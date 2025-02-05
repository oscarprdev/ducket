import { db } from '.';
import { type Files, type Projects, type Users, files, projects, users } from './schema';
import { eq } from 'drizzle-orm';

export const QUERIES = {
  // PROJECTS
  getProjects: function ({ ownerId }: { ownerId: string }): Promise<Projects[]> {
    return db.select().from(projects).where(eq(projects.ownerId, ownerId)).limit(10).offset(0);
  },
  getProject: function ({ projectId }: { projectId: string }): Promise<Projects[]> {
    return db.select().from(projects).where(eq(projects.id, projectId));
  },
  getProjectByApiKey: function ({ apiKey }: { apiKey: string }) {
    return db.select().from(projects).where(eq(projects.api_key, apiKey));
  },
  getProjectByTitle: function ({ title }: { title: string }): Promise<Projects[]> {
    return db.select().from(projects).where(eq(projects.title, title));
  },
  // FILES
  getFileByName: function ({ name }: { name: string }): Promise<Files[]> {
    return db.select().from(files).where(eq(files.fileName, name));
  },
  getFilesByProjectId: function ({ projectId }: { projectId: string }): Promise<Files[]> {
    return db.select().from(files).where(eq(files.projectId, projectId));
  },
  // USERS
  getUserById: function ({ id }: { id: string }): Promise<Users[]> {
    return db.select().from(users).where(eq(users.id, id));
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
