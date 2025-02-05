import Link from 'next/link';
import CreateProject from '~/components/create-project';
import { SignOut } from '~/components/sign-out';
import { auth } from '~/server/auth';
import { QUERIES } from '~/server/db/queries';

export default async function Dashboard() {
  const session = await auth();
  if (!session) return null;

  const projects = await QUERIES.getProjects({ ownerId: session?.user.id });

  return (
    <main>
      <SignOut />
      <CreateProject />
      {projects.map(project => (
        <Link key={project.id} href={`/dashboard/${project.id}`}>
          {project.title}
        </Link>
      ))}
    </main>
  );
}
