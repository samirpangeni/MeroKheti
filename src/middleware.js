import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  const publicRoutes = ["/login", "/register"];

  // Allow public routes
  if (publicRoutes.includes(pathname)) {
    if (token) {
      try {
        jwt.verify(token, process.env.JWT_SECRET);
        return NextResponse.redirect(new URL("/", req.url));
      } catch (err) {
        // expired or invalid token
      }
    }
    return NextResponse.next();
  }

  // Routes that require login
  const protectedRoutes = [
    "/",
    "/dashboard",
    "/addProduct",
    "/cart",
    "/checkout",
    "/buy",
    "/review",
    "/report",
  ];

  const isProtected = protectedRoutes.some((route) =>
    pathname === route || pathname.startsWith(route + "/")
  );

  if (isProtected && !token) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET);
      return NextResponse.next();
    } catch (err) {
      const response = NextResponse.redirect(
        new URL("/login", req.url)
      );

      response.cookies.delete("token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/addProduct/:path*",
    "/cart/:path*",
    "/checkout/:path*",
    "/buy/:path*",
    "/review/:path*",
    "/report/:path*",
    "/login",
    "/register",
  ],
};