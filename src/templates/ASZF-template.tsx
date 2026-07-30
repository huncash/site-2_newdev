export interface CompanyInfo {
  name: string;
  address: string;
  taxNumber: string;
  companyRegistrationNumber: string;
  email: string;
  taxNumberEU?: string;
}

export interface SiteSpecificInfo {
  siteName: string;
  siteUrl: string;
  activityDescription: string;
}

export interface AszfTemplateProps {
  companyInfo: CompanyInfo;
  siteSpecificInfo: SiteSpecificInfo;
}

export function AszfTemplate({ companyInfo, siteSpecificInfo }: AszfTemplateProps) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 text-sm leading-relaxed">
      <h1 className="mb-8 text-2xl font-bold">Általános Szerződési Feltételek</h1>
      <p className="mb-6 text-muted-foreground">
        Hatályos: 2024. január 1-től visszavonásig
      </p>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold">1. Szolgáltató adatai</h2>
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b">
              <td className="py-2 pr-6 font-medium">Cégnév</td>
              <td className="py-2 text-muted-foreground">{companyInfo.name}</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 pr-6 font-medium">Székhely</td>
              <td className="py-2 text-muted-foreground">{companyInfo.address}</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 pr-6 font-medium">Adószám</td>
              <td className="py-2 text-muted-foreground">{companyInfo.taxNumber}</td>
            </tr>
            {companyInfo.taxNumberEU ? (
              <tr className="border-b">
                <td className="py-2 pr-6 font-medium">Közösségi adószám</td>
                <td className="py-2 text-muted-foreground">{companyInfo.taxNumberEU}</td>
              </tr>
            ) : null}
            <tr className="border-b">
              <td className="py-2 pr-6 font-medium">Cégjegyzékszám</td>
              <td className="py-2 text-muted-foreground">{companyInfo.companyRegistrationNumber}</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 pr-6 font-medium">Email</td>
              <td className="py-2 text-muted-foreground">
                <a href={`mailto:${companyInfo.email}`} className="underline">
                  {companyInfo.email}
                </a>
              </td>
            </tr>
            <tr className="border-b">
              <td className="py-2 pr-6 font-medium">Weboldal</td>
              <td className="py-2 text-muted-foreground">
                <a href={siteSpecificInfo.siteUrl} className="underline">
                  {siteSpecificInfo.siteUrl}
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold">2. A webshop tevékenysége</h2>
        <p className="text-muted-foreground">{siteSpecificInfo.activityDescription}</p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold">3. A szerződés létrejötte</h2>
        <p className="text-muted-foreground">
          A {siteSpecificInfo.siteName} weboldalon leadott rendelés elektronikus úton kötött szerződésnek minősül,
          amelyre az elektronikus kereskedelmi szolgáltatások, az információs társadalommal összefüggő
          szolgáltatások egyes kérdéseiről szóló 2001. évi CVIII. törvény rendelkezései alkalmazandók.
          A szerződés a megrendelés visszaigazolásával jön létre.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold">4. Árak</h2>
        <p className="text-muted-foreground">
          Az oldalon feltüntetett árak forintban (HUF) értendők, és tartalmazzák az általános forgalmi adót (ÁFA).
          A szolgáltató fenntartja az árak módosításának jogát. A módosítás a weboldalon való megjelenéssel
          egyidejűleg lép hatályba, és a már leadott megrendelésekre nem vonatkozik.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold">5. Elállási jog</h2>
        <p className="text-muted-foreground">
          A fogyasztó az áru átvételétől számított 14 napon belül indokolás nélkül elállhat a szerződéstől
          a 45/2014. (II.26.) Korm. rendelet alapján. Az elállási szándékot írásban szükséges jelezni
          a következő e-mail címen: <a href={`mailto:${companyInfo.email}`} className="underline">{companyInfo.email}</a>.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold">6. Szavatosság és jótállás</h2>
        <p className="text-muted-foreground">
          A hibás teljesítéssel kapcsolatos igények érvényesítésére a Polgári Törvénykönyvről szóló
          2013. évi V. törvény és a 19/2014. (IV.29.) NGM rendelet vonatkozó rendelkezései az irányadók.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold">7. Adatvédelem</h2>
        <p className="text-muted-foreground">
          A személyes adatok kezeléséről a weboldal Adatkezelési Tájékoztatója rendelkezik,
          amely a weboldalon elérhető. Az adatkezelő: {companyInfo.name}, {companyInfo.address}.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold">8. Panaszkezelés és jogvita</h2>
        <p className="text-muted-foreground">
          Panasz esetén először a szolgáltatóhoz forduljon: <a href={`mailto:${companyInfo.email}`} className="underline">{companyInfo.email}</a>.
          Eredménytelen panaszkezelés esetén a fogyasztó a lakóhelye szerint illetékes Békéltető Testülethez
          fordulhat, illetve igénybe veheti az EU online vitarendezési platformját:{" "}
          <a href="https://ec.europa.eu/consumers/odr" className="underline" target="_blank" rel="noreferrer">
            ec.europa.eu/consumers/odr
          </a>.
        </p>
      </section>
    </main>
  );
}
