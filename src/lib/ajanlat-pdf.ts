import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const LOGO_PATH = "/assets/logo-icon.png";

/** about:blank iframe-ben a relatív /assets/... URL nem oldódik fel — abszolút kell. */
function absoluteUrl(pathOrData: string): string {
  if (!pathOrData || pathOrData.startsWith("data:") || /^https?:\/\//i.test(pathOrData)) {
    return pathOrData;
  }
  if (typeof window === "undefined") return pathOrData;
  try {
    return new URL(pathOrData, window.location.origin).href;
  } catch {
    return pathOrData;
  }
}

/* -------------------------------------------------------------------------- */
/*  PDF-export — ugyanazokból a forrás-szövegekből, amiket az e-mail is használ */
/* -------------------------------------------------------------------------- */

export type PdfVariantMeta = { full: string; short: string; warrantyShort: string };

export type PdfVersionRow = {
  index: number;
  brand: string;
  model: string;
  sku: string;
  qty: number;
  unit: number;
  line: number;
  variantFull: string;
  warrantyShort: string;
};

export type PdfVersion = {
  key: string;
  label: string;
  isDefault: boolean;
  rows: PdfVersionRow[];
  itemsNet: number;
  shipping: number;
  net: number;
  vat: number;
  gross: number;
};

export type PdfContact = {
  lastName: string;
  firstName: string;
  email: string;
  phone: string;
  company: string;
  taxNumber: string;
  address?: string;
  registryNumber?: string;
};

export type PdfInput = {
  contact: PdfContact;
  versions: PdfVersion[];
  intro: string;
  comparisonNote?: string;
  hasQtyDivergence: boolean;
  shippingText: string;
  noInstallNote: string;
  paymentBlock: string;
  warrantyText: string;
  validUntil: string;
  quoteNumber: string;
  quoteDate: string;
  deliveryDeadline: string;
  signatureDataUrl: string | null;
  signerName: string;
  signerRole: string;
};

const fmt = new Intl.NumberFormat("hu-HU");
const huf = (n: number) => `${fmt.format(Math.round(n))} Ft`;
const eur = (n: number) =>
  `${new Intl.NumberFormat("hu-HU", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)} EUR`;
/** PDF-ben ne jelenjenek meg az „A / B / C" belső kódhivatkozások. */
const stripVariantCodes = (s: string) =>
  s
    // „— A / B / C —" típusú beszúrások (em-dashes vagy zárójelek között)
    .replace(/\s*[—–-]\s*A\s*\/\s*B\s*\/\s*C\s*[—–-]\s*/g, " ")
    .replace(/\s*\(\s*A\s*\/\s*B\s*\/\s*C\s*\)\s*/g, " ")
    // egyedi „(A)", „(B)", „(C)" jelölések
    .replace(/\s*\((?:A|B|C)\)/g, "")
    .replace(/\s{2,}/g, " ");
const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function renderParagraphs(s: string): string {
  return s
    .split(/\n{2,}/)
    .map((p) => `<p style="margin:0 0 6px 0;">${esc(p).replace(/\n/g, "<br>")}</p>`)
    .join("");
}

function renderWarranty(s: string): string {
  const bullets: string[] = [];
  const tail: string[] = [];
  s.split("\n").forEach((l) => {
    if (l.startsWith("•"))
      bullets.push(`<li style="margin:1px 0;">${esc(l.replace(/^•\s*/, ""))}</li>`);
    else if (l.trim()) tail.push(`<p style="margin:6px 0 0 0;">${esc(l)}</p>`);
  });
  return `${bullets.length ? `<ul style="margin:0;padding-left:18px;">${bullets.join("")}</ul>` : ""}${tail.join("")}`;
}

