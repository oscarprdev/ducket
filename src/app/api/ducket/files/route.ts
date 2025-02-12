import { ACTIVITY_ACTIONS } from '~/lib/constants';
import { MUTATIONS, QUERIES } from '~/server/db/queries';

async function validateBearerAuth(request: Request): Promise<string | undefined> {
  const bearer = request.headers.get('Authorization');
  return bearer?.split(' ')[1];
}
const GET_PERMISSIONS_ALLOWED = ['all', 'read'];

export async function GET(request: Request) {
  try {
    /**
     * Validate bearer auth
     */
    const apiKey = await validateBearerAuth(request);
    if (!apiKey) {
      return new Response('Invalid bearer auth', { status: 401 });
    }
    /**
     * Validate api key permissions
     */
    const [apiKeyStored] = await QUERIES.apiKeys.getBySecret({ apiKey });
    if (!apiKeyStored) {
      return new Response('Invalid bearer auth', { status: 402 });
    }
    if (
      !apiKeyStored.permissions.some(permission => GET_PERMISSIONS_ALLOWED.includes(permission))
    ) {
      return new Response('Api key permissions not allowed', { status: 403 });
    }

    /*
     * Get project by api key
     */
    const [project] = await QUERIES.projects.getByApiKey({ apiKey });
    if (!project) {
      return new Response('Project not found', { status: 404 });
    }

    /*
     * Get files by project id
     */
    const [files] = await Promise.all([
      QUERIES.files.getByProjectId({ projectId: project.id }),
      MUTATIONS.updateApiKeyUsage({
        projectId: project.id,
        apiKey: apiKey,
      }),
    ]);

    await Promise.all(
      files.map(file =>
        MUTATIONS.createActivityLog({
          projectId: project.id,
          userId: project.ownerId,
          fileName: file.fileName ?? '-',
          action: ACTIVITY_ACTIONS.read,
        })
      )
    );

    const fileUrls = files.map(file => file.fileUrl);

    return new Response(JSON.stringify({ files: fileUrls }), { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return new Response(errorMessage, { status: 500 });
  }
}
