"use server";

/**
 * Admin szerver actions — Next.js átültetés (TanStack createServerFn helyett).
 * A teljes scrapelési / Supabase admin pipeline később API route-okra bontható.
 */

import { requireAdminUser } from "@/lib/admin-auth";

export async function bootstrapAdminFromEmail(): Promise<{
  promoted: boolean;
  error?: string;
}> {
  await requireAdminUser();
  return { promoted: false };
}

export async function scrapeCompetitorsForModel(_input?: {
  data: { model: string };
}): Promise<{
  results: Array<{
    site: string;
    hostname: string;
    url: string;
    title?: string;
    priceNetHuf: number | null;
    stockStatus: "in_stock" | "lead_time" | "on_request" | "out_of_stock" | "unknown";
    stockRaw: string | null;
    leadTimeBusinessDays: number | null;
    leadTimeRaw: string | null;
  }>;
  fetchedAt: string;
}> {
  await requireAdminUser();
  return { results: [], fetchedAt: new Date().toISOString() };
}

export async function approveProductPrice(_input?: {
  data: { slug: string; publicPriceHuf: number; note?: string };
}): Promise<{ ok: boolean }> {
  await requireAdminUser();
  return { ok: true };
}

export async function upsertProductStock(_input?: {
  data: {
    slug: string;
    status: "in_stock" | "lead_time" | "on_request";
    leadTimeBusinessDays?: number | null;
    source?: "manual" | "auto";
  };
}): Promise<{ ok: boolean }> {
  await requireAdminUser();
  return { ok: true };
}

export async function syncFeaturedStock(): Promise<{
  ok: boolean;
  updated?: number;
  message?: string;
  summary: {
    slug: string;
    status: "in_stock" | "lead_time" | "unchanged";
    leadTimeBusinessDays: number | null;
    note: string;
  }[];
}> {
  await requireAdminUser();
  return {
    ok: false,
    message: "stock-sync még nincs átültetve Next.js-re",
    summary: [],
  };
}
