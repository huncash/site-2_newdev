import type { Metadata } from "next";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Projektorlámpacsere",
  description: "Projektor lámpamodul csere — gyors, megbízható, B2B",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="hu">
      <body className="flex min-h-screen flex-col bg-background text-foreground antialiased">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
