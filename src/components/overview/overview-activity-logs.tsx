import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { CloudDownload, EyeIcon, FileIcon, Trash2Icon, UploadIcon } from 'lucide-react';
import { useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { ACTIVITY_ACTIONS, API_KEY_PERMISSIONS } from '~/lib/constants';
import { formatDate, formatRelativeTime } from '~/lib/utils';
import { type ActivityLogsWithUser } from '~/server/db/queries';

interface OverviewActivityLogProps {
  activityLogs: ActivityLogsWithUser[];
}

export function OverviewActivityLog({ activityLogs }: OverviewActivityLogProps) {
  const badgeVariant = useCallback((action: string) => {
    switch (action) {
      case ACTIVITY_ACTIONS.upload:
        return 'secondary';
      case ACTIVITY_ACTIONS.download:
        return 'tertiary';
      case ACTIVITY_ACTIONS.delete:
        return 'destructive';
      case ACTIVITY_ACTIONS.read:
        return 'secondary';
      default:
        return 'default';
    }
  }, []);

  const getActivityIcon = useCallback((type: string) => {
    switch (type) {
      case ACTIVITY_ACTIONS.upload:
        return <UploadIcon className="h-4 w-4" />;
      case ACTIVITY_ACTIONS.download:
        return <CloudDownload className="h-4 w-4" />;
      case ACTIVITY_ACTIONS.delete:
        return <Trash2Icon className="h-4 w-4" />;
      case API_KEY_PERMISSIONS.read:
        return <EyeIcon className="h-4 w-4" />;
      default:
        return <FileIcon className="h-4 w-4" />;
    }
  }, []);
  return (
    <Card className="col-span-2 row-span-3 row-start-4 flex flex-col">
      <CardHeader>
        <CardTitle className="flex w-full items-center justify-between">
          Activity Log
          <Button variant="outline" size="sm">
            See all logs
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="min-h-0 flex-1">
        <div className="scrollable h-full space-y-4">
          {activityLogs?.map(activity => (
            <div key={activity.id} className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <div className="rounded-md border p-2">{getActivityIcon(activity.action)}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{activity.fileName}</p>
                    <Badge variant={badgeVariant(activity.action)} className="capitalize">
                      {activity.action === API_KEY_PERMISSIONS.write ? 'Upload' : activity.action}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{activity.user}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                {formatRelativeTime(activity.timestamp) || formatDate(activity.timestamp)}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
