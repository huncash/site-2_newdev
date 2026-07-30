import { NextResponse } from "next/server";

import {
  SESSION_COOKIE,
  verifySessionToken,
} from "@/auth/session-token";
import {
  adminAuthResponse,
  readAdminToken,
  requireAdminUser,
} from "@/lib/admin-auth";

export async function GET() {
  try {
    const user = await requireAdminUser();
    const token = await readAdminToken();
    const claims = token ? verifySessionToken(token) : null;
    return NextResponse.json({
      user,
      createdAt: claims ? new Date(claims.iat * 1000).toISOString() : null,
      expiresAt: claims ? new Date(claims.exp * 1000).toISOString() : null,
      cookie: SESSION_COOKIE,
    });
  } catch (error) {
    return adminAuthResponse(error);
  }
}
