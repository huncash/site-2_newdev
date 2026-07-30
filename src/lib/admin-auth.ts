import "server-only";

import { cookies, headers } from "next/headers";

import authConfig from "@/config/auth.json";
import {
  SESSION_COOKIE,
  claimsToUser,
  getTokenFromAuthHeader,
  verifySessionToken,
  type SessionClaims,
} from "@/auth/session-token";
import type { User } from "@/lib/types";

export class AdminAuthError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function readAdminToken(): Promise<string | null> {
  const headerList = await headers();
  const fromHeader = getTokenFromAuthHeader(headerList.get("authorization") ?? undefined);
  if (fromHeader) return fromHeader;

  const jar = await cookies();
  const fromCookie = jar.get(SESSION_COOKIE)?.value;
  return fromCookie && fromCookie.length > 0 ? fromCookie : null;
}

export async function getAdminClaims(): Promise<SessionClaims | null> {
  const token = await readAdminToken();
  if (!token) return null;
  return verifySessionToken(token);
}

export async function requireAdminUser(): Promise<User> {
  const claims = await getAdminClaims();
  if (!claims) {
    throw new AdminAuthError(401, "Unauthorized");
  }

  const user = claimsToUser(claims);
  const level = authConfig.roles[user.role] ?? authConfig.roles.guest;
  if (level < authConfig.roles.admin) {
    throw new AdminAuthError(403, "Forbidden");
  }

  return user;
}

export function adminAuthResponse(error: unknown): Response {
  if (error instanceof AdminAuthError) {
    return Response.json({ error: error.message }, { status: error.status });
  }
  console.error("[admin]", error);
  return Response.json({ error: "Internal error" }, { status: 500 });
}
