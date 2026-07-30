import "server-only";

import authConfig from "../config/auth.json";
import {
  authenticatePartner,
  getPartnerCart,
  registerPartnerUser,
  savePartnerCart,
} from "./partner-store";
import { PARTNER_SESSION_COOKIE } from "./session-constants";
import {
  claimsToUser,
  getTokenFromAuthHeader,
  nextSessionCookieOptions,
  signSessionToken,
  verifySessionToken,
} from "./session-token";
import type { CartItem } from "@/lib/cart-types";

const attempts = new Map<string, { count: number; resetAt: number }>();

function rateLimit(key: string, max = 30, windowMs = 15 * 60 * 1000): boolean {
  const now = Date.now();
  const row = attempts.get(key);
  if (!row || row.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (row.count >= max) return false;
  row.count += 1;
  return true;
}

function clientKey(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
}

function serializeCookie(
  name: string,
  value: string,
  opts: ReturnType<typeof nextSessionCookieOptions>
): string {
  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    `Path=${opts.path}`,
    `Max-Age=${opts.maxAge}`,
    `SameSite=${opts.sameSite}`,
  ];
  if (opts.httpOnly) parts.push("HttpOnly");
  if (opts.secure) parts.push("Secure");
  return parts.join("; ");
}

function json(
  data: unknown,
  status = 200,
  setCookies: string[] = []
): Response {
  const headers = new Headers({ "Content-Type": "application/json" });
  for (const c of setCookies) headers.append("Set-Cookie", c);
  return new Response(JSON.stringify(data), { status, headers });
}

function readPartnerToken(request: Request): string | null {
  const fromHeader = getTokenFromAuthHeader(
    request.headers.get("authorization") ?? undefined
  );
  if (fromHeader) return fromHeader;

  const cookie = request.headers.get("cookie") ?? "";
  const match = cookie
    .split(";")
    .map((p) => p.trim())
    .find((p) => p.startsWith(`${PARTNER_SESSION_COOKIE}=`));
  if (!match) return null;
  const value = decodeURIComponent(match.slice(PARTNER_SESSION_COOKIE.length + 1));
  return value.length > 0 ? value : null;
}

function requirePartnerUser(
  request: Request
):
  | { ok: true; user: ReturnType<typeof claimsToUser>; claims: NonNullable<ReturnType<typeof verifySessionToken>> }
  | { ok: false; error: Response } {
  const token = readPartnerToken(request);
  if (!token) return { ok: false, error: json({ error: "Unauthorized" }, 401) };
  const claims = verifySessionToken(token);
  if (!claims || claims.role !== "user") {
    return { ok: false, error: json({ error: "Forbidden" }, 403) };
  }
  return { ok: true, user: claimsToUser(claims), claims };
}

function partnerSessionCookie(token: string, ttl: number): string {
  return serializeCookie(
    PARTNER_SESSION_COOKIE,
    token,
    nextSessionCookieOptions(ttl)
  );
}

function clearPartnerSessionCookie(): string {
  return serializeCookie(
    PARTNER_SESSION_COOKIE,
    "",
    nextSessionCookieOptions(0)
  );
}

export async function handlePartnerRegister(request: Request): Promise<Response> {
  if (!rateLimit(`partner-reg:${clientKey(request)}`)) {
    return json({ error: "Too many attempts" }, 429);
  }

  let body: { email?: string; password?: string };
  try {
    body = (await request.json()) as { email?: string; password?: string };
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const result = await registerPartnerUser(
    body.email?.trim() ?? "",
    body.password ?? ""
  );
  if ("error" in result) {
    return json({ error: result.error }, result.status);
  }

  const session = signSessionToken(
    { ...result, role: "user" },
    authConfig.sessionTtlSeconds
  );
  return json(
    {
      user: session.user,
      createdAt: session.createdAt,
      expiresAt: session.expiresAt,
    },
    200,
    [partnerSessionCookie(session.token, authConfig.sessionTtlSeconds)]
  );
}

export async function handlePartnerLogin(request: Request): Promise<Response> {
  if (!rateLimit(`partner-login:${clientKey(request)}`)) {
    return json({ error: "Too many login attempts" }, 429);
  }

  let body: { email?: string; password?: string };
  try {
    body = (await request.json()) as { email?: string; password?: string };
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const email = body.email?.trim() ?? "";
  const password = body.password ?? "";
  if (!email || !password) {
    return json({ error: "email and password required" }, 400);
  }

  const user = await authenticatePartner(email, password);
  if (!user || user.role !== "user") {
    return json({ error: "Invalid credentials" }, 401);
  }

  const session = signSessionToken(
    { ...user, role: "user" },
    authConfig.sessionTtlSeconds
  );
  return json(
    {
      user: session.user,
      createdAt: session.createdAt,
      expiresAt: session.expiresAt,
      cart: getPartnerCart(user.id),
    },
    200,
    [partnerSessionCookie(session.token, authConfig.sessionTtlSeconds)]
  );
}

export async function handlePartnerLogout(): Promise<Response> {
  return json({ status: "ok" }, 200, [clearPartnerSessionCookie()]);
}

export async function handlePartnerSession(request: Request): Promise<Response> {
  const auth = requirePartnerUser(request);
  if (!auth.ok) return auth.error;
  return json({
    user: auth.user,
    createdAt: new Date(auth.claims.iat * 1000).toISOString(),
    expiresAt: new Date(auth.claims.exp * 1000).toISOString(),
    cart: getPartnerCart(auth.user.id),
  });
}

export async function handlePartnerCartGet(request: Request): Promise<Response> {
  const auth = requirePartnerUser(request);
  if (!auth.ok) return auth.error;
  return json({ items: getPartnerCart(auth.user.id) });
}

export async function handlePartnerCartPut(request: Request): Promise<Response> {
  const auth = requirePartnerUser(request);
  if (!auth.ok) return auth.error;

  let body: { items?: CartItem[] };
  try {
    body = (await request.json()) as { items?: CartItem[] };
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  try {
    const items = savePartnerCart(
      auth.user.id,
      Array.isArray(body.items) ? body.items : []
    );
    return json({ items });
  } catch {
    return json({ error: "Save failed" }, 500);
  }
}
