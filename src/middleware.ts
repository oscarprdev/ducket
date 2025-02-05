import { type NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('authjs.session-token');
  if (protectedRoutes.includes(pathname) && !sessionCookie) {
    const newUrl = new URL('/', request.nextUrl.origin);
    return Response.redirect(newUrl);
  }
  if (pathname === '/' && sessionCookie) {
    const url = new URL('/dashboard', request.nextUrl.origin);
    return Response.redirect(url);
  }
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
