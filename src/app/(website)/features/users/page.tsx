import Link from 'next/link';
import { Button } from '~/components/ui/button';
import { FeatureImage } from '~/components/website/features/files-image';

export default function UsersPage() {
  return (
    <>
      <section className="relative mx-auto mt-12 max-w-[1200px] space-y-4 bg-background px-4 py-8 sm:mt-16 sm:space-y-6 sm:py-10 md:mt-20 md:space-y-8 md:py-12">
        <h1 className="pointer-events-none text-4xl font-bold leading-none tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl">
          Users
        </h1>
        <p className="max-w-[700px] text-base text-muted-foreground sm:text-lg md:text-xl">
          Effortlessly create, manage, invite, and remove users in your project, granting them the
          necessary permissions to handle your files.
        </p>
        <Button asChild className="flex-1">
          <Link href="/sign-in">{`Invite users to your project now ->`}</Link>
        </Button>
      </section>
      <section className="relative mx-auto max-w-[1200px] space-y-8 bg-background px-4">
        <FeatureImage
          src="https://ducket.dev/b3147339-819b-4dac-9362-103f174efcae/users-screen.webp"
          alt="Files"
        />
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-transparent from-10% to-background to-100%"></div>
      </section>
      <section className="relative mx-auto -mt-10 max-w-[1200px] space-y-4 bg-background px-4 py-8">
        <h2 className="pointer-events-none text-2xl font-bold leading-none tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
          Manage your invitations
        </h2>
        <p className="max-w-[700px] text-base text-muted-foreground sm:text-lg md:text-xl">
          Manage your invitations, accept, reject them or remove users from your project.
        </p>
      </section>
      <section className="relative mx-auto max-w-[1200px] space-y-8 bg-background px-4">
        <FeatureImage
          src="https://ducket.dev/b3147339-819b-4dac-9362-103f174efcae/invitations-screen.webp"
          alt="Files"
        />
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-transparent from-10% to-background to-100%"></div>
      </section>
      <section className="relative mx-auto -mt-10 max-w-[1200px] space-y-4 bg-background px-4 py-8">
        <h2 className="pointer-events-none text-2xl font-bold leading-none tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
          Transfer ownership
        </h2>
        <p className="max-w-[700px] text-base text-muted-foreground sm:text-lg md:text-xl">
          Transfer the ownership of your project to another user.
        </p>
      </section>
      <section className="relative mx-auto max-w-[1200px] space-y-8 bg-background px-4">
        <FeatureImage
          src="https://ducket.dev/b3147339-819b-4dac-9362-103f174efcae/transfers-screen.webp"
          alt="Files"
        />
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-transparent from-10% to-background to-100%"></div>
      </section>
    </>
  );
}
