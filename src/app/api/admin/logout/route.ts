import { NextResponse } from "next/server";

import { SESSION_COOKIE, nextSessionCookieOptions } from "@/auth/session-token";

export async function POST() {
  const response = NextResponse.json({ status: "ok" });
  response.cookies.set(SESSION_COOKIE, "", {
    ...nextSessionCookieOptions(0),
    maxAge: 0,
  });
  return response;
}
