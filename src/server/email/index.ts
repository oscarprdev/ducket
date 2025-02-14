import { Resend } from 'resend';
import { env } from '~/env';

export const sendInvitationEmail = async ({ to, link }: { to: string; link: string }) => {
  const resend = new Resend(env.RESEND_API_KEY);
  await resend.emails.send({
    from: 'Ducket <oscarpr@ducket.dev>',
    to: [to],
    subject: 'You are invited to join a project on Ducket',
    html: `<p>You are invited to join a project on Ducket.</p>
    <a href="${link}">Click here to join</a>`,
  });
};

export const sendVerificationEmail = async ({ to, link }: { to: string; link: string }) => {
  const resend = new Resend(env.RESEND_API_KEY);
  await resend.emails.send({
    from: 'Ducket <oscarpr@ducket.dev>',
    to: [to],
    subject: 'Verify your email',
    html: `<p>Verify your email.</p>
    <a href="${link}">Click here to verify</a>`,
  });
};
