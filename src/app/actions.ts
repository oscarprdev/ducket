'use server';

import { Bucket } from 'ducket';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { MAX_FILES } from '~/components/public-file-upload';
import { env } from '~/env';
import { VALID_FILE_TYPES } from '~/lib/constants';
import { validatedAction } from '~/server/auth/middleware';
import { MUTATIONS } from '~/server/db/mutations';
import { QUERIES } from '~/server/db/queries';

const uploadPublicFileSchema = z.object({
  file: z
    .any()
    .refine(
      (file: unknown): file is { type: string } =>
        typeof file === 'object' &&
        file !== null &&
        'type' in file &&
        Object.values(VALID_FILE_TYPES).some(types =>
          types.includes((file as { type: string }).type)
        ),
      'File type not valid'
    ),
  name: z.string(),
  type: z.string(),
});

export const uploadPublicFile = validatedAction(uploadPublicFileSchema, async (_, formData) => {
  try {
    const currentPublicFiles = await QUERIES.publicFiles.getAll();
    if (currentPublicFiles.length >= MAX_FILES) {
      await MUTATIONS.publicFiles.delete({ name: currentPublicFiles[0]?.fileName ?? '' });
    }

    const bucket = new Bucket({
      apiUrl: env.S3_API_URL,
      accessId: env.S3_ACCESS_KEY_ID,
      secret: env.S3_SECRET_ACCESS_KEY,
      bucketName: env.S3_BUCKET,
    });

    const file = formData.get('file') as File;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const type = file.type;
    const name = file.name;

    const bucketResponse = await bucket.uploadFile({ file: buffer, type, name, project: 'public' });
    if (!bucketResponse) {
      return { error: 'Error uploading file' };
    }

    const fileUrl = `${env.S3_PUBLIC_URL}${bucketResponse}`;

    await MUTATIONS.publicFiles.create({
      fileName: name,
      type,
      fileUrl,
      size: file.size,
    });

    revalidatePath(`/`);

    return { success: 'File uploaded successfully' };
  } catch (error: unknown) {
    return { error: error instanceof Error ? error.message : 'Error uploading file' };
  }
});
