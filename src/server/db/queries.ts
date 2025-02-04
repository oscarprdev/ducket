import { db } from "."
import { projects } from "./schema"

export const MUTATIONS = {
    createProject: function (ownerId: string, title: string) {
        return db.insert(projects).values({
            ownerId,
            title,
        })
    }
}