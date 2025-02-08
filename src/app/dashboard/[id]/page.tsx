import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import FileTable from '~/components/file-table';
import FileTableSkeleton from '~/components/file-table-skeleton';
import { FileUploadDialog } from '~/components/file-upload-dialog';
import { API_KEY_PERMISSIONS, VALID_FILE_TYPES } from '~/lib/constants';
import { auth } from '~/server/auth';
import { QUERIES } from '~/server/db/queries';

async function ProjectFiles({
  projectId,
  apiKey,
  isDeleteAllowed,
}: {
  projectId: string;
  apiKey: string;
  isDeleteAllowed: boolean;
}) {
  const files = await QUERIES.getFilesByProjectId({ projectId });
  return (
    <FileTable
      apiKey={apiKey}
      isDeleteAllowed={isDeleteAllowed}
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
  const session = await auth();
  if (!session?.user?.id) redirect('/dashboard');

  const response = await QUERIES.getApiKeyByProjectAndUser({
    projectId: id,
    userId: session.user.id,
  });

  if (response.length === 0 || !response[0]) redirect('/dashboard');

  const secret = response[0].secret;
  const permissions = response[0].permissions;
  const isUploadAllowed =
    permissions.includes(API_KEY_PERMISSIONS.all) ||
    permissions.includes(API_KEY_PERMISSIONS.write);
  const isDeleteAllowed = permissions.includes(
    API_KEY_PERMISSIONS.all || API_KEY_PERMISSIONS.delete
  );

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Project Files</h1>
        {isUploadAllowed && <FileUploadDialog apiKey={secret} projectId={id} />}
      </div>
      <Suspense fallback={<FileTableSkeleton />}>
        <ProjectFiles projectId={id} apiKey={secret} isDeleteAllowed={isDeleteAllowed} />
      </Suspense>
    </>
  );
}
