import { NextResponse } from "next/server";
import { createSessionClient } from "./appwrite/config";

// Define protected paths that require authentication
const protectedPaths = ['/seller', '/shop/checkout', '/shop/orders', '/admin', '/profile', '/account'];
const sellerPaths = ['/seller'];
const adminPaths = ['/admin'];

async function getUser(request) {
  const sessionCookie = request.cookies.get('session');
  if (!sessionCookie?.value) return null;

  try {
    const { account } = await createSessionClient(sessionCookie.value);
    const user = await account.get();
    return user;
  } catch (error) {
    console.error('Middleware auth error:', error);
    return null;
  }
}

function isProtectedRoute(pathname) {
  // Check if the path starts with any of the protected paths
  return protectedPaths.some(protectedPath => 
    pathname === protectedPath || pathname.startsWith(`${protectedPath}/`)
  );
}

export async function middleware(request) {
  const path = request.nextUrl.pathname;

  // Only check authentication for protected routes
  if (!isProtectedRoute(path)) {
    return NextResponse.next();
  }

  const user = await getUser(request);
  
  if (!user) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Add user info to headers for server components
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-id', user.$id);

  // For seller paths, add seller requirement header
  if (path.startsWith('/seller')) {
    requestHeaders.set('x-require-seller', '1');
  }

  // For admin paths, add admin requirement header
  if (path.startsWith('/admin')) {
    requestHeaders.set('x-require-admin', '1');
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    // Match everything except static files and api routes
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
};