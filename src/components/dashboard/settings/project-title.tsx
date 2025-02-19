'use client';

import { Pencil } from 'lucide-react';
import { useState } from 'react';
import LoaderCircle from '~/components/shared/loader-circle';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { useFormAction } from '~/hooks/use-form-action';
import { useToast } from '~/hooks/use-toast';
import { type ActionState } from '~/server/auth/middleware';
import { type Projects } from '~/server/db/schema';

interface ProjectTitleCardProps {
  project: Projects;
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
}

export function ProjectTitleCard({ project, action }: ProjectTitleCardProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const { toast } = useToast();
  const { state, formAction, pending } = useFormAction({
    action,
    onSuccess: () => {
      toast({
        title: 'Project title updated',
        description: 'Your project title has been updated successfully',
        variant: 'success',
      });
      setIsEditingTitle(false);
    },
    onError: () => {
      toast({
        title: 'Error',
        description: state.error,
        variant: 'destructive',
      });
    },
  });

  const handleFormAction = (formData: FormData) => {
    formData.append('projectId', project.id);
    formAction(formData);
  };

  return (
    <Card className="max-w-[800px] bg-background">
      <CardHeader>
        <CardTitle>Project Title</CardTitle>
        <CardDescription>
          The name of your project as it appears throughout the app.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isEditingTitle ? (
          <form action={handleFormAction} className="flex items-center justify-between">
            <Input
              name="title"
              defaultValue={project.title}
              required
              disabled={pending}
              className="max-w-sm"
            />
            <div className="flex items-center gap-2">
              <Button type="submit" disabled={pending}>
                {pending ? (
                  <span className="flex items-center gap-2">
                    <LoaderCircle />
                    Saving...
                  </span>
                ) : (
                  'Save'
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                disabled={pending}
                onClick={() => setIsEditingTitle(false)}>
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium">{project.title}</span>
            <Button variant="ghost" size="sm" onClick={() => setIsEditingTitle(true)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
