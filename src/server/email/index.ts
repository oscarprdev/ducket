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

export const sendRecoverPasswordEmail = async ({ to, url }: { to: string; url: string }) => {
  const resend = new Resend(env.RESEND_API_KEY);
  await resend.emails.send({
    from: 'Ducket <oscarpr@ducket.dev>',
    to: [to],
    subject: 'Recover your password',
    html: `<p>Recover your password.</p>
    <a href="${url}">Click here to recover</a>`,
  });
};
