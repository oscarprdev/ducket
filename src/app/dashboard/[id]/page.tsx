import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import DashboardLayout from '~/components/dashboard-layout';
import FileTable from '~/components/file-table';
import FileTableSkeleton from '~/components/file-table-skeleton';
import { FileUploadDialog } from '~/components/file-upload-dialog';
import ProjectSidebar from '~/components/project-sidebar';
import { VALID_FILE_TYPES } from '~/lib/constants';
import { QUERIES } from '~/server/db/queries';

async function ProjectFiles({ projectId }: { projectId: string }) {
  const files = await QUERIES.getFilesByProjectId({ projectId });
  return (
    <FileTable
      files={files.map(file => ({
        id: file.id,
        name: file.fileName ?? '-',
        type: file.type ?? '-',
        size: String(file.size) ?? '-',
        url: file.fileUrl,
        icon: file.type
          ? VALID_FILE_TYPES.images.includes(file.type)
            ? 'image'
            : VALID_FILE_TYPES.text.includes(file.type)
              ? 'text'
              : 'file'
          : 'file',
      }))}
    />
  );
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [project] = await QUERIES.getProject({ projectId: id });
  if (!project?.api_key) redirect('/dashboard');

  return (
    <DashboardLayout sidebarContent={<ProjectSidebar projectId={id} />}>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Project Files</h1>
        <FileUploadDialog apiKey={project.api_key} projectId={id} />
      </div>
      <Suspense fallback={<FileTableSkeleton />}>
        <ProjectFiles projectId={id} />
      </Suspense>
    </DashboardLayout>
  );
}
