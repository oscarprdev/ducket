'use client';

import { TransferProjectDialog } from './transfer-project-dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';

export function TransferProjectCard({ projectId }: { projectId: string }) {
  return (
    <Card className="max-w-[800px] bg-background">
      <CardHeader>
        <CardTitle>Transfer Project</CardTitle>
        <CardDescription>Transfer this project to another user within Ducket app.</CardDescription>
      </CardHeader>
      <CardContent>
        <TransferProjectDialog projectId={projectId} />
      </CardContent>
    </Card>
  );
}
