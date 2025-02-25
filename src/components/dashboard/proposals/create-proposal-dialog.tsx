'use client';

import { CreateProposalForm } from './create-proposal-form';
import { PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { createProposal } from '~/app/(website)/community/proposals/actions';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';

export function CreateProposalDialog() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Proposal
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Proposal</DialogTitle>
          <DialogDescription>
            Share your ideas with the community. Be specific and provide clear details about your
            proposal.
          </DialogDescription>
        </DialogHeader>
        <CreateProposalForm action={createProposal} onActionFinished={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
