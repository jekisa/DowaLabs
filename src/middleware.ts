import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "dowalabs_session";

export function middleware(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("from", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // JWT validity and the admin role are checked again in the server layouts
  // and route handlers, where MongoDB and jsonwebtoken are available.
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/payment/:path*", "/admin/:path*"],
};
