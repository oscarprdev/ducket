import { AccountCredentialsForm } from './account-credentials-form';
import { Lock } from 'lucide-react';
import { updateUserCredentials } from '~/app/dashboard/account/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';

interface AccountCredentialsProps {
  userId: string;
  isOAuthUser: boolean;
}

export function AccountCredentials({ userId, isOAuthUser }: AccountCredentialsProps) {
  return (
    <Card className="max-w-[800px] bg-background">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Lock className="mr-2 h-5 w-5" />
          Credentials
        </CardTitle>
        <CardDescription>
          {isOAuthUser
            ? 'Your credentials are managed by Github.'
            : 'Update your account password.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <AccountCredentialsForm
          userId={userId}
          isOAuthUser={isOAuthUser}
          action={updateUserCredentials}
        />
      </CardContent>
    </Card>
  );
}
