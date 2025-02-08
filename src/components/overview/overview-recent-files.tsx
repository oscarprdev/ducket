import { FileIcon, ImageIcon, VideoIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';

const recentFiles = [
  {
    id: 1,
    name: 'presentation.pdf',
    type: 'file',
    size: '2.4MB',
    uploadedAt: '2024-02-08T10:00:00',
  },
  {
    id: 2,
    name: 'screenshot.png',
    type: 'image',
    size: '4.2MB',
    uploadedAt: '2024-02-08T09:30:00',
  },
  {
    id: 3,
    name: 'demo.mp4',
    type: 'video',
    size: '12.8MB',
    uploadedAt: '2024-02-08T09:00:00',
  },
  {
    id: 4,
    name: 'demo.mp4',
    type: 'video',
    size: '12.8MB',
    uploadedAt: '2024-02-08T09:00:00',
  },
  {
    id: 5,
    name: 'demo.mp4',
    type: 'video',
    size: '12.8MB',
    uploadedAt: '2024-02-08T09:00:00',
  },
  {
    id: 6,
    name: 'demo.mp4',
    type: 'video',
    size: '12.8MB',
    uploadedAt: '2024-02-08T09:00:00',
  },
  {
    id: 7,
    name: 'demo.mp4',
    type: 'video',
    size: '12.8MB',
    uploadedAt: '2024-02-08T09:00:00',
  },
];

function getFileIcon(type: string) {
  switch (type) {
    case 'image':
      return <ImageIcon className="h-4 w-4" />;
    case 'video':
      return <VideoIcon className="h-4 w-4" />;
    default:
      return <FileIcon className="h-4 w-4" />;
  }
}

export function OverviewRecentFiles() {
  return (
    <Card className="col-span-2 -mt-32 h-[450px]">
      <CardHeader>
        <CardTitle>Recent Files</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentFiles.map(file => (
            <div key={file.id} className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <div className="rounded-md border p-2">{getFileIcon(file.type)}</div>
                <div>
                  <p className="text-sm font-medium leading-none">{file.name}</p>
                  <p className="text-sm text-muted-foreground">{file.size}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {new Date(file.uploadedAt).toLocaleTimeString()}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
