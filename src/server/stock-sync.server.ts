/** Stub — teljes stock-sync pipeline későbbi sprint. */
export async function runFeaturedStockSync(_opts?: {
  caller?: string;
}): Promise<{ ok: boolean; updated: number; message: string }> {
  return {
    ok: false,
    updated: 0,
    message: "stock-sync.server stub — még nincs átültetve",
  };
}
