import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { auth } from '~/server/auth';
import { MUTATIONS } from '~/server/db/queries';
import generateApiKey from '~/server/utils/generate-api-key';

const createProjectsSchema = z.object({
  ownerId: z.string(),
  title: z.string(),
  apiKey: z.string(),
});

export default function CreateProject() {
  return (
    <form
      action={async (formData: FormData) => {
        'use server';
        const session = await auth();
        const userId = session?.user.id;
        const title = formData.get('title');
        const apiKey = generateApiKey();

        if (!title || !userId || !apiKey) return;

        const safeInput = createProjectsSchema.safeParse({
          ownerId: userId,
          title,
          apiKey,
        });

        if (!safeInput.success) return;

        await MUTATIONS.createProject(
          safeInput.data.ownerId,
          safeInput.data.title,
          safeInput.data.apiKey
        );

        revalidatePath('/dashboard');
      }}>
      <label>
        Title
        <input type="text" name="title" placeholder="Project title" />
      </label>
      <button type="submit">Create project</button>
    </form>
  );
}
