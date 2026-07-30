import { NextResponse } from "next/server";

import {
  deleteRawProduct,
  getRawProducts,
  upsertRawProduct,
  type RawProduct,
} from "@/lib/data-provider";
import { AdminAuthError, adminAuthResponse, requireAdminUser } from "@/lib/admin-auth";

const ADMIN_FIELDS = [
  "costPrice",
  "purchasePrice",
  "wholesalePrice",
  "supplier",
  "bulbOnlyNetHuf",
  "margin",
  "marginMultiplier",
] as const;

export async function GET() {
  try {
    await requireAdminUser();
    return NextResponse.json({ products: getRawProducts() });
  } catch (error) {
    return adminAuthResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireAdminUser();
    const body = (await request.json()) as Partial<RawProduct>;
    const products = getRawProducts();
    const nextId =
      products.reduce((max, p) => (typeof p.id === "number" && p.id > max ? p.id : max), 0) + 1;

    const product = upsertRawProduct({
      id: typeof body.id === "number" ? body.id : nextId,
      name: String(body.name ?? "").trim(),
      price: Number(body.price),
      imageUrl: String(body.imageUrl ?? "/projector-lamp-module.jpg"),
      slug: body.slug ? String(body.slug) : undefined,
      description: body.description ? String(body.description) : undefined,
      category: body.category ? String(body.category) : undefined,
      badge: body.badge ? String(body.badge) : undefined,
      specs:
        body.specs && typeof body.specs === "object"
          ? (body.specs as Record<string, string | number>)
          : undefined,
      ...pickAdminFields(body),
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return adminAuthResponse(error);
    }
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return adminAuthResponse(error);
  }
}

export async function PUT(request: Request) {
  try {
    await requireAdminUser();
    const body = (await request.json()) as Partial<RawProduct> & { id: number };
    if (typeof body.id !== "number") {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }

    const existing = getRawProducts().find((p) => p.id === body.id);
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const product = upsertRawProduct({
      ...existing,
      ...body,
      id: body.id,
      name: String(body.name ?? existing.name).trim(),
      price: Number(body.price ?? existing.price),
      imageUrl: String(body.imageUrl ?? existing.imageUrl ?? "/projector-lamp-module.jpg"),
      ...pickAdminFields({ ...existing, ...body }),
    });

    return NextResponse.json({ product });
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return adminAuthResponse(error);
    }
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return adminAuthResponse(error);
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdminUser();
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get("id"));
    if (!Number.isFinite(id)) {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }
    const ok = deleteRawProduct(id);
    if (!ok) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    return adminAuthResponse(error);
  }
}

function pickAdminFields(body: Partial<RawProduct>): Partial<RawProduct> {
  const out: Partial<RawProduct> = {};
  for (const key of ADMIN_FIELDS) {
    if (key in body) {
      (out as Record<string, unknown>)[key] = body[key];
    }
  }
  return out;
}
