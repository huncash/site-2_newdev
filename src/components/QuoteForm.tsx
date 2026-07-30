"use client";

import { useState, useRef } from "react";
import { z } from "zod";
import * as XLSX from "xlsx";
import { projectorBrands } from "@/data/brands";
import { modelsForBrand } from "@/data/projector-models";
import { trackEvent } from "@/lib/analytics";

type ProductRow = {
  id: string;
  brand: string;
  model: string;
  sku: string;
  quantity: number;
};

const newRow = (overrides: Partial<ProductRow> = {}): ProductRow => ({
  id: crypto.randomUUID(),
  brand: "",
  model: "",
  sku: "",
  quantity: 1,
  ...overrides,
});

const contactSchema = z
  .object({
    lastName: z.string().trim().min(1, "A vezetéknév megadása kötelező").max(60),
    firstName: z.string().trim().min(1, "A keresztnév megadása kötelező").max(60),
    email: z.string().trim().email("Érvénytelen e-mail cím").max(255),
    company: z.string().trim().max(150).optional().or(z.literal("")),
    taxNumber: z
      .string()
      .trim()
      .max(40, "Az adószám túl hosszú")
      .regex(/^[A-Za-z0-9\-\s./]*$/, "Csak betűk, számok, kötőjel, pont, perjel")
      .optional()
      .or(z.literal("")),
    phone: z
      .string()
      .trim()
      .min(1, "A telefonszám megadása kötelező")
      .max(40, "A telefonszám túl hosszú")
      .regex(/^[+0-9()\-\s./]+$/, "Csak számok és +, -, (), szóköz, pont, perjel"),
    notes: z.string().trim().max(1000).optional().or(z.literal("")),
  })
  .superRefine((val, ctx) => {
    const hasCompany = !!val.company && val.company.trim() !== "";
    const hasTax = !!val.taxNumber && val.taxNumber.trim() !== "";
    if (hasCompany && !hasTax) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["taxNumber"],
        message: "Cégnév megadása esetén az adószám is kötelező.",
      });
    }
    if (hasTax && !hasCompany) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["company"],
        message: "Adószám megadása esetén a cégnév is kötelező.",
      });
    }
  });

type ContactErrors = Partial<Record<keyof z.infer<typeof contactSchema>, string>>;

const WEB3FORMS_ACCESS_KEY = "0fb4d620-883f-4dcb-9245-583ead59163d";

