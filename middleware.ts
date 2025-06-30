import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";


export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    const authRoutes = [
      "/login",
      "/signup",
      "/forgot-password",
      "/reset-password",
      "/verify-email",
    ];

    if (token && authRoutes.some((p) => pathname.startsWith(p))) {
      return NextResponse.redirect(new URL("/profile", req.url));
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        // Check if the user is authenticated.
        const { pathname } = req.nextUrl;
        if (
          pathname === "/" || // Allow root path for landing page
          pathname.startsWith("/api/auth") ||
          pathname.startsWith("/login") ||
          pathname.startsWith("/signup") ||
          pathname.startsWith("/forgot-password") ||
          pathname.startsWith("/reset-password") ||
          pathname.startsWith("/verify-email")
        )
          return true;

        return !!token;
      },
    },
  }
);


export const config = {
  matcher: [
    /*
     *
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};