function renderVersionBlock(v: PdfVersion): string {
  const accent = v.isDefault ? "#059669" : "#475569";
  const bg = v.isDefault ? "#ecfdf5" : "#f8fafc";
  const rows = v.rows
    .map(
      (r) => `<tr>
        <td style="padding:4px 6px;border-bottom:1px solid #e2e8f0;vertical-align:top;">
          <div style="font-weight:600;">${r.index + 1}. ${esc([r.brand, r.model].filter(Boolean).join(" ") || "(megnevezés)")}</div>
          ${r.sku ? `<div style="font-size:9px;color:#64748b;">cikkszám: ${esc(r.sku)}</div>` : ""}
          <div style="font-size:9px;color:#475569;margin-top:1px;">Kivitel: ${esc(stripVariantCodes(r.variantFull))}</div>
          <div style="font-size:9px;color:#475569;">Jótállás: ${esc(r.warrantyShort)}</div>
        </td>
        <td style="padding:4px 6px;border-bottom:1px solid #e2e8f0;text-align:right;white-space:nowrap;vertical-align:top;">${r.qty} db</td>
        <td style="padding:4px 6px;border-bottom:1px solid #e2e8f0;text-align:right;white-space:nowrap;vertical-align:top;">${esc(huf(r.unit))}</td>
        <td style="padding:4px 6px;border-bottom:1px solid #e2e8f0;text-align:right;white-space:nowrap;vertical-align:top;font-weight:600;">${esc(huf(r.line))}</td>
      </tr>`,
    )
    .join("");

  return `<div style="margin:6px 0;border-left:3px solid ${accent};background:${bg};padding:6px 8px;border-radius:3px;page-break-inside:avoid;">
    <div style="font-weight:700;font-size:12px;color:${accent};margin-bottom:3px;">
      ${esc(v.label)}${v.isDefault ? " · ajánlott választás" : ""}
    </div>
    <table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;margin-top:4px;font-size:10px;background:#ffffff;border:1px solid #e2e8f0;border-radius:3px;">
      <thead>
        <tr style="background:#f1f5f9;">
          <th style="text-align:left;padding:4px 6px;font-size:9px;text-transform:uppercase;letter-spacing:0.04em;color:#475569;">Tétel</th>
          <th style="text-align:right;padding:4px 6px;font-size:9px;text-transform:uppercase;letter-spacing:0.04em;color:#475569;">Db</th>
          <th style="text-align:right;padding:4px 6px;font-size:9px;text-transform:uppercase;letter-spacing:0.04em;color:#475569;">Nettó egységár</th>
          <th style="text-align:right;padding:4px 6px;font-size:9px;text-transform:uppercase;letter-spacing:0.04em;color:#475569;">Összesen</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <table cellpadding="0" cellspacing="0" style="margin-top:4px;width:100%;font-size:10px;">
      <tr><td style="padding:1px 0;color:#475569;">Tételek nettó</td><td style="padding:1px 0;text-align:right;">${esc(huf(v.itemsNet))}</td></tr>
      <tr><td style="padding:1px 0;color:#475569;">Szállítás</td><td style="padding:1px 0;text-align:right;">${v.shipping > 0 ? esc(huf(v.shipping)) : "díjmentes"}</td></tr>
      <tr><td style="padding:1px 0;color:#475569;">Nettó végösszeg</td><td style="padding:1px 0;text-align:right;font-weight:600;">${esc(huf(v.net))}</td></tr>
      <tr><td style="padding:1px 0;color:#475569;">ÁFA (27%)</td><td style="padding:1px 0;text-align:right;">${esc(huf(v.vat))}</td></tr>
      <tr><td style="padding:2px 0;color:#0f172a;font-weight:700;">Bruttó fizetendő</td><td style="padding:2px 0;text-align:right;font-weight:700;font-size:12px;color:${accent};">${esc(huf(v.gross))}</td></tr>
    </table>
  </div>`;
}

