import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const validEmail = process.env.ADMIN_EMAIL;
    const validPassword = process.env.ADMIN_PASSWORD;
    const sessionSecret = process.env.ADMIN_SESSION_SECRET;

    if (!validEmail || !validPassword || !sessionSecret) {
      return NextResponse.json(
        { message: "Admin environment settings are missing." },
        { status: 500 }
      );
    }

    if (email !== validEmail || password !== validPassword) {
      return NextResponse.json(
        { message: "Incorrect email address or password." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ message: "Login successful." });

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: sessionSecret,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch {
    return NextResponse.json(
      { message: "Unable to sign in." },
      { status: 400 }
    );
  }
}
