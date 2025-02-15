import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import FileTable, { type FileData } from '~/components/dashboard/files/file-table';
import FileTableSkeleton from '~/components/dashboard/files/file-table-skeleton';
import { FileUploadDialog } from '~/components/dashboard/files/file-upload-dialog';
import { API_KEY_PERMISSIONS, VALID_FILE_TYPES } from '~/lib/constants';
import { auth } from '~/server/auth';
import { QUERIES } from '~/server/db/queries';

const ITEMS_PER_PAGE = 10;

async function ProjectFilesSSR({
  projectId,
  isDeleteAllowed,
  page,
  userId,
}: {
  projectId: string;
  isDeleteAllowed?: boolean;
  page: number;
  userId: string;
}) {
  const currentPage = Number(page) || 1;
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const limit = ITEMS_PER_PAGE;
  const [files, totalItems] = await Promise.all([
    QUERIES.files.getByProjectId({
      projectId,
      limit,
      offset,
    }),
    QUERIES.files.getCount({ projectId }),
  ]);

  const filesMapped = files.map(file => ({
    id: file.id,
    name: file.fileName ?? '-',
    type: file.type ?? '-',
    size: String(file.size) ?? '-',
    createdAt: file.createdAt ?? new Date(),
    url: file.fileUrl,
    icon: file.type
      ? VALID_FILE_TYPES.images.includes(file.type)
        ? 'image'
        : VALID_FILE_TYPES.text.includes(file.type)
          ? 'text'
          : 'file'
      : 'file',
  })) as FileData[];

  return (
    <FileTable
      userId={userId}
      projectId={projectId}
      isDeleteAllowed={isDeleteAllowed}
      files={filesMapped}
      totalItems={totalItems}
      itemsPerPage={ITEMS_PER_PAGE}
      currentPage={currentPage}
    />
  );
}

export default async function ProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page: string }>;
}) {
  const { id } = await params;
  const { page } = await searchParams;
  const session = await auth();
  if (!session?.user?.id) redirect('/dashboard');

  const user = session.user;
  const [userEmail] = await QUERIES.users.getById({ id: user.id });
  const [projectUser] = await QUERIES.projectUsers.getByUserEmail({
    email: userEmail?.email ?? '',
  });
  if (!projectUser) redirect('/dashboard');

  const isUploadAllowed =
    projectUser.permissions.includes(API_KEY_PERMISSIONS.all) ||
    projectUser.permissions.includes(API_KEY_PERMISSIONS.write);
  const isDeleteAllowed =
    projectUser.permissions.includes(API_KEY_PERMISSIONS.all) ||
    projectUser.permissions.includes(API_KEY_PERMISSIONS.delete);

  return (
    <section className="relative">
      <div className="mb-6 flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Project Files</h1>
          <p className="text-sm text-muted-foreground">
            Manage and organize your project files in one place.
          </p>
        </div>
        {isUploadAllowed && <FileUploadDialog userId={user.id} projectId={id} />}
      </div>
      <Suspense fallback={<FileTableSkeleton />}>
        <ProjectFilesSSR
          userId={user.id}
          projectId={id}
          isDeleteAllowed={isDeleteAllowed}
          page={parseInt(page)}
        />
      </Suspense>
    </section>
  );
}
