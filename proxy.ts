import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "sm_admin_session";

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const isLoginPage = pathname === "/admin/login";
  const isLoginApi = pathname === "/api/admin/login";
  const isAdminPage = pathname === "/admin" || pathname.startsWith("/admin/");
  const isUploadApi = pathname.startsWith("/api/upload");
  const isSettingsWrite =
    pathname.startsWith("/api/website-settings") && request.method !== "GET";

  const protectedRequest = isAdminPage || isUploadApi || isSettingsWrite;

  if (isLoginPage || isLoginApi || !protectedRequest) {
    return NextResponse.next();
  }

  const expected = process.env.ADMIN_SESSION_SECRET;
  const received = request.cookies.get(COOKIE_NAME)?.value;
  const authenticated = Boolean(expected && received && received === expected);

  if (authenticated) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json(
      { message: "Administrator login required." },
      { status: 401 }
    );
  }

  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/upload/:path*",
    "/api/website-settings/:path*",
  ],
};
