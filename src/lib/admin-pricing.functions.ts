"use server";

import { competitorSamples, type CompetitorRow } from "@/data/competitor.server";
import { requireAdminUser } from "@/lib/admin-auth";

/** Admin-only — konkurens mintaárak soha nem mennek publikus bundle-be. */
export async function listCompetitorSamples(): Promise<CompetitorRow[]> {
  await requireAdminUser();
  return competitorSamples;
}
