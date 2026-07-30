import type { ProjectorBrand } from "./brands";

export interface PopularModel {
  slug: string;
  brand: ProjectorBrand;
  model: string;
  /** Tipikusan az adott modellbe szerelt gyári lámpa cikkszám — végleges egyeztetés mindig az árajánlatban. */
  lampPart?: string;
  /** Lámpa teljesítmény (gyári adat). */
  wattage?: string;
  /** Natív felbontás. */
  resolution: string;
  /** Fényerő ANSI lumenben. */
  brightness: string;
  /** Tipikus felhasználási kör — egy rövid bekezdés. */
  context: string;
  /** Márka slug az aktív brandPages bejegyzésre. */
  brandSlug: string;
}

const m = (
  brand: ProjectorBrand,
  brandSlug: string,
  model: string,
  resolution: string,
  brightness: string,
  context: string,
  lampPart?: string,
  wattage?: string,
): PopularModel => ({
  slug: `${brand.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${model.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
  brand,
  brandSlug,
  model,
  resolution,
  brightness,
  context,
  lampPart,
  wattage,
});

export const popularModels: PopularModel[] = [
  // Epson
  m("Epson", "epson", "EB-X05", "XGA (1024×768)", "3 300 lm", "Tantermi 3LCD vetítő, gyakori cseretétel hazai oktatási intézményekben.", "ELPLP96", "210 W"),
  m("Epson", "epson", "EB-X41", "XGA (1024×768)", "3 600 lm", "Az EB-X05 továbbfejlesztése, általános oktatási és tárgyalói telepítésre.", "ELPLP96", "210 W"),
  m("Epson", "epson", "EB-S05", "SVGA (800×600)", "3 200 lm", "Belépő tantermi 3LCD vetítő, költséghatékony lámpacserével.", "ELPLP96", "210 W"),
  m("Epson", "epson", "EB-W05", "WXGA (1280×800)", "3 300 lm", "Szélesvásznú tárgyalói és oktatási vetítő.", "ELPLP96", "210 W"),
  m("Epson", "epson", "EB-2042", "XGA (1024×768)", "4 400 lm", "Magasabb fényerejű, telepített előadótermi 3LCD vetítő.", "ELPLP95", "250 W"),
  m("Epson", "epson", "EB-595Wi", "WXGA (1280×800)", "3 300 lm", "Ultra-rövid vetítési távolságú, interaktív tantermi készülék.", "ELPLP80", "215 W"),
  m("Epson", "epson", "EH-TW650", "Full HD (1920×1080)", "3 100 lm", "Otthoni és kis tárgyalótermi házimozis vetítő.", "ELPLP96", "210 W"),
  m("Epson", "epson", "EB-685Wi", "WXGA (1280×800)", "3 500 lm", "Ultra-rövid távolságú, interaktív whiteboard vetítő iskolákhoz.", "ELPLP80", "215 W"),

  // BenQ
  m("BenQ", "benq", "MS524", "SVGA (800×600)", "3 200 lm", "Belépő üzleti DLP vetítő, oktatási és kisebb tárgyalói telepítésre.", "5J.J6L05.001", "190 W"),
  m("BenQ", "benq", "MX525", "XGA (1024×768)", "3 200 lm", "Általános üzleti DLP vetítő, tantermi standard.", "5J.J6L05.001", "190 W"),
  m("BenQ", "benq", "MW526", "WXGA (1280×800)", "3 200 lm", "Szélesvásznú DLP vetítő tárgyalókba és előadótermekbe.", "5J.J6L05.001", "190 W"),
  m("BenQ", "benq", "MH535", "Full HD (1920×1080)", "3 500 lm", "Full HD üzleti DLP vetítő, magas kontraszttal.", "5J.J9R05.001", "240 W"),
  m("BenQ", "benq", "TH535", "Full HD (1920×1080)", "3 200 lm", "Sport- és játékvetítésre optimalizált Full HD DLP modell.", "5J.J9R05.001", "240 W"),
  m("BenQ", "benq", "W1070", "Full HD (1920×1080)", "2 000 lm", "Klasszikus házimozis Full HD DLP vetítő; gyakori csere a hazai piacon.", "5J.J7L05.001", "240 W"),

  // NEC
  m("NEC", "nec", "V260", "XGA (1024×768)", "2 600 lm", "Hordozható oktatási és üzleti vetítő.", "NP15LP", "210 W"),
  m("NEC", "nec", "M300X", "XGA (1024×768)", "3 000 lm", "Telepített tantermi vetítő, magas megbízhatóság.", "NP15LP", "230 W"),
  m("NEC", "nec", "NP-M311W", "WXGA (1280×800)", "3 100 lm", "Szélesvásznú tantermi és tárgyalói vetítő.", "NP15LP", "230 W"),
  m("NEC", "nec", "NP-P350W", "WXGA (1280×800)", "3 500 lm", "Magasabb fényerejű előadótermi NEC P-széria.", "NP21LP", "280 W"),

  // Optoma
  m("Optoma", "optoma", "HD142X", "Full HD (1920×1080)", "3 000 lm", "Belépő házimozi és játékvetítő Full HD felbontásban.", "BL-FU195C", "190 W"),
  m("Optoma", "optoma", "HD143X", "Full HD (1920×1080)", "3 000 lm", "A HD142X továbbfejlesztett változata, alacsony input lag-gal.", "BL-FP195A", "190 W"),
  m("Optoma", "optoma", "EH200ST", "Full HD (1920×1080)", "3 000 lm", "Rövid vetítési távolságú Full HD üzleti vetítő.", "BL-FU190E", "190 W"),
  m("Optoma", "optoma", "HD27", "Full HD (1920×1080)", "3 200 lm", "Klasszikus házimozi Full HD DLP modell.", "BL-FU195A", "190 W"),

  // Acer
  m("Acer", "acer", "P1500", "Full HD (1920×1080)", "3 000 lm", "Acer üzleti Full HD DLP vetítő, alapcsomagban DLP Link 3D.", "MC.JG211.00B", "220 W"),
  m("Acer", "acer", "X1240", "XGA (1024×768)", "3 200 lm", "Belépő tantermi DLP vetítő Acer X-szériából.", "MC.JH011.001", "240 W"),
  m("Acer", "acer", "H6510BD", "Full HD (1920×1080)", "3 000 lm", "Korábbi generációs Full HD házimozi DLP vetítő; a hazai parkban még gyakori.", "MC.JFZ11.001", "230 W"),
  m("Acer", "acer", "H6517BD", "Full HD (1920×1080)", "3 400 lm", "H6510BD utódmodell, magasabb fényerővel és kontraszttal.", "MC.JFZ11.001", "230 W"),

  // ViewSonic
  m("ViewSonic", "viewsonic", "PJD7820HD", "Full HD (1920×1080)", "3 200 lm", "Full HD üzleti DLP vetítő, közepes árszintű telepítésekhez.", "RLC-100", "240 W"),
  m("ViewSonic", "viewsonic", "PA503S", "SVGA (800×600)", "3 600 lm", "Belépő üzleti és oktatási DLP vetítő.", "RLC-108", "203 W"),
  m("ViewSonic", "viewsonic", "PG707W", "WXGA (1280×800)", "4 000 lm", "Magasabb fényerejű előadótermi vetítő ViewSonic PG-szériából.", "RLC-118", "240 W"),

  // Panasonic
  m("Panasonic", "panasonic", "PT-VX505N", "XGA (1024×768)", "5 000 lm", "Tantermi és előadótermi telepített Panasonic LCD vetítő.", "ET-LAV400", "230 W"),
  m("Panasonic", "panasonic", "PT-VW355N", "WXGA (1280×800)", "4 000 lm", "Szélesvásznú előadótermi Panasonic LCD vetítő.", "ET-LAV300", "230 W"),
  m("Panasonic", "panasonic", "PT-LB360", "XGA (1024×768)", "3 600 lm", "Hordozható tantermi Panasonic LCD vetítő.", "ET-LAL500", "200 W"),

  // Sony
  m("Sony", "sony", "VPL-EX235", "XGA (1024×768)", "2 800 lm", "Telepített üzleti és oktatási Sony 3LCD vetítő.", "LMP-E212", "215 W"),
  m("Sony", "sony", "VPL-DX122", "XGA (1024×768)", "2 600 lm", "Belépő üzleti Sony 3LCD vetítő.", "LMP-D213", "215 W"),
  m("Sony", "sony", "VPL-HW45ES", "Full HD (1920×1080)", "1 800 lm", "Prémium SXRD házimozi vetítő, magas kontrasztaránnyal.", "LMP-H210", "215 W"),

  // Hitachi
  m("Hitachi", "hitachi", "CP-X3041WN", "XGA (1024×768)", "3 000 lm", "Tantermi 3LCD vetítő, vezeték nélküli prezentációval.", "DT01411", "215 W"),
  m("Hitachi", "hitachi", "CP-EX251N", "XGA (1024×768)", "2 700 lm", "Tantermi belépő 3LCD vetítő Hitachi EX-szériából.", "DT01511", "200 W"),
  m("Hitachi", "hitachi", "iPJ-AW250N", "WXGA (1280×800)", "2 500 lm", "Interaktív, ultra-rövid vetítési távolságú tantermi készülék.", "DT01191", "210 W"),
];

export const getPopularModel = (slug: string) =>
  popularModels.find((p) => p.slug === slug);