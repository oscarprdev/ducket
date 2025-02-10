import { db } from '.';
import generateApiKey from '../utils/generate-api-key';
import {
  type ActivityLogs,
  type ApiKeys,
  type Files,
  type Projects,
  type Users,
  activityLogs,
  apiKeys,
  files,
  projects,
  users,
} from './schema';
import { and, desc, eq, gt, lt, sql } from 'drizzle-orm';
import { type ApiKeyPermissions } from '~/lib/constants';

export interface ActivityLogsWithUser extends ActivityLogs {
  user: string;
}

export const QUERIES = {
  // PROJECTS
  getProjects: function ({ ownerId }: { ownerId: string }): Promise<Projects[]> {
    return db.select().from(projects).where(eq(projects.ownerId, ownerId)).limit(10).offset(0);
  },
  getProject: function ({ projectId }: { projectId: string }): Promise<Projects[]> {
    return db.select().from(projects).where(eq(projects.id, projectId));
  },
  getProjectByApiKey: async function ({ apiKey }: { apiKey: string }): Promise<Projects[]> {
    const response = await db
      .select()
      .from(projects)
      .innerJoin(apiKeys, eq(apiKeys.projectId, projects.id))
      .where(eq(apiKeys.secret, apiKey));

    const projectsResult = response[0]?.projects;
    if (!projectsResult) return [];

    return [projectsResult];
  },
  getProjectByTitle: function ({ title }: { title: string }): Promise<Projects[]> {
    return db.select().from(projects).where(eq(projects.title, title));
  },
  // FILES
  getFileByName: function ({ name }: { name: string }): Promise<Files[]> {
    return db.select().from(files).where(eq(files.fileName, name));
  },
  getFilesByProjectId: function ({
    projectId,
    offset,
    limit,
  }: {
    projectId: string;
    offset?: number;
    limit?: number;
  }): Promise<Files[]> {
    const DEFAULT_OFFSET = 0;
    const DEFAULT_LIMIT = 10000;
    return db
      .select()
      .from(files)
      .where(eq(files.projectId, projectId))
      .offset(offset ?? DEFAULT_OFFSET)
      .limit(limit ?? DEFAULT_LIMIT)
      .orderBy(desc(files.createdAt));
  },
  // USERS
  getUserById: function ({ id }: { id: string }): Promise<Users[]> {
    return db.select().from(users).where(eq(users.id, id));
  },
  getUserByEmail: function ({ email }: { email: string }): Promise<Users[]> {
    return db.select().from(users).where(eq(users.email, email));
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
  // ACTIVITY LOGS
  getActivityLogsByProject: async function ({
    projectId,
    offset,
    limit,
  }: {
    projectId: string;
    offset?: number;
    limit?: number;
  }): Promise<ActivityLogsWithUser[]> {
    const DEFAULT_LIMIT = 5;
    const DEFAULT_OFFSET = 0;
    const response = await db
      .select()
      .from(activityLogs)
      .where(eq(activityLogs.projectId, projectId))
      .innerJoin(users, eq(activityLogs.userId, users.id))
      .offset(offset ?? DEFAULT_OFFSET)
      .limit(limit ?? DEFAULT_LIMIT)
      .orderBy(desc(activityLogs.timestamp));

    if (!response || response.length === 0) return [];

    return response.map(data => ({ ...data.activity_logs, user: data.user.email }));
  },
  // STORAGE
  getStorageByProjectId: async function ({
    projectId,
  }: {
    projectId: string;
  }): Promise<{ maxSize: number }> {
    const response = await db.select().from(projects).where(eq(projects.id, projectId));

    if (!response[0]?.maxSize) {
      return {
        maxSize: 0,
      };
    }

    return {
      maxSize: response[0].maxSize,
    };
  },
  getLastMonthFilesByProjectId: async function ({
    projectId,
  }: {
    projectId: string;
  }): Promise<Files[]> {
    return db
      .select()
      .from(files)
      .where(
        and(
          eq(files.projectId, projectId),
          lt(files.createdAt, sql`CURRENT_TIMESTAMP - INTERVAL '1 day'`),
          gt(files.createdAt, sql`CURRENT_TIMESTAMP - INTERVAL '31 days'`)
        )
      );
  },
  getTodayFilesByProjectId: async function ({
    projectId,
  }: {
    projectId: string;
  }): Promise<Files[]> {
    return db
      .select()
      .from(files)
      .where(and(eq(files.projectId, projectId), gt(files.createdAt, sql`CURRENT_DATE`)));
  },
  getYesterdayFilesByProjectId: async function ({
    projectId,
  }: {
    projectId: string;
  }): Promise<Files[]> {
    return db
      .select()
      .from(files)
      .where(
        and(
          eq(files.projectId, projectId),
          gt(files.createdAt, sql`CURRENT_DATE - INTERVAL '1 day'`),
          lt(files.createdAt, sql`CURRENT_DATE`)
        )
      );
  },
  getLastWeekFilesByProjectId: async function ({
    projectId,
  }: {
    projectId: string;
  }): Promise<Files[]> {
    return db
      .select()
      .from(files)
      .where(
        and(
          eq(files.projectId, projectId),
          gt(files.createdAt, sql`CURRENT_DATE - INTERVAL '7 days'`),
          lt(files.createdAt, sql`CURRENT_DATE`)
        )
      );
  },
};

export const MUTATIONS = {
  // PROJECTS
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
    try {
      await db.insert(apiKeys).values({
        projectId: project.id,
        name: title,
        secret: apiKey,
        userId: ownerId,
      });
    } catch {
      await db.delete(projects).where(eq(projects.id, project.id));
      throw new Error('Failed to create project after api key creation');
    }

    return [project];
  },
  // FILES
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
  // API KEYS
  updateApiKeyUsage: function (input: { projectId: string; apiKey: string }): Promise<ApiKeys[]> {
    const { projectId, apiKey } = input;
    return db
      .update(apiKeys)
      .set({
        lastUsed: sql`CURRENT_TIMESTAMP`,
      })
      .where(and(eq(apiKeys.projectId, projectId), eq(apiKeys.secret, apiKey)));
  },
  createApiKey: function (input: {
    projectId: string;
    name: string;
    userId: string;
    permissions: ApiKeyPermissions[];
  }) {
    const { projectId, name, userId, permissions } = input;
    return db.insert(apiKeys).values({
      name,
      projectId,
      permissions,
      userId,
      secret: generateApiKey(),
    });
  },
  editApiKey: function (input: {
    projectId: string;
    name: string;
    permissions: ApiKeyPermissions[];
  }) {
    const { projectId, name, permissions } = input;
    return db.update(apiKeys).set({ name, permissions }).where(eq(apiKeys.projectId, projectId));
  },
  deleteApiKey: function (input: { projectId: string; apiKey: string }): Promise<ApiKeys[]> {
    const { projectId, apiKey } = input;
    return db
      .delete(apiKeys)
      .where(and(eq(apiKeys.projectId, projectId), eq(apiKeys.secret, apiKey)));
  },
  // ACTIVITY LOGS
  createActivityLog: function (input: {
    projectId: string;
    userId: string;
    fileName: string;
    action: string;
  }): Promise<ActivityLogs[]> {
    const { projectId, userId, fileName, action } = input;
    return db.insert(activityLogs).values({
      projectId,
      userId,
      fileName,
      action,
    });
  },
};
