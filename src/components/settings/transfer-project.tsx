'use client';

import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';

export function TransferProjectCard() {
  const [transferEmail, setTransferEmail] = useState('');

  const handleTransferProject = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically initiate the project transfer process
    console.log(`Transferring project to ${transferEmail}`);
    setTransferEmail('');
  };

  return (
    <Card className="max-w-[800px] bg-background">
      <CardHeader>
        <CardTitle>Transfer Project</CardTitle>
        <CardDescription>Transfer this project to another account or organization.</CardDescription>
      </CardHeader>
      <CardContent>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              Transfer Project
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Transfer Project</DialogTitle>
              <DialogDescription>
                Transfer ownership of this project to another user or organization. This action
                cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleTransferProject}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="transferEmail" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="transferEmail"
                    value={transferEmail}
                    onChange={e => setTransferEmail(e.target.value)}
                    className="col-span-3"
                    placeholder="user@example.com or org@example.com"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" variant="destructive">
                  Transfer Ownership
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