export function QuoteForm({ productName, sku }: { productName?: string; sku?: string }) {
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [rowErrors, setRowErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [products, setProducts] = useState<ProductRow[]>(() => [
    newRow({
      sku: sku || "",
      model: !sku && productName ? productName : "",
    }),
  ]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importMsg, setImportMsg] = useState<string | null>(null);

  function updateRow(id: string, patch: Partial<ProductRow>) {
    setProducts((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }
  function removeRow(id: string) {
    setProducts((prev) => (prev.length === 1 ? prev : prev.filter((r) => r.id !== id)));
  }
  function addRow() {
    setProducts((prev) => [...prev, newRow()]);
  }

  function validateRows(rows: ProductRow[]): Record<string, string> {
    const errs: Record<string, string> = {};
    rows.forEach((r) => {
      if (!r.brand.trim()) {
        errs[r.id] = "A márka megadása kötelező.";
      } else if (!r.model.trim() && !r.sku.trim()) {
        errs[r.id] = "Adja meg a projektor típusát vagy a lámpamodul cikkszámát.";
      } else if (!Number.isFinite(r.quantity) || r.quantity < 1) {
        errs[r.id] = "A mennyiség legalább 1 db.";
      }
    });
    return errs;
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportMsg(null);
    try {
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, { defval: "" });
      const norm = (s: string) => s.toLowerCase().replace(/[\s_-]/g, "");
      const pick = (row: Record<string, unknown>, keys: string[]) => {
        for (const k of Object.keys(row)) {
          if (keys.includes(norm(k))) return String(row[k] ?? "").trim();
        }
        return "";
      };
      const imported: ProductRow[] = rows
        .map((r) => {
          const brand = pick(r, ["márka", "marka", "brand", "gyártó", "gyarto"]);
          const model = pick(r, ["típus", "tipus", "model", "modell", "projektor"]);
          const skuVal = pick(r, ["cikkszám", "cikkszam", "sku", "lámpa", "lampa", "kód", "kod"]);
          const qtyRaw = pick(r, ["mennyiség", "mennyiseg", "db", "qty", "quantity", "darab"]);
          const qty = parseInt(qtyRaw, 10);
          if (!brand && !model && !skuVal) return null;
          return newRow({
            brand,
            model,
            sku: skuVal,
            quantity: Number.isFinite(qty) && qty > 0 ? qty : 1,
          });
        })
        .filter((r): r is ProductRow => r !== null);
      if (imported.length === 0) {
        setImportMsg("Nem találtunk értelmezhető sorokat. Várt oszlopok: márka, típus, cikkszám, mennyiség.");
      } else {
        setProducts((prev) => {
          const empty = prev.length === 1 && !prev[0].brand && !prev[0].model && !prev[0].sku;
          return empty ? imported : [...prev, ...imported];
        });
        setImportMsg(`${imported.length} tétel beolvasva.`);
      }
    } catch {
      setImportMsg("Nem sikerült feldolgozni a fájlt. Kérjük .xlsx, .xls vagy .csv formátumot töltsön fel.");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const raw = Object.fromEntries(formData.entries());
    const result = contactSchema.safeParse(raw);
    const rErrs = validateRows(products);
    if (!result.success || Object.keys(rErrs).length > 0) {
      const next: ContactErrors = {};
      if (!result.success) {
        for (const issue of result.error.issues) {
          const key = issue.path[0] as keyof ContactErrors;
          if (key && !next[key]) next[key] = issue.message;
        }
      }
      setErrors(next);
      setRowErrors(rErrs);
      return;
    }
    setErrors({});
    setRowErrors({});
    setSubmitError(null);
    setSubmitting(true);

    const c = result.data;
    const fullName = `${c.lastName} ${c.firstName}`.trim();
    const itemsText = products
      .map(
        (r, i) =>
          `${i + 1}. ${r.brand} | Típus: ${r.model || "-"} | Cikkszám: ${r.sku || "-"} | Mennyiség: ${r.quantity} db`
      )
      .join("\n");

    const message =
      `Új árajánlat-kérés érkezett a projektorlampacsere.hu oldalról.\n\n` +
      `--- Kapcsolattartó ---\n` +
      `Név: ${fullName}\n` +
      `Vezetéknév: ${c.lastName}\n` +
      `Keresztnév: ${c.firstName}\n` +
      `E-mail: ${c.email}\n` +
      `Cégnév: ${c.company || "-"}\n` +
      `Adószám: ${c.taxNumber || "-"}\n` +
      `Telefon: ${c.phone}\n\n` +
      `--- Kért tételek ---\n${itemsText}\n\n` +
      `--- Megjegyzés ---\n${c.notes || "-"}\n`;

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `Árajánlat-kérés — ${c.company || fullName}`,
          from_name: "projektorlampacsere.hu — Árajánlat-kérés",
          replyto: c.email,
          name: fullName,
          last_name: c.lastName,
          first_name: c.firstName,
          email: c.email,
          company: c.company || "",
          tax_number: c.taxNumber || "",
          phone: c.phone,
          notes: c.notes || "",
          message,
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { success?: boolean; message?: string };
      if (!res.ok || !json.success) {
        throw new Error(json.message || "A beküldés nem sikerült.");
      }
      setSubmitted(true);
      trackEvent("quote_submitted", {
        items: products.length,
        has_company: c.company ? "yes" : "no",
      });
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? `Sajnáljuk, a beküldés nem sikerült: ${err.message} Kérjük, néhány perc múlva próbálja meg ismét.`
          : "Sajnáljuk, a beküldés nem sikerült. Kérjük, néhány perc múlva próbálja meg ismét."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="border border-primary/30 bg-primary-soft/40 rounded p-6 text-sm">
        <div className="font-medium text-primary-deep">Köszönjük, az árajánlat-kérést rögzítettük.</div>
        <p className="text-muted-foreground mt-2">
          Írásos, tételes ajánlattal válaszolunk — benne a készlettel, a szállítási
          idővel és a mennyiségi árral.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 text-sm">
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Vezetéknév" name="lastName" required maxLength={60} error={errors.lastName} />
        <Field label="Keresztnév" name="firstName" required maxLength={60} error={errors.firstName} />
        <Field label="Munkahelyi e-mail" name="email" type="email" required maxLength={255} error={errors.email} />
        <Field label="Telefonszám" name="phone" type="tel" required maxLength={40} error={errors.phone} />
        <Field
          label="Cégnév / Intézmény"
          name="company"
          maxLength={150}
          error={errors.company}
          tooltip="Megadása opcionális. Amennyiben kitölti, az adószám megadása is kötelező."
        />
        <Field
          label="Adószám"
          name="taxNumber"
          maxLength={40}
          placeholder="pl. 12345678-2-42"
          error={errors.taxNumber}
          tooltip="Megadása opcionális. Amennyiben kitölti, a cégnév megadása is kötelező."
        />
      </div>

      <div className="grid gap-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <div className="text-sm font-medium text-foreground">Kért tételek</div>
            <p className="text-xs text-muted-foreground">
              Soronként kötelező a márka és <em>vagy</em> a projektor típus, <em>vagy</em> a lámpamodul cikkszám.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs border border-input rounded px-3 py-2 hover:bg-accent transition"
            >
              Excel / CSV feltöltés
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              className="hidden"
              onChange={handleFile}
            />
          </div>
        </div>
        {importMsg && (
          <div className="text-xs text-muted-foreground border border-border rounded px-3 py-2 bg-muted/30">
            {importMsg}
          </div>
        )}

        <div className="grid gap-3">
          {products.map((row, idx) => (
            <div key={row.id} className="border border-border rounded p-3 bg-card grid gap-2">
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">Tétel #{idx + 1}</div>
                {products.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRow(row.id)}
                    className="text-xs text-muted-foreground hover:text-destructive transition"
                    aria-label="Tétel eltávolítása"
                  >
                    Eltávolítás
                  </button>
                )}
              </div>
              <div className="grid md:grid-cols-4 gap-2">
                <label className="grid gap-1 md:col-span-1">
                  <span className="text-xs font-medium">Márka *</span>
                  <select
                    value={row.brand}
                    onChange={(e) => updateRow(row.id, { brand: e.target.value })}
                    className="border border-input rounded px-2 py-2 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Válasszon…</option>
                    {projectorBrands.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-1 md:col-span-1">
                  <span className="text-xs font-medium">Projektor típus</span>
                  <input
                    value={row.model}
                    onChange={(e) => updateRow(row.id, { model: e.target.value })}
                    placeholder={row.brand ? "Válasszon vagy írjon be sajátot…" : "pl. PowerLite 1080"}
                    maxLength={100}
                    list={`models-${row.id}`}
                    autoComplete="off"
                    className="border border-input rounded px-2 py-2 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <datalist id={`models-${row.id}`}>
                    {modelsForBrand(row.brand).map((m) => (
                      <option key={m} value={m} />
                    ))}
                  </datalist>
                </label>
                <label className="grid gap-1 md:col-span-1">
                  <span className="text-xs font-medium">Lámpa cikkszám</span>
                  <input
                    value={row.sku}
                    onChange={(e) => updateRow(row.id, { sku: e.target.value })}
                    placeholder="pl. ELPLP96"
                    maxLength={80}
                    className="border border-input rounded px-2 py-2 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </label>
                <label className="grid gap-1 md:col-span-1">
                  <span className="text-xs font-medium">Mennyiség (db)</span>
                  <input
                    type="number"
                    min={1}
                    max={100000}
                    value={row.quantity}
                    onChange={(e) => updateRow(row.id, { quantity: parseInt(e.target.value, 10) || 1 })}
                    className="border border-input rounded px-2 py-2 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </label>
              </div>
              {rowErrors[row.id] && (
                <div className="text-xs text-destructive">{rowErrors[row.id]}</div>
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addRow}
          className="self-start inline-flex items-center gap-2 text-sm border border-dashed border-input rounded px-3 py-2 hover:bg-accent transition"
          aria-label="További termék hozzáadása"
        >
          <span className="text-lg leading-none">+</span> További termék hozzáadása
        </button>
      </div>

      <label className="grid gap-1.5">
        <span className="text-xs font-medium text-foreground">Megjegyzés</span>
        <textarea
          name="notes"
          rows={4}
          maxLength={1000}
          placeholder="Projektor típus, intézmény, határidő, szállítási igény…"
          className="border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        />
        {errors.notes && <span className="text-xs text-destructive">{errors.notes}</span>}
      </label>
      <button
        type="submit"
        disabled={submitting}
        className="bg-cta text-cta-foreground hover:bg-cta-hover font-medium rounded px-5 py-2.5 hover:opacity-90 transition justify-self-start"
      >
        {submitting ? "Beküldés folyamatban…" : "Árajánlat kérése"}
      </button>
      {submitError && (
        <div className="text-sm text-destructive border border-destructive/30 rounded px-3 py-2 bg-destructive/5">
          {submitError}
        </div>
      )}
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  defaultValue,
  placeholder,
  maxLength,
  error,
  tooltip,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string | number;
  placeholder?: string;
  maxLength?: number;
  error?: string;
  tooltip?: string;
}) {
  return (
    <label className="grid gap-1.5" title={tooltip}>
      <span className="text-xs font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-0.5" aria-hidden="true"> *</span>}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
        maxLength={maxLength}
        title={tooltip}
        className="border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
      />
      {error && <span className="text-xs text-destructive">{error}</span>}
    </label>
  );
}
