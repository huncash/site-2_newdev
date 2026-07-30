import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Színpadi világítás lámpa — Philips MSD Platinum moving head | projektorlampacsere.hu",
  description: "Színpadi moving head fej discharge lámpa: Philips MSD Platinum 5R, 7R, 10R, 14R, 17R, 20R. Színházi, klubvilágítási és televíziós rendezvénytechnikai parkba tételes áfás számlával.",
};

import { canonical } from "@/lib/seo";

function SzinpadLampaPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <nav className="text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Főoldal</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Színpadi világítás lámpa</span>
      </nav>
      <div className="mt-4 text-xs tracking-[0.25em] text-primary font-medium">SZAKMAI KATEGÓRIA</div>
      <h1 className="text-3xl font-semibold tracking-tight mt-2">
        Színpadi világítás — Philips MSD Platinum moving head lámpa
      </h1>
      <p className="text-muted-foreground mt-4 leading-relaxed">
        A színpadi, klubvilágítási és televíziós moving head fejek
        meghatározó fényforrás-családja a Philips MSD Platinum-széria
        (5R, 7R, 10R, 14R, 17R, 20R). A névleges értékek közvetlenül
        meghatározzák az adott fej fényerejét, sugárgeometriáját és
        élettartamát; a fejtípus megnevezésében (pl. „Sharpy 7R", „14R
        beam") szereplő érték az izzó típusát is jelöli.
      </p>

      <h2 className="mt-10 text-xl font-semibold">Tipikus alkalmazás</h2>
      <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground leading-relaxed list-disc list-inside marker:text-primary">
        <li><strong>MSD Platinum 5R / 7R</strong> — belépő és klubkategóriás beam moving headek (Sharpy és klónjai)</li>
        <li><strong>MSD Platinum 10R / 14R</strong> — középkategóriás színpadi beam/spot headek (Clay Paky Mythos klónok, Robe Pointe)</li>
        <li><strong>MSD Platinum 17R / 20R</strong> — nagy színpadi és tévéfelvételi fejek</li>
      </ul>

      <h2 className="mt-10 text-xl font-semibold">Élettartam és ütemezett csere</h2>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
        A Platinum-széria névleges élettartama 1 500–3 000 üzemóra — a 14R és
        17R változatok a felsőbb sávban, az 5R és 7R változatok az alsóbb
        sávban. A turné- és fesztiválhasználatra szánt fejek élettartam-
        tervezésénél tipikus a féléves rendszeres csere a tényleges
        üzemórától függetlenül: a kopott elektródájú izzó instabil
        sugárgeometriát és fényerő-ingadozást okoz.
      </p>

      <h2 className="mt-10 text-xl font-semibold">Mit szállítunk</h2>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
        Eredeti Philips MSD Platinum-széria izzókat (5R, 7R, 10R, 14R, 17R,
        20R) szállítunk, tételes áfás számlával az ADP-TOP Kft. neve alatt.
        A fizetés minden ügyfél — rendezvénytechnikai és viszonteladói
        partnereket is ideértve — számára egységesen díjbekérő számla
        (Számlázz.hu) alapján, banki átutalással történik.
      </p>

      <div className="mt-10 rounded-lg border bg-card p-5">
        <p className="text-sm text-muted-foreground">
          A discharge lámpacsere biztonsági szempontjait és a tipikus
          üzemeltetési hibákat az{" "}
          <Link href={`/blog/${"msd-szinpadi-lampa-discharge" }`} className="text-primary hover:underline">
            MSD discharge színpadi lámpa bejegyzésben
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
export default SzinpadLampaPage;
