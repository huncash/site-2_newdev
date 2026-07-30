"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { downloadAjanlatPdf, type PdfVersion } from "@/lib/ajanlat-pdf";
import { getSupabase } from "@/integrations/supabase/client";

/* -------------------------------------------------------------------------- */
/*  BELSŐ — Ajánlatadó (lean workflow, variánsok + verziók)                   */
/*                                                                            */
/*  1) Bemásolod a Web3Forms értesítő email szövegét                          */
/*  2) A parser kinyeri a vevő- és tételadatokat                              */
/*  3) Tételenként 4 kivitelhez (A/B/C/D) külön nettó egységár                */
/*  4) Az ügyfél 2–3 csomagot (A/B/C verzió) kap, összehasonlítható           */
/*     szumma összeggel — a beágyazott készlet panel csak az ajánlatban       */
/*     szereplő modellekre szűri a katalógust                                  */
/* -------------------------------------------------------------------------- */

const fmt = new Intl.NumberFormat("hu-HU");
const huf = (n: number) => `${fmt.format(Math.round(n))} Ft`;

/* -------------------------------------------------------------------------- */
/*  Típusok                                                                   */
/* -------------------------------------------------------------------------- */

type Variant = "A" | "B" | "C";

const VARIANT_META: Record<
  Variant,
  { code: Variant; short: string; full: string; description: string; warrantyMonths: number | null; warrantyShort: string }
> = {
  A: {
    code: "A",
    short: "Eredeti diszkont lámpamodul",
    full: "Eredeti diszkont lámpamodul — eredeti gyári izzó méretpontos utángyártott kerettel",
    description:
      "Alapértelmezett ajánlatunk: eredeti gyári izzó (Philips UHP / Osram P-VIP / Ushio NSH / Phoenix SHP) méretpontos utángyártott kerettel — műszakilag azonos az OEM modullal, jellemzően az OEM ár 25–55%-áért.",
    warrantyMonths: 6,
    warrantyShort: "6 hónap (max. 500 üó.)",
  },
  B: {
    code: "B",
    short: "Teljes gyári (OEM) cseremodul",
    full: "Teljes gyári (OEM) cseremodul — eredeti izzó eredeti, gyári kazettában",
    description:
      "Külön kérésre rendelhető: teljes gyári (OEM) cseremodul — eredeti gyári izzó eredeti márkás kazettában. Magasabb árkategória; márkaszervizes cseréhez vagy intézményi leltár-előíráshoz szükséges.",
    warrantyMonths: 3,
    warrantyShort: "3 hónap (max. 500 üó.)",
  },
  C: {
    code: "C",
    short: "Csak gyári (OEM) izzó",
    full: "Csak gyári (OEM) izzó — ház nélkül, az ügyfél / szakember szereli",
    description:
      "Spórolós kivitel: kizárólag az eredeti gyári izzó, kazetta nélkül. Az ügyfél vagy szakembere bontja a meglévő modul-házat és szereli át az új izzót.",
    warrantyMonths: null,
    warrantyShort: "gyártói élettartam-garancia",
  },
};

const ALL_VARIANTS: Variant[] = ["A", "B", "C"];

type Item = {
  id: string;
  brand: string;
  model: string;
  sku: string;
  qty: number;
  unitPrices: Partial<Record<Variant, number>>;
};

const newItem = (over: Partial<Item> = {}): Item => ({
  id: crypto.randomUUID(),
  brand: "",
  model: "",
  sku: "",
  qty: 1,
  unitPrices: {},
  ...over,
});

type Contact = {
  lastName: string;
  firstName: string;
  email: string;
  phone: string;
  company: string;
  taxNumber: string;
  notes: string;
};

const emptyContact = (): Contact => ({
  lastName: "",
  firstName: "",
  email: "",
  phone: "",
  company: "",
  taxNumber: "",
  notes: "",
});

type VersionKey = "v1" | "v2" | "v3";
type Version = {
  key: VersionKey;
  enabled: boolean;
  label: string;
  defaultVariant: Variant;
  /** Tételenként felülírható kivitel (id → variant). Üres = defaultVariant. */
  overrides: Record<string, Variant>;
  /** Tételenként felülírható darabszám (id → qty). Üres = item.qty. */
  qtyOverrides: Record<string, number>;
};

const DEFAULT_VERSIONS: Version[] = [
  {
    key: "v1",
    enabled: true,
    label: "Alapértelmezett ajánlatunk — eredeti diszkont lámpamodul",
    defaultVariant: "A",
    overrides: {},
    qtyOverrides: {},
  },
  {
    key: "v2",
    enabled: false,
    label: "DIY ajánlatunk — csak az eredeti gyári izzó (keret nélkül)",
    defaultVariant: "C",
    overrides: {},
    qtyOverrides: {},
  },
  {
    key: "v3",
    enabled: false,
    label: "Még élő gyártói garancia alatti készülékhez — teljes gyári (OEM) cseremodul",
    defaultVariant: "B",
    overrides: {},
    qtyOverrides: {},
  },
];

function addDaysISO(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString("hu-HU", { year: "numeric", month: "long", day: "numeric" });
}

/* -------------------------------------------------------------------------- */
/*  Parser — Web3Forms értesítő (új és régi formátum)                         */
/* -------------------------------------------------------------------------- */

function parseEmail(raw: string): { contact: Contact; items: Item[]; warnings: string[] } {
  const warnings: string[] = [];
  const contact = emptyContact();
  const items: Item[] = [];
  const text = raw.replace(/\r\n/g, "\n");

  const kapcsolatMatch = text.match(/---\s*Kapcsolattart[óo]\s*---([\s\S]*?)(?=---|$)/i);
  const tetelekMatch = text.match(/---\s*K[ée]rt\s+t[ée]telek\s*---([\s\S]*?)(?=---|$)/i);
  const megjegyzesMatch = text.match(/---\s*Megjegyz[ée]s\s*---([\s\S]*?)(?=---|$)/i);

  if (kapcsolatMatch) {
    const block = kapcsolatMatch[1];
    const pick = (re: RegExp) => {
      const m = block.match(re);
      return m ? m[1].trim() : "";
    };
    contact.lastName = pick(/Vezet[ée]kn[ée]v\s*:\s*(.+)/i);
    contact.firstName = pick(/Keresztn[ée]v\s*:\s*(.+)/i);
    if (!contact.lastName && !contact.firstName) {
      const full = pick(/N[ée]v\s*:\s*(.+)/i);
      if (full) {
        const parts = full.split(/\s+/);
        contact.lastName = parts.slice(0, -1).join(" ");
        contact.firstName = parts.slice(-1).join(" ");
      }
    }
    contact.email = pick(/E[-\s]?mail\s*:\s*(\S+)/i);
    contact.company = pick(/C[ée]gn[ée]v\s*:\s*(.+)/i);
    contact.taxNumber = pick(/Ad[óo]sz[áa]m\s*:\s*(.+)/i);
    contact.phone = pick(/Telefon\s*:\s*(.+)/i);
  } else {
    const pick = (re: RegExp) => {
      const m = text.match(re);
      return m ? m[1].trim() : "";
    };
    contact.lastName = pick(/^\s*Last name\s+(.+)$/im);
    contact.firstName = pick(/^\s*First name\s+(.+)$/im);
    if (!contact.lastName && !contact.firstName) {
      const full = pick(/^\s*Name\s+(.+)$/im);
      if (full) {
        const parts = full.split(/\s+/);
        contact.lastName = parts.slice(0, -1).join(" ");
        contact.firstName = parts.slice(-1).join(" ");
      }
    }
    contact.email = pick(/^\s*Email\s+(\S+)/im);
    contact.company = pick(/^\s*Company\s+(.+)$/im);
    contact.taxNumber = pick(/^\s*Tax number\s+(.+)$/im);
    contact.phone = pick(/^\s*Phone\s+(.+)$/im);
    const notes = pick(/^\s*Notes\s+([\s\S]+?)(?=^\s*Message\s+|$)/im);
    if (notes) contact.notes = notes.trim();
  }

  if (megjegyzesMatch) contact.notes = megjegyzesMatch[1].trim();

  if (tetelekMatch) {
    const lines = tetelekMatch[1].split("\n").map((l) => l.trim()).filter(Boolean);
    for (const line of lines) {
      const m = line.match(
        /^\d+\.\s*([^|]+?)\s*\|\s*T[íi]pus\s*:\s*([^|]*?)\s*\|\s*Cikksz[áa]m\s*:\s*([^|]*?)\s*\|\s*Mennyis[ée]g\s*:\s*(\d+)/i,
      );
      if (m) {
        const brand = m[1].trim();
        const model = m[2].trim().replace(/^-$/, "");
        const sku = m[3].trim().replace(/^-$/, "");
        const qty = parseInt(m[4], 10) || 1;
        items.push(newItem({ brand, model, sku, qty }));
      } else {
        warnings.push(`Tételsor nem ismerhető fel: "${line}"`);
      }
    }
  }

  if (items.length === 0) {
    items.push(newItem());
    if (!tetelekMatch) {
      warnings.push("Nem találtam strukturált tétel-blokkot — kérlek töltsd ki kézzel.");
    }
  }

  return { contact, items, warnings };
}

/* -------------------------------------------------------------------------- */
/*  Komponens                                                                 */
/* -------------------------------------------------------------------------- */