function renderHtml(input: PdfInput): string {
  const c = input.contact;
  const fullName = [c.lastName, c.firstName].filter(Boolean).join(" ");
  const customerName = c.company || fullName || "—";
  const contactPerson = c.company && fullName ? fullName : "—";
  const logoSrc = absoluteUrl(LOGO_PATH);
  const signatureSrc = input.signatureDataUrl
    ? absoluteUrl(input.signatureDataUrl)
    : null;

  const customerRow = (label: string, value: string) =>
    `<tr>
      <td style="padding:3px 6px;border:1px solid #cbd5e1;background:#f8fafc;font-size:9px;color:#475569;width:32%;">${esc(label)}</td>
      <td style="padding:3px 6px;border:1px solid #cbd5e1;font-size:10px;">${value ? esc(value) : "<span style='color:#94a3b8;'>—</span>"}</td>
    </tr>`;

  const versionsHtml = input.versions.map(renderVersionBlock).join("");

  return `<div style="font-family:'Helvetica Neue',Arial,sans-serif;color:#0f172a;font-size:10px;line-height:1.4;width:100%;padding:0;">
    <!-- FEJLÉC -->
    <table cellpadding="0" cellspacing="0" style="width:100%;border-bottom:2px solid #0f172a;padding-bottom:10px;margin-bottom:10px;">
      <tr>
        <td style="vertical-align:middle;width:78px;">
          <img src="${logoSrc}" alt="" width="68" height="68" style="display:block;border-radius:8px;" />
        </td>
        <td style="vertical-align:middle;padding-left:12px;">
          <div style="font-size:20px;font-weight:700;letter-spacing:-0.01em;line-height:1.15;">Projektorlámpacsere.hu</div>
          <div style="font-size:10px;color:#475569;font-style:italic;margin-top:4px;">Eredeti gyári izzó, méretpontos utángyártott kerettel — kerülőutak nélkül.</div>
        </td>
        <td style="vertical-align:middle;text-align:right;font-size:9px;color:#475569;line-height:1.5;white-space:nowrap;">
          <strong style="color:#0f172a;">ADP-TOP Kft.</strong><br>
          1116 Budapest, Híradó utca 29.<br>
          Adószám: 13777164-2-43<br>
          adptopkft@gmail.com
        </td>
      </tr>
    </table>

    <!-- CÍM -->
    <div style="text-align:center;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;margin:6px 0 8px 0;line-height:1.3;">
      Projektorlámpa-modulok szállítására vonatkozó szolgáltatói árajánlat
    </div>

    <!-- VEVŐ -->
    <table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;margin-bottom:6px;">
      ${customerRow("Név / Cégnév", customerName)}
      ${customerRow("Kapcsolattartó neve", contactPerson)}
      ${customerRow("Székhely / Szállítási cím", c.address || "")}
      ${customerRow("Cégjegyzékszám", c.registryNumber || "")}
      ${customerRow("Adószám", c.taxNumber)}
      ${customerRow("Telefonszám, e-mail", [c.phone, c.email].filter(Boolean).join(" · "))}
    </table>

    <p style="margin:4px 0 6px 0;font-size:10px;">${esc(input.intro)}</p>

    ${versionsHtml}

    ${
      input.comparisonNote
        ? `<h3 style="font-size:10px;text-transform:uppercase;letter-spacing:0.05em;color:#475569;margin:8px 0 3px 0;">Mit érdemes mérlegelni</h3>${renderParagraphs(stripVariantCodes(input.comparisonNote))}`
        : ""
    }

    ${
      input.hasQtyDivergence
        ? `<div style="margin:6px 0;padding:4px 8px;background:#fffbeb;border:1px solid #fde68a;border-radius:3px;font-size:9px;"><strong style="color:#92400e;">Eltérő darabszámok:</strong> egyes tételeknél a csomagok eltérő darabszámmal készültek — adott keretösszegen belül a legkedvezőbb mix-et választhatja.</div>`
        : ""
    }

    <h3 style="font-size:10px;text-transform:uppercase;letter-spacing:0.05em;color:#475569;margin:8px 0 3px 0;">Szállítás</h3>
    ${renderParagraphs(input.shippingText)}

    <h3 style="font-size:10px;text-transform:uppercase;letter-spacing:0.05em;color:#475569;margin:6px 0 3px 0;">Beszerelés</h3>
    <p style="margin:0 0 4px 0;">Cégünk a beszerelést / fizikai cserét <strong>nem végzi</strong> — kizárólag a projektorlámpa-modulok és gyári izzók értékesítésével foglalkozunk; a csere a vásárló vagy az általa megbízott szakember feladata.</p>

    <h3 style="font-size:10px;text-transform:uppercase;letter-spacing:0.05em;color:#475569;margin:6px 0 3px 0;">Fizetés</h3>
    ${renderParagraphs(input.paymentBlock)}

    <h3 style="font-size:10px;text-transform:uppercase;letter-spacing:0.05em;color:#475569;margin:6px 0 3px 0;">Garancia</h3>
    ${renderWarranty(stripVariantCodes(input.warrantyText))}

    <p style="margin:8px 0 4px 0;font-weight:700;">Az árajánlat érvényessége: ${esc(input.validUntil)}.</p>

    <!-- AJÁNLAT META -->
    <table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;margin-top:4px;page-break-inside:avoid;">
      <thead>
        <tr style="background:#f1f5f9;">
          <th style="padding:3px 6px;border:1px solid #cbd5e1;font-size:9px;text-align:left;color:#475569;">Fizetési mód</th>
          <th style="padding:3px 6px;border:1px solid #cbd5e1;font-size:9px;text-align:left;color:#475569;">Szállítási határidő</th>
          <th style="padding:3px 6px;border:1px solid #cbd5e1;font-size:9px;text-align:left;color:#475569;">Árajánlat száma</th>
          <th style="padding:3px 6px;border:1px solid #cbd5e1;font-size:9px;text-align:left;color:#475569;">Ajánlatadás dátuma</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="padding:4px 6px;border:1px solid #cbd5e1;font-size:10px;">Díjbekérő + banki átutalás</td>
          <td style="padding:4px 6px;border:1px solid #cbd5e1;font-size:10px;">${esc(input.deliveryDeadline)}</td>
          <td style="padding:4px 6px;border:1px solid #cbd5e1;font-size:10px;">${esc(input.quoteNumber)}</td>
          <td style="padding:4px 6px;border:1px solid #cbd5e1;font-size:10px;">${esc(input.quoteDate)}</td>
        </tr>
      </tbody>
    </table>

    <!-- ALÁÍRÁS -->
    <table cellpadding="0" cellspacing="0" style="width:100%;margin-top:18px;page-break-inside:avoid;">
      <tr>
        <td style="width:55%;"></td>
        <td style="width:45%;text-align:center;">
          ${
            signatureSrc
              ? `<img src="${signatureSrc}" alt="" style="max-height:52px;max-width:170px;display:inline-block;margin-bottom:2px;" />`
              : `<div style="height:40px;"></div>`
          }
          <div style="border-top:1px solid #0f172a;padding-top:3px;">
            <div style="font-weight:700;font-style:italic;font-size:10px;">${esc(input.signerName)}</div>
            <div style="font-style:italic;font-size:9px;color:#475569;">${esc(input.signerRole)}</div>
          </div>
        </td>
      </tr>
    </table>

    <!-- FOOTER -->
    <div style="margin-top:10px;padding-top:4px;border-top:1px solid #0f172a;text-align:center;font-size:8px;color:#475569;">
      ● PROJEKTORLAMPACSERE.HU ● adptopkft@gmail.com ● ADP-TOP Kft. ●
    </div>
  </div>`;
}

