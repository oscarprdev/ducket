// import { signToken, verifyToken } from './server/auth/session';
// import { type NextRequest, NextResponse } from 'next/server';
import NextAuth from 'next-auth';
import { authConfig } from '~/server/auth/config';

export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  matcher: ['/', '/(en|es)/:path*', '/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
