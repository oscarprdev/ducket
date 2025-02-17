'use client';

import { DeleteAccountDialog } from './delete-account-dialog';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';

export function AccountDangerZone({ userId }: { userId: string }) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <Card className="max-w-[800px] border-destructive/20 bg-background">
      <CardHeader>
        <CardTitle className="text-destructive">Danger Zone</CardTitle>
        <CardDescription>Irreversible and destructive actions</CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="destructive" onClick={() => setIsDeleteOpen(true)}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Account
        </Button>
        <DeleteAccountDialog isOpen={isDeleteOpen} onOpenChange={setIsDeleteOpen} userId={userId} />
      </CardContent>
    </Card>
  );
}
