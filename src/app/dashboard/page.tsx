import { SignOut } from '~/components/sign-out';
import { auth } from '~/server/auth';

export default async function Dashboard() {
  const session = await auth();

  return (
    <main>
      <SignOut />
    </main>
  );
}
