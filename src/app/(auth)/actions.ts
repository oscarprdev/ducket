'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { signIn } from '~/server/auth';
import { validatedAction } from '~/server/auth/middleware';
import { hashPassword } from '~/server/auth/session';
import { MUTATIONS } from '~/server/db/mutations';
import { QUERIES } from '~/server/db/queries';

const signUpSchema = z.object({
  name: z.string({ message: 'Name is required' }).min(3).max(255),
  email: z.string({ message: 'Email is required' }).email(),
  password: z.string({ message: 'Password is required' }).min(8),
});

export const signUp = validatedAction(signUpSchema, async data => {
  try {
    const { email, password, name } = data;

    const [user] = await QUERIES.users.getByEmail({ email });

    if (user) {
      return {
        error: 'User already exists. Please try again.',
        email,
        password,
      };
    }

    const passwordHash = await hashPassword(password);

    await MUTATIONS.users.create({ email, name, passwordHash });

    return {
      success: 'User created successfully',
      email,
      password,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to create user. Please try again.',
    };
  }
});

const signInSchema = z.object({
  email: z.string({ message: 'Email is required' }).email(),
  password: z.string({ message: 'Password is required' }).min(8),
});

export const signInWithCredentials = validatedAction(signInSchema, async data => {
  try {
    const { email, password } = data;

    await signIn('credentials', {
      email,
      password,
    });

    redirect('/dashboard');
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to sign in. Please try again.',
    };
  }
});

const recoverPasswordSchema = z.object({
  token: z.string({ message: 'Token is required' }),
  password: z.string({ message: 'Password is required' }).min(8),
  repeatPassword: z.string({ message: 'Repeat password is required' }).min(8),
});

export const recoverPassword = validatedAction(recoverPasswordSchema, async data => {
  try {
    const { token: tokenHash, password, repeatPassword } = data;

    if (password !== repeatPassword) {
      return { error: 'Passwords do not match' };
    }

    const [token] = await QUERIES.passwordResetTokens.getByToken({ token: tokenHash });

    if (!token) {
      return { error: 'Invalid token' };
    }
    const passwordHash = await hashPassword(password);

    await Promise.all([
      MUTATIONS.users.updatePassword({ id: token.userId, passwordHash }),
      MUTATIONS.passwordResetTokens.delete({ id: token.id }),
    ]);

    return { success: 'Password recovered successfully' };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : 'Failed to recover password. Please try again.',
    };
  }
});
