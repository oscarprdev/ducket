import { db } from '.';
import { type Files, type Projects, files, projects } from './schema';
import { eq } from 'drizzle-orm';

export const QUERIES = {
  getProjects: function ({ ownerId }: { ownerId: string }): Promise<Projects[]> {
    return db.select().from(projects).where(eq(projects.ownerId, ownerId)).limit(10).offset(0);
  },
  getProject: function ({ projectId }: { projectId: string }): Promise<Projects[]> {
    return db.select().from(projects).where(eq(projects.id, projectId));
  },
  getProjectByTitle: function ({ title }: { title: string }): Promise<Projects[]> {
    return db.select().from(projects).where(eq(projects.title, title));
  },
  getFileByName: function ({ name }: { name: string }): Promise<Files[]> {
    return db.select().from(files).where(eq(files.fileName, name));
  },
};

export const MUTATIONS = {
  createProject: function (input: {
    ownerId: string;
    title: string;
    apiKey: string;
  }): Promise<Projects[]> {
    const { ownerId, title, apiKey } = input;
    return db.insert(projects).values({
      ownerId,
      title,
      api_key: apiKey,
    });
  },
  createFile: function (input: {
    projectId: string;
    fileName: string;
    type: string;
    fileUrl: string;
  }): Promise<Projects[]> {
    const { projectId, fileName, type, fileUrl } = input;
    return db.insert(files).values({
      projectId,
      fileName,
      type,
      fileUrl,
    });
  },
  deleteFileByName: function (input: { name: string }): Promise<Files[]> {
    const { name } = input;
    return db.delete(files).where(eq(files.fileName, name));
  },
};
