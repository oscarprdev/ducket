import { z } from "zod";
import { auth } from "~/server/auth";
import { MUTATIONS } from "~/server/db/queries";

const createProjectsSchema = z.object({
ownerId: z.string(),
  title: z.string(),
})

export default function CreateProject() {
  return (
    <form
      action={async (formData: FormData) => {
        'use server';
        const session = await auth()
        const userId = session?.user.id
        const title = formData.get('title')

        if (!title || !userId) return

        const safeInput = createProjectsSchema.safeParse({
          ownerId: userId,
          title,
        })

        if (!safeInput.success) return

        await MUTATIONS.createProject(safeInput.data.ownerId, safeInput.data.title)
      }}>
        <label>
            Title
            <input type="text" name="title" placeholder="Project title" />
        </label>
      <button type="submit">Create project</button>
    </form>
  );
}
