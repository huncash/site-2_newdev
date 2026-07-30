"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/katalogus", label: "Katalógus" },
  { href: "/markak", label: "Márkák" },
  { href: "/megtakaritas", label: "Megtakarítás" },
  { href: "/csere-utmutato", label: "Csere útmutató" },
  { href: "/gyik", label: "GYIK" },
  { href: "/blog", label: "Tudásbázis" },
  { href: "/kapcsolat", label: "Kapcsolat" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <header className="bg-primary-soft border-b border-border sticky top-0 z-40">
      <div className="w-full px-6 h-16 flex items-center justify-between text-sm">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2.5 font-bold tracking-tight text-foreground"
        >
          <img
            src="/assets/logo-icon.png"
            alt="projektorlampacsere.hu logó"
            width={36}
            height={36}
            className="w-9 h-9 rounded-md"
          />
          <span>projektorlampacsere.hu</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-foreground">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-foreground hover:opacity-70 transition-opacity ${
                pathname === l.href || pathname.startsWith(l.href + "/") ? "font-medium" : ""
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/ajanlatkeres"
            className="hidden md:inline-flex px-4 py-2 bg-cta text-cta-foreground hover:bg-cta-hover rounded font-medium text-sm hover:opacity-90 transition-opacity"
          >
            Árajánlatot kérek
          </Link>
          <Link
            href="/ajanlatkeres"
            className="md:hidden px-3 py-1.5 bg-cta text-cta-foreground hover:bg-cta-hover rounded text-xs font-medium"
          >
            Árajánlat kérés
          </Link>
          <button
            type="button"
            aria-label={open ? "Menü bezárása" : "Menü megnyitása"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded border border-border text-foreground hover:bg-surface"
          >
            {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-primary-soft">
          <nav className="w-full px-6 py-3 flex flex-col text-sm">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`py-2.5 text-foreground hover:opacity-70 border-b border-border last:border-b-0 ${
                  pathname === l.href || pathname.startsWith(l.href + "/") ? "font-medium" : ""
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
