import { signInWithCredentials } from '../actions';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AuthForm } from '~/components/auth/auth-form';
import SignInGithub from '~/components/auth/sign-in';
import { auth } from '~/server/auth';

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const session = await auth();
  if (session) {
    redirect('/dashboard');
  }
  const { email } = await searchParams;
  return (
    <>
      <h1 className="mb-6 text-center text-2xl font-bold">Sign In to Ducket</h1>
      <div className="space-y-4">
        <SignInGithub />
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>
        <AuthForm email={email} action={signInWithCredentials} mode={'sign-in'} />
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/sign-up" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </>
  );
}
