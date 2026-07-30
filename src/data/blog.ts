export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  description: string;
  publishedAt: string; // ISO
  readingMinutes: number;
  /** Markdown-lite: paragraphs separated by blank lines; lines starting with `## ` become h2. */
  body: string;
}

export const posts: BlogPost[] = [
  {
    slug: "mennyibe-kerul-projektor-izzo-csere",
    title: "Mennyibe kerül egy projektor izzó cseréje 2026-ban?",
    excerpt:
      "Átlagárak technológiánként (UHP, UHE, NSH), az eredeti gyári izzó keretezett változatának és a teljes OEM modulnak az árkülönbsége, valamint a rejtett költségek, amelyekkel intézményi vásárlóként számolni érdemes.",
    description:
      "Projektor izzó csere árak 2026: UHP, UHE, NSH lámpamodulok ársávjai, az eredeti gyári izzós keretezett modul és a teljes OEM modul közötti különbség, valamint az áfás számlázás és szállítás költségvonzata.",
    publishedAt: "2026-02-18",
    readingMinutes: 9,
    body: `Egy projektor lámpamodul cseréje az esetek többségében a készülék továbbüzemeltetésének leggazdaságosabb módja: a fényerő visszaáll a gyári értékre, a vetítő pedig további több ezer üzemórát teljesít. A költséget három tényező határozza meg: a fényforrás technológiája, a választott modulkivitel, valamint a szállítás és számlázás módja.

![Teli előadóterem, a vetítő nem működik, az oktató a sötét vászon előtt áll — vonalrajz illusztráció](/blog/nem-mukodo-vetito-eloadoterem.jpg)

## A fényforrás technológiája

A piacon ma jelen lévő nagy gyártók (Philips UHP, Osram P-VIP, Ushio NSH, Phoenix SHP) modelltípusonként eltérő alkatrészárakkal dolgoznak. Az alacsony és közepes fényerejű, irodai és oktatási kategóriába tartozó projektorok lámpamodulja jellemzően a megfizethetőbb sávba esik, míg a nagyobb teljesítményű, prezentációs és rendezvénykategóriás készülékek modulja ennek többszöröse. (A digital cinema Xenon-csöveket jelenleg nem kínáljuk.)

Tájékoztató jelleggel három ársávot különböztetünk meg. Az **belépő kategória** (irodai és oktatási projektorok, jellemzően 2 000–3 500 lumen fényerő — például Epson EB-S, EB-X, EB-W széria, BenQ MS/MX/MW és NEC V-széria) lámpamoduljai a megfizethető sávba esnek. A **közép kategória** (3 500–5 000 lumen, igényesebb tárgyalói és előadótermi készülékek — Epson EB-9xx, EB-19xx, NEC NP-P, BenQ MH/SH-széria) modulja jellemzően ennek másfél–kétszerese. A **felső kategória** (5 000 lumen felett, prezentációs, mozi- és rendezvénykategóriás projektorok — Christie, Barco, NEC PA-széria, Panasonic PT-RZ/RW) lámpamodulja a belépő kategória árának három-ötszöröse is lehet, mert a benne dolgozó nagyobb nyomású kisülőlámpa, a ballaszt-specifikáció és a hűtéssel összehangolt keret jelentősen drágább.

## Az általunk forgalmazott modulkivitel

**Eredeti diszkont lámpamodult** szállítunk: eredeti gyári izzó (Philips UHP, Osram P-VIP, Ushio NSH, Phoenix SHP) méretpontos, utángyártott modulházba szerelve. A fényforrás azonos a teljes gyári cseremodulba épített izzóval; a különbség kizárólag a kazetta keretében van. Műszakilag azonos fényerőt, élettartamot és színhőmérsékletet biztosít, jellemzően a teljes gyári cseremodul árának 25–55%-áért. Erre a kivitelre 6 hónap, legfeljebb 500 üzemóra jótállást vállalunk.

Iskolák, egyetemek, közintézmények, kis- és középvállalkozások, AV-integrátorok és karbantartók tipikusan ezt a kivitelt rendelik. A modul eredeti gyári izzóval és — kérésre — az izzógyártó eredetigazolásával kerül átadásra.

Teljes gyári (OEM) kivitelű cseremodulra — szerződéses márkaszerviz-jelenlét, kiterjesztett gyártói garancia vagy belső eszközszabályzat melletti igény esetén — szintén tudunk ajánlatot adni; a részleteket a GYIK ide vonatkozó pontja foglalja össze.

## Amit nem forgalmazunk: kompatibilis utángyártott izzós modul

A piacon elérhető egy harmadik árszint is, amely első ránézésre még kedvezőbbnek tűnik: **kompatibilis, nem gyári márkájú izzóval szerelt utángyártott modul** — jellemzően ellenőrizetlen ázsiai üzemekből, Philips / Osram / Ushio / Phoenix tipográfiát másoló címkével, mégis gyári származási bizonylat nélkül. Ezt a kivitelt nem forgalmazzuk, és intézményi felhasználáshoz nem javasoljuk. A kompatibilis izzók fényereje tipikusan 20–40%-kal alacsonyabb, az élettartam töredéke a gyári értéknek, a színhőmérséklet eltolódik, a meghibásodási ráta többszörös — és a magasabb hőtermelés a projektor ballasztját és optikáját is károsíthatja. A szállító-időn belüli néhány tízezer forintos megtakarítás így rendre egy második — esetleg harmadik — modulvásárlással, illetve a vetítő szervizköltségével fizettetődik meg. A klasszikus megfogalmazás szerint *„nem vagyok olyan gazdag, hogy olcsó dolgokat vegyek"*: a megbízható, eredeti gyári izzós modul hosszú távon olcsóbb döntés, mint a kompatibilis kivitel.

## Számlázás, szállítás, rejtett költségek

Valamennyi megrendelésünket az ADP-TOP Kft. nevére, tételes áfás számlával állítjuk ki (27% ÁFA), így a tétel költségként és tárgyi eszközként egyaránt elszámolható. A szállítás Magyarország területén belül jellemzően 1–2 munkanap készletes tétel esetén, illetve 6–12 munkanap egyedi beszerzés esetén. A pontos szállítási időt és a fuvarköltséget az árajánlat tartalmazza.

Az érvényes megrendelés minden ügyfél számára egységesen a Számlázz.hu rendszerből kiállított díjbekérő banki átutalással történő teljesítéséhez kötött; a teljesítést a jóváírás visszaigazolása után indítjuk. Visszatérő és nagyobb tételes megrendelésekre mennyiségi kedvezményt biztosítunk.

Érdemes a számlán szereplő tételáron túl három, gyakran figyelmen kívül hagyott költségelemmel is számolni. Az **állásidő költségével**: egy oktatási vagy tárgyalótermi vetítő kiesése egy teljes munkanapra önmagában is meghaladhatja a modul árát, ezért a tervezett — és nem a meghibásodás után végrehajtott — csere mindig gazdaságosabb. A **kiszállás és beépítés díjával**, ha a cserét nem helyben oldják meg: jellemzően ez a tétel a modul árának 20–40%-a, és bekerülési költségként pontosan tervezhető. Végül a **selejtezés és a higanytartalmú izzó szabályos átvételének díjával**: a használt lámpamodulokat a környezetvédelmi előírásoknak megfelelő hulladékkezelőnek kell átadni; intézményi felhasználóknak ezt javasolt a meglévő veszélyeshulladék-szerződésük keretében bonyolítani.

## Mennyi időre tervezhető vissza a beruházás?

Egy átlagos, közepes fényerejű üzleti projektor új készülékkénti pótlása ma 250 000 — 500 000 forint, míg ugyanennek a vetítőnek a lámpamoduljának cseréje ennek tört része. Amennyiben a készülék többi alkatrésze (DLP-chip vagy LCD-panel, optika, ventilátorok, ballaszt) jó állapotban van — ami egy normál üzemeltetésű, 4–6 éves vetítőnél tipikus — egyetlen lámpamodul-csere további 2 000–4 000 üzemórát ad a készülék életéhez. Ez a legtöbb intézményi környezetben 3–5 további év üzemszerű használatnak felel meg, így a csere megtérülése jellemzően az első félévben realizálódik.

Tételes árajánlatot — a projektor pontos típusszáma vagy a meglévő lámpamodul cikkszáma alapján — egy munkanapon belül visszaigazolunk.`,
  },
  {
    slug: "elhasznalodott-projektor-izzo-jelei",
    title: "Mikor érdemes lámpamodult cserélni? Az elhasználódott projektor izzó jelei",
    excerpt:
      "A fényerő fokozatos csökkenése, a színhőmérséklet eltolódása, a megnövekedett ventilátor-zaj és a „Lamp\" figyelmeztetés értelmezése — mely jeleknél időszerű a tervezett csere, és melyek utalnak közvetlen meghibásodásra.",
    description:
      "Hogyan ismerhető fel, hogy elhasználódott a projektor lámpamodulja: fényerőcsökkenés, színeltolódás, ventilátorzaj, Lamp/Warning üzenetek és a tervezett lámpacsere optimális időzítése intézményi környezetben.",
    publishedAt: "2024-07-09",
    readingMinutes: 8,
    body: `A projektor fényforrása fogyóeszköz: a gyártó által megadott névleges élettartam jellemzően 2 000–6 000 üzemóra között mozog, az üzemmódtól (Normal / Eco / Dynamic) és a környezeti hőmérséklettől függően. Az alábbi jelek alapján időben tervezhető a csere, mielőtt a vetítő üzemképtelenné válna.

![TMK – tervezett megelőző karbantartás: ipari vetítő lámpamoduljának szervizelése — vonalrajz illusztráció](/blog/tmk-ipari-vetito-szereles.jpg)

## A fényerő fokozatos csökkenése

A leggyakoribb és legkorábban észlelhető tünet. Az UHP és UHE technológiájú izzók a névleges élettartamuk végére akár 30–50%-os fényerővesztést is mutathatnak; a kép halványabb, az árnyalatok elmosódottak, a vetített tartalom erősen megvilágított termekben már alig olvasható. Intézményi környezetben — oktatási, tárgyalói, vezérlőtermi alkalmazásban — ez a pont jellemzően jóval a tényleges meghibásodás előtt érkezik el.

A jelenség fokozatos, ezért a felhasználók megszokják, és gyakran csak akkor figyelnek fel rá, amikor a kép már egyértelműen használhatatlan. Egy gyors önellenőrzés: vetítse ki a készülékkel a Windows alapértelmezett fehér háttérképét, vagy egy üres, fehér prezentációs diát, és hasonlítsa össze egy újonnan üzembe helyezett, hasonló kategóriás projektor képével. Ha a kép észrevehetően sárgásabb, szürkésebb vagy halványabb, a lámpamodul a névleges élettartam vége felé közelít.

## Színhőmérséklet eltolódása

Az elhasználódó izzó spektruma megváltozik: a fehér tartalom sárgás vagy zöldes árnyalatúvá válik, a kontraszt csökken. Ha a kalibráció ellenére sem áll vissza az eredeti színkép, a fényforrás közel jár az élettartama végéhez.

Ez különösen az oktatási és prezentációs alkalmazásokban okoz észrevehető minőségromlást: a fényképek bőrtónusa fakó lesz, a térképeken és diagramokon a piros és narancs árnyalatok eltolódnak, a videótartalom kontrasztja pedig láthatóan csökken. Színhűségre érzékeny felhasználásnál (grafikai prezentáció, orvosi képalkotás, építészeti vetítés) a csere már jóval a névleges élettartam vége előtt indokolt lehet.

## Megnövekedett ventilátorzaj

A csökkenő hatékonyságú izzó több hőt termel, amit a vetítő hűtőrendszere magasabb ventilátorfordulattal kompenzál. Ha a készülék érezhetően hangosabban üzemel, mint korábban — különösen Eco üzemmódban —, az a fényforrás vagy a porral telített hűtőcsatornák figyelmeztető jele.

A két ok elkülönítése egyszerű: kapcsolja ki a készüléket, hagyja teljesen lehűlni (legalább 15 perc), majd óvatosan tisztítsa át a légszűrőt és a hűtőrácsokat sűrített levegővel. Ha az ismételt bekapcsolás után a ventilátorzaj normalizálódik, a probléma a hűtőrendszer eltömődése volt; ha nem, a fényforrás a hibás. Az utóbbi esetben a csere halogatása komolyabb meghibásodáshoz vezethet — a tartós hőterhelés a ballasztot és a DLP-chip/LCD-panel környezetét is károsítja.

## A „Lamp\" vagy „Warning\" figyelmeztetés a menüben

A legtöbb gyártó (Epson, BenQ, NEC, Sony, Optoma, Hitachi, Panasonic) a megadott üzemóraszám közelében figyelmeztető üzenetet jelenít meg. Ez nem jelent azonnali meghibásodást, de a tervezett csere ütemezésére hivatalos jelzés.

A figyelmeztetés általában két lépcsőben jelenik meg. Az **első jelzés** (jellemzően a névleges élettartam 80–90%-ánál) a tervezhető csere ablakát nyitja meg; ekkor érdemes a pótmodult megrendelni és a cserét a következő szervezeti szünetre — tanítási szünet, ünnepi időszak — időzíteni. A **második jelzés** (a névleges élettartam elérésekor vagy meghaladásakor) általában már a készülék automatikus kikapcsolásával vagy bekapcsolás-tiltással jár. Bizonyos modelleknél (különösen Epson és NEC) a lámpaszámláló nullázása a csere után kötelező lépés; ennek menete a szervizmenüben típusfüggő, a részletes leírást a megrendeléshez mellékelt útmutatóban átadjuk.

## Hirtelen kikapcsolás, ismételt újraindulás

Ha a vetítő üzem közben kikapcsol, majd néhány perc múlva ismét elindítható, az többnyire a fényforrás közvetlen meghibásodására utal. Ilyen esetben a további bekapcsolási kísérletek a ballaszt és a tápegység terhelését növelik; javasolt a lámpamodul soron kívüli cseréje.

Ritkább, de hasonló tünet a **kép pillanatnyi kihunyása és visszatérése** vetítés közben, jellemzően halk pukkanó hanggal kísérve. Ez az izzóelektróda közeli kontaktushiba jele, és néhány órán belül teljes meghibásodáshoz vezet. Ha a készülék hozzáférhető helyen van, a fényforrást ilyenkor azonnal érdemes lekapcsolni — a túlfeszültség-impulzusok a ballaszt-elektronikát is károsíthatják, ami a lámpamodul cseréjének költségénél jóval drágább javítást eredményez.

## A teljes meghibásodás formái

Az elhasználódás végállomása három, jól elkülöníthető hibakép szerint zajlik. A **csendes kialvás** — a vetítő bekapcsol, a menü megjelenik, de fény nem jön ki, vagy néhány másodperc után kialszik — a leggyakoribb, kockázatmentes meghibásodás; egyszerű modulcserével orvosolható. A **hallható kis pukkanás bekapcsoláskor** azt jelzi, hogy az izzó belső kvarcburka megrepedt; a modul cseréje után a vetítő rendeltetésszerűen működik, de a lámpaházat gondos áttisztítás után érdemes ellenőriztetni az üvegszilánkok miatt. A **modul-ház deformálódásával vagy elszíneződésével járó meghibásodás** ritka, és túlhevülésre utal; ilyenkor a hűtőrendszer (ventilátorok, légszűrő, ballaszt-hőelvezetés) átvizsgálása is indokolt a modulcsere mellett.

## Tervezett csere intézményi környezetben

Oktatási intézményekben, tárgyalókban és vezérlőtermekben javasolt a fényforrást a névleges élettartam 80%-ának elérésekor, vagy a tanév / üzleti negyedév végén pótolni. Így elkerülhető, hogy egy fontos prezentáció vagy oktatási alkalom közben álljon le a készülék.

Nagyobb, több vetítőt üzemeltető szervezeteknél (iskolák, egyetemek, AV-integrátorok) javasolt **kritikus készülékhez egy darab tartalék lámpamodult készleten tartani**. Egy átlagos lámpamodul polcélettartama 3–5 év, így a beszerzés a használt vetítő teljes hátralévő élettartamára megoldja a kockázatkezelést, miközben a tényleges állásidőt nullára csökkenti — a csere ekkor saját időben, a hibajegy érkezésétől számított órákon belül elvégezhető.

A pótlandó modulok típusát az árajánlat-kérő űrlapon megadott projektor-azonosító alapján visszaigazoljuk; több készülékből álló park egyösszegű felmérésére keretszerződéses partnereinknek külön ajánlatot adunk.`,
  },
  {
    slug: "uhp-uhe-nsh-kulonbsegek",
    title: "UHP, UHE, NSH és P-VIP — mi a különbség a projektor izzó technológiák között?",
    excerpt:
      "Rövid technológiai áttekintés a négy elterjedt nagyfényerejű kisülőlámpa-családról: Philips UHP, Philips UHE, Ushio NSH és Osram P-VIP. Mikor melyik adja a legjobb fényerő–élettartam–ár egyensúlyt.",
    description:
      "UHP, UHE, NSH és Osram P-VIP projektor izzó technológiák összehasonlítása: működési elv, fényerő, élettartam, színhőmérséklet és tipikus alkalmazási területek.",
    publishedAt: "2024-08-27",
    readingMinutes: 9,
    body: `A digitális projektorok túlnyomó többségében nagy nyomású higanygőz-kisülésű (HID) lámpa biztosítja a fényt. A piacon négy fő technológia van jelen, eltérő márkanevek alatt; ezek paraméterei és tipikus alkalmazási területei az alábbiak.

## Közös működési elv

Mind a négy technológia rövid ívű, nagy nyomású gázkisülőlámpán alapul: a lámpa kvarcburkájában higany és kis mennyiségű nemesgáz keverékét egy nagyfeszültségű gyújtóimpulzus ionizálja, majd az így kialakuló ívben — két wolfram elektróda között, mindössze 1,0–1,3 mm hosszan — folytatódik a kisülés. Az üzemi nyomás 200 bar fölé emelkedik, az elektródák közötti hőmérséklet meghaladja a 6 000 K-t, a kis ívhossz pedig közel pontszerű fényforrást eredményez — ez teszi a technológiát kifejezetten alkalmassá optikai vetítésre. A négy technológia közötti különbségek az adalékanyagokban, a burok geometriájában, a reflektor-illesztésben és a ballaszt-szabályozásban vannak.

![Rövid ívű, nagy nyomású higanygőz-kisülőlámpa metszeti ábrája: kvarcbura, wolfram elektródák ~1 mm ívközzel, reflektor és kilépő fénynyaláb](/blog/rovid-ivu-higanygoz-kisulolampa-abra.jpg)

## Philips UHP (Ultra High Performance)

A Philips által szabadalmaztatott, rendkívül stabil fényspektrumú technológia. Jellemzői: hosszú, 4 000–6 000 órás névleges élettartam, kiegyensúlyozott fehérpont (kb. 7 500 K), kiváló színvisszaadás. Az UHP fényforrást használja a legtöbb prémium üzleti és oktatási projektor — Epson, NEC, Sony, Christie nagyobb teljesítményű modelljei.

Az UHP fő erőssége a **spektrum időbeli stabilitása**: a hagyományos higanygőzlámpákkal ellentétben a Philips eljárása a wolfram elpárolgásának visszafordítását — az úgynevezett halogén-ciklust — pontosan beállított adalékokkal kezeli, így az elektródák felülete és a fényspektrum is hosszú időn át változatlan marad. Gyakorlati következmény: az UHP-modulok a teljes élettartam első 75–80%-ában a névleges fényerő több mint 80%-át adják, ami egy oktatási vetítő esetében több ezer üzemórán át kalibráció nélküli, megbízható képminőséget eredményez.

## Philips UHE (Ultra High Efficiency)

Az UHP költséghatékony változata, alacsonyabb és közepes fényerejű (jellemzően 2 000–3 500 lumen) projektorokba. Élettartama 3 000–5 000 üzemóra, fényhozama valamivel kedvezőbb, mint az UHP-é, viszont a stabilitása rövidebb. Tömeges oktatási és otthonmozi alkalmazásban elterjedt.

Az UHE-modulok kifejezetten azokra a projektorokra készülnek, ahol a beszerzési ár és a fenntartási költség lényegesebb szempont, mint a hosszú távon stabil színkép. Hátránya, hogy az élettartam második felében az UHP-nél meredekebben veszít fényerőből, és a színhőmérséklet eltolódása is hamarabb észlelhető. Ennek ellenére a legtöbb iskolai, tárgyalótermi és otthoni felhasználáshoz az UHE-modul kompromisszummentesen elegendő, és a teljes bekerülési költség (TCO) szempontjából gyakran ez a legjobb választás.

## Ushio NSH (New Super High Pressure)

A japán Ushio által gyártott nagyfényerejű kisülőlámpa-család. Tipikus alkalmazási területe a közepes és nagy fényerejű üzleti, valamint moziprojektorok (BenQ, Optoma, Mitsubishi). Élettartama 3 000–5 000 óra, színhőmérséklete az UHP-hez hasonló.

Az NSH technológia kifejlesztése a 2000-es évek elején azt célozta, hogy a Philips UHP-vel műszakilag egyenértékű, de teljesen független szabadalmi háttérrel rendelkező alternatíva álljon a projektorgyártók rendelkezésére. A gyakorlatban az NSH és az UHP fényspektruma, élettartama és színhőmérséklete annyira közel van egymáshoz, hogy egy modul típusváltása felhasználói oldalon nem észlelhető — pontosan ezért használja a két szabadalom-családot vegyesen több gyártó is, modelltípus szerint változó beszállítóval.

## Osram P-VIP (Video Projector)

Az Osram saját fejlesztésű, magas fényhasznosítású technológiája. Jellegzetessége a gyors felfutás és a stabil, hideg-fehér színkép. Élettartama 2 500–5 000 óra között mozog, számos BenQ, Vivitek, ViewSonic és LG projektor gyári fényforrása.

A P-VIP egyik jól ismert megkülönböztető tulajdonsága a **rövid felfutási idő**: a teljes fényerő 90%-át tipikusan 40–60 másodperc alatt eléri, szemben az UHP/UHE jellemző 60–90 másodperces felfutási idejével. Ez azoknál a vetítőknél, amelyeket napi több alkalommal kapcsolnak be és ki (üzleti tárgyalók, oktatóhelyiségek), érzékelhető kényelmi előnyt jelent. Cserébe a P-VIP-modulok az élettartam utolsó harmadában az UHP-nél valamivel érzékenyebbek a hirtelen hőterhelésre — ezért ezekben a vetítőkben a megfelelő szellőzés és a tiszta légszűrő különösen fontos.

## Melyiket válasszuk?

A választást alapesetben nem a felhasználó dönti el: minden projektor lámpamodulja meghatározott gyártói specifikációval rendelkezik, és csak azonos technológiájú izzóval helyettesíthető. A modulház és az izzó együtt alkot egy lecserélhető egységet; az izzó típusát a projektor gyártója határozza meg.

A megfelelő modul azonosításához elegendő a projektor pontos típusszáma vagy a jelenlegi modul cikkszáma (pl. ELPLP71, NP41LP, 5J.J9R05.001). Az árajánlat az eredeti diszkont lámpamodulra vonatkozik; ha a megrendelés teljes gyári (OEM) kivitelű cseremodult igényel, kérjük, az ajánlatkérés megjegyzés rovatában jelezze.

## LED és lézer fényforrás: alternatíva vagy más kategória?

Az utóbbi években egyre több új projektoron jelenik meg a **LED**- vagy a **lézerfoszforos** fényforrás, amely 20 000–30 000 órás élettartammal és gyakorlatilag elhanyagolható fényerővesztéssel működik. Felmerülő kérdés, hogy a meglévő, lámpás projektort érdemes-e ilyen készülékre cserélni. A válasz általában az, hogy **egy meglévő, jól működő lámpás vetítő üzemszerű cseréje új lézeres készülékre csak akkor gazdaságos, ha a meglévő készülék több éven át, intenzív üzemben (heti 30+ üzemóra) használatban van** — egy tipikus, oktatási vagy tárgyalótermi vetítőnél a beszerzési árkülönbség és az alacsonyabb karbantartási költség közötti megtérülés 6–10 évre tehető.

A gyakorlatban tehát a meglévő, működőképes lámpás projektort érdemes a lámpamodul cseréjével további 2–4 évre megtartani, és csak a teljes elavulás (felbontás, csatlakozók, vezérlés) idején cserélni le újabb generációs készülékre. Tételes árajánlatot a projektor típusszáma alapján egy munkanapon belül visszaigazolunk.`,
  },
  {
    slug: "eredeti-vs-utangyartott-projektor-izzo",
    title: "Eredeti vs. utángyártott projektor izzó — mit válasszon B2B beszerzőként?",
    excerpt:
      "Három kivitel létezik a piacon: teljes gyári (OEM) cseremodul, eredeti gyári izzó utángyártott keretben, valamint kompatibilis (nem gyári) izzós modul. Cikkünk lépésről lépésre összeveti a három opciót intézményi és vállalati szempontból.",
    description:
      "Eredeti OEM cseremodul, eredeti gyári izzós utángyártott modul vagy kompatibilis izzós modul? Az intézményi és vállalati projektor lámpamodul-beszerzés három útjának műszaki, jogi és gazdasági összehasonlítása.",
    publishedAt: "2024-10-15",
    readingMinutes: 8,
    body: `Egy intézményi vagy vállalati projektor-park üzemeltetőjeként a lámpamodul-beszerzéskor három, lényegesen eltérő kivitel közül választhat. A három opció — teljes gyári (OEM) cseremodul, eredeti gyári izzó utángyártott modulházban, valamint kompatibilis (nem gyári) izzóval szerelt utángyártott modul — műszaki teljesítménye, garanciája, ára és intézményi besorolása is markánsan eltér.

## 1. Teljes gyári (OEM) cseremodul

A vetítőgyártó (Epson, BenQ, NEC, Optoma, Panasonic, Sony, Hitachi és társaik) saját logózott, eredeti dobozos cseremodulja. A fényforrás az iparágban érintett négy nagy izzógyártó (Philips UHP, Osram P-VIP, Ushio NSH, Phoenix SHP) egyikétől származik, amelyet a vetítőgyártó saját, eredeti tervezésű és gyártású modulházba szerel. A megoldás a maximális kompatibilitást, a gyári cikkszámmal történő nyilvántartást és a leghosszabb (jellemzően 90 napos vagy gyártófüggő) gyártói garanciát kínálja, jellemzően a legmagasabb áron.

**Mikor válassza:** ha a projektorra élő gyártói jótállás vagy márkaszerviz-szerződés vonatkozik, és a szerviz a gyári cikkszámmal címkézett modul beépítését szerződésben előírja; vagy ha a belső eszközszabályzat, a leltár-nyilvántartási rend, esetleg egy ISO-megfelelőségi audit ezt megköveteli.

## 2. Eredeti diszkont lámpamodul — eredeti gyári izzó utángyártott keretben

Az általunk forgalmazott kivitel. A fényforrás itt is ugyanaz az eredeti gyári izzó (Philips UHP, Osram P-VIP, Ushio NSH, Phoenix SHP), amely a teljes OEM modulba kerül; az egyetlen különbség, hogy a kazetta keretét nem a vetítőgyártó, hanem egy ellenőrzött harmadik fél gyártja, méretpontos, mechanikai és optikai szempontból az eredetivel azonos kivitelben. A fényerő, a színhőmérséklet, az élettartam és a hűtési viselkedés változatlan; az ár jellemzően a teljes OEM modul 25–55%-a.

**Mikor válassza:** a hazai intézményi és vállalati felhasználók 80–90%-ánál ez a műszakilag és gazdaságilag is optimális választás. A modul eredeti gyári izzóval és — kérésre — az izzógyártó eredetigazolásával kerül átadásra. Garancia: 6 hónap, legfeljebb 500 üzemóra.

## 3. Kompatibilis utángyártott izzós modul

A legolcsóbb piaci kivitel: ellenőrizetlen, jellemzően ázsiai forrásból származó, nem gyári márkájú izzóval szerelt utángyártott modul. A címkén gyakran Philips, Osram vagy Ushio felirat olvasható — gyári származási bizonylat azonban nem áll mögötte. **Ezt a kivitelt nem forgalmazzuk**, és intézményi felhasználáshoz nem javasoljuk.

**Miért nem:** a kompatibilis izzók fényereje tipikusan 20–40%-kal alacsonyabb, élettartamuk a gyári érték töredéke, színhőmérsékletük eltolódott, meghibásodási rátájuk többszörös. A magasabb hőtermelés a vetítő ballasztját és optikáját is károsíthatja. A beszerzéskor megtakarított összeg rendre egy második modulvásárlással és szervizköltséggel fizettetődik meg. Az intézményi felhasználó számára a hibásan világító vetítő egy oktatási vagy tárgyalótermi környezetben azonnal mérhető üzemzavari költséget okoz.

## Összehasonlító táblázat — három kivitel egy oldalon

| Szempont | Teljes gyári (OEM) | Eredeti diszkont modul | Kompatibilis izzós modul |
|---|---|---|---|
| Fényforrás | Eredeti gyári izzó | **Eredeti gyári izzó** | Nem gyári izzó |
| Modulház | Gyári | Méretpontos utángyártott | Méretpontos utángyártott |
| Fényerő, élettartam, színhőmérséklet | Gyári érték | **Gyári érték** | 60–80% / töredék / eltolódás |
| Garancia | 90 nap / gyártófüggő | 6 hónap, max. 500 üó | Nincs / vállalhatatlan |
| Ár (összehasonlítva az OEM-mel) | 100% | **25–55%** | 15–25%, de magas kockázat |

## A B2B döntés rövid heurisztikája

Ha a vetítőre élő gyártói garancia vagy márkaszerviz-szerződés vonatkozik → **teljes OEM modul**. Minden más intézményi és vállalati esetben — beleértve az iskolai, egyetemi, önkormányzati, kórházi és gazdasági társasági projektor-parkokat is — **eredeti gyári izzó utángyártott keretben**. A kompatibilis kivitel intézményi környezetben nem javasolt; a megtakarítás látszólagos, az üzemzavari és újraszerelési költség valós.

Tételes árajánlatot — bármelyik kivitelre — a projektor pontos típusszáma vagy a meglévő lámpamodul cikkszáma alapján egy munkanapon belül visszaigazolunk.`,
  },
  {
    slug: "projektor-izzo-elettartam-meghosszabbitas",
    title: "Projektor izzó élettartamának meghosszabbítása — 7 üzemeltetési gyakorlat",
    excerpt:
      "Hét konkrét üzemeltetési gyakorlat, amellyel egy közepes fényerejű üzleti vagy oktatási projektor lámpamoduljának élettartama 30–60%-kal hosszabbítható meg. ECO mód, hűtési ciklus, szűrőtisztítás, áramellátás, telepítési geometria.",
    description:
      "Hogyan hosszabbítható meg egy projektor izzó élettartama? Hét intézményi és vállalati üzemeltetési gyakorlat — ECO mód, helyes ki- és bekapcsolás, szűrőkarbantartás, áramellátás, telepítési geometria és üzemórastatisztika.",
    publishedAt: "2024-12-03",
    readingMinutes: 7,
    body: `A gyártó által megadott névleges lámpaélettartam (jellemzően 2 000–6 000 üzemóra) egy ideális, gondosan üzemeltetett vetítőre vonatkozik. A gyakorlatban az élettartam felső sávjának elérése — és sok esetben a túlteljesítése — szabad szemmel is jól látható döntéseken múlik. Az alábbi hét gyakorlat egy közepes fényerejű, üzleti vagy oktatási projektor moduljának élettartamát együttesen jellemzően 30–60%-kal hosszabbítja meg.

## 1. ECO / SmartEco / Lamp Save üzemmód

A legtöbb modern projektor kínál fényerő-csökkentett (ECO, SmartEco, Lamp Save, Eco Plus) üzemmódot, amely a lámpa elektromos terhelését 20–30%-kal csökkenti. A gyakorlatban a fényerő csak közepesen sötétített előadótermi vagy oktatási környezetben válik észrevehetően gyengébbé — cserébe a névleges élettartam 5 000 óráról 8 000–10 000 órára nőhet. Tipikus szabály: ha a vetítés alatt a vászon képe szabad szemmel kényelmesen olvasható, és a fal- vagy mennyezeti megvilágítás csillapítható, akkor érdemes az ECO módot alapértelmezetté tenni.

## 2. Helyes ki- és bekapcsolási ciklus

A nagy nyomású higanyizzók legnagyobb mechanikai megterhelése a felfutási (warm-up) és a lehűlési (cool-down) szakaszban éri őket. A lehűlési ciklust **soha ne szakítsa meg** — ne húzza ki azonnal a tápkábelt, és ne kapcsoljon le egy fali kapcsolóval, amíg a ventilátor le nem áll. Egy átlagos vetítőnél ez 1–3 perc; ennek megsértése a tipikus okok közé tartozik a lámpa idő előtti meghibásodásánál.

Másodszor: kerülje a rövid, ismétlődő be-kikapcsolásokat. Ha a vetítő egy órán belül újra használatba kerül, hagyja bekapcsolt állapotban (sötétített képpel vagy kihúzott jelforrással) — ez összességében kíméletesebb a fényforrásnak, mint több ciklus.

## 3. Levegőszűrő és hűtőborda rendszeres tisztítása

Az izzó működési hőmérséklete az élettartam egyik legfontosabb tényezője. Egy eltömődött levegőszűrő vagy poros hűtőborda 10–30 °C-os hőmérséklet-emelkedést is okozhat, ami az élettartamot 30–50%-kal megrövidíti. Intézményi környezetben — különösen tantermi, ipari vagy raktári telepítésnél — érdemes **3 havonta tisztítani a szűrőt**, és évente egyszer porszívóval vagy sűrített levegővel átfújni a belső hűtőbordákat is.

## 4. Stabil áramellátás és túlfeszültség-védelem

A higanyizzó és a hozzá tartozó ballaszt érzékeny a hálózati feszültség-ingadozásra. Egy 5–10%-os feszültségcsúcs vagy -ingadozás a ballasztot, és közvetve az izzót is károsíthatja. **Túlfeszültség-védett elosztó** vagy intézményi környezetben szünetmentes tápegység (UPS) használata egyaránt csökkenti a hirtelen izzó-meghibásodás kockázatát.

## 5. Helyes telepítési geometria és szellőzési távolság

A vetítő dőlésszöge, a fal- vagy mennyezeti rögzítés, valamint a környező szellőzési tér mind hatással van a fényforrás hűtésére. Tartsa meg a gyártó által előírt **legalább 30–50 cm** szabad teret a hűtőnyílások körül, és kerülje a vetítő közvetlen napsugárzásnak vagy fűtőtestnek való kitételét. A mennyezeti rögzítésnél figyeljen a megfelelő, „mennyezeti telepítés\" üzemmód beállítására a vetítő menüjében — ez a beállítás nemcsak a kép tükrözését, hanem a belső hűtési algoritmust is befolyásolja.

## 6. Üzemóra-statisztika és proaktív csere

A vetítők többsége nyilvántartja a teljes és az ECO-üzemmódban töltött üzemórát; ezt a Service menüben vagy a karbantartási információk között lehet leolvasni. **Vezessen egyszerű, intézményi szintű üzemóra-nyilvántartást** a vetítőkről (egy táblázat is elegendő), és tervezze meg a lámpacserét a névleges élettartam elérése **előtt** (jellemzően 80%-ra). A proaktív csere a karbantartási ablakhoz időzíthető, így nincs hirtelen üzemzavar egy oktatási vagy tárgyalótermi környezetben.

## 7. Eredeti gyári izzós modul használata

A leghosszabb élettartam előfeltétele a megfelelő minőségű fényforrás. A piacon elérhető **kompatibilis, nem gyári márkájú izzók** névleges élettartama a gyári érték töredéke; az „olcsóbb csere\" így rendre rövidebb élettartamot, magasabb meghibásodási rátát és gyakran a vetítő ballasztjának és optikájának károsodását is jelenti. Az általunk szállított eredeti diszkont lámpamodul kizárólag eredeti gyári izzót (Philips UHP, Osram P-VIP, Ushio NSH, Phoenix SHP) tartalmaz, méretpontos utángyártott keretben — így a fenti hat gyakorlat együttes eredménye is realizálható.

## Mennyit lehet ezekkel megtakarítani?

Egy átlagos, közepes fényerejű üzleti vetítő (~5 000 óra névleges élettartam) lámpamoduljának ára — kivitelfüggően — a vetítő új beszerzési árának 8–25%-a. A fenti hét gyakorlat együttes betartásával a tipikus élettartam 5 000 óráról 7 000–8 000 órára nőhet — ami egy heti 30 üzemóra körüli oktatási környezetben **másfél–két évnyi plusz használatot** jelent egy modulra vetítve. Egy 10 vetítős intézményi parknál ez évente egy-két elmaradt lámpacserének felel meg.

Tételes ajánlatkérést a projektor pontos típusszáma alapján egy munkanapon belül visszaigazolunk.`,
  },
  {
    slug: "projektor-izzo-elettartam-orak",
    title: "Projektor izzó élettartam — hány órát világít, és mitől függ?",
    excerpt:
      "A gyártói névleges üzemóraszám tartalmi értelmezése, a Normal és ECO módok közötti különbség, a fényerő-csökkenés görbéje, valamint az üzemóra-leolvasás módja a gyakoribb projektor-márkáknál.",
    description:
      "Projektor izzó élettartam: a Normal és ECO mód közötti tipikus 2 000–6 000 üzemórás sáv értelmezése, a fényerő-csökkenés görbéje, az üzemóra-leolvasás és a tervezett csere optimális időzítése.",
    publishedAt: "2025-01-21",
    readingMinutes: 8,
    body: `A „mennyi ideig világít egy projektor izzó?" kérdés a tervezett karbantartás és az intézményi eszközköltség-tervezés egyik legfontosabb belépőpontja. A válasz pontos megadása csak három, egymástól függő paraméter ismeretében lehetséges: az üzemmód (Normal / ECO / dinamikus), a fényerő-csökkenés görbéje, és az üzemórák tényleges leolvasási módja a vetítő szervizmenüjében.

## A gyártói névleges óraszám tartalmi értelmezése

A gyártói specifikációkban megadott élettartam (jellemzően 2 000 és 6 000 üzemóra között) az izzó **fele-élettartamát** jelöli — azt az időpontot, amikor a fényforrások 50%-a még legalább a névleges fényerő 50%-át adja. Ez nem azonos sem a meghibásodás biztos időpontjával, sem a vetítő használhatatlanságával. A gyakorlatban a fényforrás:

- a teljes élettartam első 25%-ában a névleges fényerő 90–100%-át adja,
- a 25–60% közötti sávban 75–90%-át,
- a 60–90% közötti sávban 60–75%-át,
- a 90%-on túli sávban már 40–60%-át — ez a tartomány az, ahol a tartalom egy átlagos előadótermi környezetben **észrevehetően halványul**.

Intézményi környezetben a tervezett csere optimális időpontja a névleges élettartam 80%-ánál van: a fényerő ekkor még elfogadható, de a meghibásodási kockázat már fokozatosan emelkedik, és a beszerzés kényelmesen időzíthető egy szervezeti szünetre.

## Normal és ECO mód közötti tipikus különbség

A legtöbb modern vetítő (Epson, BenQ, NEC, Sony, Optoma, Hitachi, Panasonic) többféle lámpa-üzemmódot kínál:

- **Normal (Standard / Bright):** a gyártói névleges fényerő 100%-a; a lámpa a teljes elektromos terhelést kapja, a névleges élettartam tipikusan 2 000–4 000 üzemóra.
- **ECO (Eco / Eco Plus / Lamp Save):** a lámpa-teljesítmény 20–30%-kal alacsonyabb; a fényerő ezzel arányosan csökken, az élettartam viszont **40–80%-kal nő** — jellemzően 4 000–8 000 üzemórára.
- **SmartEco / Dynamic / Auto Iris (gyártó-függő):** képtartalom-vezérelt, dinamikus üzemmód; sötét jeleneteknél a fényerőt csökkenti, ami a vegyes tartalom (film, prezentáció videós elemekkel) esetén a Normal és az ECO közötti élettartamot eredményez.

Egy sötétített vagy közepesen sötétített előadótermi, oktatási környezetben az ECO mód szabad szemmel kompromisszum nélkül használható — a vetítő ekkor a gyártó által megadott élettartam felső sávját teljesíti.

## Hogyan olvasható le az aktuális üzemóra?

A vetítő szervizmenüje minden modellnél tartalmazza a lámpa aktuális üzemóra-számlálóját, jellemzően az alábbi útvonalakon:

- **Epson:** Menu → Information → Lamp Hours
- **BenQ:** Menu → System Setup → Lamp Settings → Lamp Hours Info
- **NEC:** Menu → Information → Usage Time → Lamp Life Remaining
- **Sony:** Menu → Setup → Lamp Timer
- **Optoma:** Menu → Settings → Lamp Settings → Lamp Hour Used
- **Hitachi:** Menu → Option → Service → Lamp Time
- **Panasonic:** Menu → Status → Lamp

Intézményi parknál (több vetítő, több helyiség) érdemes a vetítőnként mért üzemóra-állást **kvartális rendszerességgel** táblázatban vezetni — ez a megelőző karbantartás egyetlen alapja, és a kvartális ellenőrzés mellett a hirtelen meghibásodás esélye nullához közelít.

## A lámpaszámláló nullázása csere után

A modulcsere után a vetítő üzemóra-számlálóját **kötelező nullázni**, ellenkező esetben a következő bekapcsoláskor a vetítő hamis figyelmeztetést jelenít meg, és bizonyos modelleknél (különösen Epson, NEC, egyes Sharp Notevision készülékek) a lámpa-üzemórán túl bekapcsolás-tiltás is életbe lép. A nullázás menüpontja a fenti útvonalak alatt, „Reset Lamp Hours" vagy „Lamp Counter Reset" néven található; a modulcsere mellé minden megrendeléshez típusra szabott magyar nyelvű útmutatót mellékelünk.

## Tervezett csere és tartalék modul

A névleges élettartam végén bekövetkező meghibásodás tipikusan néhány héttel előrejelezhető — a fényerő-csökkenés, a színhőmérséklet eltolódása és a megnövekedett ventilátorzaj együttesen jelzi, hogy a csere a következő hetekben időszerű. A meghibásodás formáit és a tervezett csere intézményi környezetében alkalmazható jó gyakorlatot a [„Mikor érdemes lámpamodult cserélni"](/blog/elhasznalodott-projektor-izzo-jelei) bejegyzésünk részletezi.

Tételes árajánlatot — a projektor pontos típusszáma vagy a lámpamodul cikkszáma alapján — egy munkanapon belül visszaigazolunk.`,
  },
  {
    slug: "uhp-izzo-mit-jelent",
    title: "UHP izzó — mit jelent, és miben különbözik az UHE, NSH és P-VIP fényforrásoktól?",
    excerpt:
      "A Philips Ultra High Performance (UHP) technológia gyakorlati jelentősége, és a vele versengő Philips UHE, Ushio NSH és Osram P-VIP rövid ívű kisülőlámpák közötti tényleges műszaki különbségek.",
    description:
      "Mit jelent az UHP izzó: a Philips Ultra High Performance lámpa működése, élettartama, színhőmérséklete, valamint összehasonlítása az UHE, NSH és P-VIP technológiákkal.",
    publishedAt: "2025-03-11",
    readingMinutes: 8,
    body: `Az „UHP izzó" kifejezést a hazai projektorpiacon gyakran szinonimaként használják minden nagy nyomású gázkisülésű fényforrásra — pedig az UHP egy konkrét, Philips által szabadalmaztatott technológia, és a piacon jelen lévő rendszerek (UHE, NSH, P-VIP) jól elkülöníthető műszaki tulajdonságokkal bírnak.

## Mit jelent az UHP a betűszó szerint

Az **UHP** a Philips **Ultra High Performance** technológiájának rövidítése: nagy nyomású higanygőz-kisülésű, rövid ívű lámpacsalád, amelyet a Philips az 1990-es évek közepén fejlesztett ki kifejezetten digitális projektorok számára. A technológia kulcseleme a **halogén-ciklus**: a kvarcburkában elhelyezett adalék (bróm vagy klór) a wolfram-elektródáról elpárolgó anyagot visszaköti az elektródára, így az ív geometriája és a fényspektrum a teljes élettartam alatt stabil marad.

Ez a tulajdonság az UHP-izzókat különösen alkalmassá teszi prémium üzleti, oktatási és installációs vetítőkbe — a Philips technológiát licencben használja az Epson, NEC, Sony, Christie és számos más gyártó.

## Az UHE technológia — a Philips „könnyített" rokona

Az **UHE** (**Ultra High Efficiency**) ugyancsak Philips fejlesztés, az UHP közelben mozgó, ám az ár- és élettartam-egyensúlyt máshova helyező változata. Tipikus jellemzői:

- alacsonyabb üzemi nyomás (kb. 150–180 bar, szemben az UHP 200+ bar-jával),
- némileg rövidebb ívhossz, ami a kisebb, kompakt vetítőkbe (3 000 lumen alatti tárgyalói és otthoni modellek) jól illeszkedik,
- a névleges élettartam 3 000–5 000 üzemóra (UHP-nél 4 000–6 000),
- alacsonyabb gyártási költség, ami a végfelhasználói modulárakban is megjelenik.

Az UHE elsősorban az Epson EB-S, EB-X, EB-W belépő-szériájában, illetve a BenQ MS, MW kategóriás projektorokban gyakori.

## Az Osram P-VIP — a versenytárs ipari szabványa

Az **Osram P-VIP** (**Premium Video Projection**) az UHP közvetlen versenytársa, ugyanazon a rövid ívű higanygőz-elven, eltérő reflektor-geometriával és némileg más adalékkémiával. A P-VIP tipikusan:

- enyhén hidegebb (kb. 8 000–8 500 K) színhőmérsékletet ad, ami videós tartalomnál előnyös,
- a névleges élettartam 3 500–5 500 üzemóra,
- a Philips UHP-vel keresztkompatibilisen használt a BenQ, Optoma, Acer és Hitachi készülékekben.

A gyakorlatban a két technológia között a végfelhasználó számára nem érzékelhető műszaki különbség van — mindkettő prémium kategóriás fényforrásnak számít.

## Az Ushio NSH és Phoenix SHP technológia

Az **Ushio NSH** (**New Super High Pressure**) japán fejlesztésű, elsősorban a NEC, Sony és Sanyo készülékekbe szállított rövid ívű higanyizzó. Jellemzői az UHP-hez és P-VIP-hez közel állnak, üzemi élettartama jellemzően 3 000–5 000 üzemóra, színhőmérséklete kb. 7 500 K. A **Phoenix SHP** (**Super High Pressure**) hasonló paraméterekkel, némileg alacsonyabb prémium-szegmensben (Sharp, egyes Hitachi és Mitsubishi modellek) jelen lévő technológia.

## A „kompatibilis" izzó — amit kerülni kell

A piacon elérhetők úgynevezett **kompatibilis (generic) izzóval** szerelt modulok is, amelyek a fenti négy márka tipográfiáját másoló címkével kerülnek forgalomba, valójában azonban ellenőrizetlen ázsiai üzemekben gyártott, gyári származási bizonylat nélküli fényforrásokat tartalmaznak. Fényerejük tipikusan 20–40%-kal alacsonyabb, élettartamuk a gyári érték töredéke, és a magasabb hőtermelés a vetítő ballasztját és optikáját is károsíthatja. Az eredeti gyári izzó és a kompatibilis kivitel közötti különbség a [„Mennyibe kerül egy projektor izzó cseréje"](/blog/mennyibe-kerul-projektor-izzo-csere) bejegyzésben részletesen kifejtve.

## Melyiket szállítjuk

Az általunk forgalmazott **eredeti diszkont lámpamodul** kivitel kizárólag eredeti gyári izzót — Philips UHP, Philips UHE, Osram P-VIP, Ushio NSH vagy Phoenix SHP — tartalmaz, méretpontos utángyártott modulházba szerelve. A keret és a tükörgeometria azonos a gyári OEM kivitellel, így a fényerő, a színhőmérséklet, az élettartam és a hűtés is változatlan a teljes gyári cseremodullal összevetve. Erre a kivitelre 6 hónap, legfeljebb 500 üzemóra jótállást vállalunk.

A márka- és modellspecifikus információkat — Epson, BenQ, NEC, Sony, Optoma, Hitachi, Panasonic és további márkák lámpamodul-választékát — a [márkaoldalainkon](/markak) találja. Tételes árajánlatot a projektor pontos típusszáma alapján egy munkanapon belül visszaigazolunk.`,
  },
  {
    slug: "projektor-karbantartas-iskolaban",
    title: "Projektor karbantartás iskolában — éves szervizterv és üzemóra-nyilvántartás",
    excerpt:
      "Intézményi karbantartási útmutató oktatási környezetbe: a légszűrő tisztítási ciklusa, a lámpa üzemóra-nyilvántartás vezetése, a tartalék modul készleten tartása, és a tanévhez igazított szervizablakok megtervezése.",
    description:
      "Projektor karbantartás iskolában: éves szervizterv, légszűrő-tisztítási ciklus, üzemóra-napló vezetése, tartalék lámpamodul készletezés, és a tanévhez igazított megelőző karbantartási ablakok.",
    publishedAt: "2025-04-29",
    readingMinutes: 9,
    body: `Egy iskola, gimnázium vagy egyetem projektorparkjának üzemképességét egyetlen tényező határozza meg igazán: van-e megírt, naptárhoz rendelt karbantartási terv. Az alábbi keret egy átlagos, 8–30 vetítős oktatási intézményre szabva mutatja be a kvartális szervizmunkát, a vezetendő nyilvántartást és a tartalék-készletezés szempontjait. A keretrendszer hangsúlya a **megelőzésen**, nem a meghibásodás utáni reakción van — ez a leglátványosabb különbség a tervezett és a sürgősségi karbantartás összköltsége között.

## Negyedéves karbantartási alapcsomag

Egy átlagos tantermi vetítő — heti 25–35 üzemórával — negyedévente egyszer érdemli meg az alábbi 4–6 lépéses ellenőrzést. Egy gyakorlott karbantartónak vetítőnként 8–12 perc:

1. **Légszűrő tisztítása vagy cseréje.** A szűrőszövet sűrített levegővel átfújva, illetve langyos vízben kimosva (cserélhető típusoknál cserélve). Ez az egyetlen olyan művelet, amelynek elmulasztása önmagában 30–50%-kal megrövidítheti a lámpa élettartamát.
2. **Hűtőborda és ventilátorrács portalanítása.** Kikapcsolt, lehűlt vetítőn, sűrített levegővel kifújva. Mennyezeti telepítésnél a vetítő felett és körül összegyűlt port is érdemes letörölni.
3. **Lámpa üzemóra-leolvasás.** A vetítő szervizmenüjében — pontos útvonalak az [üzemóra-leolvasásról szóló cikkben](/blog/projektor-izzo-elettartam-orak). Az érték rögzítése a karbantartási naplóban.
4. **Fényerő- és színhűség-ellenőrzés.** Fehér háttérképpel összevetve egy referencia-vetítővel; észrevehető halványulás vagy színhőmérséklet-eltolódás esetén a következő szervizablakra tervezett cserét előrébb hozni.
5. **Mechanikai ellenőrzés.** Csatlakozók (HDMI, VGA, hálózat), tápkábel, mennyezeti rögzítés, kábelvezetés.
6. **Távirányító elemcsere évente.** Egyszerű, gyakran elfelejtett tétel — egy nem működő távirányító egy tanórán belül használhatatlanná teszi az egyébként hibátlan vetítőt.

## Üzemóra-nyilvántartás vezetése

Az intézményi karbantartás gerincét egy egyszerű, vetítőnként karbantartott táblázat adja, amelyet érdemes a karbantartó munkatárs és az IT-felelős közösen vezetni. A táblázat oszlopai:

- **Helyiség-azonosító** (terem szám)
- **Vetítő márka és típus** (pl. Epson EB-535W)
- **Lámpamodul cikkszáma** (pl. ELPLP78)
- **Üzembe helyezés dátuma**
- **Aktuális üzemóra** (Normal mód)
- **Aktuális üzemóra** (ECO mód, ahol releváns)
- **Névleges élettartam** és a fennmaradó óraszám
- **Legutóbbi szűrő-tisztítás dátuma**
- **Tervezett következő szervizablak**
- **Megjegyzés** (rendellenesség, távirányító csere, optikai tisztítás)

A naplót kvartális rendszerességgel frissítve a karbantartási vezető bármikor 30 másodperc alatt választ tud adni a két leggyakoribb intézményi kérdésre: **melyik vetítő hibásodhat meg a következő félévben**, és **mennyi tartalék lámpamodult kell készleten tartani**.

## Tartalék lámpamodul készletezés

Egy 10–20 vetítős intézményi parknál a tartalék készletezés ökölszabálya: minden olyan vetítőhöz, amely a névleges élettartam 70%-a fölött jár, legyen polcon legalább egy darab pótlámpamodul. Ez tipikusan 2–4 modul készleten tartását jelenti egy átlagos középiskolában. A modul polcélettartama gyártatlan állapotban 3–5 év, így a befektetés a vetítő hátralévő élettartamára teljes mértékben kihasználható.

A tartalék készletezés a tényleges állásidőt nullához közelíti: egy hibajegy érkezésétől számított 30–60 percen belül a karbantartó kicseréli a modult, és a következő tanóra már a megfelelő vetítővel kezdődhet. A tartaléknélküli alternatíva — egyedi sürgős beszerzés — a megrendelési és szállítási idő miatt jellemzően 2–10 munkanapos kiesést jelent egy teremben.

## A tanévhez igazított szervizablakok

Az oktatási év természetes karbantartási pontjai: az **őszi szünet** (negyedéves alapcsomag és üzemóra-leolvasás), a **téli szünet** (lámpacserék többsége, mert ez a leghosszabb ablak), a **tavaszi szünet** (második negyedéves alapcsomag és üzemóra-leolvasás), és a **nyári szünet** (teljes átvizsgálás, optikai tisztítás, mennyezeti rögzítések ellenőrzése, listán lévő készülékek tervezett selejtezése).

Ez a négy ablak elegendő a tantermi vetítők megelőző karbantartására; a két nagyobb szünet (téli, nyári) ad teret a tényleges lámpacseréknek, így az aktív tanítási időszakban hirtelen állásidő a gyakorlatban nem fordul elő.

## Központi beszerzés és számlázás

Az általunk szállított lámpamodulokat tételes áfás számlával állítjuk ki, az intézmény költségkeretéből tárgyi eszközként és karbantartási költségként egyaránt elszámolható. A fizetés minden ügyfél számára egységesen a Számlázz.hu rendszerből kiállított díjbekérő banki átutalással történő teljesítéséhez kötött; visszatérő és nagyobb tételes megrendelésekre mennyiségi kedvezményt biztosítunk. A teljes oktatási szegmensre vonatkozó beszerzési feltételeket és a tipikus tantermi vetítők lámpamoduljait az [/oktatas](/oktatas) oldalon foglaltuk össze.

Tételes árajánlatot — egy vagy több vetítőre — egy munkanapon belül visszaigazolunk.`,
  },
  {
    slug: "xenon-vs-uhp-mozi-vetito",
    title: "Xenon vs UHP — miben különbözik a mozi-projektor fényforrása az üzleti vetítőkétől?",
    excerpt:
      "Műszaki ismeretterjesztő összehasonlítás a digitális mozi- és rendezvénytechnikai Xenon-kisülőlámpák, valamint az üzleti és oktatási projektorokban használt UHP, UHE, NSH és P-VIP higanygőz-izzók között. Digital cinema Xenon-csöveket jelenleg nem kínálunk.",
    description:
      "Xenon vs UHP projektor izzó: a mozi- és rendezvény-projektorok Xenon-kisülőlámpái és az üzleti vetítők UHP higanygőz-izzói közötti műszaki és üzemeltetési különbségek. Tájékoztató jellegű ismertető; digital cinema Xenon-csöveket jelenleg nem kínálunk.",
    publishedAt: "2025-06-17",
    readingMinutes: 8,
    body: `A „projektor izzó" gyűjtőfogalom alá két, egymástól műszakilag jól elkülöníthető fényforrás-család tartozik. Az üzleti, oktatási és otthoni projektorok túlnyomó többsége **nagy nyomású higanygőz-kisülésű** (UHP, UHE, NSH, P-VIP) izzót használ, míg a digitális mozi- és nagytermi rendezvény-projektorok jelentős részében **rövid ívű Xenon-kisülőlámpa** dolgozik. Ez a bejegyzés a két technológia közötti különbségek tájékoztató jellegű áttekintését adja.

> **Hatókör.** A projektorlampacsere.hu kínálata kizárólag UHP, UHE, NSH és P-VIP higanygőz-kisülésű lámpamodulokra terjed ki. Digital cinema Xenon-csöveket (Christie CDXL, Barco DXL, NEC NC-szériás Xenon, Ushio DXL/UXL stb.) **jelenleg nem kínálunk.** A lent leírtak ismeretterjesztő tartalmak, nem termékajánlat.

## A higanygőz-kisülésű (UHP / UHE / NSH / P-VIP) technológia

Az üzleti és oktatási projektorokba kerülő fényforrások mind ugyanazon az elven működnek: a kvarcburkában higany és nemesgáz keverékét egy nagyfeszültségű impulzus ionizálja, majd a két wolfram-elektróda között, mindössze 1,0–1,3 mm hosszú ívben folytatódik a kisülés. Az üzemi teljesítmény tipikusan 150–400 W között mozog, a névleges élettartam 2 000–6 000 üzemóra.

A technológia részletes összehasonlítása — Philips UHP, Philips UHE, Osram P-VIP, Ushio NSH, Phoenix SHP — az [„UHP izzó — mit jelent"](/blog/uhp-izzo-mit-jelent) bejegyzésünkben olvasható. Ez az a fényforrás-család, amelynek **teljes katalógusát szállítjuk** — eredeti gyári izzós, méretpontos utángyártott keretbe szerelt modulként.

## A Xenon rövid ívű kisülőlámpa

A digitális mozi-projektorok (DCI-szabvány szerinti, jellemzően 2K és 4K Christie, Barco, NEC fényforrásai) és a nagytermi rendezvény-projektorok (Christie Roadie / J-Series, Barco HDX / HDF / FLM, NEC NC-szériás digitális mozi) **Xenon-kisülőlámpát** használnak. Ez egy lényegesen eltérő, ipari osztályú fényforrás, amelynek beszerzése és kezelése külön disztribúciós csatornát igényel:

- **Munkapont:** tiszta Xenon-gáz töltéssel, 10–30 bar nyomáson, két wolfram-elektróda közötti rövid ívben.
- **Teljesítmény:** 1 kW és 12 kW között, ami nagyságrendekkel meghaladja az UHP izzók 150–400 W-os tartományát.
- **Színhőmérséklet:** kb. 6 200 K, kifejezetten közel a természetes napfényhez — ez teszi a Xenont alkalmassá DCI-szabványú mozi-vetítésre.
- **Élettartam:** 1 000–3 000 üzemóra, jelentősen rövidebb az UHP technológiánál, mert a Xenon-cső elektródái üzemközben folyamatosan kopnak.
- **Beszerzési csatorna:** a Xenon-csövek külön, ipari B2B-csatornán keresztül érhetők el, nem az általános AV-utángyártói piacon.

## Eltérő üzemeltetési követelmények

A Xenon-fényforrás üzemeltetése a hagyományos projektor-izzókhoz képest több ipari biztonsági feltételt is támaszt:

- **Robbanásveszély:** a magas töltési nyomás miatt a kihűlt Xenon-cső is jelentős belső nyomáson áll; a cseréhez gyártói előírás szerint **védőkesztyű és arcvédő** használata kötelező. A használt csöveket szabályozott módon — a vetítő szervizdokumentációja szerint — kell hatástalanítani és veszélyes hulladékként kezelni.
- **Hűtés:** a Xenon-csövek 5–20-szor több hőt termelnek, mint az UHP izzók; a vetítők ehhez aktív, jellemzően folyadékos hűtőrendszerrel készülnek, amelynek karbantartási ciklusa szigorúbb.
- **Tárolás:** a Xenon-csövek polcélettartama 1–2 év (UHP-nél 3–5 év); a tartalékot a tényleges felhasználáshoz közeli időpontra érdemes ütemezni.
- **Cserét csak kvalifikált szakember végezhet:** a vetítő-üzemeltetők többségénél ez a saját vetítéstechnikus vagy AV-integrátor szerződéses partner — szemben az UHP modulokkal, amelyek cseréje a karbantartó munkatárs számára is biztonságosan elvégezhető.

## Mikor melyik technológia

A választás a vetítési feladat (kiosztott fényerő és vetítési felület) alapján egyértelmű:

- **300 lumen-nm/m² alatt** (oktatási és tárgyalótermi vetítés, jellemzően 100–250 hüvelyk diagonális vászon, 1 500–6 500 lumen fényerő): **UHP / UHE / P-VIP / NSH** technológia. Megbízható, kedvező árú, hosszú élettartamú.
- **300–800 lumen-nm/m² között** (előadótermi, konferenciatermi, kis- és középmozi-jellegű vetítés, 6 500–15 000 lumen): **nagy teljesítményű UHP modulok** (Panasonic PT-RZ, NEC PA-széria) vagy **alacsony teljesítményű Xenon** (Christie LWU/LX, Barco F-széria) egyaránt jöhet — a választás a teljes üzemeltetési költségen (TCO) múlik.
- **800 lumen-nm/m² felett** (digitális mozi, nagyszínpadi rendezvény, planetárium, szimulátor, 15 000 lumen feletti vetítők): **Xenon** technológia, alternatíva nélkül.

## Mit szállítunk és mit nem

Az UHP, UHE, P-VIP és NSH lámpamodulok a teljes hazai katalógusunk gerincét adják — eredeti gyári izzós, méretpontos utángyártott keretbe szerelt kivitelben, 6 hónap / 500 üzemóra jótállással, tételes áfás számlával. Ez kifejezetten lefedi a Christie LX/LW/LWU/DWU/DHD/GS, Barco F-széria, Panasonic PT-RZ/RW és NEC PA installációs vetítőit is (lásd a [Christie](/markak/christie) és [Barco](/markak/barco) márkaoldalakat). A részletes árképzést a [„Mennyibe kerül egy projektor izzó cseréje"](/blog/mennyibe-kerul-projektor-izzo-csere) bejegyzés tárgyalja.

**Xenon-csöveket** — Christie Roadie / J-Series / CP, Barco HDX / HDF / FLM / XDL, NEC NC-széria, vagy bármilyen DCI-szabványú digital cinema projektor — **jelenleg nem kínálunk**. A jelen bejegyzés célja kizárólag a két technológia közötti különbségek tisztázása, hogy az érdeklődők a megfelelő irányba tájékozódhassanak.`,
  },
  {
    slug: "projektor-izzo-ar-2026-mitol-fugg",
    title: "Projektor izzó ár 2026 — mitől függ, és mit takar a tételes ajánlat?",
    excerpt:
      "Árképzési átláthatóság intézményi vásárlóknak: melyek a projektor lámpamodul árát meghatározó tényezők, és mit tartalmaz a tételes árajánlat a fényforrás-technológián túl.",
    description:
      "Projektor izzó ár 2026: az ársávokat meghatározó tényezők (technológia, modulkivitel, ballaszt-illesztés), az ajánlat tételei — szállítás, áfa, garancia — és az eredeti diszkont modul kontra OEM cseremodul közötti különbség.",
    publishedAt: "2025-08-19",
    readingMinutes: 7,
    body: `Egy projektor lámpamodul ára 2026-ban — a vetítő kategóriájától és a választott kivitelttől függően — bruttó 25 000 forint és bruttó 350 000 forint között mozog. Ez a tág sáv első ránézésre átláthatatlannak tűnik; valójában négy jól körülírható tényező határozza meg, és minden megrendelésre adott tételes ajánlatunk ezekre a tényezőkre adott választ tartalmazza.

## 1. A fényforrás technológiája és teljesítménye

Az árképzés legfontosabb tényezője a fényforrás típusa és wattszáma. A piaci ársávok 2026-ban:

- **Belépő kategória** (UHP / UHE / P-VIP 150–230 W, 2 000–3 500 lumen vetítők — Epson EB-S, EB-X, BenQ MS/MX, NEC V-széria): bruttó 25 000 – 55 000 Ft.
- **Közép kategória** (UHP / P-VIP / NSH 230–330 W, 3 500–5 000 lumen — Epson EB-19xx, NEC NP-P, BenQ MH/SH, Panasonic PT-VX): bruttó 55 000 – 130 000 Ft.
- **Felső kategória** (350 W feletti, dual lamp, installációs — Panasonic PT-DZ, NEC PA, Christie LWU, Barco F-széria): bruttó 130 000 – 350 000 Ft.

A technológiák részletes műszaki háttere az [„UHP izzó — mit jelent"](/blog/uhp-izzo-mit-jelent) bejegyzésünkben olvasható. A digital cinema Xenon-csövek külön kategóriát alkotnak (Christie Roadie / CP, Barco HDX / FLM, NEC NC-széria) — ezeket **jelenleg nem kínáljuk**; a háttérről a [„Xenon vs UHP"](/blog/xenon-vs-uhp-mozi-vetito) ismeretterjesztő bejegyzés szól.

## 2. A választott modulkivitel

Egy adott vetítőre három, egymástól markánsan eltérő árú megoldás létezik a piacon — közülük kettőt szállítunk:

- **Eredeti diszkont lámpamodul** (a mi alapkivitelünk): eredeti gyári izzó (Philips UHP, Osram P-VIP, Ushio NSH, Phoenix SHP) méretpontos, utángyártott modulházba szerelve. A teljes gyári cseremodul árának **25–55%-áért**, műszakilag azonos fényerővel és élettartammal. 6 hónap, max. 500 üzemóra jótállás.
- **Teljes gyári (OEM) cseremodul**: szerződéses márkaszerviz-jelenlét, kiterjesztett gyártói garancia vagy belső eszközszabályzat melletti igény esetén szállítjuk. Az árképzés a gyártó hivatalos hazai disztribúciós csatornájához igazodik.
- **Kompatibilis (generic) izzós modul**: ezt a kivitelt **nem forgalmazzuk**, és intézményi felhasználáshoz nem javasoljuk. A részletes indoklás a [„Mennyibe kerül egy projektor izzó cseréje"](/blog/mennyibe-kerul-projektor-izzo-csere) cikkben olvasható.

## 3. Ballaszt-illesztés és modulvariánsok

Egy adott lámpamodul-cikkszám alá több, ballaszt-feszültségben vagy csatlakozó-geometriában eltérő variáns is tartozhat — különösen a hosszabb gyártási időszakú, klasszikus márkáknál (Mitsubishi, Sanyo, Sharp, illetve a Panasonic ET-LA széria). Az ajánlat-kérés során ezért kérjük be a vetítő **teljes típusszámát** (nem csak a márka-szériát) — ez biztosítja, hogy a leszállított modul a ballasztra és a hűtéscsatorna geometriájára egyaránt illeszkedik.

## 4. Szállítás, számlázás és rejtett költségek

A tételes ajánlat a modul nettó árán túl tartalmazza:

- a kiszállítás díját (Magyarország területén belül 1–2 munkanap készletes tételnél, 6–12 munkanap egyedi beszerzésnél),
- a 27% áfát (a tételes áfás számlát az ADP-TOP Kft. neve alatt állítjuk ki),
- a jótállási feltételeket írásban,
- a típusra szabott magyar nyelvű cseretudnivalót és lámpaszámláló-nullázási útmutatót.

A fizetés minden ügyfél számára egységesen díjbekérő számla (Számlázz.hu) alapján, banki átutalással történik; visszatérő és nagyobb tételes megrendelésekre mennyiségi kedvezményt biztosítunk.

A teljes intézményi beszerzési és számlázási feltételeket az [/oktatas](/oktatas) oldalon foglaltuk össze.

## Mit nem tartalmaz az ajánlat

Két, gyakran feltételezett tételt a tételes árajánlat **nem** tartalmaz, mert ezeket az intézményi vásárló oldaláról rendre saját szerződéses kerete bonyolítja:

- a vetítő helyszíni szerelését (a modulcsere magyar nyelvű útmutató alapján a karbantartó munkatárs számára biztonságosan elvégezhető),
- a használt higanytartalmú lámpamodul veszélyes hulladékként történő átvételét (ezt a meglévő veszélyeshulladék-szerződés keretében javasolt rendezni).

## Tételes ajánlatkérés

A pontos árhoz egy adatra van szükségünk: a projektor **teljes típusszámára** (pl. Epson EB-535W, BenQ MS524H, NEC V302H, Panasonic PT-VX610). Az ezen az alapon adott tételes ajánlatot egy munkanapon belül visszaigazoljuk; az ajánlat 30 napig érvényes, a benne foglalt szállítási idő és bruttó ár fix.`,
  },
  {
    slug: "projektor-legszuro-cseretudnivalo",
    title: "Projektor légszűrő — mikor és miért cseréljük?",
    excerpt:
      "A légszűrő telítettsége az egyik leggyakoribb, mégis legritkábban ellenőrzött ok a lámpamodul idő előtti meghibásodása mögött. Mikor kötelező a csere, és mit jelez a vetítő figyelmeztetése.",
    description:
      "Projektor légszűrő csere: a karbantartási ciklusok (500–1 000 üzemóra), a telített szűrő tünetei, és miért hosszabbítja meg a rendszeres szűrőcsere a lámpamodul élettartamát.",
    publishedAt: "2025-10-14",
    readingMinutes: 5,
    body: `A projektorok lámpamoduljának élettartamát a legtöbb intézményi felhasználó a használati módon (Normal vs ECO) és a be-/kikapcsolási fegyelmen mérlegeli. A harmadik — és a gyakorlatban legalább annyira meghatározó — tényező a **légszűrő állapota**: ha a hűtőlevegő útjába épített szűrőbetét eltömődik, a vetítő belső hőmérséklete megemelkedik, és a kisülőlámpa élettartama 30–50%-kal is csökkenhet.

## A gyári csere időintervallum

A legtöbb installációs vetítő gyári előírása **500–1 000 üzemóra**, illetve évi egy alkalom — amelyik előbb bekövetkezik. Poros környezetben (műhelyterem, szakképző, ipari előadóterem, raktárcsarnok) ez az időköz felére csökken. A vetítő legtöbb modellnél figyelmeztet a kijelzőn, amint a szűrő-üzemóraszámláló elérte a gyári küszöböt — ez a riasztás a karbantartó számára az időben ütemezett szűrőcsere bevett triggere.

## A telített szűrő tipikus tünetei

- A vetítő hangosabb ventilátorzajjal üzemel (a hűtésvezérlés felpörgeti a ventilátorokat).
- A kép automatikusan halványul, vagy a vetítő rendszeres időközönként ECO módba vált.
- A készülék 30–60 perc üzem után termikus védelmi okból kikapcsol.
- A lámpamodul a névleges élettartam 50–70%-ánál idő előtt meghibásodik.

## Miért érdemes ütemezett karbantartásként végezni

Egy kiesett, oktatási környezetben működő vetítő egy munkanapnyi állásideje (előadás kimaradása, helyettesítő terem, AV-átszervezés) gyakran meghaladja egy szűrő + egy lámpamodul együttes árát. A negyedéves vagy féléves szűrőellenőrzés ezért nem opcionális karbantartási tétel, hanem a teljes vetítőpark üzemeltetési költségét közvetlenül csökkentő intézkedés.

A szállítható szűrőtípusok és a megrendelés menete a [/szolgaltatas/projektor-szuro-csere](/szolgaltatas/projektor-szuro-csere) oldalon olvasható.`,
  },
  {
    slug: "dmd-chip-csere-mikor-szukseges",
    title: "DMD chip csere — mikor érdemes a teljes vetítő cseréje helyett?",
    excerpt:
      "A DLP projektorokon megjelenő sárga vagy zöld foltot a kép sarkában szinte minden esetben a DMD-chip meghibásodása okozza. A chipcsere a vetítő életét akár 4–6 évvel meghosszabbíthatja — töredéknyi költséggel.",
    description:
      "DMD chip csere DLP projektorokban: a foltos kép és színhibák diagnózisa, a chip cseréjének költsége az új vetítőhöz képest, és a tipikus érintett modellek (BenQ, NEC, Optoma, Panasonic).",
    publishedAt: "2025-12-09",
    readingMinutes: 6,
    body: `A DLP technológiával működő projektorok kulcsalkatrésze a **DMD-chip** (Digital Micromirror Device): egy néhány millió, egyenként vezérelt mikrotükröt tartalmazó félvezető, amely a fénymotorból érkező fényt a vászon irányába tükrözi. A chip élettartama hosszabb a kisülőlámpánál, de néhány tipikus tünet egyértelműen jelzi, ha a DMD meghibásodott — és ilyenkor a lámpamodul cseréje önmagában már nem oldja meg a problémát.

## Tipikus tünetek

- **Sárga vagy zöld folt a kép egyik sarkában vagy szélén** (jellemzően nagyobb, mint egy néhány mm-es pont, és nem mozog a tartalommal).
- **Hiányzó vagy hibás pixelek** csoportja, amely ugyanazon a képkoordinátán marad bemenettől függetlenül.
- A teljes kép **felbontás-eltolódása** vagy duplázódása (DLP-illesztőelektronika hibája).
- Erőteljes **kontraszt- és színveszteség**, amelyet lámpamodul-csere nem korrigál.

## Mikor gazdaságos a chipcsere

A DMD-chipcsere költsége modellfüggő, de a piaci tartomány jellemzően egy új, hasonló kategóriás vetítő árának **25–45%-a** — szemben a teljes készülék cseréjével, amely az intézmény oldalán selejtezési, leltár- és AV-újratelepítési költséggel is jár. Egy 4–6 éves, egyébként jó állapotú installációs vetítő (BenQ MH, NEC P-széria, Optoma EH, Panasonic PT-DZ) chipcseréje a készülék életét további 4–6 évvel meghosszabbítja.

## Mit kérünk az ajánlatkéréskor

- A vetítő teljes típusszámát és gyári sorszámát.
- A folt vagy a kép tüneteinek 1–2 fotóját (egy fehér és egy szürke háttérről).
- A vetítő üzemóra-állapotát (lámpaszámláló és — ha kiolvasható — összóraszám).

Az ezen az alapon készített tételes ajánlatot egy munkanapon belül visszaigazoljuk. A részletes szolgáltatási leírás és a tipikus érintett modellek a [/szolgaltatas/dmd-chip-csere](/szolgaltatas/dmd-chip-csere) oldalon olvashatók.`,
  },
  {
    slug: "hbo-mikroszkop-lampa-laboratoriumi",
    title: "HBO mikroszkóp lámpa — fluoreszcens mikroszkópok lámpacseréje laboratóriumi környezetben",
    excerpt:
      "A Nikon Intensilight és az Olympus U-HGLGPS típusú higany-xenon (HBO) lámpaegységek a hazai egyetemi és kórházi laboratóriumi mikroszkópok meghatározó fényforrásai. A cserekiépítés és az élettartam-gazdálkodás alapjai.",
    description:
      "HBO higany-xenon mikroszkóp lámpa csere: Nikon Intensilight C-HGFI / C-HGFIE, Olympus U-HGLGPS / SHI-130OL és kompatibilis SHI-130N1 cserekészlet laboratóriumi és klinikai mikroszkópokhoz.",
    publishedAt: "2026-02-17",
    readingMinutes: 6,
    body: `A fluoreszcens mikroszkópia hazai egyetemi és kórházi laboratóriumi gyakorlatában máig domináns gerjesztőfényforrás a **nagy nyomású higany-xenon (HBO) ívlámpa**, amely a 365–550 nm közötti tartományban biztosít magas spektrális intenzitást a DAPI, FITC, TRITC és más színezékek gerjesztéséhez. A Nikon és az Olympus zárt fényegységei — Nikon Intensilight C-HGFI / C-HGFIE, Olympus U-HGLGPS — a tipikus 100 W-os HBO csövet egy precentered modulban tartják, így a cserekor nincs szükség mechanikai központosításra.

## Tipikus élettartam és cseretudnivaló

A 100 W-os HBO ívlámpa névleges élettartama jellemzően **2 000 üzemóra** — a 200 W-os változatoké 400–500 óra. A laboratóriumi gyakorlatban az élettartam-számláló alapján ütemezett csere mindig gazdaságosabb, mint a felfutási hiba utáni reakció: az elhasznált cső intenzitása fokozatosan csökken (a felénél már 50% alatt), ami a fluoreszcens kép kvantitatív kiértékelhetőségét veszélyezteti.

## Általunk szállított típusok

- **Nikon Intensilight C-HGFI / C-HGFIE precentered cserekészlet** (gyári fényegység és kompatibilis SHI-130N1 csere-modul).
- **Olympus U-HGLGPS / SHI-130OL precentered cserekészlet** (kompatibilis 130 W-os modul).
- 100 W és 200 W HBO csere-csövek a hagyományos, manuálisan beigazítható lámpaházakhoz.

## Cserekor figyelembe veendő biztonsági szempontok

- A HBO csövet **kihűlt állapotban**, védőkesztyűben és arcvédőben cseréljük (a kvarcburkon az ujjlenyomat zsírja a felfűtés során foltot éget).
- A lámpaházat üzembe helyezés előtt teljesen vissza kell zárni — a HBO lámpa erős UV-kibocsátása zárt fényegység mellett nem szabadul ki.
- A használt lámpát higanytartalma miatt veszélyes hulladékként kell kezelni.

A teljes szolgáltatási leírás és a megrendelés menete a [/laboratoriumi-mikroszkop-lampa](/laboratoriumi-mikroszkop-lampa) oldalon olvasható.`,
  },
  {
    slug: "msd-szinpadi-lampa-discharge",
    title: "MSD discharge színpadi lámpa — moving head fényforrás-csere a gyakorlatban",
    excerpt:
      "A Philips MSD Platinum-széria a hazai színpadi, klubvilágítási és televíziós moving head fejek meghatározó fényforrása. Az élettartam-tervezés és a típusválasztás alapjai.",
    description:
      "MSD Platinum színpadi discharge lámpa: a Philips MSD Platinum 14R és kapcsolódó moving head fényforrások élettartama, cseretudnivalója és intézményi beszerzési feltételei.",
    publishedAt: "2026-04-21",
    readingMinutes: 5,
    body: `A színpadi és klubvilágítási moving head fejek többsége — a hazai professzionális rendezvénytechnikai és színházi parkban — **rövid ívű, fémhalogenid (discharge) izzót** használ. A piaci szabványnak tekinthető fényforrás-család a Philips **MSD Platinum-széria** (5R, 7R, 10R, 14R, 17R, 20R), amelynek értékei közvetlenül meghatározzák az adott fej fényerejét, sugárgeometriáját és élettartamát.

## Tipikus alkalmazás

- **MSD Platinum 5R / 7R**: belépő és klubkategóriás beam moving headek (Sharpy-klónok).
- **MSD Platinum 10R / 14R**: középkategóriás színpadi moving headek (Clay Paky Sharpy 10R / Mythos klónok, Robe Pointe).
- **MSD Platinum 17R / 20R**: nagy színpadi és tévéfelvételi beam/spot fejek.

## Élettartam és cseretudnivaló

A Platinum-széria névleges élettartama **1 500–3 000 üzemóra** — a 14R és 17R változatok a felsőbb sávban, az 5R és 7R változatok az alsóbb sávban. A turné- és fesztiválhasználatra szánt fejek élettartam-tervezésénél tipikus a féléves rendszeres csere, függetlenül a tényleges üzemóráról: a kopott elektródájú izzó instabil sugárgeometriát, fényerő-ingadozást és a fej elektromos ballasztjának fokozott terhelését okozhatja.

## Cserekor figyelembe veendő szempontok

- A discharge lámpát **kihűlt állapotban**, védőkesztyűben cseréljük (a kvarcburkon hagyott ujjlenyomat a felfűtés során az üveg elszíneződését okozza).
- A fej burkolatát üzembe helyezés előtt teljesen vissza kell zárni — a discharge lámpa erős UV-kibocsátása zárt mechanika mellett nem szabadul ki.
- A használt lámpát a higanytartalom miatt veszélyes hulladékként kell átadni.

## Mit szállítunk

Eredeti Philips MSD Platinum-széria izzókat (5R, 7R, 10R, 14R, 17R, 20R) közvetlenül a Philips disztribúciós láncból, tételes áfás számlával. Az érvényes megrendelés minden ügyfél számára egységesen a Számlázz.hu rendszerből kiállított díjbekérő banki átutalással történő teljesítéséhez kötött; visszatérő és nagyobb tételes megrendelésekre mennyiségi kedvezményt biztosítunk. A részletes megrendelési menet és a kapcsolódó típuslista a [/szinpadi-vilagitas-lampa](/szinpadi-vilagitas-lampa) oldalon olvasható.`,
  },
  {
    slug: "iskolai-projektor-lampacsere-nyari-utemezes",
    title: "Iskolai projektor lámpacsere: nyári ütemezés lépésről lépésre",
    excerpt:
      "Hogyan tervezzünk egy 30-50 vetítős iskolai park nyári lámpacseréjét, hogy szeptember 1-re minden cseremodul a helyszínen legyen.",
    description:
      "Nyári karbantartási ablak iskolai projektorpark lámpacseréjéhez: leltár, ajánlatkérés, megrendelés, szállítás — hónapról hónapra ütemezve, hogy szeptember 1-re minden cseremodul a helyszínen legyen.",
    publishedAt: "2026-06-15",
    readingMinutes: 6,
    body: `A tanévvégi zárás és a szeptemberi indulás közötti 8-10 hét a hazai oktatási parkban a legkedvezőbb karbantartási ablak. Egy mérsékelt méretű középiskola 20-40, egy nagyobb 40-60 vetítőt üzemeltet; a park 10-25%-a igényel éves szinten lámpacserét — nyárra ez 8-15 modult jelent.

## Miért éppen nyáron

A tantermi vetítők túlnyomó része az iskolai időszakban 4-8 üzemórát dolgozik naponta; a nyár az egyetlen olyan időablak, amikor a park érdemben nyugvópontra kerül. A karbantartó szakember hozzáférése zavartalan, és az egyedi beszerzésű, ritkább típusokra is bőven belefér a 6-12 munkanapos beszerzési átfutás.

## Ütemterv

**Június eleje — leltár.** A park típusonkénti bontásban rögzítve: gyártó, típusszám, üzemóra (a projektor OSD menüjéből kiolvasható), utolsó lámpacsere dátuma. Az 1500 üzemóra felett lévő vetítők a cserelistára kerülnek, a 2000 óra felettiek pedig prioritással.

**Június vége — ajánlatkérés.** Egyetlen összevont ajánlatkérés a teljes csereigényre. Tételes visszaigazolás egy munkanapon belül, típusonkénti egységárral és szállítási határidővel.

**Július eleje — megrendelés.** Számlázz.hu díjbekérő + banki átutalás. A jóváírás után indul a beszerzés; készletes tételek 1-2, egyedi típusok 6-12 munkanap.

**Augusztus közepe — szállítás és beépítés.** Összevont kézbesítés a karbantartó címére. A beépítés a szeptemberi indulásig kényelmesen befér a rendelkezésre álló időbe.

## Mit kell egy ajánlatkéréshez tudni?

Minimum a projektor pontos típusszáma (pl. „Epson EB-X05"), vagy a régi lámpamodul cikkszáma (pl. „ELPLP96"). Ha egyik sem áll rendelkezésre, a projektor típustábláját (a készülék alján vagy hátulján) elég lefényképezni és mellékelni. A részletes ütemezés a [/oktatas/nyari-karbantartas](/oktatas/nyari-karbantartas) oldalon olvasható.`,
  },
  {
    slug: "harminc-vetitos-park-karbantartasa",
    title: "30+ vetítős park karbantartása: mit tanultunk 200+ intézményi rendelésből",
    excerpt:
      "Melyek a leggyakoribb hibák, hogyan lehet elkerülni a szeptemberi tanévkezdés csúszását, és mennyi tartalék modult érdemes helyszínen tartani.",
    description:
      "Intézményi projektorpark karbantartásának tapasztalati tanulságai: helyszíni tartalék, ajánlatkérés időzítése, típus-koncentráció, üzemóra-figyelés — 200+ oktatási rendelésből leszűrve.",
    publishedAt: "2026-07-05",
    readingMinutes: 5,
    body: `Az utóbbi években 200-nál is több intézményi rendelést szállítottunk oktatási partnereinknek, iskolai eszközparkoktól egyetemi karokig. Néhány visszatérő tanulság, amit érdemes megosztani.

## A legdrágább hiba: a hiányzó tartalék

Egy 30 vetítős iskolai parkban statisztikailag évi 4-8 modul hibásodik meg — ebből 1-2 tipikusan a tanév közben. Ha ilyenkor nincs helyszíni tartalék, a tanterem egy hétre kiesik. A javaslatunk: a leggyakoribb 2-3 típusból tartsanak 1-1 db tartalék cseremodult a szertárban.

## A második legdrágább hiba: későn indított ajánlatkérés

Augusztus közepén már mindenki rendel — a beszerzési láncokban ilyenkor csúszások vannak. A júniusi rendelés még kényelmes átfutási idővel dolgozik; a júliusi rendelés még kockázat nélkül teljesíthető; az augusztus közepe utáni rendelés esetén az egyedi típusokra már nem tudunk szeptember 1-i szállítást garantálni.

## Típus-koncentráció

Egy tipikus iskolai park a 40-60 vetítőből is jellemzően 6-10 különböző típust üzemeltet. Érdemes a jövőbeli beszerzéseket 3-4 típusra koncentrálni — nem csak a beszerzési oldalon egyszerűsödik minden, hanem a karbantartó számára is átláthatóbb az eszközpark.

## Üzemóra-figyelés

A modern projektorok OSD menüjéből percre pontosan kiolvasható a lámpamodul üzemideje. Egy egyszerű, félévente frissített Excel-táblával az egész park lámpacsere-igénye előre tervezhető — nem hiba, hanem karbantartás.

## Számlázás

Az intézményi beszerzésnél a Számlázz.hu rendszerből kiállított díjbekérő banki átutalással történő teljesítése után indul a szállítás; a végszámla áfás, az intézmény nevére (27% ÁFA). A részletek a [/oktatas](/oktatas) oldalon olvashatók.`,
  },
  {
    slug: "av-karbantartasi-ellenorzo-lista",
    title: "AV-karbantartási ellenőrző lista tanévkezdés előtt",
    excerpt:
      "10 pontos ellenőrző lista tantermi és előadótermi vetítők nyári átvizsgálásához — a lámpamodul csak az egyik tétel.",
    description:
      "AV-karbantartási ellenőrző lista tanévkezdés előtt: 10 pont a tantermi és előadótermi vetítők nyári átvizsgálásához — üzemóra, fényerő, portalanítás, szűrő, DMD-chip, kábelek, rögzítés.",
    publishedAt: "2026-07-25",
    readingMinutes: 7,
    body: `A nyári karbantartási ablak nemcsak a lámpacseréről szól. Az alábbi 10 pont a tapasztalatunk szerint jó minimum egy tantermi vagy előadótermi vetítő éves átvizsgálásához.

## 1. Üzemóra ellenőrzése

Az OSD menü „Information" vagy „Status" oldalán a lámpaóra kiolvasható. A gyártói ajánlott csereidő általában 2000-5000 óra között van, típusfüggő módon.

## 2. Fényerő becslése

Egy 3-4 éves lámpamodul jellemzően az eredeti fényerő 50-70%-át adja le. Ha a tantermi tábla képe már este is halványnak tűnik nappali fényben, a lámpacsere aktuális.

## 3. Portalanítás

A vetítő szellőzőrácsa és belső portalanítása — sűrített levegővel, kikapcsolt állapotban. Az elpiszkolódott szellőző az élettartam legfontosabb csökkentője.

## 4. Levegőszűrő

Sok modellben cserélhető szűrő van (Epson EB-, NEC NP-széria); a szűrőcsere is a nyári karbantartáshoz tartozik. Részletek: [/szolgaltatas/projektor-szuro-csere](/szolgaltatas/projektor-szuro-csere).

## 5. Kép-élesség és színek

Tesztkép (pl. HDMI-forrásból egy 1080p vagy 4K tesztminta) segítségével ellenőrizhető a fókusz, a színbeállítás és az esetleges DMD-chip elhasználódásából adódó „szűrt" pixelek. DMD-chip csere: [/szolgaltatas/dmd-chip-csere](/szolgaltatas/dmd-chip-csere).

## 6. Távirányító és elem

Új elem, gombtakarók ellenőrzése. Az elveszett vagy nem működő távirányító pótlása: [/szolgaltatas/projektor-tavkapcsolo](/szolgaltatas/projektor-tavkapcsolo).

## 7. Kábel-ellenőrzés

HDMI, VGA, tápkábel csatlakozásainak ellenőrzése — meglazult csatlakozó gyakori hibaforrás.

## 8. Rögzítés

Mennyezeti tartó csavarjainak ellenőrzése, esetleges bereszelt csavar cseréje.

## 9. Vászon, tükör, projekciós felület

Tisztítás, esetleges felületi sérülés dokumentálása.

## 10. Cseremodul-tartalék

A leggyakoribb 2-3 vetítőtípusból legalább 1-1 tartalék cseremodul beszerzése a szertárba — így egy meghibásodás nem okoz értékteremtő kiesést.

A lámpamodul-cserét összevont, tételes ajánlatkéréssel a [/quote](/quote) oldalon lehet indítani.`,
  },
  {
    slug: "szeptemberi-tanevkezdes-projektor-ellenorzes",
    title: "Szeptemberi tanévkezdés — mit ellenőrizzünk a projektorpark körül?",
    excerpt:
      "Rövid, gyakorlati AV-check-lista intézményüzemeltetőknek a szeptember 1-i tanévkezdés előtti utolsó két hétre: mit érdemes megnézni, mikor kell soron kívül lámpamodult rendelni, és melyek a tipikus szeptemberi hibák.",
    description:
      "Tanévkezdés előtti projektor ellenőrzés iskolákban: 10 pontos AV check-lista, tipikus szeptemberi hibák (halványuló izzó, eltömődött szűrő, elhasználódott távirányító) és soron kívüli lámpamodul csere ütemezés.",
    publishedAt: "2026-08-10",
    readingMinutes: 6,
    body: `A nyári karbantartási ablak vége felé, két héttel a szeptember 1-i tanévkezdés előtt még bőven van idő egy gyors, gyakorlati AV-ellenőrzésre. Cikk célja: egyetlen menetből lássa az intézményüzemeltető, hogy melyik vetítő üzembiztos, melyiknek kell csak apró karbantartás, és melyikhez kell soron kívül lámpamodult rendelni.

## Miért éppen a tanévkezdés előtti két hét

A nyári szünet alatt a tantermek nagyrészt zárva vannak, a vetítők nyugvópontra kerülnek. Az augusztus közepi újbóli bekapcsolásnál viszont sok esetben csak ekkor derül ki, hogy egy-egy modul ténylegesen az élettartama végén jár: a júniusban még halványan működő izzó szeptemberre olvashatatlan képet ad. Két hét szűk, de elegendő ablak a soron kívüli beszerzésre — a készletes tételek 1–2 munkanap alatt szállíthatók.

## 10 pontos check-lista

Menjen végig minden tanteremben az alábbi tíz ponton, típusonként rögzítve az eredményt (Excel vagy egy egyszerű nyomtatott lista is elegendő):

1. **Bekapcsolás és felfutás** — elindul-e a vetítő, hozza-e a névleges fényerőt?
2. **OSD üzemóra** — a menüből kiolvasva, az izzó a névleges élettartam 80%-a felett jár-e?
3. **Fehér kép teszt** — fehér diakép vetítése, nem sárgás vagy halványuló-e.
4. **Színhőmérséklet** — a fehér tartalom marad-e semleges, vagy zöldes / sárgás árnyalatú.
5. **Ventilátorzaj** — érezhetően hangosabb-e, mint a nyár elején (Eco módban is).
6. **Légszűrő** — porral eltömődött-e, tisztítás vagy csere kell.
7. **„Lamp" / „Warning" üzenet** — a menü figyelmeztet-e közeli lámpacserére.
8. **Távirányító** — reagál-e minden gomb, van-e friss elem.
9. **Kábelek** — HDMI, VGA, táp csatlakozók stabilak-e.
10. **Cseremodul-tartalék** — van-e a szertárban 1-1 db a leggyakoribb 2-3 típusból.

## Tipikus szeptemberi hibák

A nyáron nyugvó, majd augusztusban újraindított park három leggyakoribb hibája a következő. **Halványuló, sárgás kép:** az izzó a névleges élettartama vége felé jár; ha a park több vetítőjén is látszik, érdemes összevont rendelést leadni, mert a mennyiségi kedvezmény tíz darab feletti tételtől már számottevő. **Nem indul, csak villog a jelzőfény:** kiégett lámpamodul — készletes típusnál másnapra a helyszínen. **Hangosabb, gyakran leálló vetítő:** eltömődött légszűrő + elhasználódott izzó együttes tünete; egy művelettel megoldható.

## Ütemezés a tanévkezdés első hetéig

Az utolsó két hét beosztása jellemzően a következő: az első héten a leltár és az ajánlatkérés, a második héten a beszerzés és a beépítés fér be. Ha a park mérete 30 vetítő felett van, érdemes az ellenőrzést augusztus első hetében kezdeni, hogy az egyedi beszerzésű típusokra is legyen elég átfutási idő. Készletes tételekre (Epson EB-X, EB-S, EB-W széria, BenQ MS/MX/MW, NEC V-széria) a 24 órás visszaigazolás után 1–2 munkanap a szállítás; egyedi beszerzésű típusokra 6–12 munkanap.

## Ajánlatkérés

A soron kívüli tanévkezdéses csereigényt egyetlen ajánlatkéréssel a [/oktatas/tanevkezdes](/oktatas/tanevkezdes) oldalon vagy közvetlenül a [/quote](/quote) űrlapon lehet indítani; a válaszban tételes áfás számla-ajánlatot és várható szállítási dátumot kapunk vissza.`,
  },
];

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);

export const sortedPosts = () =>
  [...posts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
