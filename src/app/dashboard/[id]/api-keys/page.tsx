import { QUERIES } from '~/server/db/queries';

export default async function ApiKeysPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [project] = await QUERIES.getProject({ projectId: id });
  return <div>{project?.api_key}</div>;
}
