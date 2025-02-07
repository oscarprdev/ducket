import { Bucket } from 'ducket';
import { env } from '~/env';
import { MUTATIONS, QUERIES } from '~/server/db/queries';

async function validateBearerAuth(request: Request): Promise<string | undefined> {
  const bearer = request.headers.get('Authorization');
  return bearer?.split(' ')[1];
}

async function deleteFileFromBucket(name: string, project: string): Promise<string | void> {
  const bucket = new Bucket({
    apiUrl: env.S3_API_URL,
    accessId: env.S3_ACCESS_KEY_ID,
    secret: env.S3_SECRET_ACCESS_KEY,
    bucketName: env.S3_BUCKET,
  });

  return await bucket.deleteFile({ name, project });
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

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
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
    const { id: name } = await context.params;
    const [file] = await QUERIES.getFileByName({ name });
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

    /**
     * Delete file from bucket
     */
    await deleteFileFromBucket(name, project.title);

    /**
     * Delete file in database
     */
    await MUTATIONS.deleteFileByName({ name });

    return new Response(JSON.stringify({ fileDeleted: name, projectId: project.id }), {
      status: 201,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return new Response(errorMessage, { status: 500 });
  }
}
