import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  const isLoginPage = pathname === "/login";

  // allow product pages always (IMPORTANT)
  const isProductRoute = pathname.startsWith("/product");

  // redirect logged-in users away from login
  if (isLoginPage && token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // protect ONLY these routes
  const protectedRoutes = ["/dashboard", "/addProduct"];

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}
export const config = {
  matcher: ["/dashboard/:path*", "/addProduct/:path*", "/login"],
}; 