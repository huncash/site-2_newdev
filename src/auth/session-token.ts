import { createHmac, timingSafeEqual } from "node:crypto";

import authConfig from "../config/auth.json";
import type { User, UserRole } from "@/lib/types";
import { SESSION_COOKIE } from "./session-constants";

export { SESSION_COOKIE };

export interface SessionClaims {
  sub: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}

export interface PublicSession {
  token: string;
  user: User;
  createdAt: string;
  expiresAt: string;
}

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET ?? process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("SESSION_SECRET (min 16 chars) is required");
  }
  return secret;
}

function b64urlJson(value: unknown): string {
  return Buffer.from(JSON.stringify(value), "utf-8").toString("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) {
    return false;
  }
  return timingSafeEqual(left, right);
}

export function toPublicUser(user: Pick<User, "id" | "email" | "role">): User {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
  };
}

export function signSessionToken(
  user: Pick<User, "id" | "email" | "role">,
  ttlSeconds = authConfig.sessionTtlSeconds
): PublicSession {
  const secret = getSessionSecret();
  const createdAt = new Date();
  const expiresAt = new Date(createdAt.getTime() + ttlSeconds * 1000);
  const claims: SessionClaims = {
    sub: user.id,
    email: user.email,
    role: user.role,
    iat: Math.floor(createdAt.getTime() / 1000),
    exp: Math.floor(expiresAt.getTime() / 1000),
  };

  const header = b64urlJson({ alg: "HS256", typ: "JWT" });
  const payload = b64urlJson(claims);
  const data = `${header}.${payload}`;
  const sig = createHmac("sha256", secret).update(data).digest("base64url");
  const token = `${data}.${sig}`;

  return {
    token,
    user: toPublicUser(user),
    createdAt: createdAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
  };
}

export function verifySessionToken(token: string): SessionClaims | null {
  try {
    const secret = getSessionSecret();
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    const [header, payload, signature] = parts;
    const expected = createHmac("sha256", secret)
      .update(`${header}.${payload}`)
      .digest("base64url");

    if (!safeEqual(signature, expected)) {
      return null;
    }

    const claims = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf-8")
    ) as SessionClaims;

    if (
      typeof claims.sub !== "string" ||
      typeof claims.email !== "string" ||
      typeof claims.role !== "string" ||
      typeof claims.exp !== "number"
    ) {
      return null;
    }

    if (claims.exp * 1000 <= Date.now()) {
      return null;
    }

    return claims;
  } catch {
    return null;
  }
}

export function claimsToUser(claims: SessionClaims): User {
  return {
    id: claims.sub,
    email: claims.email,
    role: claims.role,
  };
}

export function getTokenFromAuthHeader(
  authorization: string | undefined
): string | null {
  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }
  const token = authorization.slice("Bearer ".length).trim();
  return token.length > 0 ? token : null;
}

export function sessionCookieOptions(maxAgeSeconds: number) {
  const secure =
    process.env.AUTH_COOKIE_SECURE === "true" ||
    process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure,
    path: "/",
    maxAge: maxAgeSeconds * 1000,
  };
}

export function nextSessionCookieOptions(maxAgeSeconds: number) {
  const secure =
    process.env.AUTH_COOKIE_SECURE === "true" ||
    process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure,
    path: "/",
    maxAge: maxAgeSeconds,
  };
}
