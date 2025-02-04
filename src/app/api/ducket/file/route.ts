import { Bucket } from 'ducket';
import { env } from '~/env';
import { MUTATIONS, QUERIES } from '~/server/db/queries';

export async function POST(request: Request) {
  const bearer = request.headers.get('Authorization');
  const apiKey = bearer?.split(' ')[1];
  if (!apiKey) {
    return new Response('No api key provided', { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file');

  if (!file || !(file instanceof Blob)) {
    return new Response('No file uploaded', { status: 400 });
  }

  const id = formData.get('id') as string;
  const type = formData.get('type') as string;
  const project = formData.get('project') as string;

  if (!id || !type || !project) {
    return new Response('No id, type or project provided', { status: 400 });
  }

  const bucket = new Bucket({
    apiUrl: env.API_URL,
    accessId: env.ACCESS_KEY_ID,
    secret: env.SECRET_ACCESS_KEY,
    bucketName: env.BUCKET,
  });

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const bucketResponse = await bucket.uploadFile({ file: buffer, type, id, project });
  if (!bucketResponse) {
    return new Response('Error uploading file', { status: 500 });
  }
  const fileUrl = `https://pub-3a1b1ef37a894643bf2137184d00dd0a.r2.dev/${bucketResponse}`;
  console.log({ project });
  const [projectByTitle] = await QUERIES.getProjectByTitle({ title: project });
  if (!projectByTitle?.id) {
    return new Response('Project not found', { status: 404 });
  }

  const response = await MUTATIONS.createFile({
    projectId: projectByTitle.id,
    fileName: file.name,
    type,
    fileUrl,
  });

  console.log(response);

  return new Response(JSON.stringify({ fileUrl }));
}
