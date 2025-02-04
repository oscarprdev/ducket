import CreateProject from '~/components/create-project';
import { SignOut } from '~/components/sign-out';

export default async function Dashboard() {
  return (
    <main>
      <SignOut />
      <CreateProject/>
    </main>
  );
}
