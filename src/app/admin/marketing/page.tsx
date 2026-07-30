"use client";

import Link from "next/link";
import { useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { landingPages } from "@/data/landing-pages";
import {
  generateAdVariants,
  auditLandingPage,
  type AdVariantResult,
  type CampaignAuditResult,
} from "@/lib/marketing.functions";
import { isGoogleAdsConfigured } from "@/lib/analytics";

type Tab = "konverzio" | "ai" | "gsc";

function MarketingPage() {
  const [tab, setTab] = useState<Tab>("ai");

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <AdminHeader badge="MARKETING" title="Google Ads / SEO / AI hirdetés-tervezet" />

      <nav className="flex gap-1 border-b border-border mb-6 text-sm">
        <TabBtn active={tab === "ai"} onClick={() => setTab("ai")}>
          AI hirdetés-tervezet
        </TabBtn>
        <TabBtn active={tab === "konverzio"} onClick={() => setTab("konverzio")}>
          Konverziómérés
        </TabBtn>
        <TabBtn active={tab === "gsc"} onClick={() => setTab("gsc")}>
          Search Console
        </TabBtn>
      </nav>

      {tab === "ai" && <AiPanel />}
      {tab === "konverzio" && <ConversionPanel />}
      {tab === "gsc" && <GscPanel />}
    </div>
  );
}

function TabBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 -mb-px border-b-2 font-medium transition-colors ${
        active
          ? "border-primary text-foreground"
          : "border-transparent text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

/* ============================================================
 * AI hirdetés-tervezet
 * ============================================================ */
function AiPanel() {
  const gen = generateAdVariants;
  const audit = auditLandingPage;
  const [path, setPath] = useState(landingPages[0].path);
  const [tone, setTone] = useState<"formal" | "urgent" | "value">("formal");
  const [loading, setLoading] = useState(false);
  const [auditing, setAuditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AdVariantResult | null>(null);
  const [auditResult, setAuditResult] = useState<CampaignAuditResult | null>(null);

  const selected = landingPages.find((p) => p.path === path)!;

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const r = await gen({ data: { landingPath: path, tone } });
      setResult(r);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ismeretlen hiba");
    } finally {
      setLoading(false);
    }
  }

  async function handleAudit() {
    setAuditing(true);
    setError(null);
    setAuditResult(null);
    try {
      const r = await audit({ data: { landingPath: path } });
      setAuditResult(r);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ismeretlen hiba");
    } finally {
      setAuditing(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="border border-border rounded p-4 bg-surface">
        <div className="grid md:grid-cols-3 gap-3">
          <label className="text-sm">
            <div className="text-xs text-muted-foreground mb-1">Landing oldal</div>
            <select
              value={path}
              onChange={(e) => setPath(e.target.value)}
              className="w-full border border-border rounded px-2 py-1.5 bg-background text-sm"
            >
              {landingPages.map((p) => (
                <option key={p.path} value={p.path}>
                  {p.title}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <div className="text-xs text-muted-foreground mb-1">Hangvétel</div>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value as typeof tone)}
              className="w-full border border-border rounded px-2 py-1.5 bg-background text-sm"
            >
              <option value="formal">Hivatalos, B2B</option>
              <option value="urgent">Sürgető, határidőre</option>
              <option value="value">Értékajánlat-központú</option>
            </select>
          </label>
          <div className="flex items-end gap-2">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="px-4 py-2 bg-cta text-cta-foreground hover:bg-cta-hover rounded text-sm font-medium disabled:opacity-50"
            >
              {loading ? "Generálás…" : "Hirdetés generálása"}
            </button>
            <button
              onClick={handleAudit}
              disabled={auditing}
              className="px-4 py-2 border border-border rounded text-sm font-medium hover:bg-surface disabled:opacity-50"
            >
              {auditing ? "Elemzés…" : "AI audit"}
            </button>
          </div>
        </div>
        <div className="mt-3 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Cél:</span> {selected.audience} ·{" "}
          <span className="font-medium text-foreground">Fő kulcsszó:</span>{" "}
          {selected.primaryKeyword}
        </div>
      </div>

      {error && (
        <div className="border border-destructive/50 bg-destructive/5 text-destructive rounded p-3 text-sm">
          {error}
        </div>
      )}

      {auditResult && <AuditView data={auditResult} />}
      {result && <AdResultView data={result} />}

      {!result && !auditResult && !loading && !auditing && (
        <div className="text-sm text-muted-foreground text-center py-8">
          Válassz landing oldalt, majd generálj hirdetés-tervezetet vagy futtass AI auditot.
        </div>
      )}
    </div>
  );
}

function AuditView({ data }: { data: CampaignAuditResult }) {
  return (
    <section className="border border-border rounded p-4 bg-surface space-y-4">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        AI audit
      </h2>
      <div className="grid md:grid-cols-2 gap-4 text-sm">
        <div>
          <div className="font-medium text-foreground mb-2">Erősségek</div>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            {data.strengths.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
        <div>
          <div className="font-medium text-foreground mb-2">Gyengeségek</div>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            {data.weaknesses.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      </div>
      <div>
        <div className="font-medium text-foreground text-sm mb-2">Konkrét lépések</div>
        <ul className="space-y-2">
          {data.next_actions.map((a, i) => (
            <li key={i} className="border border-border rounded p-3 bg-background">
              <div className="flex items-baseline justify-between gap-2">
                <div className="font-medium text-sm">{a.title}</div>
                <span
                  className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded ${
                    a.effort === "low"
                      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                      : a.effort === "medium"
                        ? "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                        : "bg-red-500/10 text-red-700 dark:text-red-400"
                  }`}
                >
                  {a.effort}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{a.why}</p>
            </li>
          ))}
        </ul>
      </div>
      <div className="text-xs text-muted-foreground italic border-t border-border pt-3">
        Szezonális megjegyzés: {data.seasonal_note}
      </div>
    </section>
  );
}

function AdResultView({ data }: { data: AdVariantResult }) {
  return (
    <section className="space-y-6">
      <Block title={`Headline-ok (${data.headlines.length}/15, max 30 char)`}>
        <ul className="grid md:grid-cols-2 gap-1.5 text-sm">
          {data.headlines.map((h, i) => (
            <CopyableRow key={i} text={h} suffix={`${h.length}/30`} />
          ))}
        </ul>
        <CopyAllBtn label="Összes headline másolása" text={data.headlines.join("\n")} />
      </Block>

      <Block title={`Description-ök (${data.descriptions.length}/4, max 90 char)`}>
        <ul className="space-y-1.5 text-sm">
          {data.descriptions.map((d, i) => (
            <CopyableRow key={i} text={d} suffix={`${d.length}/90`} />
          ))}
        </ul>
        <CopyAllBtn
          label="Összes description másolása"
          text={data.descriptions.join("\n")}
        />
      </Block>

      <Block title="Kulcsszavak">
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <KwCol title="Broad" match="none" items={data.keywords.broad} />
          <KwCol title="Phrase" match="phrase" items={data.keywords.phrase} />
          <KwCol title="Exact" match="exact" items={data.keywords.exact} />
        </div>
      </Block>

      {data.sitelinks.length > 0 && (
        <Block title="Sitelinkek">
          <ul className="space-y-2 text-sm">
            {data.sitelinks.map((s, i) => (
              <li key={i} className="border border-border rounded p-3 bg-background">
                <div className="font-medium">{s.text}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {s.description1} · {s.description2}
                </div>
              </li>
            ))}
          </ul>
        </Block>
      )}

      {data.notes && (
        <div className="text-xs text-muted-foreground italic border-t border-border pt-3">
          Kampányjavaslat: {data.notes}
        </div>
      )}
    </section>
  );
}

function KwCol({
  title,
  match,
  items,
}: {
  title: string;
  match: "none" | "phrase" | "exact";
  items: string[];
}) {
  const fmt = (k: string) =>
    match === "phrase" ? `"${k}"` : match === "exact" ? `[${k}]` : k;
  const asText = items.map(fmt).join("\n");
  return (
    <div>
      <div className="font-medium text-foreground mb-2">{title}</div>
      <ul className="space-y-1 mb-2 text-muted-foreground">
        {items.map((k, i) => (
          <li key={i} className="font-mono text-xs">
            {fmt(k)}
          </li>
        ))}
      </ul>
      <CopyAllBtn label={`${title} másolás`} text={asText} />
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-border rounded p-4 bg-surface">
      <h3 className="text-sm font-semibold mb-3">{title}</h3>
      {children}
    </div>
  );
}

function CopyableRow({ text, suffix }: { text: string; suffix: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <li className="flex items-center gap-2 border border-border rounded px-2 py-1.5 bg-background">
      <span className="flex-1 truncate">{text}</span>
      <span className="text-[10px] text-muted-foreground tabular-nums">{suffix}</span>
      <button
        onClick={() => {
          void navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1200);
        }}
        className="text-xs px-2 py-0.5 border border-border rounded hover:bg-surface"
      >
        {copied ? "✓" : "másol"}
      </button>
    </li>
  );
}

function CopyAllBtn({ label, text }: { label: string; text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        void navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      }}
      className="mt-3 text-xs px-3 py-1.5 border border-border rounded hover:bg-surface"
    >
      {copied ? "✓ Vágólapra másolva" : label}
    </button>
  );
}

/* ============================================================
 * Konverziómérés
 * ============================================================ */
function ConversionPanel() {
  const configured = isGoogleAdsConfigured();
  return (
    <div className="space-y-4">
      <div
        className={`border rounded p-4 ${
          configured
            ? "border-emerald-500/40 bg-emerald-500/5"
            : "border-amber-500/40 bg-amber-500/5"
        }`}
      >
        <div className="font-medium text-sm">
          {configured
            ? "✓ Google Ads tag konfigurálva"
            : "Google Ads tag még nincs konfigurálva"}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {configured
            ? "A gtag.js betöltődik minden oldalon, a quote_submitted és cta_quote_click_oktatas események automatikusan konverzióként mennek, amint a címke (label) is be van állítva."
            : "Ha van már Google Ads fiókod, add hozzá az AW-XXXXXXXXX formátumú Conversion ID-t a .env fájlhoz. Enélkül a mérés kikapcsolva marad."}
        </p>
      </div>

      <section className="border border-border rounded p-4 bg-surface space-y-3">
        <h3 className="text-sm font-semibold">Beállítási lépések</h3>
        <ol className="space-y-3 text-sm text-foreground list-decimal pl-5">
          <li>
            <div className="font-medium">Google Ads fiók létrehozása</div>
            <p className="text-xs text-muted-foreground">
              Ingyenes,{" "}
              <a
                href="https://ads.google.com/"
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-foreground"
              >
                ads.google.com
              </a>
              . Számlázási adatok szükségesek, de kampányt kötelezően nem kell indítani.
            </p>
          </li>
          <li>
            <div className="font-medium">Manager (MCC) fiók létrehozása</div>
            <p className="text-xs text-muted-foreground">
              Szintén ingyen,{" "}
              <a
                href="https://ads.google.com/home/tools/manager-accounts/"
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-foreground"
              >
                itt
              </a>
              . Csak MCC alól igényelhető Google Ads API developer token.
            </p>
          </li>
          <li>
            <div className="font-medium">Conversion action létrehozása</div>
            <p className="text-xs text-muted-foreground">
              Google Ads → Tools → Conversions → New. „Website" típus, „Submit lead form"
              category, count = „One". Kapsz egy Conversion ID-t (AW-…) és egy Conversion
              Label-t.
            </p>
          </li>
          <li>
            <div className="font-medium">Beállítás a projektbe</div>
            <p className="text-xs text-muted-foreground">
              Add hozzá a <code>.env</code> fájlhoz:
            </p>
            <pre className="mt-2 text-[11px] font-mono bg-background border border-border rounded p-2 overflow-x-auto">
              {`VITE_GOOGLE_ADS_ID=AW-XXXXXXXXX
VITE_GOOGLE_ADS_LABEL_QUOTE=abcDEF123
VITE_GOOGLE_ADS_LABEL_CTA=xyzABC456`}
            </pre>
          </li>
          <li>
            <div className="font-medium">Ellenőrzés</div>
            <p className="text-xs text-muted-foreground">
              Deploy után az „Ellenőrzés" gombbal a Google Ads Tag Assistant böngésző-plugin
              megnézi, hogy tüzel-e a konverzió.
            </p>
          </li>
        </ol>
      </section>

      <section className="border border-border rounded p-4 bg-surface text-sm">
        <h3 className="font-semibold mb-2">Már mért események</h3>
        <ul className="space-y-1 text-xs font-mono text-muted-foreground">
          <li>quote_submitted — fő konverzió (érték: becsült EUR)</li>
          <li>cta_quote_click_oktatas — mikrokonverzió (source prop-al)</li>
        </ul>
        <p className="text-xs text-muted-foreground mt-3">
          Ezek jelenleg Plausible-be mennek. A Google Ads ID beállításával automatikusan
          párhuzamosan tüzelnek a gtag konverzióba is — nincs kódmódosítás.
        </p>
      </section>
    </div>
  );
}

/* ============================================================
 * Search Console (később a connectorral)
 * ============================================================ */
function GscPanel() {
  return (
    <div className="border border-border rounded p-6 bg-surface text-sm space-y-3">
      <h3 className="font-semibold">Google Search Console — organikus teljesítmény</h3>
      <p className="text-muted-foreground">
        A GSC connector már linkelve van a projekthez (
        <code className="font-mono text-xs">GOOGLE_SEARCH_CONSOLE_API_KEY</code> secret). A
        query-, kattintás-, megjelenés- és pozíció-adatok bekötése a következő
        körben kerül ide — a jelenleg elérhető konverziós és AI hirdetés-panel az elsőbb
        rendelendő rész.
      </p>
      <p className="text-muted-foreground text-xs">
        Addig is: a Search Console webes felületén a{" "}
        <a
          href="https://search.google.com/search-console"
          target="_blank"
          rel="noreferrer"
          className="underline hover:text-foreground"
        >
          teljesítmény jelentés
        </a>{" "}
        elérhető.
      </p>
    </div>
  );
}
export default MarketingPage;
