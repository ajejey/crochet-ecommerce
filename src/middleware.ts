import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createSessionClient } from './appwrite/config';

// Define protected paths
const protectedPaths = ['/seller', '/shop/cart', '/shop/orders'];
const sellerPaths = ['/seller'];

// Check if path requires protection
const isProtectedPath = (path: string) => 
  protectedPaths.some(prefix => path.startsWith(prefix));

const isSellerPath = (path: string) =>
  sellerPaths.some(prefix => path.startsWith(prefix));

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Skip if not a protected path
  if (!isProtectedPath(path)) {
    return NextResponse.next();
  }

  const session = request.cookies.get('session');
  
  if (!session?.value) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    // Verify session with Appwrite
    const { account } = await createSessionClient(session.value);
    const user = await account.get();

    // Add user info to headers for server components
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', user.$id);

    // For seller paths, verify seller role
    if (isSellerPath(path)) {
      // We'll verify the seller role in the page/layout component
      // as we need to access MongoDB for that
      requestHeaders.set('x-require-seller', '1');
    }

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    // Session invalid or expired
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    '/seller/:path*',
    '/shop/cart/:path*',
    '/shop/orders/:path*'
  ]
};
