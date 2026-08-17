import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req) {
  const pathname = req.nextUrl.pathname;
  const token = req.cookies.get("token")?.value;
  const publicPages = ["/login", "/user"];
  const publicApis = ["/api/login", "/api/user"];
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
    const isSuspended = payload.isSuspended;
    const suspendUntil = payload.suspendUntil;
    const now = new Date();

    if (
      isSuspended &&
      suspendUntil &&
      now < new Date(suspendUntil)
    ) {
      // Allow the suspended page and logout
      if (
        pathname !== "/suspend" &&
        pathname !== "/api/logout"
      ) {
        return NextResponse.redirect(new URL("/suspend", req.url));
      }
    }
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

      if (
        isSuspended &&
        suspendUntil &&
        new Date() < new Date(suspendUntil)
      ) {
        return NextResponse.json(
          { message: "Your account has been suspended." },
          { status: 403 }
        );
      }
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
    if (
      err.code == "ERR_JWT_EXPIRED" ||
      err.code == "ERR_JWT_INVALID" ||
      err.code == "ERR_JWT_INVALID"
    ) {
      if (pathname.startsWith("/api")) {
        const response = NextResponse.json({ message: "session expired.Please login again." }, { status: 401 })
        response.cookies.delete("token");
        return response
      }
      const response = NextResponse.redirect(
        new URL("/login", req.url)
      );
      response.cookies.delete("token");
      return response;
    }
    if (pathname.startsWith("/api")) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }
    if (
      pathname === "/suspend" &&
      (
        !isSuspended ||
        !suspendUntil ||
        now >= new Date(suspendUntil)
      )
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/suspend",

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