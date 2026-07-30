import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Adatkezelési tájékoztató (GDPR) — projektorlampacsere.hu",
  description: "projektorlampacsere.hu (üzemeltető: ADP-TOP Kft.) GDPR-megfelelő adatkezelési tájékoztatója: árajánlatkérés, számlázás, kapcsolatfelvétel.",
};

import { company } from "@/data/company";
import { canonical } from "@/lib/seo";

function AdatvedelemPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="text-xs tracking-[0.25em] text-primary font-medium">JOGI</div>
      <h1 className="text-3xl font-semibold tracking-tight mt-2">Adatkezelési tájékoztató</h1>
      <p className="text-sm text-muted-foreground mt-3">Hatályos: 2026. január 1-jétől.</p>

      <Section n="1." title="Adatkezelő">
        <Defs items={[
          ["Adatkezelő neve", company.legalName],
          ["Rövid név", company.shortName],
          ["Székhely", company.address.full],
          ["Adószám", company.taxNumber],
          ["Cégjegyzékszám", `${company.registryNumberPlaceholder} (${company.registryAuthority})`],
          ["Kapcsolat (e-mail)", company.email],
        ]} />
        <P>
          Az adatkezelő nem nevezett ki adatvédelmi tisztviselőt (DPO), mivel erre az általános
          adatvédelmi rendelet (GDPR) 37. cikke alapján nem köteles. Adatvédelmi kérdésekben a fenti
          e-mail címen érhető el.
        </P>
      </Section>

      <Section n="2." title="A tájékoztató hatálya">
        <P>
          Jelen tájékoztató a {company.brandName} weboldalon keresztül megvalósuló adatkezelésekre
          vonatkozik. Az adatkezelés az Európai Parlament és a Tanács <strong>(EU) 2016/679 rendelete
          (GDPR)</strong>, valamint az információs önrendelkezési jogról és az információszabadságról
          szóló <strong>2011. évi CXII. törvény (Infotv.)</strong> alapján történik.
        </P>
      </Section>

      <Section n="3." title="Kezelt adatok, célok és jogalapok">
        <Table
          rows={[
            ["Árajánlat-kérés", "Név, e-mail, cégnév, adószám, telefonszám (opcionális), kért termék, mennyiség, megjegyzés", "Ajánlatadás, kapcsolattartás, szerződéskötés előkészítése", "GDPR 6. cikk (1) b) — szerződés megkötését megelőző intézkedés", "5 év (Ptk. általános elévülés)"],
            ["Megrendelés, számlázás", "Cégnév, székhely, adószám, kapcsolattartó, e-mail, telefonszám, megrendelt termék, ár", "A szerződés teljesítése, számla kiállítása", "GDPR 6. cikk (1) b) és c) — szerződés és jogi kötelezettség (Sztv. 169. §)", "8 év (számviteli bizonylatok)"],
            ["Kapcsolatfelvétel e-mailben", "Név, e-mail, üzenet tartalma", "Megkeresés megválaszolása", "GDPR 6. cikk (1) f) — jogos érdek (ügyfélkommunikáció)", "Lezárást követően max. 1 év"],
            ["Garanciális ügyintézés", "Vevő adatai, termék azonosító, hibaleírás, üzemóra-adat", "Garanciális kötelezettségek teljesítése", "GDPR 6. cikk (1) b) — szerződés", "Garanciaidő + 1 év"],
          ]}
        />
      </Section>

      <Section n="4." title="Sütik (cookie-k)">
        <P>
          A weboldal kizárólag a működéshez feltétlenül szükséges, ún. <strong>technikai sütiket</strong>{" "}
          használ (pl. munkamenet-azonosító). Marketing- vagy harmadik féltől származó analitikai
          sütiket nem helyezünk el a beleegyezés nélkül. Amennyiben ez a jövőben változik, a sütibanner
          megjelenésével előzetes hozzájárulást kérünk.
        </P>
      </Section>

      <Section n="5." title="Adattovábbítás, adatfeldolgozók">
        <P>
          Az adatkezelő az adatokat az alábbi adatfeldolgozók részére továbbíthatja, kizárólag a
          szolgáltatás nyújtásához szükséges mértékben:
        </P>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Tárhelyszolgáltató</strong> — a weboldal kiszolgálásához (a tárhely adatait az Impresszum tartalmazza).</li>
          <li><strong>Könyvelő iroda</strong> — számviteli kötelezettségek teljesítéséhez.</li>
          <li><strong>Futárszolgálat</strong> — a megrendelt termék kiszállításához (név, cím, telefonszám, e-mail).</li>
          <li><strong>Számlázó rendszer szolgáltatója</strong> — elektronikus számlák kiállításához.</li>
        </ul>
        <P>
          Az adatkezelő harmadik országba (EU/EGT-n kívülre) személyes adatot nem továbbít.
        </P>
      </Section>

      <Section n="6." title="Az érintett jogai">
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Hozzáférés</strong> — tájékoztatást kérhet a kezelt adatairól.</li>
          <li><strong>Helyesbítés</strong> — pontatlan adat javítását kérheti.</li>
          <li><strong>Törlés</strong> („elfeledtetéshez való jog") — a jogszabályi megőrzési idő keretein belül.</li>
          <li><strong>Korlátozás</strong> — bizonyos esetekben az adatkezelés korlátozása.</li>
          <li><strong>Adathordozhatóság</strong> — gépileg olvasható formátumban való átadás.</li>
          <li><strong>Tiltakozás</strong> — a jogos érdeken alapuló adatkezelés ellen.</li>
          <li><strong>Hozzájárulás visszavonása</strong> — ha az adatkezelés hozzájáruláson alapul.</li>
        </ul>
        <P>
          Kérelmét a <a href={`mailto:${company.email}`} className="text-primary hover:underline">{company.email}</a>{" "}
          címre küldve juttathatja el. Az adatkezelő a kérelmet legfeljebb 30 napon belül kivizsgálja
          és tájékoztatást ad.
        </P>
      </Section>

      <Section n="7." title="Adatbiztonság">
        <P>
          Az adatkezelő ésszerű technikai és szervezési intézkedéseket alkalmaz a kezelt adatok
          védelmére (titkosított adatátvitel, hozzáférési jogosultságok, biztonsági mentés). A
          munkatársak az adatokat szigorú titoktartás mellett kezelik.
        </P>
      </Section>

      <Section n="8." title="Jogorvoslat">
        <P>
          Adatkezeléssel kapcsolatos panaszával az adatkezelőhöz fordulhat. Amennyiben a választ nem
          tartja kielégítőnek, panaszával a <strong>Nemzeti Adatvédelmi és Információszabadság
          Hatósághoz (NAIH)</strong> fordulhat:
        </P>
        <Defs items={[
          ["Cím", "1055 Budapest, Falk Miksa utca 9-11."],
          ["Postacím", "1363 Budapest, Pf.: 9."],
          ["E-mail", "ugyfelszolgalat@naih.hu"],
          ["Honlap", "naih.hu"],
        ]} />
        <P>
          Ezen felül az érintett közvetlenül bírósághoz is fordulhat (lakóhelye vagy az adatkezelő
          székhelye szerinti törvényszéken).
        </P>
      </Section>

      <p className="mt-12 text-xs text-muted-foreground">
        Adatkezelő: {company.legalName} ({company.shortName}), {company.address.full}.
        Adószám: {company.taxNumber}. További részleteket az{" "}
        <Link href="/aszf" className="text-primary hover:underline">Általános Szerződési Feltételekben</Link>{" "}
        olvashat.
      </p>
    </div>
  );
}

function Section({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-lg font-semibold tracking-tight">
        <span className="text-primary mr-2">{n}</span>
        {title}
      </h2>
      <div className="mt-3 text-sm text-muted-foreground space-y-3">{children}</div>
    </section>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p>{children}</p>;
}

function Defs({ items }: { items: [string, string][] }) {
  return (
    <dl className="border-t border-border">
      {items.map(([k, v]) => (
        <div key={k} className="grid grid-cols-[180px_1fr] gap-4 py-2 border-b border-border text-sm">
          <dt className="text-muted-foreground">{k}</dt>
          <dd className="text-foreground">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function Table({ rows }: { rows: string[][] }) {
  const headers = ["Adatkezelés", "Kezelt adatok", "Cél", "Jogalap", "Időtartam"];
  return (
    <div className="overflow-x-auto border border-border rounded">
      <table className="w-full text-xs">
        <thead className="bg-surface">
          <tr>
            {headers.map((h) => (
              <th key={h} className="text-left p-3 font-medium text-foreground border-b border-border">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-border last:border-b-0 align-top">
              {row.map((cell, j) => (
                <td key={j} className="p-3 text-muted-foreground">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdatvedelemPage;
