import { recoverPassword } from '../../actions';
import { redirect } from 'next/navigation';
import RecoverPasswordForm from '~/components/auth/recover-form';
import { MUTATIONS } from '~/server/db/mutations';
import { QUERIES } from '~/server/db/queries';

export default async function RecoverPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [token] = await QUERIES.passwordResetTokens.getByToken({ token: id });

  if (!token || token.isUsed) {
    redirect('/');
  }

  await MUTATIONS.passwordResetTokens.update({ id: token.id, isUsed: true });

  return (
    <>
      <h1 className="mb-6 text-center text-2xl font-bold">Recover Password</h1>
      <div className="space-y-4">
        <RecoverPasswordForm token={id} action={recoverPassword} />
      </div>
    </>
  );
}
