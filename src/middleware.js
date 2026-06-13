import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  if (!token && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (token) {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      // Admin only
      if (
        pathname.startsWith("/admin") &&
        decoded.role !== "admin"
      ) {
        return NextResponse.redirect(new URL("/", req.url));
      }

      // Farmer only
      if (
        pathname.startsWith("/addProduct") &&
        decoded.role !== "farmer"
      ) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    } catch {
      return NextResponse.redirect(
        new URL("/login", req.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/addProduct/:path*",
    "/admin/:path*",
    "/login",
  ],
};