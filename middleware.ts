import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Define publicly accessible routes
const publicRoutes = new Set([
  "/",
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/about",
  "/contact",
]);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public API routes
  if (pathname.startsWith("/api/auth") || 
      (pathname === "/api/users" && req.method === "POST") ||
      pathname.startsWith("/_next") ||
      pathname.startsWith("/favicon") ||
      pathname.startsWith("/public")) {
    return NextResponse.next();
  }

  // Allow public pages
  if (publicRoutes.has(pathname)) {
    return NextResponse.next();
  }

  // Require authentication for all other routes
  try {
    const token = await getToken({ 
      req, 
      secret: process.env.NEXTAUTH_SECRET,
      secureCookie: process.env.NODE_ENV === "production"
    });

  if (!token) {
    const signInUrl = new URL("/login", req.url);
    signInUrl.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    // On error, redirect to login
    const signInUrl = new URL("/login", req.url);
    signInUrl.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(signInUrl);
  }
}

// Apply middleware to all routes except static files and public assets
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
