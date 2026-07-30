"use client";

import Link from "next/link";
import { canonical, SITE_URL } from "@/lib/seo";
import { trackEvent } from "@/lib/analytics";
import { TanevkezdesBanner } from "@/components/TanevkezdesBanner";

function Page() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <nav className="text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Főoldal</Link>
        <span className="mx-2">/</span>
        <Link href="/oktatas" className="hover:text-foreground">Oktatási intézményeknek</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Tankerületi központok</span>
      </nav>

      <div className="mt-6">
        <TanevkezdesBanner variant="tankerulet" />
      </div>
      <div className="text-xs tracking-[0.25em] text-primary font-medium">TANKERÜLETI KÖZPONTOK</div>
      <h1 className="text-3xl font-semibold tracking-tight mt-2">
        Több iskolát érintő nyári lámpacsere összevont kezelése
      </h1>
      <p className="text-muted-foreground mt-4 leading-relaxed">
        Egy tankerületi központhoz 15–40 általános és középiskola tartozik,
        iskolánként 20–60 vetítővel. A nyári karbantartás időszakára a
        cseremodul-igényt egyetlen összevont ajánlatkérésbe rendezzük,
        iskolánkénti szállítási címmel és tételes áfás számlával — így a
        műszaki csoportnak nem kell iskolánként külön beszerzést lefolytatnia.
      </p>

      <h2 className="mt-10 text-xl font-semibold">A folyamat</h2>
      <ol className="mt-3 list-decimal pl-5 text-sm text-foreground space-y-2">
        <li>A tankerületi műszaki csoport összegyűjti az iskolák cseremodul-igényét (típus, mennyiség, iskolai szállítási cím).</li>
        <li>Egyetlen összevont ajánlatkérést küld hozzánk — a válaszban típusonkénti egységárat és a teljes tétel összesített értékét kap.</li>
        <li>A megrendelést a tankerület adja fel, a Számlázz.hu díjbekérő banki átutalással kiegyenlítendő.</li>
        <li>A szállítást iskolánkénti bontásban, a megadott címekre teljesítjük — a számla egyben vagy iskolánként tételesen is kiállítható.</li>
      </ol>

      <h2 className="mt-10 text-xl font-semibold">Miért éri meg összevonni</h2>
      <ul className="mt-3 list-disc pl-5 text-sm text-foreground space-y-2">
        <li>A 10 db feletti tétel automatikusan a mennyiségi kedvezménysávba esik — jellemzően 8–15% típustól függően.</li>
        <li>Egyetlen adminisztratív folyamat 20–30 külön iskolai beszerzés helyett.</li>
        <li>A teljes tankerület egyszerre készen áll a szeptemberi tanévkezdésre.</li>
      </ul>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/ajanlatkeres"
          onClick={() => trackEvent("cta_quote_click_oktatas", { source: "tankeruleti_kozpont" })}
          className="px-5 py-2.5 bg-cta text-cta-foreground hover:bg-cta-hover rounded font-medium text-sm"
        >
          Tankerületi ajánlatot kérek
        </Link>
        <Link
          href="/oktatas/nyari-karbantartas"
          className="px-5 py-2.5 border border-border rounded text-sm font-medium hover:bg-surface"
        >
          Nyári karbantartási ütemezés
        </Link>
      </div>
    </div>
  );
}
export default Page;
