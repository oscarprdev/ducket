import { db } from '.';
import {
  type ApiKeys,
  type Files,
  type Projects,
  type Users,
  apiKeys,
  files,
  projects,
  users,
} from './schema';
import { and, eq } from 'drizzle-orm';

export const QUERIES = {
  // PROJECTS
  getProjects: function ({ ownerId }: { ownerId: string }): Promise<Projects[]> {
    return db.select().from(projects).where(eq(projects.ownerId, ownerId)).limit(10).offset(0);
  },
  getProject: function ({ projectId }: { projectId: string }): Promise<Projects[]> {
    return db.select().from(projects).where(eq(projects.id, projectId));
  },
  getProjectByApiKey: function ({ apiKey }: { apiKey: string }) {
    return db
      .select()
      .from(projects)
      .innerJoin(apiKeys, eq(apiKeys.projectId, projects.id))
      .where(eq(apiKeys.secret, apiKey))
      .then(result => result[0]);
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
  // API KEYS
  getApikey: function ({ apiKey }: { apiKey: string }): Promise<ApiKeys[]> {
    return db.select().from(apiKeys).where(eq(apiKeys.secret, apiKey));
  },
  getApiKeysByProject: async function ({
    projectId,
  }: {
    projectId: string;
  }): Promise<{ projects: Projects[]; apiKeys: ApiKeys[] }> {
    const [response] = await db
      .select()
      .from(apiKeys)
      .innerJoin(projects, eq(apiKeys.projectId, projects.id))
      .where(eq(apiKeys.projectId, projectId));

    if (!response) return { projects: [], apiKeys: [] };

    return {
      projects: [response.projects],
      apiKeys: [response.api_keys],
    };
  },
  getApiKeyByProjectAndUser: async function ({
    projectId,
    userId,
  }: {
    projectId: string;
    userId: string;
  }): Promise<ApiKeys[]> {
    const [response] = await db
      .select()
      .from(apiKeys)
      .innerJoin(projects, eq(apiKeys.projectId, projects.id))
      .innerJoin(users, eq(apiKeys.userId, users.id))
      .where(and(eq(apiKeys.projectId, projectId), eq(apiKeys.userId, userId)));

    if (!response) return [];

    return [response.api_keys];
  },
};

export const MUTATIONS = {
  createProject: async function (input: {
    ownerId: string;
    title: string;
    apiKey: string;
  }): Promise<Projects[]> {
    const { ownerId, title, apiKey } = input;
    const [project] = await db
      .insert(projects)
      .values({
        ownerId,
        title,
      })
      .returning();

    if (!project) {
      throw new Error('Failed to create project');
    }

    await db.insert(apiKeys).values({
      projectId: project.id,
      name: title,
      secret: apiKey,
      permissions: 'all',
      userId: ownerId,
    });

    return [project];
  },
  createFile: function (input: {
    projectId: string;
    fileName: string;
    type: string;
    fileUrl: string;
    size: number;
  }): Promise<Projects[]> {
    const { projectId, fileName, type, fileUrl, size } = input;
    return db.insert(files).values({
      projectId,
      fileName,
      type,
      fileUrl,
      size,
    });
  },
  deleteFileByName: function (input: { name: string }): Promise<Files[]> {
    const { name } = input;
    return db.delete(files).where(eq(files.fileName, name));
  },
};
