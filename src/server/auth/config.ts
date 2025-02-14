import { CredentialsProvider } from './auth-providers';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { type DefaultSession, type NextAuthConfig } from 'next-auth';
import GitHub from 'next-auth/providers/github';
import { db } from '~/server/db';
import { accounts, sessions, users, verificationTokens } from '~/server/db/schema';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession['user'];
  }
}

export const authConfig = {
  providers: [GitHub, CredentialsProvider],
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      return token;
    },
    session: ({ session, user, token }) => {
      const id = (user ? user.id : token.id) as string;
      return {
        ...session,
        user: {
          ...session.user,
          id,
        },
      };
    },
  },
  session: { strategy: 'jwt' },
} satisfies NextAuthConfig;
