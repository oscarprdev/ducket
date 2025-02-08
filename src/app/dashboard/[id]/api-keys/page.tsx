import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import ApiKeyCard from '~/components/api-keys/api-key-card';
import { ApiKeysCreateDialog } from '~/components/api-keys/api-keys-create-dialog';
import ApiKeysTable from '~/components/api-keys/api-keys-table';
import { ApiKeysTableSkeleton } from '~/components/api-keys/api-keys-table-skeleton';
import { auth } from '~/server/auth';
import { QUERIES } from '~/server/db/queries';
import { type ApiKeys } from '~/server/db/schema';

async function ApiKeysTableSSR({ apiKeys }: { apiKeys: ApiKeys[] }) {
  const apiKeysWithUser = await Promise.all(
    apiKeys.map(async apiKey => ({
      ...apiKey,
      userId: await QUERIES.getUserById({ id: apiKey.userId }).then(user => user[0]?.email ?? ''),
    }))
  );
  return <ApiKeysTable apiKeys={apiKeysWithUser} />;
}

export default async function ApiKeysPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect('/dashboard');

  const user = session.user;
  const { projects, apiKeys } = await QUERIES.getApiKeysByProject({
    projectId: id,
  });

  const userIsOwner = projects.some(project => project.ownerId === user.id);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">API Keys</h1>
      {apiKeys[0] ? <ApiKeyCard apiKey={apiKeys[0]} /> : <p>No API keys found</p>}
      {userIsOwner && (
        <Suspense fallback={<ApiKeysTableSkeleton />}>
          {<ApiKeysTableSSR apiKeys={apiKeys} />}
        </Suspense>
      )}
      {apiKeys.length === 0 && <ApiKeysCreateDialog projectId={id} />}
    </div>
  );
}
