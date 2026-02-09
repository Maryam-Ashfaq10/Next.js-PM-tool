import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const protectedPaths = ["/", "/dashboard", "/projects", "/settings"];
const authPaths = ["/login", "/register"];

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;
  const { pathname } = req.nextUrl;

  const isProtectedPath = protectedPaths.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
  const isAuthPath = authPaths.some((p) => pathname === p || pathname.startsWith(p + "/"));

  const secret = new TextEncoder().encode(process.env.JWT_SECRET || "");

  const verifyToken = async () => {
    if (!token) return false;
    try {
      await jwtVerify(token, secret);
      return true;
    } catch {
      return false;
    }
  };

  const isValid = await verifyToken();

  // Authenticated user visiting login/register → redirect to dashboard
  if (token && isAuthPath) {
    if (isValid) return NextResponse.redirect(new URL("/", req.url));
  }

  // Unauthenticated user visiting protected route → redirect to login
  if (!token && isProtectedPath) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (token && isProtectedPath) {
    if (!isValid) {
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