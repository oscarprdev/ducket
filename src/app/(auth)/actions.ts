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

    return {
      success: 'Signed in successfully',
      email,
      password,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to sign in. Please try again.',
    };
  }
});
