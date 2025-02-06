import { auth } from '.';
import { type User } from 'next-auth';
import { type z } from 'zod';

export type ActionState = {
  error?: string;
  success?: string;
  [key: string]: unknown;
};

type ValidatedActionFunction<S extends z.ZodType<unknown, z.ZodTypeDef>, T> = (
  data: z.infer<S>,
  formData: FormData
) => Promise<T>;

export function validatedAction<S extends z.ZodType<unknown, z.ZodTypeDef>, T>(
  schema: S,
  action: ValidatedActionFunction<S, T>
) {
  return async (prevState: ActionState, formData: FormData): Promise<T> => {
    const result = schema.safeParse(Object.fromEntries(formData));
    if (!result.success) {
      return { error: result.error.errors[0]?.message } as T;
    }

    return action(result.data, formData);
  };
}

interface AuthUser extends User {
  id: string;
}

type ValidatedActionWithUserFunction<S extends z.ZodType<unknown, z.ZodTypeDef>, T> = (
  data: z.infer<S>,
  formData: FormData,
  user: AuthUser
) => Promise<T>;

export function validatedActionWithUser<S extends z.ZodType<unknown, z.ZodTypeDef>, T>(
  schema: S,
  action: ValidatedActionWithUserFunction<S, T>
) {
  return async (prevState: ActionState, formData: FormData): Promise<T> => {
    const session = await auth();
    const user = session?.user;
    if (!user || !user.id) {
      return {
        error: 'User is not authenticated',
      } as T;
    }

    const result = schema.safeParse(Object.fromEntries(formData));
    if (!result.success) {
      return { error: result.error.errors[0]?.message } as T;
    }

    return action(result.data, formData, user);
  };
}
