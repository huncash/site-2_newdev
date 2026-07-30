import { projectorModels } from "./projector-models";
import type { ProjectorBrand } from "./brands";

export interface BrandPage {
  slug: string;
  brand: ProjectorBrand;
  name: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  /** 2–4 bekezdés a márka projektorparkjáról és a tipikus lámpamodulokról. */
  body: string[];
  /** Tipikus izzótechnológia és gyári izzógyártók a márka modelljeinél. */
  technologyNote: string;
  /** Ajánlott modellek listája (az adatkészletből szűrve, korlátozott számban). */
  popularModels: string[];
}

const take = (brand: ProjectorBrand, n: number): string[] =>
  (projectorModels[brand] ?? []).slice(0, n);

export const brandPages: BrandPage[] = [
  {
    slug: "epson",
    brand: "Epson",
    name: "Epson projektor izzó és lámpamodul",
    metaTitle: "Epson projektor izzó és lámpamodul — ELPLP cikkszámok | projektorlampacsere.hu",
    metaDescription:
      "Epson projektor lámpamodul beszerzés intézményeknek: ELPLP sorozat (EB-X, EB-W, EB-S, EH-TW, EB-1900/9000). Eredeti gyári izzó, tételes árajánlat, áfás számla.",
    intro:
      "Az Epson 3LCD projektorok izzómoduljai a hazai tárgyalói, oktatási és lakossági telepítések egyik leggyakoribb cseretétele. A teljes Epson palettát lefedjük — az iskolai EB-S és EB-X belépő modellektől az EB-1900-as és EB-9000-es tárgyalói szérián át a házimozis EH-TW vetítőkig.",
    body: [
      "Az Epson saját, ELPLP-előtaggal jelölt cikkszámrendszert használ (például ELPLP67, ELPLP71, ELPLP78, ELPLP88, ELPLP96). Egy adott vetítőtípushoz tipikusan egy konkrét ELPLP-szám tartozik, amelyet a készülék kézikönyvében és a lámparekesz fedelén is feltüntetnek. Beszerzéskor ez a leggyorsabb azonosító — a típusszám (EB-, EH-) ennek hiányában szintén egyértelműen besorolja a modult.",
      "A 3LCD technológia a Philips UHP és az Osram P-VIP izzókat használja a leggyakrabban; ezek a fényforrások 2 000–6 000 üzemóra névleges élettartamot adnak, üzemmódtól függően (Normal vagy ECO). Az általunk forgalmazott eredeti diszkont lámpamodul mindkét gyártói izzóra elérhető, méretpontos utángyártott keretbe szerelve. A keret és a tükörgeometria azonos a gyári OEM kivitellel, így a fényerő, a színhőmérséklet és a hűtés is változatlan.",
      "A beépítés Epsonnál többnyire egyszerű, oldalsó vagy hátsó rekeszből végezhető. A lámpaszámláló nullázását a vetítő menüjében (Reset → Lamp Hours) kell elvégezni, ellenkező esetben a lámpacsere-figyelmeztetés továbbra is megjelenik.",
    ],
    technologyNote:
      "Tipikus fényforrás: Philips UHP / Osram P-VIP. Cikkszám-konvenció: ELPLP** vagy V13H010L**. Garancia (eredeti gyári izzó utángyártott keretben): 6 hónap, max. 500 üzemóra.",
    popularModels: take("Epson", 24),
  },
  {
    slug: "benq",
    brand: "BenQ",
    name: "BenQ projektor izzó és lámpamodul",
    metaTitle: "BenQ projektor izzó és lámpamodul — 5J cikkszámok | projektorlampacsere.hu",
    metaDescription:
      "BenQ projektor lámpamodul beszerzés: MX, MW, MS, MH, SH, TH és W-széria vetítőkhöz. Eredeti gyári izzó, áfás számla, tételes árajánlat 1 munkanapon belül.",
    intro:
      "A BenQ DLP-projektorok a hazai oktatási és üzleti tárgyalótermek népszerű készülékei. A BenQ projektor izzó cikkszámrendszere a „5J\" előtagú azonosítóra épül (pl. 5J.J9R05.001), amelyet az M-, T- és W-szériás készülékek lámparekeszének belsején is feltüntetnek.",
    body: [
      "Az általunk leggyakrabban szállított BenQ lámpamodulok az MS-, MW-, MX-széria (irodai 3 200–4 000 lumen), az SH- és TH-széria (Full HD üzleti és prezentációs), valamint a W- és HT-széria (házimozi) készülékeibe készülnek. A BenQ TI DLP-chipekkel dolgozik, jellemzően Philips UHP, illetve Osram P-VIP fényforrással.",
      "A modulhoz tartozó névleges élettartam üzemmódtól függően 3 500–10 000 üzemóra között mozog (SmartEco vagy LampSave módban). A cserekorszak elérésekor a BenQ vetítők — a vetített képen megjelenő figyelmeztetés mellett — a kompresszor-hangerő és a ventilátorfordulat enyhe növekedésével is jelzik a fényforrás elhasználódását.",
      "A modulcsere a legtöbb BenQ készüléknél hátulról vagy a készülék tetejéről, két csavar kilazítása után végrehajtható. A lámpaszámláló nullázása a Menu → System Setup → Lamp Settings → Reset Lamp Timer útvonalon történik, és a sikeres csere részeként javasolt.",
    ],
    technologyNote:
      "Tipikus fényforrás: Philips UHP / Osram P-VIP. Cikkszám-konvenció: 5J.******.*** vagy CS.****-***.001.",
    popularModels: take("BenQ", 24),
  },
  {
    slug: "nec",
    brand: "NEC",
    name: "NEC projektor izzó és lámpamodul",
    metaTitle: "NEC projektor izzó és lámpamodul — NP-LP cikkszámok | projektorlampacsere.hu",
    metaDescription:
      "NEC projektor lámpamodul beszerzés: NP-, V-, M-, ME- és PA-széria vetítőkhöz. NP-LP cikkszámok, eredeti gyári izzó, tételes árajánlat áfás számlával.",
    intro:
      "A NEC üzleti, oktatási és installációs (PA-széria) projektorai stabil, intézményi célra tervezett készülékek; cseremoduljaikat az „NP\"-betűkóddal és a kapcsolódó „LP\"-végződéssel jelölik (például NP15LP, NP24LP, NP41LP, NP44LP).",
    body: [
      "A V- és M-széria a tipikus tantermi és tárgyalói vetítőt képviseli (3 000–4 500 lumen), míg az NEC PA-széria 5 000–9 500 lumenes installációs vetítőket takar — utóbbiak izzómodulja nagyobb teljesítményű, hosszabb élettartamú, és kifejezetten 24/7 üzemeltetésre van tervezve.",
      "A fényforrás márkája modellfüggő: a kis és közepes teljesítményű NEC modulokban túlnyomóan Ushio NSH, illetve Philips UHP izzó dolgozik, míg a nagyteljesítményű PA- és NP-széria gyakran kettős lámparendszerű (dual lamp) megoldást alkalmaz, ahol az egyik fényforrás meghibásodása esetén a vetítő automatikusan a másik izzóra vált.",
      "A NEC készülékek lámpaszámláló-nullázását a menüben (Reset → Clear Lamp Hours), vagy egyes modelleken a távirányító egyidejű HELP + ENTER kombinációjával lehet elvégezni. Dual lamp készüléknél a két izzó számlálója független — csak a cserélt oldal számlálóját kell nullázni.",
    ],
    technologyNote:
      "Tipikus fényforrás: Ushio NSH / Philips UHP. Cikkszám-konvenció: NP**LP, vagy LV-LP**.",
    popularModels: take("NEC", 24),
  },
  {
    slug: "optoma",
    brand: "Optoma",
    name: "Optoma projektor izzó és lámpamodul",
    metaTitle: "Optoma projektor izzó és lámpamodul — SP. cikkszámok | projektorlampacsere.hu",
    metaDescription:
      "Optoma projektor lámpamodul beszerzés: HD, EH, EW és X-széria vetítőkhöz. Eredeti gyári izzó utángyártott keretben, tételes árajánlat áfás számlával.",
    intro:
      "Az Optoma DLP-projektorok széles spektrumon mozognak az otthoni mozi és a tantermi vetítés között. A cseremodulok cikkszáma jellemzően „SP.\" előtaggal kezdődik (pl. SP.78V01GC01, SP.71P01GC01), és a vetítő alján vagy az izzórekeszben olvasható le.",
    body: [
      "A leggyakrabban szállított Optoma modulok az EH- (Full HD üzleti), HD- (otthoni mozi), valamint a W- és X-szériás (oktatási) készülékekhez tartoznak. A 3 000–4 500 lumen tartományba eső készülékek modulja Philips UHP, illetve Osram P-VIP fényforrással szerelt; a házimozis HD-széria izzói általában rövidebb ívtávolságú, hidegfehér színhőmérsékletre optimalizált változatok.",
      "Az Optoma a 2018 utáni készülékek egy részénél hosszú élettartamú „Lamp Boost\" módot is kínál, amely lehetővé teszi a fényforrás 10 000–15 000 üzemórán át tartó dinamikus, képtartalom-vezérelt üzemeltetését. Ezeknél a készülékeknél a fényforrás nem feltétlenül izzós — a megrendelés előtt érdemes ellenőrizni, hogy nem lézer- vagy hibrid LED-fényforrásról van-e szó (utóbbihoz cseremodul nem rendelhető).",
      "A lámpa cseréje a legtöbb modellnél alul, az izzófedél két csavarjának eltávolítása után végezhető. A lámpaszámláló-nullázás a Settings → Lamp Settings → Lamp Reset menüpontban érhető el.",
    ],
    technologyNote: "Tipikus fényforrás: Philips UHP / Osram P-VIP. Cikkszám-konvenció: SP.******.***.",
    popularModels: take("Optoma", 24),
  },
  {
    slug: "acer",
    brand: "Acer",
    name: "Acer projektor izzó és lámpamodul",
    metaTitle: "Acer projektor izzó és lámpamodul — MC.JG cikkszámok | projektorlampacsere.hu",
    metaDescription:
      "Acer projektor lámpamodul beszerzés: P-, X-, H- és D-széria vetítőkhöz. Eredeti gyári izzó utángyártott keretben, áfás számla, tételes árajánlat.",
    intro:
      "Az Acer projektorok költséghatékony belépő- és középkategóriás DLP-készülékek, jellemzően oktatási és kisebb tárgyalói környezetben. A cseremodulok cikkszáma „MC.JG\" vagy „EC.J\" előtaggal kezdődik (pl. MC.JG211.00B), a típusszám pedig P-, X-, H- vagy D-előtagú (P1500, X1240, H6510BD, D1P1426).",
    body: [
      "A leggyakoribb cserélt Acer modulok a P1500 és X- széria (oktatási DLP), a H- széria (Full HD házimozi) és a kódolt D- széria (intézményi OEM) készülékeihez tartoznak. Az Acer Philips UHP izzókat használ leggyakrabban; a névleges élettartam Normal módban 3 500–4 500 óra, ECO módban 5 000–7 000 óra.",
      "Az Acer vetítők egy része a lámpaszámláló-nullázáshoz a szervizmenü használatát igényli (Service mode → Lamp Hour Reset). A pontos eljárás modellfüggő — a modulcsere mellé minden esetben mellékelünk magyar nyelvű, lépésről lépésre haladó nullázási útmutatót.",
    ],
    technologyNote: "Tipikus fényforrás: Philips UHP. Cikkszám-konvenció: MC.JG***.***, EC.J***.***.",
    popularModels: take("Acer", 24),
  },
  {
    slug: "viewsonic",
    brand: "ViewSonic",
    name: "ViewSonic projektor izzó és lámpamodul",
    metaTitle: "ViewSonic projektor izzó és lámpamodul — RLC cikkszámok | projektorlampacsere.hu",
    metaDescription:
      "ViewSonic projektor lámpamodul beszerzés: PJD, PA, PG, LightStream és LS-széria vetítőkhöz. Eredeti gyári izzó, áfás számla, tételes árajánlat.",
    intro:
      "A ViewSonic projektorpaletta a PJD belépő DLP-modellektől a PG és PA előadótermi készülékeken át a LightStream és PX házimozi vetítőkig terjed. A cseremodulokat az „RLC\"-előtagú cikkszám azonosítja (pl. RLC-100, RLC-079, RLC-108).",
    body: [
      "A ViewSonic készülékek tipikusan Philips UHP, illetve Osram P-VIP izzókkal dolgoznak, modellfüggő 190–245 W teljesítménytartományban. A névleges élettartam SuperEco módban akár 10 000 üzemóra is lehet — ez a mód a fényerőt 70%-ra csökkenti, ami sötétített előadótermi vagy oktatási környezetben a gyakorlatban kompromisszum nélkül használható.",
      "A megrendelés előkészítéséhez kérjük az RLC-cikkszámot vagy a teljes ViewSonic típusszámot (pl. PJD7820HD, PA503S, PG707W). A két azonosító együtt biztosítja, hogy a modulház csatlakozója és a ballaszt feszültség-illesztése a vetítőéhez illeszkedik.",
    ],
    technologyNote: "Tipikus fényforrás: Philips UHP / Osram P-VIP. Cikkszám-konvenció: RLC-***.",
    popularModels: take("ViewSonic", 24),
  },
  {
    slug: "panasonic",
    brand: "Panasonic",
    name: "Panasonic projektor izzó és lámpamodul",
    metaTitle: "Panasonic projektor izzó és lámpamodul — ET-LA cikkszámok | projektorlampacsere.hu",
    metaDescription:
      "Panasonic projektor lámpamodul beszerzés: PT-, PT-VX, PT-EX és PT-DZ installációs vetítőkhöz. Eredeti gyári izzó, tételes árajánlat, áfás számla.",
    intro:
      "A Panasonic professzionális projektorpalettája — PT-VX, PT-EX, PT-EZ és a PT-D/DZ installációs széria — intézményi auditóriumok, múzeumok és nagy konferenciatermek meghatározó eszköze. A cseremodulok cikkszáma „ET-LA\", illetve „ET-LAV\", „ET-LAE\" előtagú (pl. ET-LAV200, ET-LAE300, ET-LAD60W).",
    body: [
      "A Panasonic kettős fényforrásos (dual lamp) installációs vetítői — a PT-DZ és PT-DW széria — két önálló lámpamodult használnak, amelyek egymástól függetlenül cserélhetők és üzemóra-számlálójuk is külön kezelt. A vetítő automatikusan a hosszabb élettartamú vagy hibátlan modulra vált, így a folyamatos üzem (rendezvény, kiállítás) megszakadás nélkül biztosítható.",
      "A névleges élettartam üzleti modelleknél (PT-VX, PT-EX) 5 000–7 000 óra, installációs vetítőknél (PT-D, PT-DZ) 2 000–4 000 óra — utóbbi a magasabb fényerő-igény és a kettős lámpa miatt rövidebb, de az automatikus átkapcsolással a rendelkezésre állás tartósan magas marad.",
      "A megrendeléshez a teljes vetítő-típusszám (pl. PT-VX505NEJ vagy PT-DZ870EK) szükséges, mert egy ET-LA cikkszám több, egymástól ballaszt-feszültségben eltérő vetítőhöz is tartozhat.",
    ],
    technologyNote: "Tipikus fényforrás: Philips UHP / Osram P-VIP / Ushio NSH. Cikkszám: ET-LA**, ET-LAV**, ET-LAE**.",
    popularModels: take("Panasonic", 24),
  },
  {
    slug: "sony",
    brand: "Sony",
    name: "Sony projektor izzó és lámpamodul",
    metaTitle: "Sony projektor izzó és lámpamodul — LMP cikkszámok | projektorlampacsere.hu",
    metaDescription:
      "Sony projektor lámpamodul beszerzés: VPL-EX, VPL-CX, VPL-DX és VPL-HW házimozi vetítőkhöz. Eredeti gyári izzó, tételes árajánlat áfás számlával.",
    intro:
      "A Sony 3LCD és SXRD (LCoS) projektorok cseremoduljait az „LMP\"-előtagú cikkszám azonosítja (LMP-E180, LMP-C200, LMP-H210). Az üzleti VPL-EX/VPL-CX/VPL-DX széria tantermi és tárgyalói telepítésre, a VPL-HW és VW széria pedig prémium házimozis vetítésre készült.",
    body: [
      "A Sony 3LCD modulok többnyire Philips UHP, az SXRD házimozi vetítők (VPL-HW45, VPL-HW65, VPL-VW260) pedig saját, magas színhűségre optimalizált Ushio fényforrással dolgoznak. A névleges élettartam Normal módban 3 500–6 000 óra között mozog, ECO módban akár 10 000 óra.",
      "A megrendeléshez a vetítő típusszáma (VPL-***) és az LMP-cikkszám együtt szükséges. Egyes újabb Sony típusokon (VPL-PHZ, VPL-FHZ széria) már lézer-foszforos fényforrás dolgozik — ezekhez a klasszikus értelemben vett izzós lámpamodul nem rendelhető.",
    ],
    technologyNote: "Tipikus fényforrás: Philips UHP / Ushio NSH. Cikkszám-konvenció: LMP-***.",
    popularModels: take("Sony", 24),
  },
  {
    slug: "hitachi",
    brand: "Hitachi",
    name: "Hitachi projektor izzó és lámpamodul",
    metaTitle: "Hitachi projektor izzó és lámpamodul — DT cikkszámok | projektorlampacsere.hu",
    metaDescription:
      "Hitachi projektor lámpamodul beszerzés: CP-, ED-széria és iPJ interaktív vetítőkhöz. DT-cikkszámok, eredeti gyári izzó, tételes árajánlat, áfás számla.",
    intro:
      "A Hitachi 3LCD projektorok — különösen a CP-X, CP-EX és iPJ-AW (interaktív) modellek — tantermi és intézményi környezetben terjedtek el. A cseremodul cikkszáma „DT\"-előtagú (pl. DT01191, DT01411, DT01433).",
    body: [
      "Az interaktív vetítők (iPJ-AW250N, CP-AW251N, CP-TW3005) rövid vetítési távolságú (short-throw vagy ultra-short-throw) készülékek; lámpamoduljuk magasabb hőmérheléssel és gyakori be-/kikapcsolási ciklussal üzemel, ezért a tanévben tipikusan 1,5–2 évente cserére szorul.",
      "A modul gyári izzója Philips UHP vagy Osram P-VIP. Az általunk szállított eredeti diszkont kivitel ugyanezt a fényforrást tartalmazza, méretpontos utángyártott keretben. A megrendeléshez a Hitachi típusszám (CP-***, iPJ-***) és lehetőség szerint a DT-cikkszám szükséges.",
    ],
    technologyNote: "Tipikus fényforrás: Philips UHP / Osram P-VIP. Cikkszám-konvenció: DT*****.",
    popularModels: take("Hitachi", 24),
  },
  {
    slug: "mitsubishi",
    brand: "Mitsubishi",
    name: "Mitsubishi projektor izzó és lámpamodul",
    metaTitle: "Mitsubishi projektor izzó és lámpamodul — VLT cikkszámok | projektorlampacsere.hu",
    metaDescription:
      "Mitsubishi projektor lámpamodul beszerzés: XD-, HD-, XL-, WD- és LVP-széria vetítőkhöz. VLT cikkszámok, eredeti gyári izzó, áfás számla, tételes árajánlat.",
    intro:
      "A Mitsubishi projektorpaletta — az XD- és WD-szériás üzleti DLP-modellektől az XL- és LVP-szériás előadótermi készülékekig — a hazai oktatási és intézményi park egyik klasszikus szereplője. A cseremodulok cikkszáma „VLT\"-előtagú (például VLT-XD280LP, VLT-HC910LP, VLT-XL5LP), és a vetítő alján vagy a lámparekesz fedelén olvasható le.",
    body: [
      "A leggyakrabban szállított Mitsubishi modulok az XD- és WD-széria (3 000–4 500 lumen, tantermi és tárgyalói DLP), az XL-széria (4 500–5 500 lumen, előadótermi LCD) és az LVP-széria (installációs vetítők) készülékeihez tartoznak. A márka projektorpalettájának gyártói támogatása a 2010-es évek közepén lezárult, így az új OEM cseremodul beszerzése a legtöbb típusnál már nem lehetséges — az általunk forgalmazott eredeti gyári izzós, méretpontos utángyártott keretbe szerelt modul ezeknek a vetítőknek a továbbüzemeltetését biztosítja.",
      "A fényforrás Philips UHP, illetve Osram P-VIP típusú; a névleges élettartam Normal módban 2 000–3 000, Low (ECO) módban 3 000–5 000 üzemóra. A Mitsubishi vetítők egy részénél (különösen az XD- és WD-szériánál) a lámpaszámláló-nullázás a szervizmenüben (Menu → Service → Lamp Reset) végezhető el; a modulcsere mellé minden esetben mellékelünk típusra szabott magyar nyelvű útmutatót.",
      "A megrendeléshez a teljes Mitsubishi típusszám (pl. XD280U-ST vagy WD8200LU) szükséges; a VLT-cikkszám csak megerősítő szerepet tölt be, mert egyes Mitsubishi modulok kétféle ballaszt-feszültséggel készültek a hosszú gyártási időszak alatt.",
    ],
    technologyNote:
      "Tipikus fényforrás: Philips UHP / Osram P-VIP. Cikkszám-konvenció: VLT-***LP. Garancia (eredeti gyári izzó utángyártott keretben): 6 hónap, max. 500 üzemóra.",
    popularModels: take("Mitsubishi", 24),
  },
  {
    slug: "sanyo",
    brand: "Sanyo",
    name: "Sanyo projektor izzó és lámpamodul",
    metaTitle: "Sanyo projektor izzó és lámpamodul — POA-LMP cikkszámok | projektorlampacsere.hu",
    metaDescription:
      "Sanyo projektor lámpamodul beszerzés: PLC-XU, PLC-XW, PLC-XT és PLV-széria vetítőkhöz. POA-LMP cikkszámok, eredeti gyári izzó, áfás számla.",
    intro:
      "A Sanyo PLC- és PLV-szériás projektorai a hazai egyetemi előadótermek, középiskolai aulák és önkormányzati intézmények tartós eszközei. A cseremodulokat a „POA-LMP\"-előtagú cikkszám azonosítja (például POA-LMP99, POA-LMP111, POA-LMP136), amelyet a vetítő tetején vagy a lámparekesz fedelén tüntetnek fel.",
    body: [
      "A leggyakrabban szállított Sanyo modulok a PLC-XU (3 000–4 000 lumen tantermi LCD), a PLC-XT (5 000–7 000 lumen előadótermi) és a PLV (házimozis) készülékekhez tartoznak. A Sanyo projektor üzletágát a Panasonic 2012-ben integrálta, az eredeti márkanév alatti gyártás megszűnt — a hazai parkban azonban a PLC-XU és PLC-XT készülékek tartós felépítésüknek köszönhetően ma is széles körben üzemelnek, így a cseremodul-kereslet stabil.",
      "A fényforrás Ushio NSH, illetve Philips UHP — modellfüggő 200–330 W teljesítménnyel. A névleges élettartam Normal módban 2 000–3 000, ECO módban 3 000–5 000 üzemóra. A Sanyo készülékek egy részénél (PLC-XT, PLC-EF) kettős lámparendszer dolgozik; a két izzó üzemóra-számlálója egymástól független, és a vetítő automatikusan a hibátlan oldalra vált.",
      "A megrendeléshez a teljes Sanyo típusszám (pl. PLC-XU100, PLC-XT35, PLV-Z3000) és a POA-LMP cikkszám szükséges. A Sanyo–Eiki–Christie technológiai együttműködés miatt egyes modulok keresztkompatibilisek a megfelelő Eiki és Christie LX/LW modellekkel — erre minden esetben tételes egyeztetést végzünk.",
    ],
    technologyNote:
      "Tipikus fényforrás: Ushio NSH / Philips UHP. Cikkszám-konvenció: POA-LMP***. Garancia (eredeti gyári izzó utángyártott keretben): 6 hónap, max. 500 üzemóra.",
    popularModels: take("Sanyo", 24),
  },
  {
    slug: "sharp",
    brand: "Sharp",
    name: "Sharp projektor izzó és lámpamodul",
    metaTitle: "Sharp projektor izzó és lámpamodul — AN-LX, AN-XR cikkszámok | projektorlampacsere.hu",
    metaDescription:
      "Sharp projektor lámpamodul beszerzés: Notevision PG-, XG-, XR- és PG-D-széria vetítőkhöz. AN-cikkszámok, eredeti gyári izzó, tételes árajánlat áfás számlával.",
    intro:
      "A Sharp Notevision projektorcsalád — a PG-, XG-, XR- és későbbi PG-D-széria — Magyarországon az ezredforduló és a 2010-es évek közepe között telepített tantermi és tárgyalói park egyik meghatározó eszköze. A cseremodulok cikkszáma „AN\"-előtagú (például AN-XR10LP, AN-PH50LP1, AN-D400LP), amelyet a vetítő alján és a lámparekeszben is feltüntetnek.",
    body: [
      "A leggyakrabban szállított Sharp modulok az XR-széria (oktatási DLP, 2 200–3 000 lumen), a PG-D-széria (Full HD üzleti) és a klasszikus XG-széria (előadótermi LCD) készülékeihez tartoznak. A Sharp projektor üzletágat 2014-ben szervezeti átalakítás után fokozatosan kivezették — az új OEM cseremodul beszerzése ma már nem lehetséges, az általunk forgalmazott eredeti gyári izzós, utángyártott keretbe szerelt modul a Sharp készülékek továbbüzemeltetésének gyakorlatilag egyetlen útja.",
      "A fényforrás Philips UHP, illetve Phoenix SHP — modellfüggő 180–275 W teljesítménnyel. A névleges élettartam Normal módban 2 000–3 000, ECO módban 3 000–4 000 üzemóra. A Sharp vetítők lámpaszámláló-nullázása a szervizmenüben végezhető (Menu → Options → Lamp Counter Reset); a modul mellé típusra szabott útmutatót adunk át.",
      "A megrendeléshez a teljes Sharp típusszám (pl. XR-10S, PG-D40W3D, XG-PH50X) és az AN-cikkszám együtt szükséges, mert egyes Notevision modulok kétféle ballaszt-feszültséggel készültek a teljes gyártási időszak alatt.",
    ],
    technologyNote:
      "Tipikus fényforrás: Philips UHP / Phoenix SHP. Cikkszám-konvenció: AN-***LP. Garancia (eredeti gyári izzó utángyártott keretben): 6 hónap, max. 500 üzemóra.",
    popularModels: take("Sharp", 24),
  },
  {
    slug: "christie",
    brand: "Christie",
    name: "Christie projektor izzó és lámpamodul",
    metaTitle: "Christie projektor izzó és lámpamodul — LX, LW, LWU, DWU | projektorlampacsere.hu",
    metaDescription:
      "Christie installációs projektorok lámpamodulja: LX, LW, LWU, DWU, DHD és GS-széria. Eredeti gyári izzós kivitel, tételes árajánlat áfás számlával.",
    intro:
      "A Christie projektorok a hazai AV-integrátori és installációs piac meghatározó eszközei — előadótermek, konferenciaközpontok, kiállítótéri és vezérlőtermi telepítések felső kategóriás vetítői. Az általunk szállított lámpamodulok az LX/LW/LWU 3LCD és a DWU/DHD/GS DLP installációs készülékekhez tartoznak; ezek mind nagy nyomású higanygőz-kisülésű (UHP / NSH / P-VIP) fényforrással üzemelnek.",
    body: [
      "A Christie installációs vetítőkhöz (LX, LW, LWU, DWU, DHD, GS-széria) jellemzően Ushio NSH, Philips UHP vagy Osram P-VIP fényforrásos cseremodul tartozik, modellfüggő 230–400 W teljesítménnyel. A névleges élettartam Normal módban 2 000–3 000, ECO módban 3 000–5 000 üzemóra. Ezekre a modellekre eredeti gyári izzóval, méretpontos utángyártott keretbe szerelt modult szállítunk, 6 hónap / legfeljebb 500 üzemóra jótállással.",
      "A megrendelés előkészítéséhez a teljes Christie típusszám (pl. LWU620i-D, DWU851-Q, GS-Series DWU850-GS) és a meglévő lámpamodul cikkszáma szükséges; ennek alapján egy munkanapon belül tételes árajánlatot adunk.",
      "A Christie Roadie, J-series és CP-szériás (digital cinema) projektorok rövid ívű Xenon-kisülőlámpát használnak. **Digital cinema és nagytermi Xenon-csöveket jelenleg nem kínálunk.** A két technológia különbségeinek hátterét a [„Xenon vs UHP”](/blog/xenon-vs-uhp-mozi-vetito) ismeretterjesztő bejegyzésünk foglalja össze.",
    ],
    technologyNote:
      "Tipikus fényforrás (installációs): Ushio NSH / Philips UHP / Osram P-VIP. Digital cinema Xenon-csöveket jelenleg nem kínálunk.",
    popularModels: take("Christie", 24),
  },
  {
    slug: "barco",
    brand: "Barco",
    name: "Barco projektor izzó és lámpamodul",
    metaTitle: "Barco projektor izzó és lámpamodul — F-széria, RLM, CRPN | projektorlampacsere.hu",
    metaDescription:
      "Barco installációs projektorok lámpamodulja: F-széria (F22/F32/F35/F50/F70/F80), RLM, CRPN. Eredeti gyári izzós kivitel, tételes árajánlat áfás számlával.",
    intro:
      "A Barco belga gyártó professzionális installációs projektorai a hazai szimulátor-, vezérlőtermi és előadótermi telepítések rangos eszközei. Az általunk szállított lámpamodulok az F-szériás (F22, F32, F35, F50, F70, F80) installációs LCD/DLP készülékekhez és az RLM/CRPN sorozathoz tartoznak; ezek mind nagy nyomású higanygőz-kisülésű (UHP / P-VIP / NSH) fényforrással üzemelnek.",
    body: [
      "A Barco installációs vetítőkhöz (F-széria, RLM, CRPN) a gyári cseremodul Philips UHP, Osram P-VIP vagy Ushio NSH fényforrással szerelt — modellfüggő 300–465 W teljesítménytartományban. A névleges élettartam Normal módban 1 500–3 000, ECO módban 2 500–4 500 üzemóra; a folyamatos 24/7 üzemeltetésre tervezett vezérlőtermi és szimulátor-alkalmazásnál ez jellemzően negyedéves cserét igényel. Ezekre a modellekre eredeti gyári izzóval, méretpontos utángyártott keretbe szerelt modult szállítunk.",
      "A Barco professzionális szegmens specifikuma a **dual lamp** (kettős lámpa) és bizonyos esetekben a **multi-lamp** (3–6 modulos) elrendezés. Ezekben a vetítőkben az egyes lámpamodulok üzemóra-számlálója egymástól független, és a készülék automatikusan a hibátlan oldalra vált — ez a megoldás kritikus rendelkezésre állást igényelt telepítéseken alapfeltétel. Egy keretmegrendelésben mindkét (vagy mindhárom-hat) modul egyidejű cseréje szakszerű, mert az ívkitérés és a színhőmérséklet az új modulok között szinkronban marad.",
      "A Barco HDX, HDF, HDQ, FLM és XDL nagytermi rendezvény- és mozi-projektorai rövid ívű Xenon-kisülőlámpát használnak. **Nagytermi Xenon-csöveket jelenleg nem kínálunk.** A két technológia különbségeit a [„Xenon vs UHP”](/blog/xenon-vs-uhp-mozi-vetito) ismeretterjesztő bejegyzésben foglaltuk össze.",
    ],
    technologyNote:
      "Tipikus fényforrás (installációs): Philips UHP / Osram P-VIP / Ushio NSH. Nagytermi Xenon-csöveket jelenleg nem kínálunk.",
    popularModels: take("Barco", 24),
  },
];

export const getBrandPage = (slug: string) => brandPages.find((b) => b.slug === slug);