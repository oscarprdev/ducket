import { Info } from 'lucide-react';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { AccountCredentials } from '~/components/dashboard/account/account-credentials';
import { AccountDangerZone } from '~/components/dashboard/account/account-danger-zone';
import { AccountProfileImage } from '~/components/dashboard/account/account-profile-image';
import { AccountProfileInformation } from '~/components/dashboard/account/account-profile-information';
import {
  CredentialsCardSkeleton,
  ProfileImageSkeleton,
  ProfileInfoSkeleton,
} from '~/components/dashboard/account/account-skeletons';
import DashboardLayout from '~/components/dashboard/dashboard-layout';
import DashboardSidebar from '~/components/dashboard/dashboard-sidebar';
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';
import { auth } from '~/server/auth';
import { QUERIES } from '~/server/db/queries';

async function AccountProfileImageSSR({
  userId,
  isOAuthUser,
}: {
  userId: string;
  isOAuthUser: boolean;
}) {
  const [user] = await QUERIES.users.getById({ id: userId });
  if (!user) {
    redirect('/sign-in');
  }
  return (
    <AccountProfileImage userId={userId} profileImage={user.image} isOAuthUser={isOAuthUser} />
  );
}

async function AccountProfileInformationSSR({
  userId,
  isOAuthUser,
}: {
  userId: string;
  isOAuthUser: boolean;
}) {
  const [user] = await QUERIES.users.getById({ id: userId });
  if (!user) {
    redirect('/sign-in');
  }
  return (
    <AccountProfileInformation
      userId={userId}
      name={user.name}
      email={user.email}
      isOAuthUser={isOAuthUser}
    />
  );
}

async function AccountCredentialsSSR({
  userId,
  isOAuthUser,
}: {
  userId: string;
  isOAuthUser: boolean;
}) {
  const [user] = await QUERIES.users.getById({ id: userId });
  if (!user) {
    redirect('/sign-in');
  }
  return <AccountCredentials userId={userId} isOAuthUser={isOAuthUser} />;
}

export default async function AccountPage() {
  const session = await auth();
  if (!session) {
    redirect('/sign-in');
  }

  const isOAuthUser = session.user.image?.includes('github') ?? false;
  return (
    <DashboardLayout sidebarContent={<DashboardSidebar />}>
      <section className="flex flex-col space-y-6">
        {isOAuthUser && (
          <Alert className="max-w-[800px] bg-background">
            <Info className="h-4 w-4" />
            <AlertTitle>OAuth Account</AlertTitle>
            <AlertDescription>
              Your account is managed by Github. Some information cannot be changed here.
            </AlertDescription>
          </Alert>
        )}
        <Suspense fallback={<ProfileImageSkeleton />}>
          <AccountProfileImageSSR userId={session.user.id} isOAuthUser={isOAuthUser} />
        </Suspense>
        <Suspense fallback={<ProfileInfoSkeleton />}>
          <AccountProfileInformationSSR userId={session.user.id} isOAuthUser={isOAuthUser} />
        </Suspense>
        <Suspense fallback={<CredentialsCardSkeleton />}>
          <AccountCredentialsSSR userId={session.user.id} isOAuthUser={isOAuthUser} />
        </Suspense>

        <AccountDangerZone userId={session.user.id} />
      </section>
    </DashboardLayout>
  );
}
