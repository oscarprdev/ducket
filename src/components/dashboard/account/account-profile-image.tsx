import { ImageUpload } from './image-upload';
import { ImageIcon } from 'lucide-react';
import { uploadImage } from '~/app/dashboard/(dashboard)/account/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';

interface AccountProfileImageProps {
  userId: string;
  profileImage: string | null;
  isOAuthUser: boolean;
}

export function AccountProfileImage({
  userId,
  profileImage,
  isOAuthUser,
}: AccountProfileImageProps) {
  return (
    <Card className="max-w-[800px] bg-background">
      <CardHeader>
        <CardTitle className="flex items-center">
          <ImageIcon className="mr-2 h-5 w-5" />
          Profile Image
        </CardTitle>
        <CardDescription>
          {isOAuthUser
            ? `Your profile image is managed by Github.`
            : 'Upload or change your profile picture.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ImageUpload
          initialImage={profileImage}
          disabled={isOAuthUser}
          userId={userId}
          action={uploadImage}
        />
      </CardContent>
    </Card>
  );
}
