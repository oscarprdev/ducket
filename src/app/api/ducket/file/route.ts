import { Bucket } from 'ducket';
import { env } from '~/env';
import { MUTATIONS, QUERIES } from '~/server/db/queries';

const PERMISSIONS_ALLOWED = ['all', 'write'];

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
  project: string
): Promise<string | void> {
  const bucket = new Bucket({
    apiUrl: env.S3_API_URL,
    accessId: env.S3_ACCESS_KEY_ID,
    secret: env.S3_SECRET_ACCESS_KEY,
    bucketName: env.S3_BUCKET,
  });

  return await bucket.uploadFile({ file: buffer, type, name, project });
}

export async function POST(request: Request) {
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
    const [apiKeyStored] = await QUERIES.getApikey({ apiKey });
    if (!apiKeyStored) {
      return new Response('Invalid bearer auth', { status: 402 });
    }
    if (apiKeyStored.permissions.some(permission => PERMISSIONS_ALLOWED.includes(permission))) {
      return new Response('Api key permissions not allowed', { status: 403 });
    }

    const [project] = await QUERIES.getProject({ projectId: apiKeyStored.projectId });
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
    const bucketResponse = await uploadFileToBucket(buffer, type, fileName, project.title);
    if (!bucketResponse) {
      return new Response('Error uploading file', { status: 500 });
    }
    const fileUrl = `${env.S3_PUBLIC_URL}${bucketResponse}`;

    /**
     * Create file in database
     */
    await Promise.all([
      MUTATIONS.createFile({
        projectId: project.id,
        fileName,
        type,
        fileUrl,
        size: file.size,
      }),
      MUTATIONS.updateApiKeyUsage({
        projectId: project.id,
        apiKey: apiKey,
      }),
    ]);

    /**
     * Return file url
     */
    return new Response(JSON.stringify({ fileUrl }), { status: 201 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return new Response(errorMessage, { status: 500 });
  }
}
