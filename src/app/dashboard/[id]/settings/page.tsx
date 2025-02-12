import { Suspense } from 'react';
import { DangerZone } from '~/components/settings/danger-zone';
import { ProjectTitleCard } from '~/components/settings/project-title';
import {
  ProjectTitleCardSkeleton,
  TransferProjectCardSkeleton,
} from '~/components/settings/settings-skeletons';
import { TransferProjectCard } from '~/components/settings/transfer-project';
import { QUERIES } from '~/server/db/queries';

async function ProjectTitleCardSSR({ projectId }: { projectId: string }) {
  const [project] = await QUERIES.projects.getById({ projectId });
  if (!project) {
    return <div>Project not found</div>;
  }
  return <ProjectTitleCard project={project} />;
}

export default async function SettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
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

      <Suspense fallback={<ProjectTitleCardSkeleton />}>
        <ProjectTitleCardSSR projectId={id} />
      </Suspense>

      <Suspense fallback={<TransferProjectCardSkeleton />}>
        <TransferProjectCard />
      </Suspense>

      <DangerZone />
    </section>
  );
}
