import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "B2B és viszonteladói feltételek — projektorlampacsere.hu",
  description: "Mennyiségi és rendszeres beszerzői kedvezmény karbantartóknak, AV integrátoroknak és intézményi üzemeltetőknek. Egységes díjbekérő + banki átutalás fizetési konstrukció, tételes áfás számla.",
};

import { canonical } from "@/lib/seo";

function B2BPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="text-xs tracking-[0.25em] text-primary font-medium">B2B PARTNEREKNEK</div>
      <h1 className="text-3xl font-semibold tracking-tight mt-2">
        Karbantartóknak, integrátoroknak, intézményi beszerzőknek
      </h1>
      <p className="text-muted-foreground mt-4 max-w-3xl">
        Megrendelőink döntő többsége nem a végfelhasználó, hanem a karbantartást ellátó szakember:
        oktatási intézmények multimédiás üzemeltetői, audiovizuális integrátorok és vállalati
        szervizmunkatársak, akik a saját ügyfeleiknél végzik el a cserét. Folyamatainkat és
        árképzésünket ennek a feladatkörnek a logikájához igazítjuk.
      </p>

      <aside className="mt-8 border-l-2 border-primary bg-card border border-border rounded-r p-5">
        <div className="text-[11px] tracking-widest text-primary font-semibold uppercase">
          Visszatérő partnereknek
        </div>
        <p className="text-sm text-foreground mt-2">
          Nagyobb eszközparkot üzemeltető partnereinknek elsősorban azt
          javasoljuk, hogy legalább 1 db tartalék cseremodult tartsanak
          helyszínen — így egy meghibásodás nem okoz értékteremtő kiesést.
          Ezen felül egyedi keretszerződés keretében az eszközparkjukhoz
          illeszkedő készletet nálunk is előjegyezhetik; ilyenkor akár másnapi
          kiszállítás is előfordulhat. A részleteket a{" "}
          <a href="#partneri-ellatas" className="text-primary hover:underline font-medium">partneri ellátási modell</a>{" "}
          szakaszban ismertetjük.
        </p>
      </aside>

      <div className="mt-10 grid md:grid-cols-3 gap-4">
        <Card
          title="Mennyiségi kedvezmény"
          body="Tíz darabot meghaladó tételes megrendelés esetén típusfüggő mértékű kedvezményt biztosítunk; a konkrét érték az ajánlatban tételesen kerül feltüntetésre."
        />
        <Card
          title="Visszatérő partnerek konstrukciója"
          body="Rendszeres beszerzők számára éves keret alapján kedvezőbb tételárat és előzetes készletbiztosítást kínálunk — karbantartási szerződésekhez illeszkedő, tervezhető ellátással."
        />
        <Card
          title="Egységes fizetési konstrukció"
          body="Minden ügyfél — a viszonteladói és intézményi partnereket is ideértve — díjbekérő számla (Számlázz.hu) alapján, banki átutalással teljesít. A jóváírás visszaigazolása után haladéktalanul indítjuk a szállítást; áfás végszámla automatikusan."
        />
      </div>

      <h2 className="mt-14 text-lg font-semibold">Hogyan dolgozunk együtt</h2>
      <ol className="mt-4 grid md:grid-cols-2 gap-4 text-sm">
        <Step
          n="1"
          title="Ajánlatkérés"
          body="Cikkszám vagy projektor típus alapján tételes, írásos ajánlattal válaszolunk: készlet, egységár és vállalt szállítási idő. Munkaidőnk H–P 10–18; 8 és 16 óra között érkezett kérésekre még aznap visszajelzünk."
        />
        <Step
          n="2"
          title="Megrendelés"
          body="A megrendelés akkor válik érvényessé, amikor a Számlázz.hu rendszerből kiállított díjbekérő ellenértéke a bankszámlánkon jóváírásra kerül; a teljesítést a jóváírás visszaigazolása után indítjuk (munkaidőben, H–P 10–18 között beérkezett utalás esetén akár az adott munkanapon). A mennyiségi kedvezmény az írásos partneri megállapodással lép életbe."
        />
        <Step
          n="3"
          title="Kiszállítás"
          body="A leggyakrabban keresett típusokat jellemzően 6–12 munkanapon belül, készletről akár 1–2 munkanap alatt, szerződött futárszolgálattal kézbesítjük. Készletre szerződött partnereinknél a hibabejelentéstől akár másnapi kiszállítás is előfordulhat. A vállalt szállítási időt az árajánlat rögzíti."
        />
        <Step
          n="4"
          title="Számlázás"
          body="Elektronikus, hiteles áfás számla a teljesítéssel egyidejűleg, intézményi könyvelési követelményeknek megfelelő formátumban (ADP-TOP Kft., 27% ÁFA)."
        />
      </ol>

      <h2 className="mt-14 text-lg font-semibold">Mit várhat tőlünk</h2>
      <ul className="mt-4 grid md:grid-cols-2 gap-3 text-sm text-muted-foreground">
        <li className="border border-border rounded p-4">
          <span className="text-foreground font-medium">Stabil utánpótlás.</span> Ugyanazok a
          típusok hosszú távon elérhetők — nem kell minden cserélődéskor új beszállítót keresni.
        </li>
        <li className="border border-border rounded p-4">
          <span className="text-foreground font-medium">Visszakövethető minőség.</span> A
          forgalmazott modulokban minden esetben gyári (Philips, Osram, Ushio, Phoenix) izzó van.
          A teljesítmény és élettartam
          adatokat a termékhez mellékelt elektronikus adatlap tartalmazza, ami segíthet a tervszerű
          karbantartás beütemezésében.
        </li>
        <li className="border border-border rounded p-4">
          <span className="text-foreground font-medium">Szakmai válasz.</span> A drótposta másik
          végén humán ügyfélkapcsolati munkatárs válaszol, aki a megrendeléstől a számlázáson át a
          kiszállításig egy kézben tartja az ügymenetet.
        </li>
      </ul>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/ajanlatkeres"
          className="bg-cta text-cta-foreground hover:bg-cta-hover rounded px-5 py-2.5 text-sm font-medium"
        >
          Árajánlatot kérek
        </Link>
        <Link
          href="/aszf"
          className="border border-border rounded px-5 py-2.5 text-sm font-medium hover:bg-surface"
        >
          Szállítási feltételek (ÁSZF)
        </Link>
      </div>

      <section id="partneri-ellatas" className="mt-20 pt-10 border-t border-border scroll-mt-24">
        <div className="text-xs tracking-[0.25em] text-primary font-medium">
          PARTNERI ELLÁTÁSI MODELL
        </div>
        <h2 className="text-2xl font-semibold tracking-tight mt-2">
          Helyszíni tartalék és nálunk előjegyzett készlet
        </h2>
        <p className="text-muted-foreground mt-4 max-w-3xl">
          Visszatérő B2B partnereink — intézmények, oktatási szervezetek,
          audiovizuális integrátorok, karbantartók és viszonteladók —
          eszközparkjához illesztett ellátási konstrukciókat kínálunk. A cél,
          hogy egy meghibásodás ne okozzon értékteremtő kiesést a partner
          tevékenységében. A pontos feltételeket minden esetben írásos
          partneri keretszerződés rögzíti; a katalóguson keresztüli, eseti
          rendelésekre továbbra is a jellemző 6–12 munkanapos átfutás
          érvényes.
        </p>

        <div className="mt-8 grid md:grid-cols-2 gap-5">
          <Tier
            n="1"
            title="Helyszíni tartalék modul"
            body="Nagyobb eszközparkot üzemeltető partnereinknek azt javasoljuk, hogy a leggyakrabban használt típusokból legalább 1 db tartalék cseremodult tartsanak a helyszínen. Így egy meghibásodás bekövetkeztekor a csere azonnal elvégezhető, és nem esik ki értékteremtő idő a partner tevékenységéből. Az ajánlott tartaléklistát az eszközpark ismeretében közösen állítjuk össze."
          />
          <Tier
            n="2"
            title="Nálunk előjegyzett készlet"
            body="Egyedi keretszerződés keretében az eszközparkjukhoz illeszkedő modulokból nálunk tartunk előjegyzett készletet. Hibabejelentéskor azonnal indul a kiszállítás — akár másnapi kézbesítéssel — anélkül, hogy a beszállítói rendelési ablakra kellene várni. A típuslistát, a tartott darabszámot és a számlázási ütemet a keretszerződés rögzíti. A katalóguson keresztüli, eseti megrendelésekre a jellemző 6–12 munkanapos átfutás érvényes."
          />
        </div>

        <h3 className="mt-12 text-lg font-semibold">A keretszerződés tipikus elemei</h3>
        <ul className="mt-4 grid md:grid-cols-2 gap-3 text-sm text-muted-foreground">
          <li className="border border-border rounded p-4">
            <span className="text-foreground font-medium">Eszközpark-leltár.</span>{" "}
            A partner projektor-állományának típusszintű listája, amely alapján
            a tartott készletet és az ajánlott modulkivitelt összeállítjuk.
          </li>
          <li className="border border-border rounded p-4">
            <span className="text-foreground font-medium">Modulkivitel-választás.</span>{" "}
            A megajánlott kivitel az eredeti diszkont lámpamodul (6 hónap /
            500 üzemóra garancia): eredeti gyári izzó (Philips, Osram, Ushio,
            Phoenix) méretpontos utángyártott kerettel. A keretszerződéshez —
            kérésre — műszaki egyenértékűségi nyilatkozatot és az izzógyártó
            eredetigazolását is mellékeljük. Amennyiben az eszközszabályzat
            vagy márkaszerviz-szerződés kifejezetten teljes gyári (OEM)
            cseremodult ír elő, ezt az ajánlatkérés megjegyzés rovatában
            kérjük jelezni — tételszinten erre is tudunk ajánlatot adni
            (lásd a <Link href="/gyik" className="text-primary hover:underline">GYIK</Link> vonatkozó pontját).
          </li>
          <li className="border border-border rounded p-4">
            <span className="text-foreground font-medium">Készletszint és reagálási ablak.</span>{" "}
            A nálunk előjegyzett típusonkénti minimum-darabszám és a
            hibabejelentéstől a futár átadásáig tartó vállalt belső átfutási
            idő — utóbbi mellett akár másnapi kézbesítés is elérhető.
          </li>
          <li className="border border-border rounded p-4">
            <span className="text-foreground font-medium">Számlázási ütem.</span>{" "}
            Több tételes ellátásnál a havi vagy negyedéves összesítő
            elszámolás formája, illetve a részteljesítések számlázási rendje.
          </li>
        </ul>

        <div className="mt-8 border-l-2 border-primary bg-card border border-border rounded-r p-5">
          <div className="text-xs tracking-[0.25em] text-primary font-medium">
            A SZOLGÁLTATÁS KERETEI
          </div>
          <p className="text-sm text-foreground mt-2">
            A partneri ellátási modell <strong>szerződéses, nem nyilvános webshop-funkció</strong>.
            Az érdeklődés első lépése a kapcsolatfelvétel, ezt követi az eszközpark
            átbeszélése és az írásos ajánlat. A konstrukció elsősorban
            nagyobb eszközparkot üzemeltető, visszatérő partnereknél indokolt;
            kisebb állományok esetén a helyszíni tartalék modul és az eseti
            megrendelés általában elegendő.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/kapcsolat"
            className="bg-cta text-cta-foreground hover:bg-cta-hover rounded px-5 py-2.5 text-sm font-medium"
          >
            Kapcsolatfelvétel — keretszerződés
          </Link>
        </div>
      </section>
    </div>
  );
}

function Card({ title, body }: { title: string; body: string }) {
  return (
    <div className="border border-border rounded p-5">
      <div className="w-8 h-0.5 bg-primary mb-3" />
      <div className="font-medium text-foreground">{title}</div>
      <p className="text-sm text-muted-foreground mt-2">{body}</p>
    </div>
  );
}

function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <li className="border border-border rounded p-4 flex gap-4">
      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold shrink-0">
        {n}
      </div>
      <div>
        <div className="font-medium text-foreground">{title}</div>
        <p className="text-muted-foreground mt-1 text-xs">{body}</p>
      </div>
    </li>
  );
}

function Tier({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="border border-border rounded p-5">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold shrink-0">
          {n}
        </div>
        <div className="font-medium text-foreground">{title}</div>
      </div>
      <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{body}</p>
    </div>
  );
}

export default B2BPage;
