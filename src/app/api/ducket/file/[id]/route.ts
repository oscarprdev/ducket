import { Bucket } from 'ducket';
import { env } from '~/env';
import { ACTIVITY_ACTIONS, API_KEY_PERMISSIONS } from '~/lib/constants';
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
const GET_PERMISSIONS_ALLOWED = [API_KEY_PERMISSIONS.all, API_KEY_PERMISSIONS.read];
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
     * Validate api key permissions
     */
    const [apiKeyStored] = await QUERIES.apiKeys.getBySecret({ apiKey });
    if (!apiKeyStored) {
      return new Response('Invalid bearer auth', { status: 402 });
    }
    if (
      !apiKeyStored.permissions.some(permission =>
        GET_PERMISSIONS_ALLOWED.includes(permission as (typeof GET_PERMISSIONS_ALLOWED)[number])
      )
    ) {
      return new Response('Api key permissions not allowed', { status: 403 });
    }

    const [projectResponse] = await QUERIES.projects.getById({
      projectId: apiKeyStored.projectId,
    });
    if (!projectResponse?.id) {
      return new Response('Project not found for api key provided', { status: 404 });
    }

    /**
     * Get file by param id
     */
    const { id } = await context.params;
    const [[file]] = await Promise.all([
      QUERIES.files.getByName({ projectId: projectResponse.id, fileName: id }),
      MUTATIONS.updateApiKeyUsage({
        projectId: projectResponse.id,
        apiKey: apiKeyStored.secret,
      }),
    ]);
    if (!file?.fileName) {
      return new Response('File not found', { status: 404 });
    }

    await MUTATIONS.createActivityLog({
      projectId: projectResponse.id,
      userId: projectResponse.ownerId,
      fileName: file.fileName,
      action: ACTIVITY_ACTIONS.read,
    });

    return new Response(JSON.stringify({ fileUrl: file.fileUrl }), { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return new Response(errorMessage, { status: 500 });
  }
}

const DELETE_PERMISSIONS_ALLOWED = [API_KEY_PERMISSIONS.all, API_KEY_PERMISSIONS.delete];
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
     * Validate api key permissions
     */
    const [apiKeyStored] = await QUERIES.apiKeys.getBySecret({ apiKey });
    if (!apiKeyStored) {
      return new Response('Invalid bearer auth', { status: 402 });
    }
    if (
      !apiKeyStored.permissions.some(permission =>
        DELETE_PERMISSIONS_ALLOWED.includes(
          permission as (typeof DELETE_PERMISSIONS_ALLOWED)[number]
        )
      )
    ) {
      return new Response('Api key permissions not allowed', { status: 403 });
    }

    const [projectResponse] = await QUERIES.projects.getById({
      projectId: apiKeyStored.projectId,
    });
    if (!projectResponse?.id) {
      return new Response('Project not found for api key provided', { status: 404 });
    }
    /**
     * Get file by param id
     */
    const { id: name } = await context.params;
    const [file] = await QUERIES.files.getByName({ projectId: projectResponse.id, fileName: name });
    if (!file) {
      return new Response('File not found', { status: 404 });
    }

    /**
     * Validate if project does exist based on projectId from file
     */
    const [project] = await QUERIES.projects.getById({ projectId: file?.projectId });
    if (!project) {
      return new Response('Project not found', { status: 404 });
    } else if (projectResponse.id !== project.id) {
      return new Response('Project not found for api key provided', { status: 404 });
    }

    /**
     * Delete file from bucket
     */
    await deleteFileFromBucket(name, project.title);

    /**
     * Delete file in database
     */
    await Promise.all([
      MUTATIONS.deleteFileByName({ name }),
      MUTATIONS.updateApiKeyUsage({
        projectId: project.id,
        apiKey: apiKey,
      }),
    ]);

    await MUTATIONS.createActivityLog({
      projectId: projectResponse.id,
      userId: projectResponse.ownerId,
      fileName: name,
      action: ACTIVITY_ACTIONS.delete,
    });

    return new Response(JSON.stringify({ fileDeleted: name, projectId: project.id }), {
      status: 201,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return new Response(errorMessage, { status: 500 });
  }
}
