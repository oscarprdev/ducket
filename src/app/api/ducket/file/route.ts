import { Bucket } from 'ducket';
import { env } from '~/env';
import { MUTATIONS, QUERIES } from '~/server/db/queries';

async function validateBearerAuth(request: Request): Promise<string> {
  const bearer = request.headers.get('Authorization');
  const apiKey = bearer?.split(' ')[1];
  if (!apiKey) {
    throw new Error('No api key provided');
  }
  return apiKey;
}

async function validateFormData(request: Request): Promise<{
  file: Blob;
  fileId: string;
  type: string;
  projectTitle: string;
}> {
  const formData = await request.formData();

  const file = formData.get('file');
  if (!file || !(file instanceof Blob)) {
    throw new Error('No file uploaded');
  }

  const fileId = formData.get('id') as string;
  const type = formData.get('type') as string;
  const projectTitle = formData.get('project') as string;

  if (!fileId || !type || !projectTitle) {
    throw new Error('No id, type or project provided');
  }

  return { file, fileId, type, projectTitle };
}

async function uploadFileToBucket(
  buffer: Buffer,
  type: string,
  id: string,
  project: string
): Promise<string> {
  const bucket = new Bucket({
    apiUrl: env.API_URL,
    accessId: env.ACCESS_KEY_ID,
    secret: env.SECRET_ACCESS_KEY,
    bucketName: env.BUCKET,
  });

  const bucketResponse = await bucket.uploadFile({ file: buffer, type, id, project });
  if (!bucketResponse) {
    throw new Error('Error uploading file');
  }
  return bucketResponse;
}

export async function POST(request: Request) {
  try {
    /**
     * Validate bearer auth and form data
     */
    const apiKey = await validateBearerAuth(request);
    const { file, fileId, type, projectTitle } = await validateFormData(request);
    
    /**
     * Validate project
     */
    const [project] = await QUERIES.getProjectByTitle({ title: projectTitle });
    if (!project?.id) {
      return new Response('Project not found', { status: 404 });
    }
    if (project.api_key !== apiKey) {
      return new Response('Invalid api key', { status: 401 });
    }

    /**
     * Upload file to bucket
     */
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const bucketResponse = await uploadFileToBucket(buffer, type, fileId, projectTitle);
    const fileUrl = `https://pub-3a1b1ef37a894643bf2137184d00dd0a.r2.dev/${bucketResponse}`;

    /**
     * Create file in database
     */
    await MUTATIONS.createFile({
      projectId: project.id,
      fileName: fileId,
      type,
      fileUrl,
    });

    /**
     * Return file url
     */
    return new Response(JSON.stringify({ fileUrl }), { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return new Response(errorMessage, { status: 500 });
  }
}
