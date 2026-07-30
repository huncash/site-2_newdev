import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tanácsadás és GYIK — projektor lámpamodul választás | projektorlampacsere.hu",
  description: "Gyakori kérdések a projektor lámpamodul választásához: eredeti gyári izzó utángyártott kerettel, márkaszervizes csere, garancia, élettartam, szállítás és egyedi árajánlat.",
};

import { canonical } from "@/lib/seo";

const menuResetImg = "/assets/csere/menu-reset-lamp-hours.jpg";

const faqJsonLd: { q: string; a: string }[] = [
  {
    q: "Mi a különbség az eredeti (OEM) cseremodul és az általunk forgalmazott modul között?",
    a: "Mindkettőben ugyanaz a néhány nagy gyártó (Philips UHP, Osram P-VIP, Ushio, Phoenix) által szállított, eredeti gyári izzó található. A különbség kizárólag a kazetta keretében van; az általunk kínált, utángyártott keretes modul azonos fényerőt, élettartamot és színhőmérsékletet biztosít, jellemzően az OEM ár 25–55%-áért.",
  },
  {
    q: "Mikor érdemes mégis eredeti, gyári logózott modult választani?",
    a: "Akkor, ha a projektorra élő gyártói jótállási vagy márkaszerviz-szerződés vonatkozik, és a szerviz a gyári cikkszámmal címkézett modul beépítését szerződésben előírja, vagy ha az ügyfél belső eszközszabályzata, leltár-nyilvántartási rendje ezt megköveteli. Minden más esetben — az intézményi beszerzéseket is ideértve — az eredeti diszkont lámpamodul műszakilag azonos eredményt ad.",
  },
  {
    q: "Honnan tudom, hogy melyik modul illik a projektoromba?",
    a: "A keresés legbiztosabb módja a projektor pontos típusszáma vagy a jelenlegi modul cikkszáma (pl. ELPLP71, NP41LP). Bizonytalanság esetén küldje el a típust az árajánlat-kérő űrlapon, és visszaigazoljuk a megfelelő modult.",
  },
  {
    q: "Miért nem forgalmaznak kompatibilis (nem gyári) izzós, utángyártott lámpamodult?",
    a: "Az ellenőrizetlen forrású, kompatibilis (nem gyári márkájú) izzós modulok fényereje tipikusan 20–40%-kal alacsonyabb, élettartama a gyári érték töredéke, meghibásodási rátájuk többszörös, a magasabb hőtermelés pedig a projektor ballasztját és optikáját is károsíthatja. A beszerzéskor megtakarított összeg rendre egy második modulvásárlással és szervizköltséggel fizettetődik meg. Kizárólag eredeti gyári izzóval (Philips UHP, Osram P-VIP, Ushio NSH, Phoenix SHP) szerelt modulokat forgalmazunk; a megtakarítás a kazetta keretéből, nem a fényforrás minőségéből származik.",
  },
  {
    q: "Mennyi a garancia az általunk szállított modulra?",
    a: "Utángyártott modulházba szerelt, eredeti gyári izzós modulra 6 hónap, teljes gyári (OEM) cseremodulra 3 hónap jótállás, mindkét esetben legfeljebb 500 üzemóráig, rendeltetésszerű használat mellett.",
  },
  {
    q: "Mennyi ideig világít az új izzó?",
    a: "A gyártó által megadott névleges élettartam jellemzően 2 000–6 000 üzemóra között mozog, projektortípustól és üzemmódtól függően. A fényforrás teljesítménye és élettartama megegyezik az OEM modulba épített változatéval.",
  },
  {
    q: "Hogyan tudok árajánlatot kérni?",
    a: "Töltse ki az árajánlat-kérő űrlapot a projektor típusával vagy a modul cikkszámával. Munkaidőnk H–P 10–18; a 8 és 16 óra között érkezett ajánlatkérésre még aznap, a többi esetben a következő munkanap elején tételes, írásos ajánlattal válaszolunk.",
  },
  {
    q: "Mennyi a szállítási idő?",
    a: "Készletről akár 2 munkanap; a katalógusban a tétel mellett feltüntetjük a készletállapotot. A nem készleten lévő modulok tipikus átfutási ideje 6–12 munkanap; a pontos időt az árajánlatban rögzítjük.",
  },
  {
    q: "Áfás számlát adnak? Hogyan zajlik a fizetés?",
    a: "Igen, minden megrendelést tételes, áfás számlával állítunk ki (ADP-TOP Kft., 27% ÁFA). Az érvényes megrendelés egységes feltétele a Számlázz.hu rendszerből kiállított díjbekérő banki átutalással történő teljesítése; a teljesítést a jóváírás visszaigazolása után indítjuk.",
  },
];

