import { QUERIES } from '~/server/db/queries';

async function validateBearerAuth(request: Request): Promise<string | undefined> {
  const bearer = request.headers.get('Authorization');
  return bearer?.split(' ')[1];
}

export async function GET(request: Request) {
  try {
    /**
     * Validate bearer auth
     */
    const apiKey = await validateBearerAuth(request);
    if (!apiKey) {
      return new Response('Invalid bearer auth', { status: 401 });
    }

    /*
     * Get project by api key
     */
    const [project] = await QUERIES.getProjectByApiKey({ apiKey });
    if (!project) {
      return new Response('Project not found', { status: 404 });
    }

    /*
     * Get files by project id
     */
    const files = await QUERIES.getFilesByProjectId({ projectId: project.id });
    const fileUrls = files.map(file => file.fileUrl);

    return new Response(JSON.stringify({ files: fileUrls }), { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return new Response(errorMessage, { status: 500 });
  }
}
