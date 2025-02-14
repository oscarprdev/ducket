'use server';

import { signUp } from '../actions';
import Link from 'next/link';
import { AuthForm } from '~/components/auth/auth-form';

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id: email } = await searchParams;

  return (
    <>
      <h1 className="mb-6 text-center text-2xl font-bold">Sign In to Ducket</h1>
      <div className="space-y-4">
        <AuthForm email={email} action={signUp} mode={'sign-up'} />
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
