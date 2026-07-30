import { NextResponse } from "next/server";

import { loadSignatureDataUrl } from "@/lib/signature-store";
import { adminAuthResponse, requireAdminUser } from "@/lib/admin-auth";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, ctx: Ctx) {
  try {
    await requireAdminUser();
    const { id } = await ctx.params;
    const dataUrl = loadSignatureDataUrl(id);
    return NextResponse.json({ id, dataUrl });
  } catch (error) {
    if (error instanceof Error && /not found|Invalid signature/i.test(error.message)) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return adminAuthResponse(error);
  }
}
