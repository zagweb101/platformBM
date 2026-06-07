import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

export default NextAuth(authConfig).auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const user = req.auth?.user;

  const isOnAdmin = nextUrl.pathname.startsWith("/admin") || nextUrl.pathname.startsWith("/dashboard/admin");
  const isOnInstructor = nextUrl.pathname.startsWith("/dashboard/instructor");
  const isOnStudent = nextUrl.pathname.startsWith("/dashboard/student");
  const isOnAuth = nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/register");

  if (isOnAuth) {
    if (isLoggedIn) {
      if (user?.role === "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard/admin", nextUrl));
      } else if (user?.role === "INSTRUCTOR") {
        return NextResponse.redirect(new URL("/dashboard/instructor", nextUrl));
      } else {
        return NextResponse.redirect(new URL("/dashboard/student", nextUrl));
      }
    }
    return NextResponse.next();
  }

  const isProtected = isOnAdmin || isOnInstructor || isOnStudent;

  if (isProtected) {
    if (!isLoggedIn) {
      let from = nextUrl.pathname;
      if (nextUrl.search) {
        from += nextUrl.search;
      }
      return NextResponse.redirect(
        new URL(`/login?from=${encodeURIComponent(from)}`, nextUrl)
      );
    }

    // Role checks
    if (isOnAdmin && user?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", nextUrl));
    }
    if (isOnInstructor && user?.role !== "INSTRUCTOR") {
      // Allow if they are on onboarding page to apply
      const isOnboarding = nextUrl.pathname === "/dashboard/instructor/onboarding";
      if (!isOnboarding) {
        return NextResponse.redirect(new URL("/", nextUrl));
      }
    }
    if (isOnStudent && user?.role !== "STUDENT") {
      return NextResponse.redirect(new URL("/", nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
