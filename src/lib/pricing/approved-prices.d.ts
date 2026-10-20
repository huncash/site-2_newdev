export type ApprovedPrices = {
  version: 1;
  updatedAt: string | null;
  prices: Record<string, { netHuf: number }>;
};

export type ApprovedChange = {
  sku: string;
  newNetHuf: number;
};

export function emptyApproved(): ApprovedPrices;
export function approvedPricesPath(root: string): string;
export function parseApproved(parsed: unknown): ApprovedPrices;
export function readApprovedPrices(root: string): ApprovedPrices;
export function loadApprovedPrices(root: string): { record: ApprovedPrices; warning: string | null };
export function applyApprovedNets<T extends { sku: string; netHuf: number }>(
  products: T[],
  approved: ApprovedPrices | null | undefined,
): T[];
export function overlayFeaturedPrices<T extends { sku: string; featuredPrice?: { netHuf: number } }>(
  products: T[],
  approved: ApprovedPrices | null | undefined,
): T[];
export function writeApprovedPrices(root: string, changes: ApprovedChange[]): ApprovedPrices;
