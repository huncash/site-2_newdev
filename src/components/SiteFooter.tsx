"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { categories } from "@/data/catalog";
import { company } from "@/data/company";

export function SiteFooter() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="border-t border-border bg-primary-soft mt-20">
      <div className="w-full px-6 py-12 text-sm bg-white">
        <p lang="hu" className="text-xs text-muted-foreground hyphens-auto text-justify">
          projektorlampacsere.hu - Projektor lámpamodulok és speciális fényforrások szakosított
          beszállítója audiovizuális integrátorok, intézményi üzemeltetők és vállalati karbantartók
          részére.
        </p>
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-xs">
          <div className="col-span-2 max-w-md">
            <img
              src="/assets/trust-badge.png"
              alt="ADP-TOP — tervezett projektor-fényforrás ellátás, eredeti gyári izzó dokumentált ellátási láncból (alapítva 2006)"
              loading="lazy"
              width={1576}
              height={686}
              className="w-full h-auto opacity-80"
            />
            <Link
              href="/about"
              className="mt-3 block text-center text-xs text-muted-foreground hover:text-foreground"
            >
              Garantált tartós vetítés — eredeti gyári izzó, dokumentált ellátási lánc
            </Link>
          </div>
          <div>
            <div className="font-medium text-foreground mb-3">
              <Link href="/katalogus" className="hover:text-foreground">
                Teljes katalógus
              </Link>
            </div>
            <ul className="space-y-2 text-muted-foreground">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link href={`/kategoria/${c.slug}`} className="hover:text-foreground">
                    {c.shortName}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/markak" className="hover:text-foreground">
                  Márkák
                </Link>
              </li>
              <li>
                <Link href="/projektor-modell" className="hover:text-foreground">
                  Projektor modellek
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="font-medium text-foreground mb-3">
              <Link href="/about" className="hover:text-foreground">
                Rólunk
              </Link>
            </div>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link href="/megtakaritas" className="hover:text-foreground">
                  Megtakarítás
                </Link>
              </li>
              <li>
                <Link href="/csere-utmutato" className="hover:text-foreground">
                  Csere útmutató
                </Link>
              </li>
              <li>
                <Link href="/gyik" className="hover:text-foreground">
                  GYIK
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-foreground">
                  Tudásbázis
                </Link>
              </li>
              <li>
                <Link href="/aszf" className="hover:text-foreground">
                  ÁSZF
                </Link>
                {" és "}
                <Link href="/adatvedelem" className="hover:text-foreground">
                  GDPR
                </Link>
              </li>
              <li>
                <Link href="/kapcsolat" className="hover:text-foreground">
                  Kapcsolat
                </Link>
              </li>
              <li>
                <Link href="/partner/login" className="hover:text-foreground">
                  Partner oldal / Belépés
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="w-full px-6 py-4 text-xs text-muted-foreground text-center">
          <span>
            © Copyright {company.foundedYear} – {new Date().getUTCFullYear()}
            {"  |  "}Minden jog fenntartva.{"  |  "}
            <Link href="/kapcsolat" className="hover:text-foreground">
              Kérdésed van? Írj nekünk!
            </Link>
            {" |"}
          </span>
        </div>
      </div>
    </footer>
  );
}
