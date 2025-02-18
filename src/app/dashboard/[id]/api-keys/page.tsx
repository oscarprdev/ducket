import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import ApiKeysLayout from '~/components/dashboard/api-keys/api-keys-layout';
import ApiKeysTable from '~/components/dashboard/api-keys/api-keys-table';
import { ApiKeysTableSkeleton } from '~/components/dashboard/api-keys/api-keys-table-skeleton';
import { API_KEY_PERMISSIONS } from '~/lib/constants';
import { auth } from '~/server/auth';
import { QUERIES } from '~/server/db/queries';

const ITEMS_PER_PAGE = 10;

async function ApiKeysTableSSR({ projectId, page }: { projectId: string; page: string }) {
  const currentPage = Number(page) || 1;
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const limit = ITEMS_PER_PAGE;
  const [{ apiKeys }, totalItems] = await Promise.all([
    QUERIES.apiKeys.getByProject({
      projectId,
      offset,
      limit,
    }),
    QUERIES.apiKeys.getCountByProject({ projectId }),
  ]);

  return (
    <ApiKeysTable
      projectId={projectId}
      apiKeys={apiKeys}
      totalItems={totalItems}
      itemsPerPage={ITEMS_PER_PAGE}
      currentPage={parseInt(page)}
    />
  );
}

export default async function ApiKeysPage({
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
    projectId: id,
  });
  if (!projectUser) redirect('/dashboard');
  const userIsOwner = projectUser?.permissions.includes(API_KEY_PERMISSIONS.all);

  return (
    <ApiKeysLayout projectId={id} userIsOwner={userIsOwner}>
      {userIsOwner ? (
        <Suspense fallback={<ApiKeysTableSkeleton />}>
          <ApiKeysTableSSR projectId={id} page={page} />
        </Suspense>
      ) : (
        <p>{"You don't have permission to view API keys"}</p>
      )}
    </ApiKeysLayout>
  );
}
