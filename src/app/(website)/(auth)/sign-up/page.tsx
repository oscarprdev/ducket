'use server';

import { signUp } from '../actions';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AuthForm } from '~/components/auth/auth-form';
import { auth } from '~/server/auth';

export default async function SignUpPage() {
  const session = await auth();
  if (session) {
    redirect('/dashboard');
  }
  return (
    <>
      <h1 className="mb-6 text-center text-2xl font-bold">Sign Up to Ducket</h1>
      <div className="space-y-4">
        <AuthForm action={signUp} mode={'sign-up'} />
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?
          <Link href="/sign-in" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </>
  );
}
