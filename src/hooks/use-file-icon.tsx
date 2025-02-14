import { FileIcon, ImageIcon, VideoIcon } from 'lucide-react';

export const useFileIcon = () => {
  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="h-4 w-4" />;
      case 'video':
        return <VideoIcon className="h-4 w-4" />;
      default:
        return <FileIcon className="h-4 w-4" />;
    }
  };

  return {
    getFileIcon,
  };
};
