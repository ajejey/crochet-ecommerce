import { NextResponse } from "next/server";
import { createSessionClient, createAdminClient } from "./appwrite/config";
import { cookies } from 'next/headers';

async function getUser(request) {
    const sessionCookie = request.cookies.get('session');
    if (!sessionCookie?.value) return null;

    try {
        const { account } = await createSessionClient(sessionCookie.value);
        const user = await account.get();

        // Get user role from database
        const { databases } = createAdminClient();
        const userData = await databases.getDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID,
            process.env.NEXT_PUBLIC_COLLECTION_USERS,
            user.$id
        );
        user.role = userData.role;
        return user;
    } catch (error) {
        console.error('Middleware auth error:', error);
        return null;
    }
}

export async function middleware(request) {
    const user = await getUser(request);
    const { pathname } = request.nextUrl;

    // If no user, redirect to login except for public routes
    if (!user && !isPublicRoute(pathname)) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // Handle seller routes
    if (pathname.startsWith('/seller') || pathname.startsWith('/admin')) {
        if (!user) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
        if (user.role !== 'seller' && user.role !== 'admin') {
            return NextResponse.redirect(new URL("/become-seller", request.url));
        }
    }

    // Handle admin-only routes
    if (pathname.startsWith('/admin')) {
        if (user.role !== 'admin') {
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    return NextResponse.next();
}

function isPublicRoute(pathname) {
    return (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname === '/' ||
        pathname === '/login' ||
        pathname === '/signup' ||
        pathname.startsWith('/shop/product') ||
        pathname === '/shop' ||
        pathname === '/products' ||
        pathname === '/become-seller'
    );
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ]
}

// import { NextResponse } from "next/server";
// import auth from "./auth";

// export async function middleware(request){
//     const user = auth.getUser()

//     if(!user){
//         request.cookies.delete("session")
//          return NextResponse.redirect(new URL("/login", request.url))
//         }
//     console.log("middleware ran")

//     return NextResponse.next()
// }

// export const config = {
//     matcher: [
//         "/admin/:path*",
//     ]
// }