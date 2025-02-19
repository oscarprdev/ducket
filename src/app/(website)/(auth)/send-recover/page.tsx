import { sendRecoverPassword } from './actions';
import { SendRecoverForm } from '~/components/auth/send-recover-form';

export default async function RecoverPage() {
  return (
    <>
      <h1 className="mb-6 text-center text-2xl font-bold">Recover Password</h1>
      <div className="space-y-4">
        <SendRecoverForm action={sendRecoverPassword} />
      </div>
    </>
  );
}
