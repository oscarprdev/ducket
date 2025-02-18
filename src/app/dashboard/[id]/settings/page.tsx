import { editProject } from '../../actions';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { DangerZone } from '~/components/dashboard/settings/danger-zone';
import { ProjectTitleCard } from '~/components/dashboard/settings/project-title';
import {
  ProjectTitleCardSkeleton,
  TransferProjectCardSkeleton,
} from '~/components/dashboard/settings/settings-skeletons';
import { TransferProjectCard } from '~/components/dashboard/settings/transfer-project';
import { auth } from '~/server/auth';
import { QUERIES } from '~/server/db/queries';

async function ProjectTitleCardSSR({ projectId }: { projectId: string }) {
  const [project] = await QUERIES.projects.getById({ projectId });
  if (!project) {
    return redirect('/dashboard');
  }
  return <ProjectTitleCard project={project} action={editProject} />;
}

export default async function SettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect('/dashboard');

  const { id } = await params;
  const [projectUser] = await QUERIES.projectUsers.getByUserId({
    userId: userId,
    projectId: id,
  });
  if (!projectUser) redirect('/dashboard');
  const isOwner = projectUser.isOwner;

  return (
    <section className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your project settings and configurations.
          </p>
        </div>
      </div>

      {isOwner ? (
        <>
          <Suspense fallback={<ProjectTitleCardSkeleton />}>
            <ProjectTitleCardSSR projectId={id} />
          </Suspense>

          <Suspense fallback={<TransferProjectCardSkeleton />}>
            <TransferProjectCard projectId={id} />
          </Suspense>

          <DangerZone projectId={id} />
        </>
      ) : (
        <p>{"You don't have permission to view project settings"}</p>
      )}
    </section>
  );
}
