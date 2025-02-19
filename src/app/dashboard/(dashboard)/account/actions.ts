'use server';

import { compare } from 'bcryptjs';
import { Bucket } from 'ducket';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { env } from '~/env';
import { VALID_FILE_TYPES } from '~/lib/constants';
import { validatedActionWithUser } from '~/server/auth/middleware';
import { MUTATIONS } from '~/server/db/mutations';
import { QUERIES } from '~/server/db/queries';

const updateUserInformationSchema = z.object({
  userId: z.string(),
  name: z.string(),
  email: z.string(),
});

export const updateUserInformation = validatedActionWithUser(
  updateUserInformationSchema,
  async data => {
    try {
      const { userId, name, email } = data;
      const user = await QUERIES.users.getById({ id: userId });
      if (!user) {
        return { error: 'User not found' };
      }
      await MUTATIONS.users.updateInformation({ id: userId, name, email });

      revalidatePath('/dashboard/account');

      return { success: 'User information updated successfully' };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Error updating user information' };
    }
  }
);

const updateUserCredentialsSchema = z.object({
  userId: z.string(),
  currentPassword: z.string(),
  newPassword: z.string(),
  confirmPassword: z.string(),
});

export const updateUserCredentials = validatedActionWithUser(
  updateUserCredentialsSchema,
  async data => {
    try {
      const { userId, currentPassword, newPassword, confirmPassword } = data;
      if (newPassword !== confirmPassword) {
        return { error: 'Passwords do not match' };
      }
      const [user] = await QUERIES.users.getById({ id: userId });
      if (!user?.passwordHash) {
        return { error: 'User not found' };
      }
      if (!(await compare(currentPassword, user.passwordHash))) {
        return { error: 'Current password is incorrect' };
      }

      await MUTATIONS.users.updatePassword({ id: userId, passwordHash: newPassword });

      revalidatePath('/dashboard/account');

      return { success: 'Password updated successfully' };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Error updating user credentials' };
    }
  }
);

const deleteAccountSchema = z.object({
  userId: z.string(),
  email: z.string(),
});

export const deleteAccount = validatedActionWithUser(deleteAccountSchema, async (data, _, user) => {
  try {
    const { userId, email } = data;
    if (email !== user?.email) {
      return { error: 'Email does not match' };
    }

    await MUTATIONS.users.delete({ id: userId });

    redirect('/');
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Error deleting account' };
  }
});

const uploadImageSchema = z.object({
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
  name: z.string({ message: 'File name is required' }),
  type: z.string({ message: 'File type is required' }),
  userId: z.string({ message: 'User ID is required' }),
});

export const uploadImage = validatedActionWithUser(uploadImageSchema, async (data, formData) => {
  try {
    const { userId, type, name } = data;
    const [user] = await QUERIES.users.getById({ id: userId });
    if (!user) {
      return { error: 'User not found' };
    }

    const bucket = new Bucket({
      apiUrl: env.S3_API_URL,
      accessId: env.S3_ACCESS_KEY_ID,
      secret: env.S3_SECRET_ACCESS_KEY,
      bucketName: env.S3_BUCKET,
    });
    const projectId = `users/${user.email}`;
    const file = formData.get('file') as File;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const bucketResponse = await bucket.uploadFile({
      file: buffer,
      type,
      name,
      project: projectId,
    });
    if (!bucketResponse) {
      return { error: 'Error uploading image' };
    }
    const fileUrl = `${env.S3_PUBLIC_URL}${bucketResponse}`;

    if (user.image) {
      await bucket.deleteFile({
        name,
        project: projectId,
      });
    }
    await MUTATIONS.users.updateImage({ id: userId, image: fileUrl });

    revalidatePath('/dashboard/account');

    return { success: 'Image uploaded successfully' };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Error uploading image' };
  }
});
