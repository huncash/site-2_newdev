import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Általános Szerződési Feltételek (ÁSZF) — projektorlampacsere.hu",
  description: "A projektorlampacsere.hu (üzemeltető: ADP-TOP Kft.) általános szerződési feltételei: megrendelés, szállítás, fizetés, garancia, elállás.",
};

import { company } from "@/data/company";
import { canonical } from "@/lib/seo";

function AszfPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 prose-zinc">
      <div className="text-xs tracking-[0.25em] text-primary font-medium">JOGI</div>
      <h1 className="text-3xl font-semibold tracking-tight mt-2">Általános Szerződési Feltételek</h1>
      <p className="text-sm text-muted-foreground mt-3">Hatályos: 2026. január 1-jétől.</p>

      <Section n="1." title="Az üzemeltető (Eladó) adatai">
        <Defs items={[
          ["Cégnév", company.legalName],
          ["Rövid név", company.shortName],
          ["Székhely", company.address.full],
          ["Adószám", company.taxNumber],
          ["Közösségi adószám", company.euVatNumber],
          ["Cégjegyzékszám", `${company.registryNumberPlaceholder} (${company.registryAuthority})`],
          ["E-mail", company.email],
        ]} />
      </Section>

      <Section n="2." title="Az ÁSZF hatálya">
        <P>
          Jelen Általános Szerződési Feltételek (a továbbiakban: <strong>ÁSZF</strong>) az Eladó által
          a {company.brandName} márkanév alatt üzemeltetett weboldalon történő ajánlatkérésre,
          megrendelésre és szerződéskötésre vonatkoznak. Az Eladó értékesítési tevékenysége
          elsődlegesen <strong>vállalkozások, költségvetési szervek és intézmények</strong>
          (a továbbiakban: üzleti Vevő) részére irányul; a kereskedelmi feltételek, az árazás,
          az átfutási idők és a folyamatok ehhez a célközönséghez vannak igazítva.
          Magánszemélyek (fogyasztók) megrendelését az Eladó eseti jelleggel, a jelen ÁSZF
          eltérést meghatározó pontjaiban (különösen 7. és 9. pont) rögzített hosszabb
          átfutási idő és visszáru-feltételek mellett fogadja. A megrendelés leadásával a
          Vevő az ÁSZF feltételeit elfogadottnak tekinti.
        </P>
      </Section>

      <Section n="3." title="A szolgáltatás és a termékek">
        <P>
          Az Eladó projektor lámpamodulokat és speciális fényforrásokat (xenon,
          fémhalogén, UV) <strong>kereskedelmi forgalomba hoz</strong>; a modulok
          fizikai összeállítását (izzó és modulház egybeszerelése) a gyártó, illetve
          a forgalmazói lánc végzi. Az Eladó kereskedelmi és ellátási partnerként
          jár el, saját műhelyi szerelést nem végez. Az Eladó az alábbi három
          kivitelben forgalmaz fényforrást és lámpamodult:
        </P>
        <ul className="list-disc pl-6 space-y-1.5 text-sm text-muted-foreground">
          <li>
            <strong>Csak eredeti gyári izzó</strong> (foglalat és keret nélkül,
            kizárólag a fényforrás) — szakképzett AV-integrátor, illetve
            márkaszerviz részére. A beépítés kockázata és felelőssége ilyenkor
            a Vevőt terheli.
          </li>
          <li>
            <strong>Eredeti diszkont lámpamodul</strong> — eredeti gyári izzó
            (Philips, Osram, Ushio vagy Phoenix) méretpontos utángyártott
            kerettel. Az Eladó alapértelmezett ajánlott kivitele; intézményi
            beszerzéseknél is ezt javasoljuk.
          </li>
          <li>
            <strong>Teljes gyári (OEM) cseremodul</strong> — gyári cikkszámmal
            és eredeti beépítőkerettel. A Vevő külön, írásbeli kérésére
            ajánljuk, tipikusan magasabb árkategóriában.
          </li>
        </ul>
        <P>
          A három kivitel garanciális ablaka eltér (lásd 8. pont); a részletes
          műszaki paramétereket és a választott kivitelt minden esetben az adott
          tételhez tartozó adatlap és árajánlat rögzíti. Az Eladó{" "}
          <strong>kompatibilis (nem gyári márkájú) izzót nem szerez be és nem
          forgalmaz</strong>; árajánlat kizárólag eredeti gyári fényforrásra
          (Philips UHP, Osram P-VIP, Ushio NSH, Phoenix SHP és más, megnevezett
          gyártóktól származó eredeti termékre) adható.
        </P>
        <P>
          A weboldalon és a termékadatlapokon feltüntetett márkanevek, típusjelölések és
          modellszámok kizárólag a kompatibilitás azonosítását szolgálják; az Eladó a
          gyártóktól független cserealkatrész-forgalmazó, és a megnevezett gyártókkal nem
          áll forgalmazói vagy képviseleti jogviszonyban. Valamennyi védjegy a megfelelő
          jogosult tulajdonát képezi.
        </P>
      </Section>

      <Section n="4." title="Megrendelés és ajánlatkérés">
        <P>
          A Vevő a weboldalon található <strong>Árajánlat-kérés</strong> űrlapon, illetve e-mailben
          adhatja le ajánlatkérését. Az ajánlatkérés nem minősül szerződéskötésnek; a szerződés akkor
          jön létre, amikor az Eladó által visszaigazolt írásos árajánlatot a Vevő írásban (e-mail
          úton vagy megrendelővel) elfogadja. Az árajánlat — eltérő megjelölés hiányában — a kiállítás
          napjától számított <strong>14 naptári napig</strong> érvényes.
        </P>
      </Section>

      <Section n="5." title="Árajánlat és megrendelés folyamata">
        <P>
          A weboldalon megjelenített árak — amennyiben szerepelnek — tájékoztató jellegűek;
          a végleges árat, a vállalt szállítási határidőt és a választható fizetési módokat
          a Vevő részére kiállított <strong>egyedi árajánlat</strong> tartalmazza. Az
          ajánlatkéréstől számítva az Eladó <strong>legfeljebb 2 munkanapon belül</strong>
          válaszol; a munkaidőben (H–P 10–18, 8 és 16 óra között) érkezett ajánlatkérésekre
          az Eladó az adott munkanapon belül visszajelez. A megrendelés akkor jön létre, amikor a Vevő az ajánlatban szereplő
          feltételeket — ár, kiszállítási idő, fizetési mód — visszaigazolja és az
          online megrendelést leadja. Az ajánlatban szereplő egyes opciók
          (pl. eltérő fizetési ütemezés) változtathatják a végleges árat
          és/vagy a kiszállítási határidőt.
        </P>
      </Section>

      <Section n="6." title="Árak, fizetési feltételek">
        <P>
          Az árak — eltérő megjelölés hiányában — <strong>nettó árak, forintban (HUF)</strong>
          értendők; az ÁFA összegét a számla külön tünteti fel.
        </P>
        <P>
          <strong>Fizetés — minden Vevő részére egységesen</strong> — összhangban
          a magyar B2B beszerzési gyakorlattal — az érvényes megrendelés feltétele
          az Eladó által <strong>Számlázz.hu rendszeren keresztül kiállított
          díjbekérő 100%-os teljesítése banki átutalással</strong>. A megrendelés
          akkor minősül érvényesnek és visszaigazoltnak, amikor a díjbekérő
          ellenértéke az Eladó bankszámláján jóváírásra kerül. Munkaidőben (H–P
          10–18) beérkezett és aznap megérkezett átutalást az Eladó az adott
          munkanapon visszaigazol és indítja a teljesítést. Az áfás végszámla a
          teljesítéssel egyidejűleg készül, a NAV Online Számla rendszerbe
          automatikusan továbbítva.
        </P>
      </Section>

      <Section n="7." title="Szállítás és átfutási idő">
        <P>
          A kiszállítás Magyarországon belül <strong>futárszolgálattal</strong>
          történik. A készleten levő termékeket Magyarországon belül akár
          <strong> 1 munkanap</strong> alatt, a legtöbb eseti megrendelést
          általában <strong>6–12 munkanap</strong> átfutási idővel kézbesítjük;
          ritkább, vagy eseti gyártói készlethiány esetén az átfutás 2–3 hétre
          is nőhet. Az adott modulhoz tartozó pontos határidőt az árajánlat
          rögzíti; esetleges késedelemről az Eladó a Vevőt e-mailben
          haladéktalanul tájékoztatja.
        </P>
        <P>
          Az Eladó <strong>csomagküldő kereskedelem</strong> keretében
          dolgozik; bemutatóterem és ügyfélfogadás nincs.
          EU-n belüli kiszállítás külön egyeztetés alapján lehetséges.
          A kárveszély a csomag átadásakor száll át a Vevőre.
        </P>
        <P>
          Versenyelőnyünk az árképzés kiszámíthatósága és a minőség
          kompromisszummentessége. Amennyiben a Vevő részéről nincs sürgősség,
          már kis darabszámú megrendelésnél is kiegyensúlyozott árat tudunk
          biztosítani; a preferált, költséghatékony beszerzéshez tartozó
          átfutási idő ilyenkor jellemzően 6–12 munkanap. Szerződött
          partnereink által előjegyzett, raktárkészletes tételekre ez nem
          vonatkozik — azok kiszállítása a készletről 1–2 munkanap.
        </P>
      </Section>

      <Section n="8." title="Garancia, szavatosság">
        <P>
          Az Eladó az értékesített lámpamodulokra a kivitelhez igazodó garanciát
          vállal a beépítéstől, de legfeljebb <strong>500 üzemórát</strong> a két
          határérték közül a hamarabb bekövetkező eseményig:
        </P>
        <ul className="list-disc pl-6 space-y-1.5 text-sm text-muted-foreground">
          <li>
            <strong>Csak eredeti gyári izzó</strong> (foglalat / keret nélkül):
            3 hónap, kizárólag az izzó gyári hibájára. A beépítésből eredő
            meghibásodásért az Eladó és a gyártó felelősséget nem vállal.
          </li>
          <li>
            <strong>Eredeti diszkont lámpamodul</strong>: 6 hónap.
          </li>
          <li>
            <strong>Teljes gyári (OEM) cseremodul</strong> (külön kérésre):
            3 hónap, a gyártói forgalmazói lánc által biztosított garanciális
            ablaknak megfelelően.
          </li>
        </ul>
        <P>
          A garancia az izzó gyári hibájára vonatkozik; nem terjed ki a helytelen
          beépítésből, túlfeszültségből, mechanikai sérülésből, illetve a projektor
          ballaszt vagy hűtés meghibásodásából eredő károkra. Garanciális
          ügyintézéshez a Vevő a hibás modult eredeti csomagolásban, a hiba
          leírásával köteles visszajuttatni az Eladó székhelyére. A pontos
          garanciális időtartamot a tételhez tartozó árajánlat is rögzíti.
        </P>
      </Section>

      <Section n="9." title="Elállás, visszáru">
        <P>
          <strong>Üzleti Vevő (vállalkozás, költségvetési szerv, intézmény) esetén</strong> a
          fogyasztói elállási jog (45/2014. Korm. rendelet) nem alkalmazandó. Indoklás
          nélküli visszavételt az Eladó nem vállal; a megrendelés véglegesítése előtt
          a Vevő köteles a típuskompatibilitást, a projektor-modellt és az
          izzómodul-cikkszámot ellenőrizni. Tévesen rendelt cikknél egyedi mérlegelés
          alapján részleges visszavétel lehetséges, de nem garantált; ilyen esetben a
          visszaszállítás teljes költsége és kockázata, valamint a felmerülő
          adminisztrációs és újra-bekészletezési költség (jellemzően a nettó vételár
          legfeljebb 20%-a) a Vevőt terheli.
        </P>
        <P>
          <strong>Magánszemély (fogyasztó) Vevő esetén</strong> a 45/2014. (II. 26.) Korm.
          rendelet szerint a kézhezvételtől számított <strong>14 naptári napon belül</strong>
          indoklás nélkül elállhat a szerződéstől. A bejelentést követően további 14 nap áll
          rendelkezésre az áru visszajuttatására. <strong>A visszaszállítás költsége és
          kockázata a fogyasztót terheli.</strong> A termék kizárólag bontatlan, sértetlen,
          eredeti csomagolásban vehető vissza teljes vételáron; bontott vagy használt
          termék esetén az Eladó értékcsökkenést érvényesít, amelynek mértéke a termék
          állapotától függően akár a vételár 100%-áig is terjedhet.
        </P>
        <P>
          <strong>Megrendelés lemondása</strong> mindkét vevői körben kizárólag addig
          lehetséges, amíg a megrendelés feldolgozása és csomagolása nem kezdődött meg;
          ennek érdekében a lemondási szándékot a megrendelés leadása után a lehető
          leghamarabb, telefonon vagy e-mailben jelezni kell. Ha a csomag a
          futárszolgálat részére már átadásra került, a megrendelés nem mondható le; a
          kézhezvétel után a fenti visszaküldési eljárás indítható el, a vonatkozó
          költségviseléssel.
        </P>
        <P>
          Bontott vagy beépített modul nem visszáruzható, kivéve a 8. pont szerinti
          garanciális esetet. Garanciális ügynél a visszaszállítás költsége nem a
          Vevőt terheli.
        </P>
      </Section>

      <Section n="10." title="Felelősségkorlátozás">
        <P>
          Az Eladó felelőssége a termék vételárának összegére korlátozódik. Az Eladó nem felel a
          termék használatából eredő közvetett vagy következményes károkért (pl. elmaradt haszon,
          üzemszünet), kivéve, ha azt jogszabály kötelezően másként rendelkezi.
        </P>
      </Section>

      <Section n="11." title="Adatkezelés">
        <P>
          A megrendelés során megadott személyes adatokat az Eladó az{" "}
          <Link href="/adatvedelem" className="text-primary hover:underline">
            Adatkezelési tájékoztatóban
          </Link>{" "}
          részletezett feltételek szerint kezeli, a GDPR és az Infotv. rendelkezéseinek megfelelően.
        </P>
      </Section>

      <Section n="12." title="Záró rendelkezések">
        <P>
          A jelen ÁSZF-ben nem szabályozott kérdésekben a Polgári Törvénykönyv (Ptk.) és a kapcsolódó
          magyar jogszabályok rendelkezései az irányadóak. A felek a jogviták rendezésére
          megpróbálnak békés úton megegyezni; ennek hiányában a felek a hatáskörrel és illetékességgel
          rendelkező magyar bíróság joghatóságát kötik ki. Az Eladó fenntartja a jogot az ÁSZF
          egyoldalú módosítására; a módosítás a weboldalon való közzététellel lép hatályba.
        </P>
      </Section>

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

export default AszfPage;
