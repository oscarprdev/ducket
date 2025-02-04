import { db } from '.';
import type {
  CreateFileInput,
  CreateProjectInput,
  GetProjectByTitleInput,
  GetProjectInput,
  GetProjectsInput,
} from './queries.types';
import { type Projects, files, projects } from './schema';
import { eq } from 'drizzle-orm';

export const QUERIES = {
  getProjects: function ({ ownerId }: GetProjectsInput): Promise<Projects[]> {
    return db.select().from(projects).where(eq(projects.ownerId, ownerId)).limit(10).offset(0);
  },
  getProject: function ({ projectId }: GetProjectInput): Promise<Projects[]> {
    return db.select().from(projects).where(eq(projects.id, projectId));
  },
  getProjectByTitle: function ({ title }: GetProjectByTitleInput): Promise<Projects[]> {
    return db.select().from(projects).where(eq(projects.title, title));
  },
};

export const MUTATIONS = {
  createProject: function ({ ownerId, title, apiKey }: CreateProjectInput): Promise<Projects[]> {
    return db.insert(projects).values({
      ownerId,
      title,
      api_key: apiKey,
    });
  },
  createFile: function ({
    projectId,
    fileName,
    type,
    fileUrl,
  }: CreateFileInput): Promise<Projects[]> {
    return db.insert(files).values({
      projectId,
      fileName,
      type,
      fileUrl,
    });
  },
};
