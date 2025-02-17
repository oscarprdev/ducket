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

export const sendTransferEmail = async ({
  from,
  to,
  url,
}: {
  from: { name: string; project: string };
  to: string;
  url: string;
}) => {
  const resend = new Resend(env.RESEND_API_KEY);
  await resend.emails.send({
    from: 'Ducket <oscarpr@ducket.dev>',
    to: [to],
    subject: 'Transfer ownership of a project',
    html: `<p>Transfer ownership of a project.</p>
    <p>From: ${from.name}</p>
    <p>Project: ${from.project}</p>
    <a href="${url}">Click here to accept the transfer</a>`,
  });
};
