import { NextResponse } from "next/server";
import { auth } from "@/auth";

const AUTH_ROUTES = ["/sign-in", "/sign-up"];
const PROTECTED_ROUTES = ["/account", "/checkout", "/orders"];
const ADMIN_ROUTES = ["/admin"];

function startsWithPath(pathname: string, routes: string[]) {
  return routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

export default auth((req) => {
  const { pathname, search } = req.nextUrl;
  const isLoggedIn = Boolean(req.auth);
  const role = (req.auth?.user as { role?: string } | undefined)?.role;

  if (startsWithPath(pathname, AUTH_ROUTES) && isLoggedIn) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (startsWithPath(pathname, PROTECTED_ROUTES) && !isLoggedIn) {
    const callbackUrl = encodeURIComponent(`${pathname}${search}`);
    return NextResponse.redirect(new URL(`/sign-in?callbackUrl=${callbackUrl}`, req.url));
  }

  if (startsWithPath(pathname, ADMIN_ROUTES) && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
