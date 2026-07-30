/**
 * Publikus cron végpont: kiemelt modellek készlet-szinkronja.
 * Védelem: `apikey` header = Supabase publikus (anon) kulcs.
 */
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const apiKey = request.headers.get("apikey") ?? request.headers.get("x-apikey");
  const expected = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!expected || !apiKey || apiKey !== expected) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const { runFeaturedStockSync } = await import("@/server/stock-sync.server");
    const res = await runFeaturedStockSync({ caller: "cron" });
    return NextResponse.json(res);
  } catch (e) {
    console.error("sync-stock cron failed", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "internal" },
      { status: 500 },
    );
  }
}
