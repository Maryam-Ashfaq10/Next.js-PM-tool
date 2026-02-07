import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const protectedPaths = ["/", "/dashboard", "/projects", "/settings"];
const authPaths = ["/login", "/register"];

export function middleware(req: NextRequest) {
  console.log("Middleware running");
  const token = req.cookies.get("auth_token")?.value;
  const { pathname } = req.nextUrl;

  const isProtectedPath = protectedPaths.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
  const isAuthPath = authPaths.some((p) => pathname === p || pathname.startsWith(p + "/"));

  // Authenticated user visiting login/register → redirect to dashboard
  if (token && isAuthPath) {
    try {
      jwt.verify(token, process.env.JWT_SECRET!);
      return NextResponse.redirect(new URL("/", req.url));
    } catch {
      // token invalid, clear and let them through to login
    }
  }

  // Unauthenticated user visiting protected route → redirect to login
  if (!token && isProtectedPath) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (token && isProtectedPath) {
    try {
      jwt.verify(token, process.env.JWT_SECRET!);
      return NextResponse.next();
    } catch (error) {
      console.error("Middleware error:", error);
      const res = NextResponse.redirect(new URL("/login", req.url));
      res.cookies.set("auth_token", "", { maxAge: 0 });
      return res;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/dashboard/:path*",
    "/projects/:path*",
    "/settings/:path*",
  ],
};