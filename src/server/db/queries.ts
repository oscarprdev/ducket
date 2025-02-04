import { db } from '.';
import { projects } from './schema';
import { eq } from 'drizzle-orm';

export const QUERIES = {
  getProjects: function (ownerId: string) {
    return db.select().from(projects).where(eq(projects.ownerId, ownerId)).limit(10).offset(0);
  },
  getProject: function (projectId: string) {
    return db.select().from(projects).where(eq(projects.id, projectId));
  },
};

export const MUTATIONS = {
  createProject: function (ownerId: string, title: string, apiKey: string) {
    return db.insert(projects).values({
      ownerId,
      title,
      api_key: apiKey,
    });
  },
};