type Faq = { q: string; a: React.ReactNode };

const sections: { title: string; intro?: string; items: Faq[] }[] = [
  {
    title: "A megfelelő modul kiválasztása",
    intro:
      "Az alábbi szempontok segítenek eldönteni, melyik kivitelt érdemes választani az adott projektorhoz és felhasználási környezethez.",
    items: [
      {
        q: "Mi a különbség az eredeti (OEM) cseremodul és az általunk forgalmazott modul között?",
        a: (
          <>
            Mindkettőben ugyanaz a néhány nagy gyártó (Philips UHP, Osram
            P-VIP, Ushio, Phoenix) által szállított, eredeti gyári izzó
            található. A különbség kizárólag a kazetta keretében van: az OEM
            változat gyári logózott háza a teljes ár jelentős részét adja,
            miközben funkcionálisan azonos egy méretpontosan gyártott
            utángyártott kerettel. Az általunk kínált modul ennek megfelelően
            azonos fényerőt, élettartamot és színhőmérsékletet biztosít, az
            ár azonban tipikusan az OEM 25–55%-a.{" "}
            <Link href="/megtakaritas" className="text-primary hover:underline">
              Részletes ár-arány bontás
            </Link>
            .
          </>
        ),
      },
      {
        q: "Mikor érdemes mégis eredeti, gyári logózott modult választani?",
        a: (
          <>
            Az alábbi, szűk esetkörökben javasoljuk kifejezetten az OEM
            kivitelt:
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                <strong>Élő márkaszerviz-szerződés esetén</strong> — ha a
                projektor a gyártó kiterjesztett garanciája vagy
                szervizszerződése alatt áll, és a szerviz a gyári cikkszámmal
                címkézett modul beépítését szerződésben előírja a garancia
                fenntartásához.
              </li>
              <li>
                <strong>Belső eszköz- vagy leltárszabályzat esetén</strong> —
                ha az ügyfél saját nyilvántartási rendje vagy átadás-átvételi
                protokollja a gyári címkézett kazettát kifejezetten
                megköveteli.
              </li>
              <li>
                <strong>Felső kategóriás, nagy fényerejű készülékeknél</strong>{" "}
                — ahol a modulhoz külön optika, szűrőkeret vagy tömítés
                tartozik, és ezek pontos illeszkedését csak a teljes gyári
                kazetta garantálja.
              </li>
            </ul>
            Minden más esetben — az intézményi beszerzéseket is ideértve — az eredeti
            diszkont lámpamodul műszakilag azonos eredményt ad.
          </>
        ),
      },
      {
        q: "Mit jelent a „modul nélküli izzó” — érdemes ezt választani?",
        a: (
          <>
            A modul nélküli (csupasz) izzó csak magát a fényforrást
            tartalmazza, keret és reflektor nélkül. A csere ebben az esetben
            a régi modul szakszerű szétbontását, az izzó precíz cseréjét és
            újra-összeszerelését igényli — ezt csak megfelelő gyakorlattal és
            kézügyességgel rendelkező felhasználónak ajánljuk. A költség
            ugyan alacsonyabb, de a hibás szerelésből eredő rövid élettartam
            vagy törés kockázata megnő. Intézményi környezetben ezért a
            kazettás (modullal ellátott) kivitelt javasoljuk.
          </>
        ),
      },
      {
        q: "Miért nem forgalmaznak kompatibilis (nem gyári) izzós, utángyártott lámpamodult?",
        a: (
          <>
            <p>
              A piacon az általunk forgalmazott eredeti diszkont kivitel
              alatt található egy harmadik árszint is: az{" "}
              <strong>utángyártott keretbe szerelt, kompatibilis (nem
              gyári márkájú) izzós lámpamodul</strong>. Ez a kategória
              tipikusan ellenőrizetlen ázsiai üzemekből származik, gyakran
              Philips, Osram, Ushio vagy Phoenix tipográfiát másoló címkével,
              de a fényforrás származási bizonylata nélkül. Tételesen
              vizsgálva ennek a kivitelnek a fényereje általában 20–40%-kal
              alacsonyabb, élettartama a gyári érték töredéke,
              színhőmérséklete eltolódik, és a meghibásodási ráta többszöröse
              a gyári izzós moduloknak. A magasabb hőtermelés ráadásul a
              projektor ballasztját és optikáját is károsíthatja.
            </p>
            <p className="mt-2">
              Tisztelettel, de őszintén: a beszerzéskor megtakarított néhány
              tízezer forint rendre egy második — esetenként harmadik —
              modulvásárlással, illetve a vetítő szervizköltségével
              fizettetődik meg. A klasszikus angol mondás —{" "}
              <em>„nem vagyok elég gazdag ahhoz, hogy olcsó dolgokat
              vegyek"</em> — pontosan erre az esetkörre íródott. A
              katalógusunkban ezért kizárólag eredeti gyári izzóval (Philips
              UHP, Osram P-VIP, Ushio NSH, Phoenix SHP) szerelt modulokat
              forgalmazunk; a megtakarítás a kazetta keretéből, és nem a
              fényforrás minőségéből származik. Aki ennél olcsóbb kompatibilis
              izzós megoldást keres, azt — minden tiszteletünk mellett —
              óvatosan, de határozottan eltanácsoljuk tőle: hosszú távon a
              gyári fényforrással szerelt modul a kedvezőbb választás.
            </p>
          </>
        ),
      },
      {
        q: "Honnan tudom, hogy melyik modul illik a projektoromba?",
        a: (
          <>
            A keresés legbiztosabb módja a projektor pontos típusszáma vagy a
            jelenlegi modul cikkszáma (pl. ELPLP71, NP41LP, 5J.J7L05.001).
            Ezek általában a régi modulon, illetve a projektor alján található
            adattáblán szerepelnek. Bizonytalanság esetén küldje el a típust
            az{" "}
            <Link href="/ajanlatkeres" className="text-primary hover:underline">
              árajánlat-kérő űrlapon
            </Link>
            , és visszaigazoljuk a megfelelő modult.
          </>
        ),
      },
    ],
  },
  {
    title: "Márkaszerviz, garancia, beépítőkeret",
    items: [
      {
        q: "Márkaszervizben kívánom cseréltetni a lámpát — mire figyeljek?",
        a: (
          <>
            Ha a cserét hivatalos márkaszervizzel végezteti, kifejezetten
            javasoljuk az <strong>eredeti, gyári cikkszámmal ellátott
            beépítőkeretes modul</strong> rendelését. A márkaszervizek
            jellemzően nem szerelnek be utángyártott kazettát — még akkor sem,
            ha az izzó eredeti gyári —, mert a beépítés tényét és a felhasznált
            alkatrész azonosítóját rögzítik a szervizjegyzőkönyvben. Ez az
            eredeti beépítőkeretes változat magasabb árkategóriába esik;
            kérjük, a megrendelés előtt egyértelműen jelezze, hogy a tételt
            márkaszervizes cseréhez szánja, hogy a megfelelő kivitelt tudjuk
            ajánlani.
          </>
        ),
      },
      {
        q: "Mennyi a garancia az általunk szállított modulra?",
        a: (
          <>
            Minden értékesített termékre konkrét, írásban vállalt jótállást
            adunk a számla mellé. Az általunk forgalmazott{" "}
            <strong>eredeti diszkont lámpamodulra</strong> (eredeti gyári
            izzó méretpontos utángyártott kerettel) <strong>6 hónap</strong>
            {" "}jótállást vállalunk; a külön kérésre rendelhető{" "}
            <strong>teljes gyári (OEM) cseremodulra</strong>{" "}
            <strong>3 hónap</strong> jótállás vonatkozik.{" "}
            Mindkét esetben legfeljebb <strong>500 üzemóráig</strong>,
            rendeltetésszerű használat mellett (megfelelő szellőzés, stabil
            tápellátás, gyári üzemórakeret betartása). A jótállás a fényerő- és
            élettartam-paraméterekre is kiterjed — ezt a két mérnöki paramétert
            vállaljuk. A jótállási idő a számla kiállításának napjától indul; a
            jótállás mellett a jogszabályi szavatosság is érvényes. A részleteket
            az ÁSZF 8. pontja tartalmazza.
          </>
        ),
      },
      {
        q: "Mennyi ideig világít az új izzó?",
        a: (
          <>
            A gyártó által megadott névleges élettartam jellemzően
            2 000–6 000 üzemóra között mozog, projektortípustól és
            üzemmódtól (Normal / Eco / Dynamic Eco) függően. A pontos érték a
            projektor és a modul adatlapján megtalálható; az izzó teljesítménye
            (Watt) és élettartama megegyezik az OEM modulba épített
            változatéval, mivel ugyanattól a gyártótól származik.
          </>
        ),
      },
      {
        q: "Csere után miért kell és hogyan kell nullázni a lámpa üzemóra-számlálóját?",
        a: (
          <>
            <p>
              A projektor belső számlálója a bekapcsolt órákat összegzi, és
              ennek alapján jelzi a felhasználónak, mikor esedékes a
              lámpacsere. Ha a számlálót a modul cseréje után nem nullázza,
              a készülék a régi izzó óráit folytatja: rövidesen
              cserefigyelmeztetést ad, holott az új lámpa élettartama még
              alig fogyott. Ez különösen intézményi környezetben okoz
              gondot, mert a karbantartási nyilvántartás az óraszámláló
              értékére támaszkodik.
            </p>
            <p className="mt-3">
              A nullázás a projektor menüjéből, néhány lépésben elvégezhető.
              Az általános menet (a pontos megnevezés gyártónként és
              típusonként eltérhet, de a logika azonos):
            </p>
            <ol className="list-decimal pl-5 mt-2 space-y-1">
              <li>Kapcsolja be a projektort, és a távirányítón vagy a készüléken nyomja meg a <strong>Menu</strong> gombot.</li>
              <li>Lépjen a <strong>Reset</strong> (Visszaállítás) — más típusoknál <em>Beállítások → Információ</em> vagy <em>Karbantartás</em> — almenübe, és nyomjon <strong>Enter</strong>-t.</li>
              <li>Válassza a <strong>Reset Lamp Hours</strong> (Lámpa órák visszaállítása) menüpontot, majd <strong>Enter</strong>.</li>
              <li>A megerősítő kérdésnél válassza a <strong>Yes</strong> (Igen) lehetőséget.</li>
              <li>A <strong>Menu</strong> vagy <strong>Esc</strong> gombbal lépjen ki.</li>
            </ol>
            <figure className="mt-4 border border-border rounded overflow-hidden bg-white">
              <img
                src={menuResetImg}
                alt="Projektor menü — Reset Lamp Hours menüpont kiválasztása"
                loading="lazy"
                className="w-full h-auto"
              />
              <figcaption className="text-[11px] text-muted-foreground px-3 py-2 border-t border-border">
                A projektor Reset menüjének részlete a „Reset Lamp Hours"
                menüponttal. Forrás: Epson America, Inc. — szemléltető célból.
              </figcaption>
            </figure>
            <p className="mt-3 text-[13px]">
              Fontos: a számlálót csak akkor nullázza, ha valóban kicserélte
              a lámpamodult — a régi lámpánál végzett nullázás torz
              élettartam-adatokat eredményez. A művelet részletes leírása az{" "}
              <Link href="/csere-utmutato" className="text-primary hover:underline">
                általános csere útmutatóban
              </Link>{" "}
              is megtalálható.
            </p>
          </>
        ),
      },
      {
        q: "Megtartja-e a projektor a gyári garanciáját, ha utángyártott keretes modult szereltetek be?",
        a: (
          <>
            Ez gyártónként és garanciafeltételenként eltérő. Ha a projektor
            még a kiterjesztett gyártói garancia hatálya alatt áll, mindenképp
            egyeztessen a márkaszervizzel a beépítés előtt, és — ahogy fentebb
            írtuk — kérjen tőlünk eredeti beépítőkeretes változatot. A
            garancia lejárta után már nincs ilyen megkötés, az utángyártott
            keretes modul minden szempontból egyenértékű választás.
          </>
        ),
      },
    ],
  },
  {
    title: "Megrendelés, szállítás, számlázás",
    items: [
      {
        q: "Hogyan tudok árajánlatot kérni?",
        a: (
          <>
            Töltse ki az{" "}
            <Link href="/ajanlatkeres" className="text-primary hover:underline">
              árajánlat-kérő űrlapot
            </Link>{" "}
            a projektor típusával vagy a modul cikkszámával. Munkaidőnk
            H–P 10–18; a 8 és 16 óra között beérkezett ajánlatkérésekre még
            aznap, a többi esetben a következő munkanap elején tételes,
            írásos ajánlattal válaszolunk.
          </>
        ),
      },
      {
        q: "Mennyi a szállítási idő?",
        a: (
          <>
            Készletről akár 2 munkanap; a katalógusban a tétel mellett
            feltüntetjük a készletállapotot. A nem készleten lévő modulok
            tipikus átfutási ideje 6–12 munkanap — a pontos időt az
            árajánlatban rögzítjük. Részletek a{" "}
            <Link href="/aszf" className="text-primary hover:underline">
              szállítási feltételeknél (ÁSZF 7. pont)
            </Link>
            .
          </>
        ),
      },
      {
        q: "Áfás számlát adnak? Hogyan zajlik a fizetés?",
        a: (
          <>
            Igen, minden megrendelést tételes, áfás számlával állítunk ki
            (ADP-TOP Kft., 27% ÁFA). Az érvényes megrendelés egységes
            feltétele a Számlázz.hu rendszerből kiállított díjbekérő banki
            átutalással történő teljesítése; a teljesítést a jóváírás
            visszaigazolása után indítjuk (munkaidőben beérkezett utalás
            esetén akár még aznap). Részletek a{" "}
            <Link href="/b2b" className="text-primary hover:underline">
              B2B oldalon
            </Link>
            .
          </>
        ),
      },
      {
        q: "Hogyan kapom meg a megrendelt modult?",
        a: (
          <>
            A kiszállítás országszerte futárszolgálattal történik;
            bemutatóterem és személyes ügyfélfogadás nincs.
          </>
        ),
      },
      {
        q: "Miért tűnnek néha drágának a projektorlámpák?",
        a: (
          <>
            A projektorba szánt nagy nyomású kisülőcsöves izzó (UHP / P-VIP /
            HSCR) egy precíziós optikai-elektronikai alkatrész: kvarcüveg
            ballon, parabolatükör, gyári kalibráció, szigorú tűréshatárok.
            Csupán néhány gyártó képes előállítani — ezért a fényforrás
            önmagában is jelentős érték. Az ár csökkentésére a leghatékonyabb
            mód az, ha a kazetta (a műanyag keret) nem gyári logózott
            kivitelben kerül az eredeti izzó köré — pontosan ezt kínáljuk.{" "}
            <Link href="/arazas" className="text-primary hover:underline">
              Részletes árképzés-magyarázat
            </Link>
            .
          </>
        ),
      },
    ],
  },
  {
    title: "B2B feltételek és árpolitika",
    intro:
      "Karbantartók, audiovizuális integrátorok és intézményi beszerzők részére kialakított együttműködési és árképzési alapelveink.",
    items: [
      {
        q: "Milyen feltételekkel dolgoznak viszonteladókkal és intézményi partnerekkel?",
        a: (
          <>
            Minden ügyfél számára — a viszonteladói és intézményi
            partnereket is ideértve — egységes a fizetési konstrukció: a
            Számlázz.hu rendszerből kiállított díjbekérő banki átutalással
            történő teljesítése után indítjuk a szállítást. Mennyiségi
            kedvezményt eseti keretszerződés vagy visszatérő megrendelés
            alapján biztosítunk. A teljes folyamatot a{" "}
            <Link href="/b2b" className="text-primary hover:underline">
              B2B oldalon
            </Link>{" "}
            részletezzük.
          </>
        ),
      },
      {
        q: "Mi az árképzési alapelvük? Miben tér el a versenytársaktól?",
        a: (
          <>
            Versenyelőnyünk az árképzés kiszámíthatósága és a minőség
            kompromisszummentessége. Amennyiben nincs sürgősség — tehát nem
            kell „tüzet oltani" —, már kis darabszámú megrendelésnél is
            korrekt, kiegyensúlyozott árat tudunk biztosítani. A preferált
            átfutási idő ilyen esetben átlagosan 6–12 munkanap; ez teszi
            lehetővé a szervezett, költséghatékony beszerzést.
          </>
        ),
      },
      {
        q: "Miben kompromisszummentes a minőség?",
        a: (
          <>
            Kizárólag <strong>eredeti, gyári izzóval</strong> szerelt
            lámpamodult forgalmazunk — Philips UHP, Osram P-VIP, Ushio vagy
            Phoenix gyártmányút, ugyanazt a fényforrást, amelyet az OEM
            cseremodulok is tartalmaznak. A fényforrás szintjén tehát nincs
            alternatíva: nem kínálunk és nem szállítunk „kompatibilis"
            utángyártott izzót. A megtakarítás kizárólag a beépítőkeret
            (kazetta) gyártói logózásának elhagyásából származik — műszakilag
            azonos eredménnyel.
          </>
        ),
      },
    ],
  },
  {
    title: "Garancia, lemondás és visszaküldés",
    intro:
      "Az alábbi pontok a megrendelés visszavonására, a termék visszaküldésére és a jótállásra vonatkozó feltételeket foglalják össze. Az értékesítés elsődlegesen B2B; a fogyasztói (magánszemély) szabályokat csak a jogszabályi minimum szintjén ismertetjük.",
    items: [
      {
        q: "Lehet-e megrendelést lemondani?",
        a: (
          <>
            Igen, amíg a megrendelés feldolgozása és csomagolása nem
            kezdődött meg. A logisztikai partnereinkhez napi szinten
            továbbítjuk a rendeléseket, ezért a lemondási szándékot a
            megrendelés leadása után a lehető leghamarabb jelezni kell —
            telefonon vagy e-mailben. Ha a csomag már átadásra került a
            futárszolgálatnak, lemondás már nem lehetséges, de a
            kézhezvétel után a visszaküldési eljárás indulhat.
          </>
        ),
      },
      {
        q: "Visszaküldhető-e a termék indoklás nélkül?",
        a: (
          <>
            <p>
              <strong>Üzleti vevő (cég, egyéni vállalkozó, intézmény):</strong>{" "}
              A B2B értékesítésre nem vonatkozik a 14 napos fogyasztói
              elállási jog. Indoklás nélküli visszavételt nem tudunk
              vállalni — a terméket a megrendelés véglegesítése előtt
              minden szempontból javasolt ellenőrizni (típuskompatibilitás,
              projektor-modell, izzómodul-cikkszám). Tévesen rendelt
              cikknél egyedi mérlegelés alapján részleges visszavétel
              lehetséges, de nem garantált; ebben az esetben{" "}
              <strong>
                a visszaszállítás teljes költsége és kockázata, valamint a
                felmerülő adminisztrációs és újra-bekészletezési költség a
                Vevőt terheli
              </strong>
              .
            </p>
            <p className="mt-2">
              <strong>Magánszemély (fogyasztó):</strong> A 45/2014. Korm.
              rendelet szerint a kézhezvételtől számított 14 naptári napon
              belül indoklás nélkül elállhat a vásárlástól. A bejelentést
              követően további 14 nap áll rendelkezésre az áru
              visszajuttatására.{" "}
              <strong>
                A visszaküldés költsége és szállítási kockázata a vásárlót
                terheli.
              </strong>{" "}
              A termék bontatlan, sértetlen, eredeti csomagolásban vehető
              vissza teljes vételáron — bontott vagy használt termék
              esetén értékcsökkenést számolhatunk fel, akár a vételár
              100%-áig.
            </p>
          </>
        ),
      },
      {
        q: "Van-e garancia, és milyen hosszú?",
        a: (
          <>
            Igen, minden értékesített termékre konkrét, írásban vállalt
            jótállást adunk a számla mellé:
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                <strong>Eredeti diszkont lámpamodul</strong> — eredeti gyári
                izzó méretpontos utángyártott kerettel: <strong>6 hónap</strong>{" "}
                jótállás.
              </li>
              <li>
                <strong>Teljes gyári (OEM) cseremodul</strong> (külön kérésre):
                {" "}<strong>3 hónap</strong> jótállás.
              </li>
            </ul>
            A jótállás a fényerő- és élettartam-paraméterekre is kiterjed —
            ezt a két mérnöki paramétert vállaljuk. A jótállási idő kezdete a
            számla kiállításának napja. A jótállás mellett a jogszabályi
            szavatosság is érvényes.
          </>
        ),
      },
      {
        q: "Hibás termék — mi a teendő?",
        a: (
          <>
            Garanciális vagy szállítási sérülésből adódó hiba esetén a
            kézhezvételtől számított lehető leghamarabb jelezni kell
            e-mailben, lehetőleg fotódokumentációval. A bejelentés alapján
            RMA-azonosítót adunk ki, és egyeztetjük a visszaszállítás
            módját. <strong>Garanciális ügynél a visszaszállítás
            költsége nem a vevőt terheli.</strong>
          </>
        ),
      },
      {
        q: "Áfás számla, EU-s VAT?",
        a: (
          <>
            Minden megrendelésről áfás számlát állítunk ki. EU-tagállamból
            érvényes közösségi adószámmal rendelő üzleti vevő részére
            fordított adózással, áfa-mentesen tudunk számlázni — ehhez a
            megrendeléskor a VAT-számot meg kell adni.
          </>
        ),
      },
    ],
  },
];

function GyikPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-xs tracking-[0.25em] text-primary font-medium">
        TANÁCSADÁS · GYIK
      </div>
      <h1 className="text-3xl font-semibold tracking-tight mt-2">
        Gyakori kérdések a projektor lámpamodul választásához
      </h1>
      <p className="text-muted-foreground mt-3 max-w-2xl">
        Az alábbiakban a leggyakrabban felmerülő műszaki és kereskedelmi
        kérdéseket gyűjtöttük össze. Ha a saját helyzetére nem talál
        választ, írja meg az ajánlatkérő űrlapon — egyedi szakmai
        javaslattal válaszolunk.
      </p>

      <aside className="mt-8 border-l-4 border-accent-amber bg-card border border-border rounded p-5">
        <div className="text-[11px] tracking-widest text-accent-amber font-semibold uppercase">
          Figyelem · Márkaszerviz
        </div>
        <p className="text-sm text-foreground mt-2">
          Ha a cserét <strong>hivatalos márkaszervizzel</strong> végezteti
          (jellemzően élő gyártói garancia vagy szervizszerződés esetén),
          kérjük, a megrendelés előtt jelezze ezt. Ilyen esetben{" "}
          <strong>eredeti, gyári cikkszámmal ellátott beépítőkeretes</strong>{" "}
          modult kell rendelnie — ez magasabb árkategóriába esik, mint a
          műszakilag azonos, utángyártott keretes változat, viszont ezt
          fogadja el a szerviz a jegyzőkönyvbe.
        </p>
      </aside>

      <div className="mt-12 space-y-12">
        {sections.map((section) => (
          <section
            key={section.title}
            id={
              section.title.startsWith("Garancia")
                ? "garancia-visszakuldes"
                : undefined
            }
            className="scroll-mt-24"
          >
            <h2 className="text-lg font-semibold tracking-tight border-b border-border pb-2">
              {section.title}
            </h2>
            {section.intro && (
              <p className="text-sm text-muted-foreground mt-3 max-w-2xl">
                {section.intro}
              </p>
            )}
            <dl className="mt-4 divide-y divide-border border border-border rounded-lg bg-card">
              {section.items.map((item, i) => (
                <details
                  key={i}
                  className="group p-5 [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex justify-between items-start gap-4 cursor-pointer list-none">
                    <dt className="text-sm font-medium text-foreground group-hover:text-primary">
                      {item.q}
                    </dt>
                    <span
                      aria-hidden
                      className="text-muted-foreground text-lg leading-none select-none transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <dd className="text-sm text-muted-foreground mt-3 leading-relaxed">
                    {item.a}
                  </dd>
                </details>
              ))}
            </dl>
          </section>
        ))}
      </div>

      <div className="mt-12 flex flex-wrap gap-3">
        <Link
          href="/ajanlatkeres"
          className="bg-cta text-cta-foreground hover:bg-cta-hover rounded px-5 py-2.5 text-sm font-medium"
        >
          Egyedi árajánlatot kérek
        </Link>
        <Link
          href="/kapcsolat"
          className="border border-border rounded px-5 py-2.5 text-sm font-medium hover:bg-surface"
        >
          Kapcsolat
        </Link>
      </div>
    </div>
  );
}

export default GyikPage;
