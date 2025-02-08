import { FileIcon, Trash2Icon, UploadIcon, UserIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { type ActivityLogsWithUser } from '~/server/db/queries';
import { type ActivityLogs } from '~/server/db/schema';

const activities = [
  {
    id: 1,
    type: 'upload',
    user: 'John Doe',
    action: 'uploaded',
    target: 'document.pdf',
    timestamp: '2024-02-08T10:00:00',
  },
  {
    id: 2,
    type: 'delete',
    user: 'Jane Smith',
    action: 'deleted',
    target: 'image.png',
    timestamp: '2024-02-08T09:30:00',
  },
  {
    id: 3,
    type: 'share',
    user: 'Mike Johnson',
    action: 'shared',
    target: 'presentation.pptx',
    timestamp: '2024-02-08T09:00:00',
  },
  {
    id: 4,
    type: 'share',
    user: 'Mike Johnson',
    action: 'shared',
    target: 'presentation.pptx',
    timestamp: '2024-02-08T09:00:00',
  },
  {
    id: 5,
    type: 'share',
    user: 'Mike Johnson',
    action: 'shared',
    target: 'presentation.pptx',
    timestamp: '2024-02-08T09:00:00',
  },
];

function getActivityIcon(type: string) {
  switch (type) {
    case 'upload':
      return <UploadIcon className="h-4 w-4" />;
    case 'delete':
      return <Trash2Icon className="h-4 w-4" />;
    case 'share':
      return <UserIcon className="h-4 w-4" />;
    default:
      return <FileIcon className="h-4 w-4" />;
  }
}

interface OverviewActivityLogProps {
  activityLogs: ActivityLogsWithUser[];
}

export function OverviewActivityLog({ activityLogs }: OverviewActivityLogProps) {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Activity Log</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activityLogs?.map(activity => (
            <div key={activity.id} className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <div className="rounded-md border p-2">{getActivityIcon(activity.action)}</div>
                <div>
                  <p className="text-sm font-medium leading-none">
                    {activity.user} {activity.action} {activity.fileName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(activity.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
