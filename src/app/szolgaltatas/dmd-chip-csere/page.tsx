import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DMD chip csere DLP projektorokba — sárga/zöld folt javítása | projektorlampacsere.hu",
  description: "DMD chip csere DLP projektorokba: sárga vagy zöld folt a kép sarkában, hiányzó pixelek és színhibák javítása. BenQ, NEC, Optoma, Panasonic, ViewSonic készülékekhez tételes áfás számlával.",
};

import { canonical } from "@/lib/seo";

function DmdChipPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <nav className="text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Főoldal</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">DMD chip csere</span>
      </nav>
      <div className="mt-4 text-xs tracking-[0.25em] text-primary font-medium">SZOLGÁLTATÁS</div>
      <h1 className="text-3xl font-semibold tracking-tight mt-2">
        DMD chip csere DLP projektorokba
      </h1>
      <p className="text-muted-foreground mt-4 leading-relaxed">
        A DLP technológiával működő projektorok kulcsalkatrésze a DMD-chip
        (Digital Micromirror Device): egy néhány millió, egyenként vezérelt
        mikrotükröt tartalmazó félvezető. Ha a kép sarkában sárga vagy zöld
        folt jelenik meg, hiányzó pixelcsoportok láthatók vagy a kontraszt
        a lámpamodul-csere után is romlott, az szinte minden esetben a
        DMD-chip hibája. A chipcsere költsége egy új, hasonló kategóriás
        vetítő árának 25–45%-a — szemben a teljes készülék cseréjével.
      </p>

      <h2 className="mt-10 text-xl font-semibold">Tipikus tünetek</h2>
      <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground leading-relaxed list-disc list-inside marker:text-primary">
        <li>Sárga vagy zöld folt a kép egyik sarkában vagy szélén</li>
        <li>Hiányzó vagy hibás pixelek csoportja, amely bemenettől függetlenül ugyanott marad</li>
        <li>Felbontás-eltolódás vagy duplázódott kép</li>
        <li>Kontraszt- és színveszteség, amelyet a lámpamodul-csere nem korrigál</li>
      </ul>

      <h2 className="mt-10 text-xl font-semibold">Tipikusan érintett modellek</h2>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
        A hazai oktatási és intézményi parkban leggyakrabban a 4–8 éves
        BenQ MH/SH/TH/MW, NEC NP-P/PA, Optoma EH/HD, Panasonic PT-DZ/DW és
        ViewSonic PJD/PG széria DLP vetítői jelentkeznek DMD-hibával. A
        chip cikkszáma a vetítő szervizdokumentációjából vagy a meglévő
        DMD-modul címkéjéről (jellemzően 1076-xxx vagy 8060-xxx kezdetű
        Texas Instruments cikkszám) olvasható le.
      </p>

      <h2 className="mt-10 text-xl font-semibold">Ajánlatkérés és garancia</h2>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
        Az ajánlatkéréshez a vetítő teljes típusszáma, a folt tüneteit
        bemutató 1–2 fotó (fehér és szürke háttéren), valamint az üzemóra-
        állapot szükséges. A leszállított DMD-chipre 6 hónap, legfeljebb
        500 üzemóra jótállást vállalunk. A megrendelést tételes áfás
        számlával, az ADP-TOP Kft. neve alatt számlázzuk.
      </p>

      <div className="mt-10 rounded-lg border bg-card p-5">
        <p className="text-sm text-muted-foreground">
          A diagnózishoz és a döntéshez kapcsolódó részletes háttéranyag a{" "}
          <Link href={`/blog/${"dmd-chip-csere-mikor-szukseges" }`} className="text-primary hover:underline">
            „DMD chip csere — mikor érdemes a teljes vetítő helyett"
          </Link>{" "}
          bejegyzésben olvasható.
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
export default DmdChipPage;
