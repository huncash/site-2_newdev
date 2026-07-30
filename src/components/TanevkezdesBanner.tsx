"use client";

import Link from "next/link";
import { campaignPhase } from "@/lib/tanevkezdes";

type BannerVariant = "iskola" | "egyetem" | "tankerulet";

const COPY: Record<BannerVariant, string> = {
  iskola:
    "Tanévkezdés: projektor lámpamodul készletellenőrzés és tételes árajánlat iskoláknak.",
  egyetem:
    "Félévkezdés: kari / AV projektor lámpamodul összevont beszerzés — tételes árajánlat.",
  tankerulet:
    "Tankerületi központok: összevont lámpamodul-lista, áfás számla, határidős szállítás.",
};

export function TanevkezdesBanner({ variant = "iskola" }: { variant?: BannerVariant }) {
  const phase = campaignPhase();
  if (phase === "off" || phase === "csend") return null;

  return (
    <div className="bg-primary text-primary-foreground text-sm">
      <div className="max-w-7xl mx-auto px-6 py-2.5 flex flex-wrap items-center justify-between gap-2">
        <span>{COPY[variant]}</span>
        <Link
          href="/ajanlatkeres"
          className="underline underline-offset-2 font-medium hover:opacity-90"
        >
          Árajánlatot kérek →
        </Link>
      </div>
    </div>
  );
}
