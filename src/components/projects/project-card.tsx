import Link from 'next/link';
import { Badge } from '~/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';
import { QUERIES } from '~/server/db/queries';

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    owner: string;
    lastUpdate: string;
    visibility: 'public' | 'private';
  };
}

export default async function ProjectCard({ project }: ProjectCardProps) {
  const [user] = await QUERIES.getUserById({ id: project.owner });

  return (
    <Link href={`/dashboard/${project.id}`}>
      <Card>
        <CardHeader>
          <CardTitle>{project.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">Owner: {user?.name}</p>
          <p className="text-sm text-gray-500">Last updated: {project.lastUpdate}</p>
        </CardContent>
        <CardFooter>
          <Badge variant={project.visibility === 'public' ? 'secondary' : 'outline'}>
            {project.visibility}
          </Badge>
        </CardFooter>
      </Card>
    </Link>
  );
}
