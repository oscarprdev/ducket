import { PlusCircle } from 'lucide-react';
import ProjectCard from '~/components/project-card';
import { Button } from '~/components/ui/button';
import { auth } from '~/server/auth';
import { QUERIES } from '~/server/db/queries';

export default async function Dashboard() {
  const session = await auth();
  if (!session) return null;

  const projects = await QUERIES.getProjects({ ownerId: session?.user.id });

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map(project => (
          <ProjectCard
            key={project.id}
            project={{
              id: project.id,
              title: project.title,
              owner: project.ownerId,
              lastUpdate: project.updatedAt.toLocaleDateString('en-GB'),
              visibility: 'private',
            }}
          />
        ))}
      </div>
    </>
  );
}
