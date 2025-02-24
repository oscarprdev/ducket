'use server';

import { PublicFileUpload } from '../public-file-upload';
import { PublicFilesList } from '../public-files-list';
import { uploadPublicFile } from '~/app/(website)/actions';
import { QUERIES } from '~/server/db/queries';

export async function PublicFilesSection() {
  const publicFiles = await QUERIES.publicFiles.getAll();
  const lastPublicFile = publicFiles[publicFiles.length - 1];

  return (
    <div className="mx-auto flex w-full max-w-[800px] flex-col items-start justify-between gap-6 rounded-lg border p-6 sm:flex-row">
      <div className="w-full space-y-4">
        <h2 className="text-2xl font-bold">Quick Share</h2>
        <PublicFileUpload action={uploadPublicFile} lastPublicFile={lastPublicFile} />
      </div>
      <div className="w-full space-y-4">
        <h3 className="text-lg font-semibold">Recently shared files</h3>
        <PublicFilesList files={publicFiles} />
      </div>
    </div>
  );
}
