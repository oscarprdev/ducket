import { Bucket } from 'ducket';
import { env } from '~/env';

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file');
  const id = formData.get('id') as string;
  const type = formData.get('type') as string;

  if (!file || !(file instanceof Blob) || !id || !type) {
    return new Response('No file uploaded', { status: 400 });
  }

  const bucket = new Bucket({
    apiUrl: env.API_URL,
    accessId: env.ACCESS_KEY_ID,
    secret: env.SECRET_ACCESS_KEY,
    bucketName: env.BUCKET,
  });

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const response = await bucket.uploadFile({ file: buffer, type, id });

  console.log(response);

  return new Response('Hello World POST!');
}