function AjanlatPage() {
  const [pasted, setPasted] = useState("");
  const [warnings, setWarnings] = useState<string[]>([]);
  const [contact, setContact] = useState<Contact>(emptyContact());
  const [items, setItems] = useState<Item[]>(() => [newItem()]);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [activeVariant, setActiveVariant] = useState<Variant>("A");

  const [versions, setVersions] = useState<Version[]>(DEFAULT_VERSIONS);

  const [validityDays, setValidityDays] = useState<number>(14);
  const [shippingText, setShippingText] = useState(
    "Raktárkészletről 4–10 munkanap; beszerzésre szoruló tételek esetén 8–14 munkanap.",
  );
  const [shippingCost, setShippingCost] = useState<number | "">(0);
  const [warrantyText, setWarrantyText] = useState("");
  const [comparisonNote, setComparisonNote] = useState("");

  // Aláírás: titkosítva private_data/signatures/{uuid} — csak id a kliensen.
  const SIGNATURE_ID_KEY = "ajanlat.signature.id";
  const [signatureId, setSignatureId] = useState<string | null>(null);
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const [signatureBusy, setSignatureBusy] = useState(false);
  const [signatureErr, setSignatureErr] = useState<string | null>(null);

  async function loadDefaultSignatureAsset() {
    try {
      const res = await fetch("/assets/signature-kiss-patrik.png");
      if (!res.ok) return;
      const blob = await res.blob();
      const reader = new FileReader();
      reader.onload = () => setSignatureDataUrl(String(reader.result || ""));
      reader.readAsDataURL(blob);
    } catch {
      /* noop */
    }
  }

  async function fetchSignatureDataUrl(id: string): Promise<string | null> {
    const res = await fetch(`/api/admin/signature/${encodeURIComponent(id)}`, {
      credentials: "include",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { dataUrl?: string };
    return typeof data.dataUrl === "string" ? data.dataUrl : null;
  }

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/signature", { credentials: "include" });
        if (res.ok) {
          const data = (await res.json()) as { id?: string | null; dataUrl?: string | null };
          if (data.id && data.dataUrl) {
            setSignatureId(data.id);
            setSignatureDataUrl(data.dataUrl);
            try {
              localStorage.setItem(SIGNATURE_ID_KEY, data.id);
            } catch {
              /* noop */
            }
            return;
          }
        }
      } catch {
        /* fall through */
      }
      try {
        const cachedId = localStorage.getItem(SIGNATURE_ID_KEY);
        if (cachedId) {
          const dataUrl = await fetchSignatureDataUrl(cachedId);
          if (dataUrl) {
            setSignatureId(cachedId);
            setSignatureDataUrl(dataUrl);
            return;
          }
        }
      } catch {
        /* noop */
      }
      await loadDefaultSignatureAsset();
    })();
  }, []);

  async function onSignatureFile(file: File | null) {
    if (!file) return;
    setSignatureBusy(true);
    setSignatureErr(null);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/signature", {
        method: "POST",
        credentials: "include",
        body,
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        id?: string;
        dataUrl?: string;
      };
      if (!res.ok || !data.id || !data.dataUrl) {
        throw new Error(data.error || "Feltöltés sikertelen.");
      }
      setSignatureId(data.id);
      setSignatureDataUrl(data.dataUrl);
      try {
        localStorage.setItem(SIGNATURE_ID_KEY, data.id);
      } catch {
        /* noop */
      }
    } catch (e) {
      setSignatureErr(e instanceof Error ? e.message : "Feltöltés sikertelen.");
    } finally {
      setSignatureBusy(false);
    }
  }

  async function clearSignature() {
    setSignatureBusy(true);
    setSignatureErr(null);
    try {
      await fetch("/api/admin/signature", {
        method: "DELETE",
        credentials: "include",
      });
    } catch {
      /* noop */
    } finally {
      setSignatureId(null);
      setSignatureDataUrl(null);
      try {
        localStorage.removeItem(SIGNATURE_ID_KEY);
      } catch {
        /* noop */
      }
      setSignatureBusy(false);
      await loadDefaultSignatureAsset();
    }
  }

  const [quoteNumber, setQuoteNumber] = useState<string>(() => {
    const d = new Date();
    return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  });
  const [pdfBusy, setPdfBusy] = useState(false);
  const [pdfMsg, setPdfMsg] = useState<string | null>(null);

  const [showFrame, setShowFrame] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  /* ----- Mentett ajánlatok (felhasználói fiókhoz kötve) ----- */
  type SavedQuoteRow = {
    id: string;
    title: string;
    quote_number: string | null;
    updated_at: string;
    created_at: string;
  };
  const [savedQuotes, setSavedQuotes] = useState<SavedQuoteRow[]>([]);
  const [currentSavedId, setCurrentSavedId] = useState<string | null>(null);
  const [saveBusy, setSaveBusy] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [savedListOpen, setSavedListOpen] = useState(true);

  function buildDefaultTitle(): string {
    const who =
      contact.company?.trim() ||
      [contact.lastName, contact.firstName].filter(Boolean).join(" ").trim() ||
      contact.email?.trim() ||
      "Névtelen ajánlat";
    return `${who} — ${new Date().toLocaleDateString("hu-HU")}`;
  }

  function serializeState() {
    return {
      contact,
      items,
      versions,
      validityDays,
      shippingText,
      shippingCost,
      warrantyText,
      comparisonNote,
      quoteNumber,
      signatureId,
    };
  }

  function applyState(p: any) {
    if (!p || typeof p !== "object") return;
    if (p.contact) setContact({ ...emptyContact(), ...p.contact });
    if (Array.isArray(p.items)) {
      const safeItems = p.items.map((it: any) => ({
        ...newItem(),
        ...it,
        id: it?.id || crypto.randomUUID(),
        unitPrices: it?.unitPrices ?? {},
      })) as Item[];
      setItems(safeItems);
      setActiveItemId(safeItems[0]?.id ?? null);
    }
    if (Array.isArray(p.versions)) setVersions(p.versions);
    if (typeof p.validityDays === "number") setValidityDays(p.validityDays);
    if (typeof p.shippingText === "string") setShippingText(p.shippingText);
    if (typeof p.shippingCost === "number" || p.shippingCost === "") setShippingCost(p.shippingCost);
    if (typeof p.warrantyText === "string") setWarrantyText(p.warrantyText);
    if (typeof p.comparisonNote === "string") setComparisonNote(p.comparisonNote);
    if (typeof p.quoteNumber === "string") setQuoteNumber(p.quoteNumber);
    if (typeof p.signatureId === "string") {
      setSignatureId(p.signatureId);
      void fetchSignatureDataUrl(p.signatureId).then((url) => {
        if (url) setSignatureDataUrl(url);
      });
    }
    setWarnings([]);
    setPasted("");
  }

  async function refreshSavedQuotes() {
    const client = getSupabase();
    if (!client) {
      setSavedQuotes([]);
      return;
    }
    const { data, error } = await client
      .from("saved_quotes")
      .select("id, title, quote_number, updated_at, created_at")
      .order("updated_at", { ascending: false });
    if (error) {
      setSaveMsg(`Lista betöltési hiba: ${error.message}`);
      return;
    }
    setSavedQuotes(data ?? []);
  }

  useEffect(() => {
    refreshSavedQuotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSaveQuote(opts: { asNew?: boolean } = {}) {
    setSaveBusy(true);
    setSaveMsg(null);
    try {
      const client = getSupabase();
      if (!client) {
        setSaveMsg(
          "Supabase nincs beállítva — az ajánlat mentése felhőbe opcionális. PDF / e-mail sablon így is működik.",
        );
        return;
      }
      const { data: userRes } = await client.auth.getUser();
      const uid = userRes?.user?.id;
      if (!uid) {
        setSaveMsg("Nincs aktív Supabase munkamenet — a felhőmentéshez Supabase login kell.");
        return;
      }
      const payload = serializeState();
      const title = buildDefaultTitle();
      if (!opts.asNew && currentSavedId) {
        const { error } = await client
          .from("saved_quotes")
          .update({ title, quote_number: quoteNumber, payload })
          .eq("id", currentSavedId);
        if (error) throw error;
        setSaveMsg("Mentve (felülírva).");
      } else {
        const { data, error } = await client
          .from("saved_quotes")
          .insert({ owner_id: uid, title, quote_number: quoteNumber, payload })
          .select("id")
          .single();
        if (error) throw error;
        setCurrentSavedId(data.id);
        setSaveMsg("Új ajánlat elmentve.");
      }
      await refreshSavedQuotes();
    } catch (e: any) {
      setSaveMsg(`Mentési hiba: ${e?.message ?? String(e)}`);
    } finally {
      setSaveBusy(false);
    }
  }

  async function handleLoadQuote(id: string) {
    setSaveBusy(true);
    setSaveMsg(null);
    try {
      const client = getSupabase();
      if (!client) {
        setSaveMsg("Supabase nincs beállítva.");
        return;
      }
      const { data, error } = await client
        .from("saved_quotes")
        .select("id, payload")
        .eq("id", id)
        .single();
      if (error) throw error;
      applyState(data.payload);
      setCurrentSavedId(data.id);
      setSaveMsg("Ajánlat betöltve.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e: any) {
      setSaveMsg(`Betöltési hiba: ${e?.message ?? String(e)}`);
    } finally {
      setSaveBusy(false);
    }
  }

  async function handleDuplicateQuote(id: string) {
    setSaveBusy(true);
    setSaveMsg(null);
    try {
      const client = getSupabase();
      if (!client) {
        setSaveMsg("Supabase nincs beállítva.");
        return;
      }
      const { data: userRes } = await client.auth.getUser();
      const uid = userRes?.user?.id;
      if (!uid) throw new Error("Nincs aktív Supabase munkamenet.");
      const { data: src, error: e1 } = await client
        .from("saved_quotes")
        .select("title, payload")
        .eq("id", id)
        .single();
      if (e1) throw e1;
      const d = new Date();
      const newQN = `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
      const newPayload = { ...(src.payload as any), quoteNumber: newQN };
      const { error: e2 } = await client.from("saved_quotes").insert({
        owner_id: uid,
        title: `${src.title} (másolat)`,
        quote_number: newQN,
        payload: newPayload,
      });
      if (e2) throw e2;
      setSaveMsg("Másolat létrehozva.");
      await refreshSavedQuotes();
    } catch (e: any) {
      setSaveMsg(`Duplikálási hiba: ${e?.message ?? String(e)}`);
    } finally {
      setSaveBusy(false);
    }
  }

  async function handleRenameQuote(id: string, currentTitle: string) {
    const next = window.prompt("Új cím:", currentTitle);
    if (!next || next.trim() === currentTitle) return;
    const client = getSupabase();
    if (!client) {
      setSaveMsg("Supabase nincs beállítva.");
      return;
    }
    const { error } = await client
      .from("saved_quotes")
      .update({ title: next.trim() })
      .eq("id", id);
    if (error) {
      setSaveMsg(`Átnevezési hiba: ${error.message}`);
      return;
    }
    await refreshSavedQuotes();
  }

  async function handleDeleteQuote(id: string, title: string) {
    if (!window.confirm(`Biztosan törlöd ezt a mentett ajánlatot?\n\n${title}`)) return;
    const client = getSupabase();
    if (!client) {
      setSaveMsg("Supabase nincs beállítva.");
      return;
    }
    const { error } = await client.from("saved_quotes").delete().eq("id", id);
    if (error) {
      setSaveMsg(`Törlési hiba: ${error.message}`);
      return;
    }
    if (currentSavedId === id) setCurrentSavedId(null);
    await refreshSavedQuotes();
  }

  function handleParse() {
    if (!pasted.trim()) return;
    const r = parseEmail(pasted);
    setContact(r.contact);
    setItems(r.items);
    setActiveItemId(r.items[0]?.id ?? null);
    setWarnings(r.warnings);
  }

  // postMessage fogadása a készlet iframe-ből
  useEffect(() => {
    function onMsg(e: MessageEvent) {
      if (e.origin !== window.location.origin) return;
      const data = e.data as
        | { type?: string; slug?: string; brand?: string; model?: string; sku?: string; netPrice?: number }
        | null;
      if (!data || data.type !== "lovable:price-pick" || typeof data.netPrice !== "number") return;

      setItems((prev) => {
        if (prev.length === 0) return prev;
        let targetId = activeItemId;
        if (!targetId && data.sku) {
          const hit = prev.find(
            (it) => it.sku && data.sku && it.sku.toLowerCase() === data.sku.toLowerCase(),
          );
          if (hit) targetId = hit.id;
        }
        if (!targetId && (data.brand || data.model)) {
          const hit = prev.find(
            (it) =>
              (data.brand ? it.brand.toLowerCase().includes(data.brand.toLowerCase()) : true) &&
              (data.model ? it.model.toLowerCase().includes(data.model.toLowerCase()) : true),
          );
          if (hit) targetId = hit.id;
        }
        if (!targetId) targetId = prev[0].id;

        return prev.map((it) =>
          it.id === targetId
            ? {
                ...it,
                brand: it.brand || data.brand || "",
                model: it.model || data.model || "",
                sku: it.sku || data.sku || "",
                unitPrices: {
                  ...it.unitPrices,
                  [activeVariant]: Math.round(data.netPrice as number),
                },
              }
            : it,
        );
      });
    }
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [activeItemId, activeVariant]);

  /* Iframe URL: csak az ajánlat-tételek SKU/modell listájával */
  const iframeQuery = useMemo(() => {
    const skus = Array.from(
      new Set(items.map((i) => i.sku.trim()).filter((s) => s.length > 0)),
    );
    const models = Array.from(
      new Set(
        items
          .map((i) => i.model.trim())
          .filter((m) => m.length > 0 && !skus.includes(m)),
      ),
    );
    const params = new URLSearchParams({ embed: "1" });
    if (skus.length) params.set("skus", skus.join(","));
    if (models.length) params.set("models", models.join(","));
    return params.toString();
  }, [items]);

  // Debounce — ne újratöltse az iframe-et minden gépeléskor
  const [iframeUrl, setIframeUrl] = useState(`/admin/keszlet?embed=1`);
  useEffect(() => {
    const t = setTimeout(() => {
      setIframeUrl(`/admin/keszlet?${iframeQuery}`);
    }, 400);
    return () => clearTimeout(t);
  }, [iframeQuery]);

  /* -------------------- Számítások verziónként -------------------- */

  function variantOf(v: Version, itemId: string): Variant {
    return v.overrides[itemId] ?? v.defaultVariant;
  }

  function unitOf(item: Item, variant: Variant): number {
    const p = item.unitPrices[variant];
    return typeof p === "number" ? p : 0;
  }

  function qtyOf(v: Version, item: Item): number {
    const q = v.qtyOverrides[item.id];
    return typeof q === "number" && q >= 0 ? q : item.qty || 0;
  }

  const shipping = typeof shippingCost === "number" ? shippingCost : 0;

  type VersionTotals = {
    itemsNet: number;
    shipping: number;
    net: number;
    vat: number;
    gross: number;
    missing: { itemId: string; variant: Variant }[];
  };

  const versionTotals: Record<VersionKey, VersionTotals> = useMemo(() => {
    const out = {} as Record<VersionKey, VersionTotals>;
    for (const v of versions) {
      let itemsNet = 0;
      const missing: { itemId: string; variant: Variant }[] = [];
      for (const it of items) {
        const variant = variantOf(v, it.id);
        const u = unitOf(it, variant);
        const q = qtyOf(v, it);
        if (u <= 0 && q > 0) missing.push({ itemId: it.id, variant });
        itemsNet += u * q;
      }
      const net = itemsNet + shipping;
      const vat = Math.round(net * 0.27);
      out[v.key] = { itemsNet, shipping, net, vat, gross: net + vat, missing };
    }
    return out;
  }, [items, versions, shipping]);

  /* -------------------- Email generálás -------------------- */

  const validUntil = addDaysISO(validityDays);
  const greeting = contact.firstName
    ? `Kedves ${contact.firstName}!`
    : contact.lastName
    ? `Kedves ${contact.lastName}!`
    : "Kedves Érdeklődő!";

  const paymentBlock = `A megrendelés rögzítését követően az ADP-TOP Kft. a Számlázz.hu rendszerből díjbekérő számlát állít ki, amely banki átutalással teljesíthető. A jóváírás visszaigazolása után — munkaidőben érkezett utalás esetén akár még aznap — a teljesítést haladéktalanul elindítjuk; az áfás végszámlát a teljesítéssel egyidejűleg kiállítjuk és a NAV Online Számla rendszerébe automatikusan továbbítjuk.`;

  const enabledVersions = versions.filter((v) => v.enabled);

  // Melyik kivitelek vannak ténylegesen használatban valamelyik aktív verzióban?
  const usedVariants = useMemo(() => {
    const set = new Set<Variant>();
    for (const v of enabledVersions)
      for (const it of items) set.add(variantOf(v, it.id));
    return set;
  }, [enabledVersions, items]);

  const GYIK_GARANCIA_URL = "https://projektorlampacsere.hu/gyik#garancia-visszakuldes";

  // Strukturált garancia-blokk — csak a ténylegesen használt kivitelek.
  const defaultWarrantyText = useMemo(() => {
    const lines: string[] = [];
    if (usedVariants.has("A"))
      lines.push("• Eredeti diszkont lámpamodul (A): 6 hónap jótállás");
    if (usedVariants.has("B"))
      lines.push("• Teljes gyári (OEM) cseremodul (B): 3 hónap jótállás");
    if (usedVariants.has("C"))
      lines.push("• Csak gyári (OEM) izzó (C): a gyártó által közölt élettartam-garancia");
    const modulLine =
      usedVariants.has("A") || usedVariants.has("B")
        ? "\nA modul-kivitelekre a jótállás legfeljebb 500 üzemóráig, rendeltetésszerű használat (megfelelő szellőzés, stabil tápellátás, gyári üzemóra keret betartása) mellett érvényes; kiterjed a fényerő- és élettartam-paraméterekre is. A jótállási idő a számla kiállításának napjától indul; a jogszabályi szavatosság mellett."
        : "";
    return `${lines.join("\n")}${modulLine}\nRészletes feltételek: ${GYIK_GARANCIA_URL}`;
  }, [usedVariants]);

  const defaultComparisonNote = useMemo(() => {
    const parts: string[] = [];
    if (usedVariants.has("A"))
      parts.push(
        "Alapértelmezett ajánlatunk az eredeti diszkont lámpamodul: eredeti gyári izzó (Philips UHP / Osram P-VIP / Ushio NSH / Phoenix SHP) méretpontos utángyártott kerettel. A fényforrás a gyári OEM-mel azonos, a megtakarítás kizárólag a kazetta keretéből származik — műszakilag egyenértékű megoldás, jellemzően az OEM ár 25–55%-áért. Cseréje egyszerű, kazettás; ezt a megoldást ajánljuk jó szívvel a legtöbb ügyfelünknek.",
      );
    if (usedVariants.has("C"))
      parts.push(
        "DIY ajánlatunk a modulos lámpa olcsóbb változata: kizárólag az eredeti gyári izzó, ház nélkül. A cseréje némi tapasztalatot igényel — a meglévő modul-házat a vásárló vagy szakembere bontja, és szereli át az új izzót. Nagyon megbízható és jelentősen gazdaságosabb megoldás; azoknak az ügyfeleknek javasoljuk, akiknek van saját, csupasz izzó cseréjében jártas szakemberük.",
      );
    if (usedVariants.has("B"))
      parts.push(
        "A teljes gyári (OEM) cseremodult akkor érdemes választani, ha a projektorra még élő gyártói jótállás vagy márkaszerviz-szerződés vonatkozik, és a szerviz a gyári cikkszámmal címkézett modul beépítését szerződésben előírja, vagy ha az intézményi leltár-nyilvántartás ezt megköveteli. A három csomag közül ez a legdrágább, jellemzően a legrövidebb (3 hónap) jótállási idővel — a fényforrás és élettartam azonos az alapértelmezett változatéval.",
      );
    return parts.join("\n\n");
  }, [usedVariants]);

  const effectiveWarrantyText = warrantyText.trim() || defaultWarrantyText;
  const effectiveComparisonNote = comparisonNote.trim() || defaultComparisonNote;

  const NO_INSTALL_NOTE =
    "Cégünk a beszerelést / fizikai cserét nem végzi — kizárólag a projektorlámpa-modulok és gyári izzók értékesítésével foglalkozunk; a csere a vásárló vagy az általa megbízott szakember feladata. Részletek: https://projektorlampacsere.hu/gyik";

  // Eltérő darabszám van valamelyik aktív verzióban?
  const hasQtyDivergence = useMemo(() => {
    for (const it of items) {
      const qs = new Set<number>();
      for (const v of enabledVersions) qs.add(qtyOf(v, it));
      if (qs.size > 1) return true;
    }
    return false;
  }, [enabledVersions, items]);

  function renderVersionBlock(v: Version): string {
    const t = versionTotals[v.key];
    const isDefault = v.key === "v1";
    const lines = items
      .map((it, i) => {
        const variant = variantOf(v, it.id);
        const unit = unitOf(it, variant);
        const q = qtyOf(v, it);
        const line = unit * q;
        const desc = [it.brand, it.model].filter(Boolean).join(" ");
        const skuPart = it.sku ? ` — cikkszám: ${it.sku}` : "";
        const meta = VARIANT_META[variant];
        return `${i + 1}. ${desc || "(megnevezés)"}${skuPart}
   Kivitel: ${meta.full}
   Mennyiség: ${q} db · Egységár: ${huf(unit)} + áfa · Összesen: ${huf(line)} + áfa
   Jótállás: ${meta.warrantyShort}`;
      })
      .join("\n");

    return `═══ ${v.label}${isDefault ? " · ajánlott választás" : ""} ═══
${lines}

Tételek nettó: ${huf(t.itemsNet)}
Szállítás: ${t.shipping > 0 ? huf(t.shipping) : "díjmentes"}
Nettó végösszeg: ${huf(t.net)}
ÁFA (27%): ${huf(t.vat)}
Bruttó fizetendő: ${huf(t.gross)}`;
  }

  const versionsBlock = enabledVersions.map(renderVersionBlock).join("\n\n");
  const versionsCount = enabledVersions.length;

  const intro =
    versionsCount > 1
      ? `Köszönjük, hogy árajánlatot kért tőlünk. Az alábbiakban ${versionsCount === 2 ? "két" : "három"} kivitelben ajánljuk a kért projektorlámpákat, hogy össze tudja hasonlítani a lehetőségeket.`
      : `Köszönjük, hogy árajánlatot kért tőlünk. Az alábbiakban tételesen összefoglaljuk ajánlatunkat a kért projektorlámpa-modulokra.`;

  const subject = `Árajánlat — Projektorlámpacsere.hu — ${contact.company || `${contact.lastName} ${contact.firstName}`.trim() || "ajánlatkérés"}`;

  const body = `${greeting}

${intro}

${versionsBlock}
${versionsCount > 1 ? `\n— Mit érdemes mérlegelni —\n${effectiveComparisonNote}\n` : ""}
${hasQtyDivergence ? `\n— Eltérő darabszámok —\nEgyes tételeknél a csomagok eltérő darabszámmal készültek — így adott keretösszegen belül a legkedvezőbb mix-et választhatja.\n` : ""}
— Szállítás —
${shippingText}

— Beszerelés —
${NO_INSTALL_NOTE}

— Fizetés —
${paymentBlock}

— Garancia —
${effectiveWarrantyText}

Az ajánlat érvényessége: ${validUntil}.

Megrendelését erre az e-mailre adott válaszával rögzíthetjük — kérjük, jelezze, melyik csomagunkat választja (a csomag megnevezésével)${versionsCount > 1 && hasQtyDivergence ? ", és tételenként a kívánt darabszámot" : ""}; ezt követően kiállítjuk a díjbekérő számlát, és a jóváírás visszaigazolása után haladéktalanul elindítjuk a teljesítést.

Kérdés esetén készséggel állunk rendelkezésére.

Üdvözlettel,

ADP-TOP Kft.
Projektorlámpacsere.hu
E-mail: info@projektorlampacsere.hu
Web: https://projektorlampacsere.hu`;

  /* -------------------- HTML email (Gmailbe illeszthető) -------------------- */

  const esc = (s: string) =>
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  function renderVersionHtml(v: Version): string {
    const t = versionTotals[v.key];
    const isDefault = v.key === "v1";
    const accent = isDefault ? "#059669" : "#64748b";
    const bg = isDefault ? "#ecfdf5" : "#f8fafc";
    const rows = items
      .map((it, i) => {
        const variant = variantOf(v, it.id);
        const unit = unitOf(it, variant);
        const q = qtyOf(v, it);
        const line = unit * q;
        const meta = VARIANT_META[variant];
        const desc = esc([it.brand, it.model].filter(Boolean).join(" ") || "(megnevezés)");
        const sku = it.sku ? `<div style="font-size:11px;color:#64748b;">cikkszám: ${esc(it.sku)}</div>` : "";
        return `<tr>
  <td style="padding:8px 10px;border-bottom:1px solid #e2e8f0;vertical-align:top;">
    <div style="font-weight:600;">${i + 1}. ${desc}</div>
    ${sku}
    <div style="font-size:11px;color:#475569;margin-top:2px;">Kivitel: ${esc(meta.full)}</div>
    <div style="font-size:11px;color:#475569;">Jótállás: ${esc(meta.warrantyShort)}</div>
  </td>
  <td style="padding:8px 10px;border-bottom:1px solid #e2e8f0;text-align:right;white-space:nowrap;vertical-align:top;">${q} db</td>
  <td style="padding:8px 10px;border-bottom:1px solid #e2e8f0;text-align:right;white-space:nowrap;vertical-align:top;">${esc(huf(unit))}</td>
  <td style="padding:8px 10px;border-bottom:1px solid #e2e8f0;text-align:right;white-space:nowrap;vertical-align:top;font-weight:600;">${esc(huf(line))}</td>
</tr>`;
      })
      .join("");

    return `<div style="margin:18px 0;border-left:4px solid ${accent};background:${bg};padding:14px 16px;border-radius:4px;">
  <div style="font-weight:700;font-size:15px;color:${accent};margin-bottom:2px;">${esc(v.label)}${isDefault ? " · ajánlott választás" : ""}</div>
  <table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;margin-top:10px;font-size:13px;background:#ffffff;border:1px solid #e2e8f0;border-radius:4px;">
    <thead>
      <tr style="background:#f1f5f9;">
        <th style="text-align:left;padding:8px 10px;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;color:#475569;">Tétel</th>
        <th style="text-align:right;padding:8px 10px;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;color:#475569;">Db</th>
        <th style="text-align:right;padding:8px 10px;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;color:#475569;">Nettó egységár</th>
        <th style="text-align:right;padding:8px 10px;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;color:#475569;">Összesen</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
  <table cellpadding="0" cellspacing="0" style="margin-top:10px;width:100%;font-size:13px;">
    <tr><td style="padding:2px 0;color:#475569;">Tételek nettó</td><td style="padding:2px 0;text-align:right;">${esc(huf(t.itemsNet))}</td></tr>
    <tr><td style="padding:2px 0;color:#475569;">Szállítás</td><td style="padding:2px 0;text-align:right;">${t.shipping > 0 ? esc(huf(t.shipping)) : "díjmentes"}</td></tr>
    <tr><td style="padding:2px 0;color:#475569;">Nettó végösszeg</td><td style="padding:2px 0;text-align:right;font-weight:600;">${esc(huf(t.net))}</td></tr>
    <tr><td style="padding:2px 0;color:#475569;">ÁFA (27%)</td><td style="padding:2px 0;text-align:right;">${esc(huf(t.vat))}</td></tr>
    <tr><td style="padding:4px 0;color:#0f172a;font-weight:700;">Bruttó fizetendő</td><td style="padding:4px 0;text-align:right;font-weight:700;font-size:15px;color:${accent};">${esc(huf(t.gross))}</td></tr>
  </table>
</div>`;
  }

  const para = (s: string) =>
    s
      .split(/\n{2,}/)
      .map((p) => `<p style="margin:0 0 10px 0;">${esc(p).replace(/\n/g, "<br>")}</p>`)
      .join("");

  const warrantyHtml = effectiveWarrantyText
    .split("\n")
    .map((l) => {
      if (l.startsWith("•")) return `<li style="margin:2px 0;">${esc(l.replace(/^•\s*/, ""))}</li>`;
      if (l.includes(GYIK_GARANCIA_URL))
        return `<p style="margin:8px 0 0 0;font-size:12px;color:#475569;">Részletes feltételek: <a href="${GYIK_GARANCIA_URL}" style="color:#2563eb;">${GYIK_GARANCIA_URL}</a></p>`;
      return l.trim() ? `<p style="margin:8px 0 0 0;">${esc(l)}</p>` : "";
    })
    .join("");
  const warrantyHtmlBlock = warrantyHtml.includes("<li")
    ? `<ul style="margin:0;padding-left:18px;">${warrantyHtml.match(/<li[\s\S]*?<\/li>/g)?.join("") ?? ""}</ul>${warrantyHtml.replace(/<li[\s\S]*?<\/li>/g, "")}`
    : warrantyHtml;

  const versionsHtml = enabledVersions.map(renderVersionHtml).join("");

  const bodyHtml = `<div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#0f172a;font-size:14px;line-height:1.55;max-width:720px;">
  <p style="margin:0 0 10px 0;">${esc(greeting)}</p>
  <p style="margin:0 0 14px 0;">${esc(intro)}</p>
  ${versionsHtml}
  ${versionsCount > 1 ? `<h3 style="font-size:13px;text-transform:uppercase;letter-spacing:0.06em;color:#475569;margin:18px 0 6px 0;">Mit érdemes mérlegelni</h3>${para(effectiveComparisonNote)}` : ""}
  ${hasQtyDivergence ? `<div style="margin:14px 0;padding:10px 14px;background:#fffbeb;border:1px solid #fde68a;border-radius:4px;font-size:13px;"><strong style="color:#92400e;">Eltérő darabszámok:</strong> egyes tételeknél a csomagok eltérő darabszámmal készültek — így adott keretösszegen belül a legkedvezőbb mix-et választhatja.</div>` : ""}
  <h3 style="font-size:13px;text-transform:uppercase;letter-spacing:0.06em;color:#475569;margin:18px 0 6px 0;">Szállítás</h3>
  ${para(shippingText)}
  <h3 style="font-size:13px;text-transform:uppercase;letter-spacing:0.06em;color:#475569;margin:18px 0 6px 0;">Beszerelés</h3>
  <p style="margin:0 0 10px 0;">Cégünk a beszerelést / fizikai cserét <strong>nem végzi</strong> — kizárólag a projektorlámpa-modulok és gyári izzók értékesítésével foglalkozunk; a csere a vásárló vagy az általa megbízott szakember feladata. Részletek: <a href="https://projektorlampacsere.hu/gyik" style="color:#2563eb;">GYIK</a>.</p>
  <h3 style="font-size:13px;text-transform:uppercase;letter-spacing:0.06em;color:#475569;margin:18px 0 6px 0;">Fizetés</h3>
  ${para(paymentBlock)}
  <h3 style="font-size:13px;text-transform:uppercase;letter-spacing:0.06em;color:#475569;margin:18px 0 6px 0;">Garancia</h3>
  ${warrantyHtmlBlock}
  <p style="margin:18px 0 10px 0;"><strong>Az ajánlat érvényessége:</strong> ${esc(validUntil)}.</p>
  <p style="margin:0 0 10px 0;">Megrendelését erre az e-mailre adott válaszával rögzíthetjük — kérjük, jelezze, melyik csomagunkat választja (a csomag megnevezésével)${versionsCount > 1 && hasQtyDivergence ? ", és tételenként a kívánt darabszámot" : ""}; ezt követően kiállítjuk a díjbekérő számlát, és a jóváírás visszaigazolása után haladéktalanul elindítjuk a teljesítést.</p>
  <p style="margin:0 0 14px 0;">Kérdés esetén készséggel állunk rendelkezésére.</p>
  <p style="margin:14px 0 0 0;border-top:1px solid #e2e8f0;padding-top:10px;font-size:13px;color:#475569;">
    Üdvözlettel,<br>
    <strong style="color:#0f172a;">ADP-TOP Kft.</strong> · Projektorlámpacsere.hu<br>
    E-mail: <a href="mailto:info@projektorlampacsere.hu" style="color:#2563eb;">info@projektorlampacsere.hu</a> ·
    Web: <a href="https://projektorlampacsere.hu" style="color:#2563eb;">projektorlampacsere.hu</a>
  </p>
</div>`;

  /* -------------------- Kísérő e-mail (a PDF mellé) -------------------- */

  const includesOEMBulb = usedVariants.has("C");
  const onlyOEMBulb = includesOEMBulb && !usedVariants.has("A") && !usedVariants.has("B");
  const GYIK_URL = "https://projektorlampacsere.hu/gyik";
  const CSERE_URL = "https://projektorlampacsere.hu/csere-utmutato/illusztralt";

  const coverEmailSubject = `Árajánlat (PDF mellékletben) — Projektorlámpacsere.hu — ${contact.company || `${contact.lastName} ${contact.firstName}`.trim() || "ajánlatkérés"}`;

  const oemBulbCaveat = includesOEMBulb
    ? `
Az Ön által jelzett, rendelkezésre álló keretösszeghez igazodva — a kért költségoptimalizálás okán — ${onlyOEMBulb ? `ajánlatunk kizárólag a „Csak gyári (OEM) izzó" (ház nélküli) kivitelre készült` : `ajánlatunkban a „Csak gyári (OEM) izzó" (ház nélküli) kivitel is szerepel`}; ez a katalógusunk legkedvezőbb árú változata, és pontosan ezt kérte tőlünk.

Engedje meg, hogy a választás véglegesítése előtt — a felelős tájékoztatás jegyében — udvariasan felhívjuk a figyelmét egy szempontra. Intézményi környezetben tapasztalataink szerint a legmegbízhatóbb megoldás az „Eredeti diszkont lámpamodul" (kazettás kivitel): eredeti gyári izzó (Philips UHP / Osram P-VIP / Ushio NSH / Phoenix SHP), méretpontos utángyártott kerettel. A kazettás kivitel POKE-YOKE elv szerint kialakított — csak egyféleképpen, helyes orientációban illeszthető vissza, így a csere során elvi szinten sem tud félremenni semmi. A fizikai csere mindössze néhány percet vesz igénybe, nem igényel sem szerszámot, sem elektromos / optikai szakképesítést, így bármely intézményi karbantartó vagy informatikus el tudja végezni. Bár az utángyártott kazetta ára beépül az árba, a teljes gyári (OEM) modulhoz viszonyítva a megtakarítás így is nagyságrendi (jellemzően az OEM ár 25–55%-a).

Csupasz, ház nélküli izzó cseréjét — kedves ügyfeleinkkel szembeni felelősségünk okán — alapesetben nem javasoljuk. A csere a meglévő modul-ház bontását, a hőelvezetés és tömítések visszaállítását, valamint precíz elektromos és optikai illesztést igényel; egy nem szakszerű beszerelésből adódó meghibásodásért sem cégünk, sem a gyártó nem tud felelősséget vállalni, és tapasztalataink szerint a cserét végző, erre nem szakképzett kolléga méltányolható módon nem szokta — és sok esetben nem is tudja — saját zsebből megtéríteni az így idő előtt selejtté vált izzó árát. Csupasz, ház nélküli izzót ezért elsősorban AV-integrátor szakember partnereinknek értékesítünk, akik az ezzel járó felelősséget szakmai oldalról is vállalják.

A két kivitel részletes összevetése, valamint a kazettás csere bemutatása az alábbi oldalakon érhető el:
• Gyakori kérdések — modulos vs. csupasz izzó: ${GYIK_URL}
• Illusztrált csere-útmutató: ${CSERE_URL}

Természetesen amennyiben a megfontolást követően továbbra is a csupasz izzós kivitel mellett dönt, a csatolt ajánlat a megküldött formában változatlanul érvényes — fenti soraink kizárólag tájékoztató, döntés-előkészítő jellegűek.
`
    : "";

  const coverEmailBody = `${greeting}

Köszönjük, hogy árajánlatot kért tőlünk a Projektorlámpacsere.hu-tól. A részletes, tételes árajánlatot — az egyes csomagok bontásával, a szállítási, fizetési és garanciális feltételekkel együtt — a csatolt PDF dokumentum tartalmazza. Az ajánlat ${validUntil}-ig érvényes.
${oemBulbCaveat}
Megrendelését erre az e-mailre adott válaszával rögzíthetjük; kérjük, jelezze, melyik csomagunkat választja${enabledVersions.length > 1 ? " (a csomag megnevezésével)" : ""}, és — amennyiben szükséges — a kívánt darabszámokat. Amennyiben az ajánlattal kapcsolatban bármilyen kérdése merül fel, készséggel állunk rendelkezésére.

Üdvözlettel,

ADP-TOP Kft.
Projektorlámpacsere.hu
E-mail: info@projektorlampacsere.hu
Web: https://projektorlampacsere.hu`;

  const coverEmailHtml = `<div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#0f172a;font-size:14px;line-height:1.6;max-width:720px;">
  <p style="margin:0 0 12px 0;">${esc(greeting)}</p>
  <p style="margin:0 0 12px 0;">Köszönjük, hogy árajánlatot kért tőlünk a <strong>Projektorlámpacsere.hu</strong>-tól. A részletes, tételes árajánlatot — az egyes csomagok bontásával, a szállítási, fizetési és garanciális feltételekkel együtt — a <strong>csatolt PDF dokumentum</strong> tartalmazza. Az ajánlat <strong>${esc(validUntil)}</strong>-ig érvényes.</p>
  ${
    includesOEMBulb
      ? `<div style="margin:16px 0;padding:14px 16px;background:#fef3c7;border-left:4px solid #d97706;border-radius:4px;">
    <div style="font-weight:700;color:#92400e;margin-bottom:8px;font-size:13px;text-transform:uppercase;letter-spacing:0.04em;">Tájékoztató jellegű kiegészítés — kivitelválasztás</div>
    <p style="margin:0 0 10px 0;font-size:13px;">Az Ön által jelzett, rendelkezésre álló keretösszeghez igazodva — a kért költségoptimalizálás okán — ${onlyOEMBulb ? `ajánlatunk <strong>kizárólag a „Csak gyári (OEM) izzó" (ház nélküli) kivitelre</strong> készült` : `ajánlatunkban a <strong>„Csak gyári (OEM) izzó" (ház nélküli)</strong> kivitel is szerepel`}; ez a katalógusunk legkedvezőbb árú változata, és pontosan ezt kérte tőlünk.</p>
    <p style="margin:0 0 10px 0;font-size:13px;">Engedje meg, hogy a választás véglegesítése előtt — a felelős tájékoztatás jegyében — udvariasan felhívjuk a figyelmét egy szempontra. Intézményi környezetben tapasztalataink szerint a legmegbízhatóbb megoldás az <strong>„Eredeti diszkont lámpamodul"</strong> (kazettás kivitel): eredeti gyári izzó (Philips UHP / Osram P-VIP / Ushio NSH / Phoenix SHP), méretpontos utángyártott kerettel. A kazettás kivitel <strong>POKE-YOKE</strong> elv szerint kialakított — csak egyféleképpen, helyes orientációban illeszthető vissza, így a csere során elvi szinten sem tud félremenni semmi. A fizikai csere mindössze néhány percet vesz igénybe, nem igényel sem szerszámot, sem elektromos / optikai szakképesítést, így bármely intézményi karbantartó vagy informatikus el tudja végezni. Bár az utángyártott kazetta ára beépül az árba, a teljes gyári (OEM) modulhoz viszonyítva a megtakarítás így is nagyságrendi (jellemzően az OEM ár 25–55%-a).</p>
    <p style="margin:0 0 10px 0;font-size:13px;">Csupasz, ház nélküli izzó cseréjét — kedves ügyfeleinkkel szembeni felelősségünk okán — alapesetben nem javasoljuk. A csere a meglévő modul-ház bontását, a hőelvezetés és tömítések visszaállítását, valamint precíz elektromos és optikai illesztést igényel; egy nem szakszerű beszerelésből adódó meghibásodásért sem cégünk, sem a gyártó nem tud felelősséget vállalni, és tapasztalataink szerint a cserét végző, erre nem szakképzett kolléga méltányolható módon nem szokta — és sok esetben nem is tudja — saját zsebből megtéríteni az így idő előtt selejtté vált izzó árát. Csupasz, ház nélküli izzót ezért elsősorban <strong>AV-integrátor szakember partnereinknek</strong> értékesítünk, akik az ezzel járó felelősséget szakmai oldalról is vállalják.</p>
    <p style="margin:0 0 6px 0;font-size:13px;">A két kivitel részletes összevetése, valamint a kazettás csere bemutatása az alábbi oldalakon érhető el:</p>
    <ul style="margin:0 0 10px 18px;padding:0;font-size:13px;">
      <li>Gyakori kérdések — modulos vs. csupasz izzó: <a href="${GYIK_URL}" style="color:#2563eb;">${GYIK_URL}</a></li>
      <li>Illusztrált csere-útmutató: <a href="${CSERE_URL}" style="color:#2563eb;">${CSERE_URL}</a></li>
    </ul>
    <p style="margin:0;font-size:13px;color:#475569;"><em>Természetesen amennyiben a megfontolást követően továbbra is a csupasz izzós kivitel mellett dönt, a csatolt ajánlat a megküldött formában változatlanul érvényes — fenti soraink kizárólag tájékoztató, döntés-előkészítő jellegűek.</em></p>
  </div>`
      : ""
  }
  <p style="margin:14px 0 12px 0;">Megrendelését erre az e-mailre adott válaszával rögzíthetjük; kérjük, jelezze, melyik csomagunkat választja${enabledVersions.length > 1 ? " (a csomag megnevezésével)" : ""}, és — amennyiben szükséges — a kívánt darabszámokat. Amennyiben az ajánlattal kapcsolatban bármilyen kérdése merül fel, készséggel állunk rendelkezésére.</p>
  <p style="margin:14px 0 0 0;border-top:1px solid #e2e8f0;padding-top:10px;font-size:13px;color:#475569;">
    Üdvözlettel,<br>
    <strong style="color:#0f172a;">ADP-TOP Kft.</strong> · Projektorlámpacsere.hu<br>
    E-mail: <a href="mailto:info@projektorlampacsere.hu" style="color:#2563eb;">info@projektorlampacsere.hu</a> ·
    Web: <a href="https://projektorlampacsere.hu" style="color:#2563eb;">projektorlampacsere.hu</a>
  </p>
</div>`;

  const coverGmailHref =
    `https://mail.google.com/mail/?view=cm&fs=1` +
    (contact.email ? `&to=${encodeURIComponent(contact.email)}` : "") +
    `&su=${encodeURIComponent(coverEmailSubject)}` +
    `&body=${encodeURIComponent(coverEmailBody)}`;

  /* -------------------- Item / Version mutátorok -------------------- */

  function updateItem(id: string, patch: Partial<Item>) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  }
  function updateUnitPrice(id: string, variant: Variant, value: number | "") {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== id) return it;
        const next = { ...it.unitPrices };
        if (value === "" || value === 0) delete next[variant];
        else next[variant] = value;
        return { ...it, unitPrices: next };
      }),
    );
  }
  function removeItem(id: string) {
    setItems((prev) => (prev.length === 1 ? prev : prev.filter((it) => it.id !== id)));
    if (activeItemId === id) setActiveItemId(null);
  }
  function addItem() {
    const it = newItem();
    setItems((prev) => [...prev, it]);
    setActiveItemId(it.id);
  }
  function updateVersion(key: VersionKey, patch: Partial<Version>) {
    setVersions((prev) => prev.map((v) => (v.key === key ? { ...v, ...patch } : v)));
  }
  function setOverride(versionKey: VersionKey, itemId: string, variant: Variant) {
    setVersions((prev) =>
      prev.map((v) => {
        if (v.key !== versionKey) return v;
        const overrides = { ...v.overrides };
        if (variant === v.defaultVariant) delete overrides[itemId];
        else overrides[itemId] = variant;
        return { ...v, overrides };
      }),
    );
  }

  function setQtyOverride(versionKey: VersionKey, itemId: string, qty: number | null) {
    setVersions((prev) =>
      prev.map((v) => {
        if (v.key !== versionKey) return v;
        const qtyOverrides = { ...v.qtyOverrides };
        if (qty === null) delete qtyOverrides[itemId];
        else qtyOverrides[itemId] = Math.max(0, qty);
        return { ...v, qtyOverrides };
      }),
    );
  }

  const [copyMsg, setCopyMsg] = useState<string | null>(null);
  async function copy(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopyMsg(`${label} a vágólapra másolva.`);
      setTimeout(() => setCopyMsg(null), 2500);
    } catch {
      setCopyMsg("A másolás nem sikerült — jelölje ki és másolja kézzel.");
    }
  }

  async function copyRich(html: string, plain: string, label: string) {
    try {
      const ClipboardItemCtor: typeof ClipboardItem | undefined =
        typeof window !== "undefined" ? (window as unknown as { ClipboardItem?: typeof ClipboardItem }).ClipboardItem : undefined;
      if (ClipboardItemCtor && navigator.clipboard && "write" in navigator.clipboard) {
        const item = new ClipboardItemCtor({
          "text/html": new Blob([html], { type: "text/html" }),
          "text/plain": new Blob([plain], { type: "text/plain" }),
        });
        await navigator.clipboard.write([item]);
        setCopyMsg(`${label} formázottan a vágólapra másolva — Gmail-be illesztve megőrzi a formázást.`);
        setTimeout(() => setCopyMsg(null), 3500);
        return;
      }
      throw new Error("no-clipboarditem");
    } catch {
      // Fallback: plaintext másolás
      try {
        await navigator.clipboard.writeText(plain);
        setCopyMsg(`${label} másolva (plaintext fallback — a böngésző nem támogatja a formázott vágólapot).`);
        setTimeout(() => setCopyMsg(null), 3500);
      } catch {
        setCopyMsg("A másolás nem sikerült — jelölje ki és másolja kézzel.");
      }
    }
  }

  const gmailHref =
    `https://mail.google.com/mail/?view=cm&fs=1` +
    (contact.email ? `&to=${encodeURIComponent(contact.email)}` : "") +
    `&su=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(body)}`;

  /* -------------------- PDF letöltés -------------------- */

  async function handleDownloadPdf() {
    if (pdfBusy) return;
    setPdfBusy(true);
    setPdfMsg(null);
    try {
      // Ajánlat generálás: szerver dekódol AES-GCM → Base64 data URL a sablonhoz
      let sigUrl = signatureDataUrl;
      if (signatureId) {
        const fresh = await fetchSignatureDataUrl(signatureId);
        if (fresh) {
          sigUrl = fresh;
          setSignatureDataUrl(fresh);
        }
      }

      const pdfVersions: PdfVersion[] = enabledVersions.map((v) => {
        const t = versionTotals[v.key];
        return {
          key: v.key,
          label: v.label,
          isDefault: v.key === "v1",
          itemsNet: t.itemsNet,
          shipping: t.shipping,
          net: t.net,
          vat: t.vat,
          gross: t.gross,
          rows: items.map((it, i) => {
            const variant = variantOf(v, it.id);
            const unit = unitOf(it, variant);
            const q = qtyOf(v, it);
            return {
              index: i,
              brand: it.brand,
              model: it.model,
              sku: it.sku,
              qty: q,
              unit,
              line: unit * q,
              variantFull: VARIANT_META[variant].full,
              warrantyShort: VARIANT_META[variant].warrantyShort,
            };
          }),
        };
      });

      const today = new Date().toLocaleDateString("hu-HU", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const slug = (contact.company || `${contact.lastName}-${contact.firstName}` || "ajanlat")
        .toLowerCase()
        .replace(/[^a-z0-9]+/gi, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 40) || "ajanlat";
      const filename = `arajanlat-${slug}-${new Date().toISOString().slice(0, 10)}.pdf`;

      await downloadAjanlatPdf(
        {
          contact: {
            lastName: contact.lastName,
            firstName: contact.firstName,
            email: contact.email,
            phone: contact.phone,
            company: contact.company,
            taxNumber: contact.taxNumber,
          },
          versions: pdfVersions,
          intro,
          comparisonNote: enabledVersions.length > 1 ? effectiveComparisonNote : "",
          hasQtyDivergence,
          shippingText,
          noInstallNote: NO_INSTALL_NOTE,
          paymentBlock,
          warrantyText: effectiveWarrantyText,
          validUntil,
          quoteNumber,
          quoteDate: today,
          deliveryDeadline: "4–14 munkanap",
          signatureDataUrl: sigUrl,
          signerName: "Kiss Patrik Péter",
          signerRole: "ügyvezető, ADP-TOP Kft.",
        },
        filename,
      );
      setPdfMsg(`PDF létrehozva: ${filename}`);
      setTimeout(() => setPdfMsg(null), 4000);
    } catch (err) {
      console.error(err);
      setPdfMsg("A PDF generálása nem sikerült — nézd meg a konzolt.");
    } finally {
      setPdfBusy(false);
    }
  }

  /* -------------------- Render -------------------- */

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-6">
      <AdminHeader
        badge="Belső · nem publikus"
        title="Ajánlatadó"
        right={
          <button
            type="button"
            onClick={() => setShowFrame((v) => !v)}
            className="text-xs border border-input rounded px-3 py-1.5 hover:bg-accent"
          >
            {showFrame ? "Készlet panel elrejtése" : "Készlet panel megjelenítése"}
          </button>
        }
      />

      <div className={showFrame ? "grid xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-6" : ""}>
        {/* BAL — ajánlat */}
        <div className="space-y-4 min-w-0">
          {/* 0. Mentett ajánlatok (felhasználói fiók) */}
          <section className="border border-border rounded p-4 bg-card">
            <div className="flex items-center justify-between gap-2 mb-2">
              <h2 className="text-sm font-semibold">
                Mentett ajánlatok
                {currentSavedId ? (
                  <span className="ml-2 text-xs font-normal text-muted-foreground">
                    (jelenleg betöltve: <code className="font-mono">{currentSavedId.slice(0, 8)}</code>)
                  </span>
                ) : null}
              </h2>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleSaveQuote()}
                  disabled={saveBusy}
                  className="text-xs border border-input rounded px-3 py-1.5 hover:bg-accent disabled:opacity-50"
                  title={currentSavedId ? "Az aktuális mentett ajánlat felülírása" : "Új ajánlat mentése a fiókhoz"}
                >
                  {currentSavedId ? "Mentés (felülírás)" : "Mentés a fiókhoz"}
                </button>
                {currentSavedId ? (
                  <button
                    type="button"
                    onClick={() => handleSaveQuote({ asNew: true })}
                    disabled={saveBusy}
                    className="text-xs border border-input rounded px-3 py-1.5 hover:bg-accent disabled:opacity-50"
                  >
                    Mentés újként
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => setSavedListOpen((v) => !v)}
                  className="text-xs border border-input rounded px-3 py-1.5 hover:bg-accent"
                >
                  {savedListOpen ? "Lista elrejtése" : `Lista (${savedQuotes.length})`}
                </button>
              </div>
            </div>
            {saveMsg ? (
              <div className="text-xs mb-2 text-muted-foreground">{saveMsg}</div>
            ) : null}
            {savedListOpen ? (
              savedQuotes.length === 0 ? (
                <div className="text-xs text-muted-foreground">
                  Még nincs mentett ajánlat. A „Mentés a fiókhoz" gombbal elteheted az aktuális űrlap teljes
                  állapotát (kapcsolat, tételek, verziók, árak, záradékok), és később egy kattintással
                  visszatöltheted — pl. ismétlődő vagy frissített ajánlatkérésnél.
                </div>
              ) : (
                <ul className="divide-y divide-border border border-border rounded">
                  {savedQuotes.map((q) => (
                    <li
                      key={q.id}
                      className={`flex flex-wrap items-center gap-2 px-3 py-2 text-xs ${
                        currentSavedId === q.id ? "bg-accent/40" : ""
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="font-medium truncate">{q.title}</div>
                        <div className="text-muted-foreground">
                          {q.quote_number ? <>#{q.quote_number} · </> : null}
                          módosítva: {new Date(q.updated_at).toLocaleString("hu-HU")}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        <button
                          type="button"
                          onClick={() => handleLoadQuote(q.id)}
                          disabled={saveBusy}
                          className="border border-input rounded px-2 py-1 hover:bg-background disabled:opacity-50"
                        >
                          Betöltés
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDuplicateQuote(q.id)}
                          disabled={saveBusy}
                          className="border border-input rounded px-2 py-1 hover:bg-background disabled:opacity-50"
                        >
                          Duplikálás
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRenameQuote(q.id, q.title)}
                          disabled={saveBusy}
                          className="border border-input rounded px-2 py-1 hover:bg-background disabled:opacity-50"
                        >
                          Átnevezés
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteQuote(q.id, q.title)}
                          disabled={saveBusy}
                          className="border border-input rounded px-2 py-1 hover:bg-background text-destructive disabled:opacity-50"
                        >
                          Törlés
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )
            ) : null}
          </section>

          {/* 1. Beillesztés */}
          <section className="border border-border rounded p-4 bg-card">
            <h2 className="text-sm font-semibold mb-2">1. Ajánlatkérő email beillesztése</h2>
            <textarea
              value={pasted}
              onChange={(e) => setPasted(e.target.value)}
              rows={6}
              placeholder="Másold ide az ajánlatkérő értesítő email teljes szövegét (Web3Forms formátum)."
              className={inputCls + " font-mono text-xs"}
            />
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleParse}
                disabled={!pasted.trim()}
                className="bg-primary text-primary-foreground rounded px-3 py-2 text-sm font-medium disabled:opacity-50"
              >
                Adatok kinyerése
              </button>
              <button
                type="button"
                onClick={() => {
                  setPasted("");
                  setWarnings([]);
                  setContact(emptyContact());
                  setItems([newItem()]);
                  setVersions(DEFAULT_VERSIONS);
                }}
                className="text-xs border border-input rounded px-3 py-2 hover:bg-accent"
              >
                Új ajánlat (ürítés)
              </button>
            </div>
            {warnings.length > 0 && (
              <ul className="mt-2 text-xs text-amber-600 dark:text-amber-400 space-y-0.5">
                {warnings.map((w, i) => (
                  <li key={i}>⚠ {w}</li>
                ))}
              </ul>
            )}
          </section>

          {/* 2. Vevő adatai */}
          <details className="border border-border rounded bg-card" open>
            <summary className="cursor-pointer px-4 py-3 text-sm font-semibold">
              2. Vevő adatai {contact.company ? `— ${contact.company}` : contact.lastName ? `— ${contact.lastName} ${contact.firstName}` : ""}
            </summary>
            <div className="px-4 pb-4 grid md:grid-cols-2 gap-3 text-sm">
              <TxtField label="Vezetéknév" value={contact.lastName} onChange={(v) => setContact({ ...contact, lastName: v })} />
              <TxtField label="Keresztnév" value={contact.firstName} onChange={(v) => setContact({ ...contact, firstName: v })} />
              <TxtField label="E-mail" value={contact.email} onChange={(v) => setContact({ ...contact, email: v })} type="email" />
              <TxtField label="Telefon" value={contact.phone} onChange={(v) => setContact({ ...contact, phone: v })} />
              <TxtField label="Cégnév / Intézmény" value={contact.company} onChange={(v) => setContact({ ...contact, company: v })} />
              <TxtField label="Adószám" value={contact.taxNumber} onChange={(v) => setContact({ ...contact, taxNumber: v })} />
              <label className="grid gap-1 md:col-span-2">
                <span className="text-xs font-medium">Megjegyzés</span>
                <textarea
                  value={contact.notes}
                  onChange={(e) => setContact({ ...contact, notes: e.target.value })}
                  rows={3}
                  className={inputCls}
                />
              </label>
            </div>
          </details>

          {/* 3. Tételek és kivitelek (variánsok) */}
          <section className="border border-border rounded p-4 bg-card">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold">3. Tételek és kivitelenkénti egységárak</h2>
              <button
                type="button"
                onClick={addItem}
                className="text-xs border border-dashed border-input rounded px-3 py-1.5 hover:bg-accent"
              >
                + Tétel
              </button>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Kattints egy kivitel-csempére, hogy aktívvá tedd — a jobb oldali készlet panel „→ Ajánlat" gombja ennek a tételnek és kivitelnek a nettó egységárát fogja kitölteni.
            </p>
            <div className="grid gap-3">
              {items.map((it, idx) => (
                <ItemCard
                  key={it.id}
                  index={idx}
                  item={it}
                  canRemove={items.length > 1}
                  activeItemId={activeItemId}
                  activeVariant={activeVariant}
                  onItemClick={() => setActiveItemId(it.id)}
                  onPickVariant={(v) => {
                    setActiveItemId(it.id);
                    setActiveVariant(v);
                  }}
                  onChange={(patch) => updateItem(it.id, patch)}
                  onChangePrice={(v, val) => updateUnitPrice(it.id, v, val)}
                  onRemove={() => removeItem(it.id)}
                />
              ))}
            </div>
          </section>

          {/* 4. Verziók A / B / C */}
          <section className="border border-border rounded p-4 bg-card">
            <h2 className="text-sm font-semibold mb-2">4. Csomag-verziók az ügyfél részére</h2>
            <p className="text-xs text-muted-foreground mb-3">
              Kapcsold be, hány csomagot küldesz az ügyfélnek — minden verzió saját szumma-összeggel kerül a levélbe. Tételenként felülírhatod az alap-kivitelt, ha egy modellre csak bizonyos kivitel létezik.
            </p>
            <div className="grid gap-3">
              {versions.map((v) => {
                const t = versionTotals[v.key];
                const isDefault = v.key === "v1";
                return (
                  <div
                    key={v.key}
                    className={
                      "border rounded p-3 " +
                      (!v.enabled
                        ? "border-dashed border-input opacity-60"
                        : isDefault
                        ? "border-l-4 border-l-emerald-500 border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/40 dark:bg-emerald-950/10"
                        : "border-border")
                    }
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      {isDefault && v.enabled && (
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-600 text-white rounded px-1.5 py-0.5">
                          Ajánlott
                        </span>
                      )}
                      <label className="flex items-center gap-2 text-sm font-medium">
                        <input
                          type="checkbox"
                          checked={v.enabled}
                          onChange={(e) => updateVersion(v.key, { enabled: e.target.checked })}
                        />
                        Verzió aktív
                      </label>
                      <input
                        value={v.label}
                        onChange={(e) => updateVersion(v.key, { label: e.target.value })}
                        className={inputCls + " max-w-xs"}
                      />
                      <label className="flex items-center gap-2 text-xs">
                        Alap-kivitel:
                        <select
                          value={v.defaultVariant}
                          onChange={(e) =>
                            updateVersion(v.key, { defaultVariant: e.target.value as Variant })
                          }
                          className="border border-input rounded px-2 py-1 bg-background text-xs"
                        >
                          {ALL_VARIANTS.map((va) => (
                            <option key={va} value={va}>
                              {va} — {VARIANT_META[va].short}
                            </option>
                          ))}
                        </select>
                      </label>
                      <div className="ml-auto text-xs tabular-nums">
                        Nettó <strong>{huf(t.net)}</strong> · Bruttó <strong>{huf(t.gross)}</strong>
                      </div>
                    </div>

                    {v.enabled && items.length > 0 && (
                      <div className="mt-3 grid gap-1.5">
                        {items.map((it, i) => {
                          const chosen = variantOf(v, it.id);
                          const unit = unitOf(it, chosen);
                          const qOverride = v.qtyOverrides[it.id];
                          const q = typeof qOverride === "number" ? qOverride : it.qty || 0;
                          const isQtyOverridden = typeof qOverride === "number" && qOverride !== it.qty;
                          return (
                            <div
                              key={it.id}
                              className="flex flex-wrap items-center gap-2 text-xs border-t border-border pt-1.5"
                            >
                              <span className="text-muted-foreground w-6 tabular-nums">#{i + 1}</span>
                              <span className="truncate max-w-[14rem]">
                                {[it.brand, it.model].filter(Boolean).join(" ") || "(megnevezés)"}
                              </span>
                              <div className="flex gap-1">
                                {ALL_VARIANTS.map((va) => {
                                  const isChosen = chosen === va;
                                  const hasPrice = (it.unitPrices[va] ?? 0) > 0;
                                  return (
                                    <button
                                      key={va}
                                      type="button"
                                      onClick={() => setOverride(v.key, it.id, va)}
                                      className={
                                        "rounded px-1.5 py-0.5 border text-[10px] font-medium " +
                                        (isChosen
                                          ? "bg-primary text-primary-foreground border-primary"
                                          : hasPrice
                                          ? "border-input hover:bg-accent"
                                          : "border-dashed border-input text-muted-foreground hover:bg-accent")
                                      }
                                      title={VARIANT_META[va].full}
                                    >
                                      {va}
                                    </button>
                                  );
                                })}
                              </div>
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  min={0}
                                  value={q}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    const parsed = val === "" ? 0 : Math.max(0, parseInt(val, 10) || 0);
                                    setQtyOverride(v.key, it.id, parsed === (it.qty || 0) ? null : parsed);
                                  }}
                                  className={
                                    "w-14 border rounded px-1.5 py-0.5 text-right tabular-nums text-[11px] bg-background " +
                                    (isQtyOverridden
                                      ? "border-amber-500 text-amber-700 dark:text-amber-400 font-semibold"
                                      : "border-input")
                                  }
                                  title={isQtyOverridden ? `Eltér az alap mennyiségtől (${it.qty} db)` : "Verzióra eső darabszám"}
                                />
                                <span className="text-[10px] text-muted-foreground">db</span>
                                {isQtyOverridden && (
                                  <button
                                    type="button"
                                    onClick={() => setQtyOverride(v.key, it.id, null)}
                                    className="text-[10px] text-muted-foreground underline hover:text-foreground"
                                    title={`Visszaállítás az alap mennyiségre (${it.qty} db)`}
                                  >
                                    ↺
                                  </button>
                                )}
                              </div>
                              <span className="ml-auto tabular-nums">
                                <strong className={unit > 0 ? "" : "text-amber-600 dark:text-amber-400"}>
                                  {unit > 0 ? huf(unit) : "— hiányzik —"}
                                </strong>{" "}
                                × {q} db = <strong className="tabular-nums">{huf(unit * q)}</strong>
                              </span>
                              <span className="basis-full text-[10px] text-muted-foreground pl-6">
                                Jótállás: {VARIANT_META[chosen].warrantyShort}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    {v.enabled && t.missing.length > 0 && (
                      <div className="mt-2 text-[11px] text-amber-600 dark:text-amber-400">
                        ⚠ {t.missing.length} tétel ára még hiányzik ehhez a verzióhoz.
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* 5. Feltételek */}
          <details className="border border-border rounded bg-card">
            <summary className="cursor-pointer px-4 py-3 text-sm font-semibold">5. Feltételek (fizetés, szállítás, garancia, összehasonlítás)</summary>
            <div className="px-4 pb-4 space-y-3 text-sm">
              <div className="grid md:grid-cols-2 gap-3">
                <Cell label={`Érvényesség (nap) — ${validUntil}-ig`}>
                  <input
                    type="number"
                    min={1}
                    max={90}
                    value={validityDays}
                    onChange={(e) => setValidityDays(Math.max(1, parseInt(e.target.value, 10) || 14))}
                    className={inputCls}
                  />
                </Cell>
                <Cell label="Szállítási költség (nettó Ft, 0 = díjmentes)">
                  <input
                    type="number"
                    min={0}
                    value={shippingCost}
                    onChange={(e) => {
                      const v = e.target.value;
                      setShippingCost(v === "" ? "" : Math.max(0, parseInt(v, 10) || 0));
                    }}
                    className={inputCls}
                  />
                </Cell>
              </div>
              <Cell label="Szállítási határidő szövege">
                <textarea value={shippingText} onChange={(e) => setShippingText(e.target.value)} rows={2} className={inputCls} />
              </Cell>
              <Cell label="Garancia szövege (üresen hagyva automatikus — csak a használt kivitelekre)">
                <textarea
                  value={warrantyText}
                  onChange={(e) => setWarrantyText(e.target.value)}
                  rows={5}
                  placeholder={defaultWarrantyText}
                  className={inputCls + " font-mono text-xs"}
                />
              </Cell>
              <Cell label="Összehasonlító magyarázat — üresen hagyva automatikus, csak a használt kivitelekre">
                <textarea
                  value={comparisonNote}
                  onChange={(e) => setComparisonNote(e.target.value)}
                  rows={6}
                  placeholder={defaultComparisonNote}
                  className={inputCls + " text-xs"}
                />
              </Cell>
              <div className="text-xs text-muted-foreground bg-surface border border-border rounded p-3 leading-relaxed">
                Fizetés: minden ügyfél számára egységesen díjbekérő számla (Számlázz.hu) + banki átutalás. A jóváírás után haladéktalanul teljesítünk; áfás végszámla automatikus.
              </div>
            </div>
          </details>

          {/* 6. Generált email */}
          <section className="border border-border rounded p-4 bg-card">
            <h2 className="text-sm font-semibold mb-3">6. Generált e-mail</h2>
            <div className="mb-3 grid gap-2">
              {enabledVersions.map((v) => {
                const t = versionTotals[v.key];
                const isDefault = v.key === "v1";
                return (
                  <div
                    key={v.key}
                    className={
                      "grid grid-cols-[1fr_auto_auto_auto] gap-2 items-center border rounded px-3 py-1.5 text-xs " +
                      (isDefault
                        ? "border-l-4 border-l-emerald-500 border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/40 dark:bg-emerald-950/10"
                        : "border-border")
                    }
                  >
                    <span className="font-medium truncate">
                      {v.label}
                      {isDefault && (
                        <span className="ml-2 text-[9px] font-bold uppercase tracking-wider bg-emerald-600 text-white rounded px-1 py-0.5 align-middle">
                          Ajánlott
                        </span>
                      )}
                    </span>
                    <span className="text-muted-foreground tabular-nums">Nettó {huf(t.net)}</span>
                    <span className="text-muted-foreground tabular-nums">ÁFA {huf(t.vat)}</span>
                    <span className="font-semibold tabular-nums">Bruttó {huf(t.gross)}</span>
                  </div>
                );
              })}
            </div>
            <div className="grid gap-3 text-sm">
              <Cell label="Címzett">
                <input value={contact.email} readOnly className={inputCls + " bg-muted/30"} />
              </Cell>
              <Cell label="Tárgy">
                <input value={subject} readOnly className={inputCls + " bg-muted/30"} />
              </Cell>
              <Cell label="Levél törzse">
                <textarea value={body} readOnly rows={22} className={inputCls + " bg-muted/30 font-mono text-xs leading-relaxed"} />
              </Cell>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => copy(subject, "Tárgy")} className="text-xs border border-input rounded px-3 py-2 hover:bg-accent">
                  Tárgy másolása
                </button>
                <button type="button" onClick={() => copy(body, "Levél szövege")} className="text-xs border border-input rounded px-3 py-2 hover:bg-accent">
                  Levél másolása (plaintext)
                </button>
                <button
                  type="button"
                  onClick={() => copyRich(bodyHtml, body, "Levél")}
                  className="text-xs bg-emerald-600 text-white rounded px-3 py-2 hover:bg-emerald-700 font-medium"
                  title="Formázott (HTML) másolás — Gmail compose ablakba illesztve megőrzi a formázást."
                >
                  Másolás formázottan (HTML — Gmailbe illeszthető)
                </button>
                <a href={gmailHref} target="_blank" rel="noopener noreferrer" className="text-xs bg-cta text-cta-foreground rounded px-3 py-2 hover:opacity-90" title="Üres Gmail compose, majd Ctrl/⌘+V a formázott levél beillesztéséhez.">
                  Megnyitás Gmailben (üres) — utána Ctrl/⌘ V
                </a>
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  disabled={pdfBusy}
                  className="text-xs bg-slate-900 text-white rounded px-3 py-2 hover:bg-slate-800 font-medium disabled:opacity-60"
                  title="A formázott ajánlat letöltése aláírással, A4 PDF-ként."
                >
                  {pdfBusy ? "PDF készül…" : "Letöltés PDF-ben (aláírással)"}
                </button>
              </div>
              {copyMsg && <div className="text-xs text-primary">{copyMsg}</div>}
              {pdfMsg && <div className="text-xs text-primary">{pdfMsg}</div>}

              {/* PDF-paraméterek + aláírás */}
              <div className="grid md:grid-cols-2 gap-3 mt-1 pt-3 border-t border-border">
                <Cell label="Árajánlat száma (a PDF meta-táblájához)">
                  <input
                    value={quoteNumber}
                    onChange={(e) => setQuoteNumber(e.target.value)}
                    className={inputCls}
                  />
                </Cell>
                <div className="grid gap-1">
                  <span className="text-xs font-medium">
                    Aláírás-kép (titkosítva private_data-ban, AES-256-GCM)
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      disabled={signatureBusy}
                      onChange={(e) => {
                        void onSignatureFile(e.target.files?.[0] ?? null);
                        e.target.value = "";
                      }}
                      className="text-xs flex-1"
                    />
                    {signatureId && (
                      <button
                        type="button"
                        disabled={signatureBusy}
                        onClick={() => void clearSignature()}
                        className="text-xs border border-input rounded px-2 py-1 hover:bg-accent disabled:opacity-50"
                      >
                        Eltávolítás
                      </button>
                    )}
                  </div>
                  {signatureBusy && (
                    <span className="text-xs text-muted-foreground">Feltöltés / dekódolás…</span>
                  )}
                  {signatureErr && (
                    <span className="text-xs text-destructive">{signatureErr}</span>
                  )}
                  {signatureId && (
                    <span className="text-[10px] font-mono text-muted-foreground">
                      id: {signatureId}
                    </span>
                  )}
                  {signatureDataUrl && (
                    <img
                      src={signatureDataUrl}
                      alt="Aláírás előnézet"
                      className="mt-1 max-h-16 border border-border rounded p-1 bg-white"
                    />
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* 7. Kísérő e-mail (PDF mellé) */}
          <section className="border border-border rounded p-4 bg-card">
            <h2 className="text-sm font-semibold mb-1">
              7. Kísérő e-mail (a PDF-melléklethez)
            </h2>
            <p className="text-xs text-muted-foreground mb-3">
              Rövid kísérő levél, amelyhez a 6. pontban letöltött PDF-et csatolja.
              {includesOEMBulb
                ? ` Mivel az ajánlatban szerepel a „Csak gyári (OEM) izzó" (ház nélküli) kivitel, a levél tartalmaz egy udvarias, döntés-előkészítő figyelmeztetést a kazettás (diszkont modulos) kivitel előnyeiről, GYIK- és csere-útmutató hivatkozással.`
                : " (Az ajánlatban nincs csupasz izzós kivitel, ezért a levél nem tartalmaz a kivitelválasztásra vonatkozó figyelmeztetést.)"}
            </p>
            <div className="grid gap-3 text-sm">
              <Cell label="Címzett">
                <input value={contact.email} readOnly className={inputCls + " bg-muted/30"} />
              </Cell>
              <Cell label="Tárgy">
                <input value={coverEmailSubject} readOnly className={inputCls + " bg-muted/30"} />
              </Cell>
              <Cell label="Levél törzse">
                <textarea
                  value={coverEmailBody}
                  readOnly
                  rows={18}
                  className={inputCls + " bg-muted/30 font-mono text-xs leading-relaxed"}
                />
              </Cell>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => copy(coverEmailSubject, "Tárgy")}
                  className="text-xs border border-input rounded px-3 py-2 hover:bg-accent"
                >
                  Tárgy másolása
                </button>
                <button
                  type="button"
                  onClick={() => copy(coverEmailBody, "Kísérő levél szövege")}
                  className="text-xs border border-input rounded px-3 py-2 hover:bg-accent"
                >
                  Levél másolása (plaintext)
                </button>
                <button
                  type="button"
                  onClick={() => copyRich(coverEmailHtml, coverEmailBody, "Kísérő levél")}
                  className="text-xs bg-emerald-600 text-white rounded px-3 py-2 hover:bg-emerald-700 font-medium"
                  title="Formázott (HTML) másolás — Gmail compose ablakba illesztve megőrzi a formázást."
                >
                  Másolás formázottan (HTML — Gmailbe illeszthető)
                </button>
                <a
                  href={coverGmailHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs bg-cta text-cta-foreground rounded px-3 py-2 hover:opacity-90"
                  title="Üres Gmail compose előtöltve a kísérő levéllel. Csatolja a 6. pontban letöltött PDF-et."
                >
                  Megnyitás Gmailben — utána csatolja a PDF-et
                </a>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Tipp: a Gmailben Ctrl/⌘+V-vel beillesztheti a formázott változatot,
                majd a gemkapocs ikonnal csatolja a letöltött PDF-ajánlatot.
              </p>
            </div>
          </section>
        </div>

        {/* JOBB — Készlet iframe */}
        {showFrame && (
          <aside className="min-w-0">
            <div className="xl:sticky xl:top-4 border border-border rounded bg-card overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30">
                <div className="text-xs font-semibold">
                  Készlet és árazás{" "}
                  {activeItemId && (
                    <span className="ml-1 text-muted-foreground font-normal">
                      → cél: tétel #{items.findIndex((i) => i.id === activeItemId) + 1}, kivitel <strong className="text-primary">{activeVariant}</strong>
                    </span>
                  )}
                </div>
                <a href={iframeUrl} target="_blank" rel="noopener noreferrer" className="text-xs underline text-muted-foreground hover:text-foreground">
                  Megnyitás új lapon ↗
                </a>
              </div>
              <iframe
                ref={iframeRef}
                src={iframeUrl}
                title="Készlet (beágyazva)"
                className="w-full h-[calc(100vh-9rem)] bg-background"
              />
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  ItemCard — egy tétel, 4 variáns árral                                     */
/* -------------------------------------------------------------------------- */

function ItemCard({
  index,
  item,
  canRemove,
  activeItemId,
  activeVariant,
  onItemClick,
  onPickVariant,
  onChange,
  onChangePrice,
  onRemove,
}: {
  index: number;
  item: Item;
  canRemove: boolean;
  activeItemId: string | null;
  activeVariant: Variant;
  onItemClick: () => void;
  onPickVariant: (v: Variant) => void;
  onChange: (patch: Partial<Item>) => void;
  onChangePrice: (v: Variant, val: number | "") => void;
  onRemove: () => void;
}) {
  const isActiveItem = activeItemId === item.id;
  return (
    <div
      onClick={onItemClick}
      className={
        "border rounded p-3 grid gap-3 text-sm cursor-pointer transition-colors " +
        (isActiveItem ? "border-primary bg-primary/5" : "border-border hover:border-input")
      }
    >
      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          Tétel #{index + 1} {isActiveItem && <span className="ml-2 text-primary font-medium">● aktív</span>}
        </div>
        {canRemove && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="text-xs text-muted-foreground hover:text-destructive"
          >
            Eltávolítás
          </button>
        )}
      </div>
      <div className="grid md:grid-cols-5 gap-2">
        <Cell label="Márka" className="md:col-span-1">
          <input value={item.brand} onChange={(e) => onChange({ brand: e.target.value })} className={inputCls} />
        </Cell>
        <Cell label="Típus" className="md:col-span-2">
          <input value={item.model} onChange={(e) => onChange({ model: e.target.value })} className={inputCls} />
        </Cell>
        <Cell label="Cikkszám" className="md:col-span-1">
          <input value={item.sku} onChange={(e) => onChange({ sku: e.target.value })} className={inputCls} />
        </Cell>
        <Cell label="Db" className="md:col-span-1">
          <input
            type="number"
            min={1}
            value={item.qty}
            onChange={(e) => onChange({ qty: parseInt(e.target.value, 10) || 1 })}
            className={inputCls}
          />
        </Cell>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {ALL_VARIANTS.map((v) => {
          const meta = VARIANT_META[v];
          const isActive = isActiveItem && activeVariant === v;
          const price = item.unitPrices[v];
          const isDefaultVariant = v === "A";
          return (
            <div
              key={v}
              onClick={(e) => {
                e.stopPropagation();
                onPickVariant(v);
              }}
              className={
                "border rounded p-2 transition-colors cursor-pointer " +
                (isActive
                  ? "border-primary bg-primary/10 ring-1 ring-primary"
                  : isDefaultVariant
                  ? "border-l-4 border-l-emerald-500 border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/30 dark:bg-emerald-950/10 hover:border-emerald-400"
                  : "border-border hover:border-input bg-background")
              }
              title={meta.description}
            >
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                  {v}
                  {isDefaultVariant && (
                    <span className="ml-1 text-emerald-700 dark:text-emerald-400 font-bold normal-case tracking-normal">· alap</span>
                  )}
                </span>
                {isActive && <span className="text-[10px] text-primary font-medium">● aktív</span>}
              </div>
              <div className="text-[11px] leading-tight mt-0.5 mb-1.5 min-h-[2.2em]">{meta.short}</div>
              <div className="text-[9px] text-muted-foreground mb-1">Jótállás: {meta.warrantyShort}</div>
              <input
                type="number"
                min={0}
                value={price ?? ""}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => {
                  const val = e.target.value;
                  onChangePrice(v, val === "" ? "" : Math.max(0, parseInt(val, 10) || 0));
                }}
                placeholder="nettó Ft"
                className={inputCls + " text-right tabular-nums text-xs py-1"}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  UI primitívek                                                             */
/* -------------------------------------------------------------------------- */

const inputCls =
  "w-full border border-input rounded px-2 py-2 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring";

function TxtField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="grid gap-1">
      <span className="text-xs font-medium">{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className={inputCls} />
    </label>
  );
}

function Cell({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`grid gap-1 ${className}`}>
      <span className="text-xs font-medium">{label}</span>
      {children}
    </label>
  );
}
export default AjanlatPage;
