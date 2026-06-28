import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req) {
  const pathname = req.nextUrl.pathname;
  const token = req.cookies.get("token")?.value;

  const publicPages = ["/login", "/register"];
  const publicApis = ["/api/login", "/api/register"];

  // Allow login/register pages without login
  if (publicPages.includes(pathname) && !token) {
    return NextResponse.next();
  }

  // Allow login/register APIs
  if (publicApis.includes(pathname)) {
    return NextResponse.next();
  }

  // User must be logged in
  if (!token) {
    if (pathname.startsWith("/api")) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    const { payload } = await jwtVerify(token, secret);

    const role = payload.role;

    // Logged-in users cannot visit login/register
    if (publicPages.includes(pathname)) {
      if (role === "admin") {
        return NextResponse.redirect(new URL("/admin", req.url));
      }

      if (role === "farmer") {
        return NextResponse.redirect(new URL("/farmer", req.url));
      }

      return NextResponse.redirect(new URL("/customer", req.url));
    }

    // Hide API routes from browser address bar
    if (pathname.startsWith("/api")) {
      const mode = req.headers.get("sec-fetch-mode");

      if (mode === "navigate") {
        return NextResponse.rewrite(new URL("/404", req.url));
      }

      return NextResponse.next();
    }

    // Customer restrictions
    if (
      role === "customer" &&
      (pathname.startsWith("/admin") ||
        pathname.startsWith("/farmer"))
    ) {
      return NextResponse.redirect(new URL("/customer", req.url));
    }

    // Farmer restrictions
    if (
      role === "farmer" &&
      (pathname.startsWith("/admin") ||
        pathname.startsWith("/customer"))
    ) {
      return NextResponse.redirect(new URL("/farmer", req.url));
    }

    // Admin restrictions
    if (
      role === "admin" &&
      (pathname.startsWith("/farmer") ||
        pathname.startsWith("/customer"))
    ) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    return NextResponse.next();
  } catch (err) {
    console.log(err);

    if (pathname.startsWith("/api")) {
      return NextResponse.json(
        { message: "Invalid token" },
        { status: 401 }
      );
    }

    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/register",

    "/admin/:path*",
    "/farmer/:path*",
    "/customer/:path*",

    "/addProduct/:path*",
    "/cart/:path*",
    "/checkout/:path*",
    "/buy/:path*",
    "/review/:path*",
    "/report/:path*",

    "/api/:path*",
  ],
};