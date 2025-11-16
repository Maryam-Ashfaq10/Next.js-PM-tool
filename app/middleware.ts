import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;

  // If no token → redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET!);
    return NextResponse.next(); // allow request
  } catch (err) {
    // Token invalid or expired → clear cookie + redirect
    const res = NextResponse.redirect(new URL("/login", req.url));
    res.cookies.set("auth_token", "", { maxAge: 0 });
    return res;
  }
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",   // protect dashboard
    "/projects/:path*",    // protect projects
    "/api/protected/:path*", // protect API routes
  ],
};