/** Build & download the offer as a PDF. */
export async function downloadAjanlatPdf(input: PdfInput, filename: string): Promise<void> {
  // Isolated iframe — elkerüli a fő dokumentum Tailwind/oklch tokenjeit,
  // amelyekkel a html2canvas nem boldogul.
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.left = "-10000px";
  iframe.style.top = "0";
  iframe.style.width = "800px";
  iframe.style.height = "1200px";
  iframe.style.border = "0";
  document.body.appendChild(iframe);

  try {
    const doc = iframe.contentDocument;
    const win = iframe.contentWindow;
    if (!doc || !win) throw new Error("iframe nem érhető el");

    doc.open();
    doc.write(`<!doctype html><html><head><meta charset="utf-8"><style>
      *,*::before,*::after { box-sizing: border-box; }
      html, body { margin: 0; padding: 0; background: #ffffff; color: #0f172a; }
      body { font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 10px; line-height: 1.4; }
      img { max-width: 100%; }
      table { border-collapse: collapse; }
    </style></head><body><div id="root" style="width:780px;padding:14px;background:#ffffff;">${renderHtml(input)}</div></body></html>`);
    doc.close();

    // Wait for images
    const imgs = Array.from(doc.querySelectorAll("img"));
    await Promise.all(
      imgs.map(
        (img) =>
          new Promise<void>((resolve) => {
            if (img.complete && img.naturalWidth > 0) return resolve();
            img.addEventListener("load", () => resolve(), { once: true });
            img.addEventListener("error", () => resolve(), { once: true });
          }),
      ),
    );
    // Small settle delay for layout
    await new Promise((r) => setTimeout(r, 80));

    const root = doc.getElementById("root") as HTMLElement;
    // Forced page-breaks: collect Y offsets (in CSS px relative to root) BEFORE html2canvas.
    const rootRect = root.getBoundingClientRect();
    const breakEls = Array.from(
      root.querySelectorAll<HTMLElement>('[data-pdf-page-break="before"]'),
    );
    const forcedBreaksCssPx = breakEls
      .map((el) => el.getBoundingClientRect().top - rootRect.top)
      .filter((y) => y > 0)
      .sort((a, b) => a - b);

    const canvas = await html2canvas(root, {
      backgroundColor: "#ffffff",
      scale: 2,
      useCORS: true,
      windowWidth: 780,
      windowHeight: root.scrollHeight,
    });

    // A4 portrait: 595.28 × 841.89 pt
    const pdf = new jsPDF({ unit: "pt", format: "a4", compress: true });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const marginX = 14;
    const marginY = 22;
    const renderW = pageW - marginX * 2;
    const scale = renderW / canvas.width;
    const fullH = canvas.height * scale;
    const pageContentH = pageH - marginY * 2;

    // Slice the canvas vertically into pages
    const sliceCanvasHeight = Math.floor(pageContentH / scale);
    // html2canvas was rendered at scale: 2 → 1 CSS px = 2 canvas px.
    const forcedBreaksCanvasPx = forcedBreaksCssPx.map((y) => Math.round(y * 2));
    let renderedY = 0;
    let pageIdx = 0;
    while (renderedY < canvas.height) {
      // Honor the next forced page-break if it falls within the current page slice.
      const nextForced = forcedBreaksCanvasPx.find(
        (y) => y > renderedY + 4 && y <= renderedY + sliceCanvasHeight,
      );
      const maxSlice = nextForced != null ? nextForced - renderedY : sliceCanvasHeight;
      const sliceH = Math.min(maxSlice, canvas.height - renderedY);
      const sliceCanvas = document.createElement("canvas");
      sliceCanvas.width = canvas.width;
      sliceCanvas.height = sliceH;
      const ctx = sliceCanvas.getContext("2d");
      if (!ctx) throw new Error("canvas 2d context nem elérhető");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
      ctx.drawImage(canvas, 0, renderedY, canvas.width, sliceH, 0, 0, canvas.width, sliceH);
      const imgData = sliceCanvas.toDataURL("image/jpeg", 0.92);
      if (pageIdx > 0) pdf.addPage();
      pdf.addImage(imgData, "JPEG", marginX, marginY, renderW, sliceH * scale);
      renderedY += sliceH;
      pageIdx++;
    }
    void fullH;

    pdf.save(filename);
  } finally {
    document.body.removeChild(iframe);
  }
}