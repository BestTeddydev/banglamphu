import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for static files and assets
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.match(/\.(jpg|jpeg|png|gif|svg|webp|ico|css|js|woff|woff2|ttf|eot)$/) ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }
  
  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/news',
    '/events',
    '/tourism',
    '/tourism/attractions',
    '/tourism/restaurants',
    '/tourism/packages',
    '/tourism/custom-tour',
    '/contact',
    '/about',
    '/login',
    '/register',
    '/setup-admin'
  ];
  
  // Admin routes that require admin role
  const adminRoutes = [
    '/admin'
  ];
  
  // Check if the route is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );
  
  // Check if the route requires admin access
  const isAdminRoute = adminRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // If it's a public route, allow access
  if (isPublicRoute) {
    return NextResponse.next();
  }
  
  // Get token from cookies
  const token = request.cookies.get('auth-token')?.value;
  
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // For now, just check if token exists
  // The actual verification will be done in the API routes
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
