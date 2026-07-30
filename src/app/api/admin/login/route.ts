import { NextResponse } from "next/server";

import { authenticateWithPassword } from "@/auth/credentials";
import {
  SESSION_COOKIE,
  nextSessionCookieOptions,
  signSessionToken,
} from "@/auth/session-token";
import authConfig from "@/config/auth.json";

const attempts = new Map<string, { count: number; resetAt: number }>();

function rateLimit(key: string, max = 20, windowMs = 15 * 60 * 1000): boolean {
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

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (!rateLimit(`login:${ip}`)) {
    return NextResponse.json({ error: "Too many login attempts" }, { status: 429 });
  }

  let body: { email?: string; password?: string };
  try {
    body = (await request.json()) as { email?: string; password?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = body.email?.trim() ?? "";
  const password = body.password ?? "";
  if (!email || !password) {
    return NextResponse.json(
      { error: "email and password required" },
      { status: 400 }
    );
  }

  const user = await authenticateWithPassword(email, password);
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const level = authConfig.roles[user.role] ?? authConfig.roles.guest;
  if (level < authConfig.roles.admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const session = signSessionToken(user, authConfig.sessionTtlSeconds);
  const response = NextResponse.json({
    user: session.user,
    createdAt: session.createdAt,
    expiresAt: session.expiresAt,
  });
  response.cookies.set(
    SESSION_COOKIE,
    session.token,
    nextSessionCookieOptions(authConfig.sessionTtlSeconds)
  );
  return response;
}
