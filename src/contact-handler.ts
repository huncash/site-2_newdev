const MAX_NAME = 120;
const MAX_EMAIL = 254;
const MAX_PHONE = 40;
const MAX_MESSAGE = 4000;
const MAX_CART_ITEMS = 100;

function asTrimmedString(value: unknown, max: number): string | null {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > max) {
    return null;
  }
  return trimmed;
}

export interface ContactResult {
  status: number;
  body: { status: string } | { error: string };
}

export function processContactPayload(body: unknown): ContactResult {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return { status: 400, body: { error: "Invalid JSON" } };
  }

  const data = body as Record<string, unknown>;
  const name = asTrimmedString(data.name, MAX_NAME);
  const email = asTrimmedString(data.email, MAX_EMAIL);
  const phone =
    data.phone == null || data.phone === ""
      ? ""
      : asTrimmedString(data.phone, MAX_PHONE);
  const message =
    data.message == null || data.message === ""
      ? ""
      : asTrimmedString(data.message, MAX_MESSAGE);

  if (!name || !email || phone === null || message === null) {
    return { status: 400, body: { error: "Invalid fields" } };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { status: 400, body: { error: "Invalid email" } };
  }

  const cart = Array.isArray(data.cart) ? data.cart : [];
  if (cart.length > MAX_CART_ITEMS) {
    return { status: 400, body: { error: "Cart too large" } };
  }

  console.log(
    JSON.stringify({
      event: "contact_received",
      siteId: "site-2",
      cartItemCount: cart.length,
      hasName: true,
      hasEmail: true,
      hasPhone: phone.length > 0,
      hasMessage: message.length > 0,
    })
  );

  return { status: 200, body: { status: "ok" } };
}

export async function handleContactPost(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const result = processContactPayload(body);
  return Response.json(result.body, { status: result.status });
}
