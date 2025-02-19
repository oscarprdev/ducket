'use client';

import { ProfileInformationForm } from './profile-information-form';
import { User } from 'lucide-react';
import { updateUserInformation } from '~/app/dashboard/(dashboard)/account/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';

interface AccountProfileInformationProps {
  userId: string;
  name: string | null;
  email: string;
  isOAuthUser: boolean;
}

export function AccountProfileInformation({
  userId,
  name,
  email,
  isOAuthUser,
}: AccountProfileInformationProps) {
  return (
    <Card className="max-w-[800px] bg-background">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Profile Information
        </CardTitle>
        <CardDescription>
          {isOAuthUser
            ? `Your profile information is managed by Github.`
            : 'Update your profile information.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ProfileInformationForm
          userId={userId}
          name={name}
          email={email}
          action={updateUserInformation}
          isOAuthUser={isOAuthUser}
        />
      </CardContent>
    </Card>
  );
}
