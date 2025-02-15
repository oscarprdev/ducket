'use server';

import { z } from 'zod';
import { env } from '~/env';
import { validatedAction } from '~/server/auth/middleware';
import { MUTATIONS } from '~/server/db/mutations';
import { QUERIES } from '~/server/db/queries';
import { sendRecoverPasswordEmail } from '~/server/email';

const sendRecoverPasswordSchema = z.object({
  email: z.string().email(),
});

export const sendRecoverPassword = validatedAction(sendRecoverPasswordSchema, async data => {
  try {
    const { email } = data;

    const [user] = await QUERIES.users.getByEmail({ email });

    if (!user) {
      return { error: 'User not found' };
    }

    const [token] = await MUTATIONS.passwordResetTokens.create({
      userId: user.id,
      tokenHash: crypto.randomUUID(),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    });

    const url = `${env.API_URL}/recover/${token?.tokenHash}`;

    await sendRecoverPasswordEmail({ to: email, url });

    return { success: 'Recover password email sent' };
  } catch {
    return { error: 'Failed to send recover password email' };
  }
});
