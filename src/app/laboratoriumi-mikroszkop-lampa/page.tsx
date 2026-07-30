import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Laboratóriumi mikroszkóp lámpa — Nikon Intensilight, Olympus HBO | projektorlampacsere.hu",
  description: "Laboratóriumi és klinikai fluoreszcens mikroszkóp HBO higany-xenon lámpák: Nikon Intensilight C-HGFI / C-HGFIE, Olympus U-HGLGPS / SHI-130OL, valamint kompatibilis SHI-130N1 cserekészlet. Áfás számla.",
};

import { canonical } from "@/lib/seo";

function MikroszkopLampaPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <nav className="text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Főoldal</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Laboratóriumi mikroszkóp lámpa</span>
      </nav>
      <div className="mt-4 text-xs tracking-[0.25em] text-primary font-medium">SZAKMAI KATEGÓRIA</div>
      <h1 className="text-3xl font-semibold tracking-tight mt-2">
        Laboratóriumi és klinikai mikroszkóp lámpa
      </h1>
      <p className="text-muted-foreground mt-4 leading-relaxed">
        A fluoreszcens mikroszkópia hazai egyetemi és kórházi gyakorlatában
        máig domináns gerjesztőfényforrás a nagy nyomású higany-xenon (HBO)
        ívlámpa, amely a 365–550 nm közötti tartományban biztosít magas
        spektrális intenzitást a DAPI, FITC, TRITC és más színezékek
        gerjesztéséhez. Az általunk szállított csere-kiépítések a Nikon és
        az Olympus zárt fényegységeit fedik le.
      </p>

      <h2 className="mt-10 text-xl font-semibold">Szállított típusok</h2>
      <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground leading-relaxed list-disc list-inside marker:text-primary">
        <li><strong>Nikon Intensilight C-HGFI / C-HGFIE</strong> precentered cserekészlet és kompatibilis SHI-130N1 csere-modul</li>
        <li><strong>Olympus U-HGLGPS / SHI-130OL</strong> precentered, 130 W kompatibilis cserekészlet</li>
        <li><strong>HG Precentered Fiber Illuminator MBF72655 / MBF72665</strong> kompatibilis cseremodul</li>
        <li><strong>100 W és 200 W HBO csere-csövek</strong> hagyományos, manuálisan beigazítható lámpaházakhoz</li>
      </ul>

      <h2 className="mt-10 text-xl font-semibold">Élettartam és ütemezett csere</h2>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
        A 100 W-os HBO ívlámpa névleges élettartama jellemzően 2 000 üzemóra,
        a 200 W-os változatoké 400–500 óra. A kvantitatív fluoreszcens
        kiértékelés érdekében az élettartam-számláló alapján ütemezett
        csere mindig gazdaságosabb és módszertanilag pontosabb, mint a
        felfutási hiba utáni reakció — a felénél már 50% alatti gerjesztési
        intenzitás kép-összehasonlíthatósági problémákat okoz.
      </p>

      <h2 className="mt-10 text-xl font-semibold">Számlázás és intézményi feltételek</h2>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
        Egyetemi tanszékek, kórházi és klinikai laboratóriumok, valamint
        kutatóintézetek részére tételes áfás számlával, az ADP-TOP Kft.
        neve alatt számlázunk. A fizetés minden ügyfél számára egységesen
        díjbekérő számla (Számlázz.hu) alapján, banki átutalással
        történik; a jóváírás után indítjuk a teljesítést.
      </p>

      <div className="mt-10 rounded-lg border bg-card p-5">
        <p className="text-sm text-muted-foreground">
          A HBO lámpacsere biztonsági szempontjait és a tipikus üzemeltetési
          hibákat a{" "}
          <Link href={`/blog/${"hbo-mikroszkop-lampa-laboratoriumi" }`} className="text-primary hover:underline">
            HBO mikroszkóp lámpa bejegyzésben
          </Link>{" "}
          foglaltuk össze.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/ajanlatkeres" className="inline-flex items-center px-5 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
          Tételes árajánlat kérése
        </Link>
        <Link href="/kapcsolat" className="inline-flex items-center px-5 py-2.5 rounded-md border text-sm font-medium hover:bg-accent">
          Kapcsolatfelvétel
        </Link>
      </div>
    </div>
  );
}
export default MikroszkopLampaPage;
