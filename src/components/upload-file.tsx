import { QUERIES } from '~/server/db/queries';

export default function UploadFile({ projectId }: { projectId: string }) {
  return (
    <form
      action={async (formData: FormData) => {
        'use server';

        const [project] = await QUERIES.getProject({ projectId });
        if (!project) return;
        const file = formData.get('file') as File;
        formData.append('id', 'testing');
        formData.append('project', project.title);
        formData.append('type', file.type);

        const response = await fetch(`http://localhost:3000/api/ducket/file`, {
          method: 'POST',
          body: formData,
          headers: {
            Authorization: `Bearer ${project.api_key}`,
          },
        });

        console.log(response);
      }}>
      <input type="file" name="file" />
      <button type="submit">Upload file</button>
    </form>
  );
}
