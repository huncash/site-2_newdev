export const FALLBACK_EUR_HUF_RATE: number;
export const APPROVE_BASE_URL: string;

export type RateInfo = {
  rate: number;
  source: string;
  asOf: string | null;
  fallback: boolean;
};

export type PriceChange = {
  sku: string;
  name: string;
  oldNetHuf: number;
  newNetHuf: number;
  costEur: number;
  costHuf: number;
  variant?: string;
};

export type PriceProposal = {
  version: 1;
  createdAt: string;
  expiresAt: string;
  rateHufPerEur: number;
  rateSource: string;
  asOf: string | null;
  targetMarginPct: number;
  costs: Record<string, number>;
  changes: PriceChange[];
};

export type FeaturedProduct = {
  sku: string;
  name: string;
  netHuf: number;
  variant?: string;
};

export function loadProjectEnv(root: string): void;
export function sealApproveToken(plain: string): string;
export function openApproveToken(encoded: string): string;
export function readApproveToken(): string;
export function approveTokenMatches(provided: string): boolean;
export function approveUrl(token: string, baseUrl?: string): string;
export function redactSecrets(text: string): string;
export function fetchEurHufRate(
  loaders?: Array<() => Promise<{ rate: number; source: string; asOf: string | null }>>,
): Promise<RateInfo>;
export function ceilForint(value: number): number | null;
export function buildProposal(input: {
  products: FeaturedProduct[];
  costs: Record<string, number> | null;
  rate: number;
  rateSource: string;
  asOf?: string | null;
}): PriceProposal;
export function assertProposalApplicable(
  proposal: PriceProposal,
  products: FeaturedProduct[],
  costs: Record<string, number> | null,
): void;
export function applyFeaturedNets(source: string, changes: PriceChange[]): string;
export function huf(value: number): string;
export function eur(value: number): string;
export function rateLabel(rateInfo: RateInfo): string;
export function renderAlertEmail(input: {
  rateInfo: RateInfo;
  rows: Array<{
    product: { sku: string; name: string; netHuf: number };
    costEur: number | null;
    costHuf: number | null;
    stats: { marginHuf: number; marginPct: number; markupPct: number } | null;
    targetNet: number | null;
    raiseNet: number | null;
    reasons: string[];
  }>;
  approveUrl: string | null;
  missingButtonReason?: string | null;
}): { text: string; html: string };
export function renderConfirmHtml(proposal: PriceProposal, token: string): string;
export function renderSuccessHtml(proposal: PriceProposal): string;
export function renderMessageHtml(title: string, message: string): string;
