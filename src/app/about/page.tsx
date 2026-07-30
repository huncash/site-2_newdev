import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rólunk — projektorlampacsere.hu",
  description: "Projektor lámpamodul beszállító intézményeknek, AV integrátoroknak és viszonteladóknak: beszerzés, készlet, logisztika.",
};

import { canonical } from "@/lib/seo";

function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-xs tracking-[0.25em] text-primary font-medium">RÓLUNK</div>
      <h1 className="text-3xl font-semibold tracking-tight mt-2">
        Szakosított beszállító — nem piactér.
      </h1>
      <p className="text-muted-foreground mt-4 max-w-2xl">
        Cégünk neve — <strong className="text-foreground">ADP-TOP</strong> — nem véletlenszerű
        betűkombináció, hanem a működés szerves alakulását követi. Az első három betű
        eredetileg a kezdeti tevékenységre, a <strong className="text-foreground">PDA </strong>
        (Personal Digital Assistant) készülékek kereskedelmére utalt, míg a TOP rész
        (Trusted OEM Partnership) a beszállítói kapcsolatok minőségét fejezte ki — és ez
        máig változatlan. A piaci igények átalakulását követve az ADP mozaikszó
        jelentéstartalma is finomodott; ma az új profilt tükrözi:
        {" "}
        <em className="text-foreground">Assured Durable Projection · Trusted OEM Partnership</em>
        {" "}— tervezett projektor-fényforrás ellátás intézményi és viszonteladói partnerek részére.
      </p>
      <p className="text-muted-foreground mt-4 max-w-2xl">
        A projektorlampacsere.hu projektor lámpamodulokat és speciális
        fényforrásokat szállít magyar és európai intézményi, valamint
        viszonteladói ügyfeleknek. <strong className="text-foreground">Kereskedelmi és ellátási
        partnerek vagyunk, nem szerelőüzem</strong>: a piacon elérhető
        modul-választékból a partner igényéhez és kockázattűréséhez illeszkedő
        terméket választjuk ki, szerezzük be és szállítjuk — eredeti gyári
        izzóval (Philips, Osram, Ushio, Phoenix), méretpontos utángyártott
        kerettel.
      </p>
      <div className="mt-8 max-w-2xl">
        <img
          src="/assets/trust-badge.png"
          alt="projektorlampacsere.hu megbízhatósági jelvény"
          className="w-full h-auto"
          loading="lazy"
        />
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Garantált tartós vetítés — eredeti gyári izzó, dokumentált ellátási lánc
        </p>
      </div>
      <h2 className="text-lg font-semibold mt-10 max-w-2xl">A betűk mögött</h2>
      <p className="text-muted-foreground mt-3 max-w-2xl text-sm">
        Az <strong className="text-foreground">ADP-TOP</strong> egy ellátási modell neve, nem
        marketing-szuperlatívusz. A bal oldal (ADP) azt írja le, <em>mit</em> szállítunk —
        szerződésben vállalt fényerővel, élettartammal és jótállással. A jobb oldal (TOP) pedig
        azt, <em>hogyan</em> garantáljuk: ellenőrzött OEM- és aftermarket-beszállítói láncon
        keresztül, dokumentált alkatrész-eredettel.
      </p>
      <div className="mt-5 max-w-2xl space-y-7">
        <div>
          <div className="text-foreground font-medium">
            A — Assured <span className="text-muted-foreground font-normal">· Garantált</span>
          </div>
          <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
            A modul szerződésben vállalt, mérhető paraméterekkel rendelkezik: a feltüntetett
            fényerő (ANSI lumen), színhőmérséklet és élettartam-ígéret nem marketing-érték,
            hanem a beszállító által vállalt és a mi jótállásunkkal megerősített specifikáció.
            Ha a vállalt érték a jótállási időn belül nem teljesül, csere jár.
          </p>
        </div>
        <div>
          <div className="text-foreground font-medium">
            D — Durable <span className="text-muted-foreground font-normal">· Tartós</span>
          </div>
          <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
            Az élettartam (üzemóra) nem becsült, hanem vállalt érték. A
            jótállás — 6 hónap az eredeti diszkont lámpamodulra — erre a
            vállalt élettartamra ad fedezetet. Ha a modul a jótállási időn
            belül a vállalt üzemóra előtt elmegy, csere jár.
          </p>
        </div>
        <div>
          <div className="text-foreground font-medium">
            P — Projection <span className="text-muted-foreground font-normal">· Vetítés</span>
          </div>
          <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
            A vevő szempontjából a termék nem egy izzó, hanem működő vetítés: fény a vásznon,
            kiszámítható óraszámig. A profilunk tudatosan szűk — a vetítéstechnikához
            kapcsolódó fényforrásokra és lámpamodulokra összpontosít —, de ezt a területet
            mélyen visszük.
          </p>
        </div>
        <div>
          <div className="text-foreground font-medium">
            T — Trusted <span className="text-muted-foreground font-normal">· Megbízható</span>
          </div>
          <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
            A „trusted" a beszerzési láncra utal: évek óta ugyanazokkal az ellenőrzött
            európai OEM- és aftermarket-beszállítói partnereinkkel dolgozunk. A minőség nem
            ingadozik, az ellátás kiszámítható — a partnerünk nem szürke piacról, hanem
            dokumentált ellátási láncból vásárol.
          </p>
        </div>
        <div>
          <div className="text-foreground font-medium">
            OEM <span className="text-muted-foreground font-normal">· Original Equipment Manufacturer — eredeti gyártói minőség</span>
          </div>
          <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
            Az OEM rövidítés (<em>Original Equipment Manufacturer</em>) az iparágban azt
            jelöli, hogy a fényforrás ugyanattól a gyártótól származik, amelyik a
            projektorhoz eredetileg is szállította — például Philips, Osram, Ushio vagy
            Phoenix. Az általunk szállított <strong>eredeti diszkont
            lámpamodul</strong> ugyanezt a gyári fényforrást tartalmazza,
            méretpontos utángyártott kerettel; az érdemi költségkülönbség
            kizárólag a modulház eredetében van, a fényerő, élettartam és
            színhőmérséklet változatlan marad.
          </p>
        </div>
        <div>
          <div className="text-foreground font-medium">
            P — Partnership <span className="text-muted-foreground font-normal">· Partnerség</span>
          </div>
          <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
            Szerződéses, hosszú távú kapcsolat — a partner eszközparkjának üzemóráira építve,
            szerződött készlettel és automatizált utánpótlással biztosítjuk a folyamatos
            vetítést. A tervezhető karbantartást támogatjuk, nem az eseti tűzoltást: stabil,
            6–12 munkanapos átfutási időt tartunk, expressz felárak nélkül.
          </p>
        </div>
      </div>
      <p className="text-muted-foreground mt-8 max-w-2xl text-sm italic">
        Az ADP-TOP nálunk nem szlogen, hanem egy ellátási modell rövid leírása: vállalt
        paraméterek, dokumentált OEM-eredet, tervezhető utánpótlás.
      </p>
      <div className="mt-12 grid md:grid-cols-3 gap-8">
        <Stat label="Aktív cikkszám" value="15 000+" />
        <Stat label="Jellemző átfutás" value="6–12 nap" />
        <Stat label="Költségmegtakarítás" value="40–60%" />
      </div>
      <div className="mt-14 border-l-2 border-primary bg-card text-card-foreground rounded-r-md pl-5 pr-6 py-6">
        <div className="text-xs tracking-[0.25em] text-primary font-medium">KÉT ÉVTIZED ÜGYFÉLSZOLGÁLATBAN</div>
        <h2 className="text-xl font-semibold tracking-tight mt-2">
          2026. július 5-én ünnepeljük fennállásunk 20. évfordulóját.
        </h2>
        <p className="text-muted-foreground mt-3 max-w-3xl text-sm">
          A vállalkozás 2006. július 5-én indult, kezdetben PDA -k
          (személyi digitális asszisztensek) kereskedelmével. A piaci igények
          változását követve mintegy 17 évvel ezelőtt fordultunk a projektor
          lámpamodulok felé, és azóta folyamatosan jelen vagyunk ezen a
          területen.
        </p>
        <p className="text-muted-foreground mt-3 max-w-3xl text-sm">
          A működés rövid, átlátható folyamatokra épül: a megkereséstől a
          kiszállításig egyetlen felelős kontaktponton keresztül halad minden
          megrendelés, ami gyors döntéshozatalt és következetes, professzionális
          ügyintézést tesz lehetővé. Két éve lezajlott generációváltást követően
          a projektorlampacsere.hu a korábban kialakított minőségi és
          kiszolgálási elvek mentén működik tovább, változatlan szakmai
          igényességgel.
        </p>
      </div>
      <div className="mt-14 border-l-2 border-primary bg-card text-card-foreground rounded-r-md pl-5 pr-6 py-6">
        <div className="text-xs tracking-[0.25em] text-primary font-medium">ÜGYVEZETŐI BEMUTATKOZÁS</div>
        <h2 className="text-xl font-semibold tracking-tight mt-2">
          Kiss Patrik Péter, élelmiszermérnök — az ADP-TOP Kft. tulajdonosa és ügyvezetője
        </h2>
        <p className="text-muted-foreground mt-3 max-w-3xl text-sm">
          A projektorlampacsere.hu üzemeltetője, az ADP-TOP Kft. tulajdonosa és ügyvezetője, Kiss Patrik Péter vagyok.
          Élelmiszermérnöki diplomával és ipari folyamatfejlesztési tapasztalattal indultam, ahol aztán hamar világossá
          vált számomra, hogy a szervezeti keretek közötti optimalizálásnál is izgalmasabb kihívás a saját vállalkozás
          építése — olyan projektekben, amelyekben a műszaki precizitás és az üzleti modell közvetlenül függ össze.
        </p>
        <p className="text-muted-foreground mt-3 max-w-3xl text-sm">
          2016-ban a családi vállalkozásban indítottam új üzletágat: a Matterport háromdimenziós szkennelési technológia
          magyarországi bevezetését és terjesztését, amely a mai napig működik (vrgo.hu). Ez a projekt megerősítette azt a
          szemléletet, amelyet ma is követek: egy technológiai szolgáltatás értéke nem a hardverben, hanem a mögötte álló
          know-how-ban és a partner igényeihez illeszkedő folyamatokban rejlik.
        </p>
        <p className="text-muted-foreground mt-3 max-w-3xl text-sm">
          Két éve vásároltam meg a céget az alapítótól, Édesapámtól, és azóta az általa felépített projektor
          lámpamodul-ellátási 'know-how'-t is teljes körűen átvettem és működtetem tovább. A cég irányításában nem az
          élelmiszermérnöki pálya konkrét szakmai ismeretei, hanem a vele járó rendszerszemlélet és a minőségi folyamatok
          iránti elkötelezettség érvényesül: dokumentált beszerzési lánc, mérhető paraméterek, vállalt jótállás.
        </p>
      </div>
      <div className="mt-14 grid md:grid-cols-2 gap-10">
        <div>
          <h2 className="text-lg font-semibold">Kiknek szállítunk</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>· Egyetemek és főiskolák előadótermei, hallgatói laborok</li>
            <li>
              ·{" "}
              <Link href="/oktatas" className="underline-offset-2 hover:underline hover:text-foreground">
                Általános és középiskolák, képzési központok
              </Link>
            </li>
            <li>· Vállalati tárgyalók, oktatótermek, üzemeltetők</li>
            <li>· AV integrátorok és karbantartó cégek</li>
            <li>· Közintézmények, közművelődési szervezetek</li>
            <li>· Mozik, stúdiók, ipari UV-alkalmazások</li>
          </ul>
        </div>
        <div>
          <h2 className="text-lg font-semibold">Hogyan dolgozunk</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Három pilléren állunk: <strong className="text-foreground">beszerzés-optimalizálás</strong> a partner
            modelljeihez illesztve; <strong className="text-foreground">ellátásbiztonság</strong> a gyakran
            használt típusokból tartott készlettel; és <strong className="text-foreground">logisztika</strong>{" "}
            megbízható futárszolgálati partnerrel. Minden szállítmány tételesen címkézett, áfás
            számlával érkezik, intézményi beszerzéshez igazodva.
          </p>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-border pt-4">
      <div className="text-3xl font-semibold tracking-tight text-foreground">{value}</div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

export default AboutPage;