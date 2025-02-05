import { QUERIES } from '~/server/db/queries';

async function validateBearerAuth(request: Request): Promise<string | undefined> {
  const bearer = request.headers.get('Authorization');
  return bearer?.split(' ')[1];
}

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    /**
     * Validate bearer auth
     */
    const apiKey = await validateBearerAuth(request);
    if (!apiKey) {
      return new Response('Invalid bearer auth', { status: 401 });
    }

    /**
     * Get file by param id
     */
    const { id } = await context.params;
    const [file] = await QUERIES.getFileByName({ name: id });
    if (!file) {
      return new Response('File not found', { status: 404 });
    }

    /**
     * Validate if project does exist based on projectId from file
     */
    const [project] = await QUERIES.getProject({ projectId: file?.projectId });
    if (!project) {
      return new Response('Project not found', { status: 404 });
    }

    /**
     * Validate authorization by api key
     */
    if (project.api_key !== apiKey) {
      return new Response('Api key not valid', { status: 401 });
    }

    return new Response(JSON.stringify({ fileUrl: file.fileUrl }), { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return new Response(errorMessage, { status: 500 });
  }
}

export function DELETE(request: Request) {
  console.log(request);
  return new Response('Hello World DELETE!');
}
