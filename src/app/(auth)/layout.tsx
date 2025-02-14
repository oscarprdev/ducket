import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '~/components/ui/button';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col bg-background">
      <div className="p-4">
        <Button asChild variant="ghost">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-[400px] p-6">{children}</div>
      </div>
    </main>
  );
}
