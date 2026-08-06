import { NextRequest, NextResponse } from "next/server";

export const ADMIN_COOKIE_NAME = "sm_admin_session";

export function isAdminRequest(request: NextRequest): boolean {
  const expected = process.env.ADMIN_SESSION_SECRET;
  const received = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  return Boolean(expected && received && received === expected);
}

export function unauthorizedResponse() {
  return NextResponse.json(
    { message: "Administrator login required." },
    { status: 401 }
  );
}
