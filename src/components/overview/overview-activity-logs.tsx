import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { EyeIcon, FileIcon, Trash2Icon, UploadIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { API_KEY_PERMISSIONS } from '~/lib/constants';
import { type ActivityLogsWithUser } from '~/server/db/queries';

function getActivityIcon(type: string) {
  switch (type) {
    case API_KEY_PERMISSIONS.write:
      return <UploadIcon className="h-4 w-4" />;
    case API_KEY_PERMISSIONS.delete:
      return <Trash2Icon className="h-4 w-4" />;
    case API_KEY_PERMISSIONS.read:
      return <EyeIcon className="h-4 w-4" />;
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
        <CardTitle className="flex w-full items-center justify-between">
          Activity Log
          <Button variant="outline" size="sm">
            See all logs
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activityLogs?.map(activity => (
            <div key={activity.id} className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <div className="mb-auto rounded-md border p-2">
                  {getActivityIcon(activity.action)}
                </div>
                <div className="-mt-1 flex flex-col space-y-1">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium leading-none"> {activity.fileName}</p>
                    <Badge className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-black">
                      {activity.action}
                    </Badge>
                  </div>
                  <p className="text-xs leading-none">{activity.user}</p>
                  <p className="text-xs text-muted-foreground">
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
