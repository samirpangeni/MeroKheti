import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const role = req.cookies.get("role")?.value;
  const pathname = req.nextUrl.pathname;

  // Public routes
  const publicRoutes = ["/login", "/register"];

  // If logged in, don't allow login/register
  if (publicRoutes.includes(pathname)) {
    if (token) {
      if (role === "admin") {
        return NextResponse.redirect(
          new URL("/admin", req.url)
        );
      }

      if (role === "farmer") {
        return NextResponse.redirect(
          new URL("/farmer", req.url)
        );
      }

      return NextResponse.redirect(
        new URL("/customer", req.url)
      );
    }

    return NextResponse.next();
  }

  // Not logged in
  if (!token) {
    return NextResponse.redirect(
      new URL("/login", req.url)
    );
  }

  // Customer restrictions
  if (
    role === "customer" &&
    (
      pathname.startsWith("/admin") ||
      pathname.startsWith("/farmer")
    )
  ) {
    return NextResponse.redirect(
      new URL("/customer", req.url)
    );
  }

  // Farmer restrictions
  if (
    role === "farmer" &&
    pathname.startsWith("/admin")
  ) {
    return NextResponse.redirect(
      new URL("/farmer", req.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/register",

    "/customer/:path*",
    "/farmer/:path*",
    "/admin/:path*",

    "/addProduct/:path*",
    "/cart/:path*",
    "/checkout/:path*",
    "/buy/:path*",
    "/review/:path*",
    "/report/:path*",
  ],
};