import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { SESSION_COOKIE } from "@/auth/session-constants";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-admin-pathname", pathname);

  const isLogin =
    pathname === "/admin/login" || pathname.startsWith("/admin/login/");
  const isLoginApi = pathname.startsWith("/api/admin/login");

  if (pathname.startsWith("/api/admin")) {
    if (isLoginApi) {
      return NextResponse.next({ request: { headers: requestHeaders } });
    }
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (isLogin) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) {
    const login = new URL("/admin/login", request.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
