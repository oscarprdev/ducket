import { QUERIES } from '../db/queries';
import { comparePasswords } from './session';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';

const signInSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .min(1, 'Email is required')
    .email('Invalid email'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password is required')
    .min(8, 'Password must be more than 8 characters')
    .max(32, 'Password must be less than 32 characters'),
});

export const CredentialsProvider = Credentials({
  credentials: {
    email: { label: 'Email', type: 'email' },
    password: { label: 'Password', type: 'password' },
  },
  authorize: async credentials => {
    const { email, password } = await signInSchema.parseAsync(credentials);
    const [user] = await QUERIES.users.getByEmail({ email });
    if (!user?.passwordHash) {
      throw new Error('Invalid credentials.');
    }

    const passwordsMatch = await comparePasswords(password, user.passwordHash);
    if (!passwordsMatch) {
      throw new Error('Invalid credentials.');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  },
});
