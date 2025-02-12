import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { ApiKeysCreateDialog } from '~/components/api-keys/api-keys-create-dialog';
import ApiKeysTable from '~/components/api-keys/api-keys-table';
import { ApiKeysTableSkeleton } from '~/components/api-keys/api-keys-table-skeleton';
import { auth } from '~/server/auth';
import { QUERIES } from '~/server/db/queries';
import { type ApiKeys } from '~/server/db/schema';

const ITEMS_PER_PAGE = 10;

async function ApiKeysTableSSR({
  apiKeys,
  projectId,
  page,
}: {
  apiKeys: ApiKeys[];
  projectId: string;
  page: string;
}) {
  const totalItems = await QUERIES.apiKeys.getCountByProject({ projectId });
  const apiKeysWithUser = await Promise.all(
    apiKeys.map(async apiKey => ({
      ...apiKey,
      userId: await QUERIES.users.getById({ id: apiKey.userId }).then(user => user[0]?.email ?? ''),
    }))
  );
  return (
    <ApiKeysTable
      apiKeys={apiKeysWithUser}
      projectId={projectId}
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
  const { projects, apiKeys } = await QUERIES.apiKeys.getByProject({
    projectId: id,
    offset: (parseInt(page) - 1) * ITEMS_PER_PAGE,
    limit: ITEMS_PER_PAGE,
  });

  const userIsOwner = projects.some(project => project.ownerId === user.id);

  return (
    <section className="relative">
      <div className="mb-6 flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">API Keys</h1>
          <p className="text-sm text-muted-foreground">
            Manage your API keys and their permissions for this project.
          </p>
        </div>
        {userIsOwner && apiKeys.length > 0 && <ApiKeysCreateDialog projectId={id} />}
      </div>
      {userIsOwner ? (
        <Suspense fallback={<ApiKeysTableSkeleton />}>
          <ApiKeysTableSSR apiKeys={apiKeys} projectId={id} page={page} />
        </Suspense>
      ) : (
        <p>{"You don't have permission to view API keys"}</p>
      )}
      {apiKeys.length === 0 && userIsOwner && <ApiKeysCreateDialog projectId={id} />}
    </section>
  );
}
