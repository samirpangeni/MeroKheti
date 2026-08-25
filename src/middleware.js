import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req) {
  const pathname = req.nextUrl.pathname;
  const token = req.cookies.get("token")?.value;

  const publicPages = ["/login", "/user"];
  const publicApis = ["/api/login", "/api/user"];

  // =========================
  // PUBLIC PAGES
  // =========================
  if (publicPages.includes(pathname) && !token) {
    return NextResponse.next();
  }

  // =========================
  // PUBLIC APIs
  // =========================
  if (publicApis.includes(pathname)) {
    return NextResponse.next();
  }

  // =========================
  // NO TOKEN
  // =========================
  if (!token) {
    if (pathname.startsWith("/api")) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.redirect(
      new URL("/login", req.url)
    );
  }

  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET
    );

    const { payload } = await jwtVerify(token, secret);

    const role = payload.role;
    const isSuspended = payload.isSuspended;
    const suspendUntil = payload.suspendUntil;

    const now = new Date();

    // =========================
    // SUSPENSION CHECK
    // =========================
    const currentlySuspended =
      isSuspended &&
      suspendUntil &&
      now < new Date(suspendUntil);

    if (currentlySuspended) {

      // Allow suspended page
      if (pathname === "/suspend") {
        return NextResponse.next();
      }

      // Allow logout
      if (pathname === "/api/logout") {
        return NextResponse.next();
      }

      // Block everything else
      if (pathname.startsWith("/api")) {
        return NextResponse.json(
          {
            message: "Your account has been suspended.",
            suspendedUntil: suspendUntil,
          },
          { status: 403 }
        );
      }

      return NextResponse.redirect(
        new URL("/suspend", req.url)
      );
    }

    // =========================
    // LOGGED-IN USERS
    // CANNOT VISIT LOGIN
    // =========================
    if (publicPages.includes(pathname)) {
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

    // =========================
    // API ROUTES
    // =========================
    if (pathname.startsWith("/api")) {

      const mode = req.headers.get("sec-fetch-mode");

      // Prevent directly navigating to API URL
      if (mode === "navigate") {
        return NextResponse.rewrite(
          new URL("/404", req.url)
        );
      }

      return NextResponse.next();
    }

    // =========================
    // CUSTOMER RESTRICTIONS
    // =========================
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

    // =========================
    // FARMER RESTRICTIONS
    // =========================
    if (
      role === "farmer" &&
      (
        pathname.startsWith("/admin") ||
        pathname.startsWith("/customer")
      )
    ) {
      return NextResponse.redirect(
        new URL("/farmer", req.url)
      );
    }

    // =========================
    // ADMIN RESTRICTIONS
    // =========================
    if (
      role === "admin" &&
      (
        pathname.startsWith("/farmer") ||
        pathname.startsWith("/customer")
      )
    ) {
      return NextResponse.redirect(
        new URL("/admin", req.url)
      );
    }

    return NextResponse.next();

  } catch (err) {
    console.log("JWT ERROR:", err);

    // =========================
    // EXPIRED / INVALID TOKEN
    // =========================
    if (
      err.code === "ERR_JWT_EXPIRED" ||
      err.code === "ERR_JWS_INVALID" ||
      err.code === "ERR_JWT_INVALID"
    ) {
      if (pathname.startsWith("/api")) {
        const response = NextResponse.json(
          {
            message: "Session expired. Please login again.",
          },
          { status: 401 }
        );

        response.cookies.delete("token");

        return response;
      }

      const response = NextResponse.redirect(
        new URL("/login", req.url)
      );

      response.cookies.delete("token");

      return response;
    }

    // =========================
    // OTHER TOKEN ERRORS
    // =========================
    if (pathname.startsWith("/api")) {
      return NextResponse.json(
        {
          message: "Invalid token",
        },
        { status: 401 }
      );
    }

    const response = NextResponse.redirect(
      new URL("/login", req.url)
    );

    response.cookies.delete("token");

    return response;
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