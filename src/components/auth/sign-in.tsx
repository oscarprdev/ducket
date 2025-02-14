import { Button } from '../ui/button';
import { Github } from 'lucide-react';
import { signIn } from '~/server/auth';

export default function SignInGithub() {
  return (
    <form
      action={async () => {
        'use server';
        await signIn('github', { redirectTo: '/dashboard' });
      }}>
      <Button type="submit" variant="outline" className="w-full">
        <Github className="mr-2 h-4 w-4" />
        Sign in with GitHub
      </Button>
    </form>
  );
}
