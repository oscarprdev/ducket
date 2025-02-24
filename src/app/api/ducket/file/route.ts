import { Bucket } from 'ducket';
import { type NextRequest } from 'next/server';
import { env } from '~/env';
import { ACTIVITY_ACTIONS, API_KEY_PERMISSIONS } from '~/lib/constants';
import { MUTATIONS } from '~/server/db/mutations';
import { QUERIES } from '~/server/db/queries';

const PERMISSIONS_ALLOWED = [API_KEY_PERMISSIONS.all, API_KEY_PERMISSIONS.write];

async function validateBearerAuth(request: Request): Promise<string | undefined> {
  const bearer = request.headers.get('Authorization');
  return bearer?.split(' ')[1];
}

async function validateFormData(request: Request): Promise<{
  file: FormDataEntryValue | null;
  fileName: string;
  type: string;
}> {
  const formData = await request.formData();

  const file = formData.get('file');
  const fileName = formData.get('name') as string;
  const type = formData.get('type') as string;

  return { file, fileName, type };
}

async function uploadFileToBucket(
  buffer: Buffer,
  type: string,
  name: string,
  projectId: string
): Promise<string | void> {
  const bucket = new Bucket({
    apiUrl: env.S3_API_URL,
    accessId: env.S3_ACCESS_KEY_ID,
    secret: env.S3_SECRET_ACCESS_KEY,
    bucketName: env.S3_BUCKET,
  });

  return await bucket.uploadFile({ file: buffer, type, name, project: projectId });
}

export async function POST(request: NextRequest) {
  try {
    const updateLogs = request.nextUrl.searchParams.get('updateLogs');
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
        PERMISSIONS_ALLOWED.includes(permission as (typeof PERMISSIONS_ALLOWED)[number])
      )
    ) {
      return new Response('Api key permissions not allowed', { status: 403 });
    }

    const [project] = await QUERIES.projects.getById({ projectId: apiKeyStored.projectId });
    if (!project?.id) {
      return new Response('Project not found for api key provided', { status: 404 });
    }

    /**
     * Validate form data
     */
    const { file, fileName, type } = await validateFormData(request);
    if (!file || !(file instanceof Blob)) {
      return new Response('No file provided', { status: 400 });
    }
    if (!fileName || !type) {
      return new Response('Invalid form data', { status: 400 });
    }

    /**
     * Upload file to bucket
     */
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const bucketResponse = await uploadFileToBucket(buffer, type, fileName, project.id);
    if (!bucketResponse) {
      return new Response('Error uploading file', { status: 500 });
    }
    const fileUrl = `${env.S3_PUBLIC_URL}${bucketResponse}`;

    /**
     * Create file in database
     */
    await Promise.all([
      MUTATIONS.files.create({
        projectId: project.id,
        fileName,
        type,
        fileUrl,
        size: file.size,
      }),
      MUTATIONS.apiKeys.updateUsage({
        projectId: project.id,
        apiKey: apiKey,
      }),
    ]);

    if (updateLogs !== 'false') {
      await MUTATIONS.activityLogs.create({
        projectId: project.id,
        userId: project.ownerId,
        fileName: file.name,
        action: ACTIVITY_ACTIONS.upload,
      });
    }

    /**
     * Return file url
     */
    return new Response(JSON.stringify({ fileUrl }), { status: 201 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return new Response(errorMessage, { status: 500 });
  }
}
