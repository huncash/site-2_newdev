import { NextResponse } from "next/server";

import {
  getActiveSignatureId,
  loadSignatureDataUrl,
  saveEncryptedSignature,
  deleteSignature,
  setActiveSignatureId,
} from "@/lib/signature-store";
import { adminAuthResponse, requireAdminUser } from "@/lib/admin-auth";

export async function GET() {
  try {
    await requireAdminUser();
    const id = getActiveSignatureId();
    if (!id) {
      return NextResponse.json({ id: null, dataUrl: null });
    }
    const dataUrl = loadSignatureDataUrl(id);
    return NextResponse.json({ id, dataUrl });
  } catch (error) {
    return adminAuthResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireAdminUser();

    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "file required" }, { status: 400 });
    }

    const buf = Buffer.from(await file.arrayBuffer());
    const meta = saveEncryptedSignature(buf, file.type || "image/png");
    const dataUrl = loadSignatureDataUrl(meta.id);

    return NextResponse.json({
      id: meta.id,
      mime: meta.mime,
      createdAt: meta.createdAt,
      dataUrl,
    });
  } catch (error) {
    if (error instanceof Error && /SECRET_KEY|Unsupported|size/i.test(error.message)) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return adminAuthResponse(error);
  }
}

export async function DELETE() {
  try {
    await requireAdminUser();
    const id = getActiveSignatureId();
    if (id) {
      deleteSignature(id);
    } else {
      setActiveSignatureId(null);
    }
    return NextResponse.json({ status: "ok" });
  } catch (error) {
    return adminAuthResponse(error);
  }
}
