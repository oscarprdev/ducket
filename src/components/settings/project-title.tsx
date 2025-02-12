'use client';

import { Pencil } from 'lucide-react';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { type Projects } from '~/server/db/schema';

export function ProjectTitleCard({ project }: { project: Projects }) {
  const [projectTitle, setProjectTitle] = useState('My Project');
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const handleTitleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditingTitle(false);
    // Here you would typically update the project title in your backend
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Title</CardTitle>
        <CardDescription>
          The name of your project as it appears throughout the app.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isEditingTitle ? (
          <form onSubmit={handleTitleSubmit} className="flex items-center gap-2">
            <Input
              value={projectTitle}
              onChange={e => setProjectTitle(e.target.value)}
              className="max-w-sm"
            />
            <Button type="submit">Save</Button>
            <Button type="button" variant="ghost" onClick={() => setIsEditingTitle(false)}>
              Cancel
            </Button>
          </form>
        ) : (
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium">{projectTitle}</span>
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
