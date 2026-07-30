"use server";

import { z } from "zod";
import { landingPages } from "@/data/landing-pages";
import { requireAdminUser } from "@/lib/admin-auth";

const AdVariantInput = z.object({
  landingPath: z.string().min(1),
  tone: z.enum(["formal", "urgent", "value"]).default("formal"),
});

export interface AdVariantResult {
  headlines: string[];
  descriptions: string[];
  keywords: {
    broad: string[];
    phrase: string[];
    exact: string[];
  };
  sitelinks: { text: string; description1: string; description2: string }[];
  notes: string;
}

export interface CampaignAuditResult {
  strengths: string[];
  weaknesses: string[];
  next_actions: Array<{
    title: string;
    why: string;
    effort: "low" | "medium" | "high";
  }>;
  seasonal_note: string;
}

export async function generateAdVariants(input?: {
  data: { landingPath: string; tone?: "formal" | "urgent" | "value" };
}): Promise<AdVariantResult> {
  await requireAdminUser();
  const data = AdVariantInput.parse(input?.data ?? { landingPath: "/" });
  const lp = landingPages.find((p) => p.path === data.landingPath);
  if (!lp) throw new Error(`Ismeretlen landing: ${data.landingPath}`);

  return {
    headlines: [lp.title.slice(0, 30)],
    descriptions: [lp.brief.slice(0, 90)],
    keywords: {
      broad: [lp.primaryKeyword],
      phrase: lp.supportingKeywords.slice(0, 8),
      exact: [lp.primaryKeyword],
    },
    sitelinks: [],
    notes: "Stub — LOVABLE_API_KEY / AI gateway még nincs bekötve Next szerver actionbe.",
  };
}

export async function auditLandingPage(input?: {
  data: { landingPath: string };
}): Promise<CampaignAuditResult> {
  await requireAdminUser();
  const path = input?.data?.landingPath ?? "/";
  const lp = landingPages.find((p) => p.path === path);
  if (!lp) throw new Error(`Ismeretlen landing: ${path}`);
  return {
    strengths: [],
    weaknesses: ["AI audit stub — még nincs átültetve."],
    next_actions: [],
    seasonal_note: "Stub",
  };
}
