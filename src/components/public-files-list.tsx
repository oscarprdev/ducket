import { Download, FileText } from 'lucide-react';
import { Button } from '~/components/ui/button';

// This would typically come from an API
const publicFiles = [
  {
    id: 1,
    name: 'public-document.pdf',
    size: '2.5 MB',
    uploadedBy: 'anonymous',
    uploadedAt: '2025-02-15',
  },
  {
    id: 2,
    name: 'shared-image.jpg',
    size: '1.8 MB',
    uploadedBy: 'anonymous',
    uploadedAt: '2025-02-14',
  },
  {
    id: 3,
    name: 'open-source-code.zip',
    size: '5.2 MB',
    uploadedBy: 'anonymous',
    uploadedAt: '2025-02-13',
  },
];

export function PublicFilesList() {
  return (
    <div className="divide-y rounded-lg border">
      {publicFiles.map(file => (
        <div key={file.id} className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <FileText className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="font-medium">{file.name}</p>
              <p className="text-sm text-muted-foreground">
                {file.size} • Uploaded on {file.uploadedAt}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      ))}
    </div>
  );
}
