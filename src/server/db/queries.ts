import { db } from '.';
import generateApiKey from '../utils/generate-api-key';
import {
  type ActivityLogs,
  type ApiKeys,
  type Files,
  type ProjectUsers,
  type Projects,
  type Users,
  activityLogs,
  apiKeys,
  files,
  projectUsers,
  projects,
  users,
} from './schema';
import { and, desc, eq, gt, lt, sql } from 'drizzle-orm';
import { type ApiKeyPermissions } from '~/lib/constants';

export interface ActivityLogsWithUser extends ActivityLogs {
  user: string;
}
export interface ActivityLogsWithUserAndURL extends ActivityLogs {
  user: string;
  fileUrl: string;
}

export const QUERIES = {
  projects: {
    getAll: ({ ownerId }: { ownerId: string }): Promise<Projects[]> => {
      return db.select().from(projects).where(eq(projects.ownerId, ownerId)).limit(10).offset(0);
    },
    getById: async ({ projectId }: { projectId: string }) => {
      return await db.select().from(projects).where(eq(projects.id, projectId)).limit(1);
    },
    getByApiKey: async ({ apiKey }: { apiKey: string }): Promise<Projects[]> => {
      const response = await db
        .select()
        .from(projects)
        .innerJoin(apiKeys, eq(apiKeys.projectId, projects.id))
        .where(eq(apiKeys.secret, apiKey));

      const projectsResult = response[0]?.projects;
      if (!projectsResult) return [];

      return [projectsResult];
    },
    getByTitle: ({ title }: { title: string }): Promise<Projects[]> => {
      return db.select().from(projects).where(eq(projects.title, title));
    },
    getByOwner: ({ userId }: { userId: string }): Promise<Projects[]> => {
      return db.select().from(projects).where(eq(projects.ownerId, userId));
    },
  },
  files: {
    getByName: async ({ projectId, fileName }: { projectId: string; fileName: string }) => {
      return await db
        .select()
        .from(files)
        .where(and(eq(files.projectId, projectId), eq(files.fileName, fileName)))
        .limit(1);
    },
    getByProjectId: ({
      projectId,
      offset,
      limit,
    }: {
      projectId: string;
      offset?: number;
      limit?: number;
    }): Promise<Files[]> => {
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
    getCount: async ({ projectId }: { projectId: string }) => {
      const result = await db
        .select({ count: sql<number>`count(*)` })
        .from(files)
        .where(eq(files.projectId, projectId));
      return result[0]?.count ?? 0;
    },
    getLastMonth: async ({ projectId }: { projectId: string }): Promise<Files[]> => {
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
    getToday: async ({ projectId }: { projectId: string }): Promise<Files[]> => {
      return db
        .select()
        .from(files)
        .where(and(eq(files.projectId, projectId), gt(files.createdAt, sql`CURRENT_DATE`)));
    },
    getYesterday: async ({ projectId }: { projectId: string }): Promise<Files[]> => {
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
    getLastWeek: async ({ projectId }: { projectId: string }): Promise<Files[]> => {
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
    getAll: async ({ projectId }: { projectId: string }): Promise<Files[]> => {
      return db.select().from(files).where(eq(files.projectId, projectId));
    },
  },
  users: {
    getById: ({ id }: { id: string }): Promise<Users[]> => {
      return db.select().from(users).where(eq(users.id, id));
    },
    getByEmail: ({ email }: { email: string }): Promise<Users[]> => {
      return db.select().from(users).where(eq(users.email, email));
    },
  },
  projectUsers: {
    getByProjectId: ({
      projectId,
      offset,
      limit,
    }: {
      projectId: string;
      offset?: number;
      limit?: number;
    }): Promise<ProjectUsers[]> => {
      const DEFAULT_OFFSET = 0;
      const DEFAULT_LIMIT = 10000;
      return db
        .select()
        .from(projectUsers)
        .where(eq(projectUsers.projectId, projectId))
        .offset(offset ?? DEFAULT_OFFSET)
        .limit(limit ?? DEFAULT_LIMIT);
    },
    getByUserId: ({ userId }: { userId: string }): Promise<ProjectUsers[]> => {
      return db.select().from(projectUsers).where(eq(projectUsers.userId, userId));
    },
  },
  apiKeys: {
    getBySecret: ({ apiKey }: { apiKey: string }): Promise<ApiKeys[]> => {
      return db.select().from(apiKeys).where(eq(apiKeys.secret, apiKey));
    },
    getByProject: async ({
      projectId,
      offset,
      limit,
    }: {
      projectId: string;
      offset?: number;
      limit?: number;
    }): Promise<{ projects: Projects[]; apiKeys: ApiKeys[] }> => {
      const response = await db
        .select()
        .from(apiKeys)
        .where(eq(apiKeys.projectId, projectId))
        .offset(offset ?? 0)
        .limit(limit ?? 10);

      if (!response || response.length === 0) return { projects: [], apiKeys: [] };

      const project = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1);

      return {
        projects: project,
        apiKeys: response,
      };
    },
    getCountByProject: async ({ projectId }: { projectId: string }) => {
      const result = await db
        .select({ count: sql<number>`count(*)` })
        .from(apiKeys)
        .where(eq(apiKeys.projectId, projectId));
      return result[0]?.count ?? 0;
    },
    getCount: async ({ projectId }: { projectId: string }) => {
      const result = await db
        .select({ count: sql<number>`count(*)` })
        .from(apiKeys)
        .where(eq(apiKeys.projectId, projectId));
      return result[0]?.count ?? 0;
    },
  },
  activityLogs: {
    getByProject: async ({
      projectId,
      offset,
      limit,
    }: {
      projectId: string;
      offset?: number;
      limit?: number;
    }): Promise<ActivityLogsWithUser[]> => {
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
    getLastWeek: async ({ projectId }: { projectId: string }): Promise<ActivityLogs[]> => {
      const response = await db
        .select()
        .from(activityLogs)
        .where(
          and(
            eq(activityLogs.projectId, projectId),
            gt(activityLogs.timestamp, sql`CURRENT_TIMESTAMP - INTERVAL '7 days'`),
            lt(activityLogs.timestamp, sql`CURRENT_TIMESTAMP`)
          )
        );

      if (!response || response.length === 0) return [];

      return response;
    },
    getAll: async ({ projectId }: { projectId: string }): Promise<ActivityLogs[]> => {
      return await db.select().from(activityLogs).where(eq(activityLogs.projectId, projectId));
    },
    getCount: async ({ projectId }: { projectId: string }) => {
      const result = await db
        .select({ count: sql<number>`count(*)` })
        .from(activityLogs)
        .where(eq(activityLogs.projectId, projectId));
      return result[0]?.count ?? 0;
    },
  },
  storage: {
    getByProjectId: async ({ projectId }: { projectId: string }): Promise<{ maxSize: number }> => {
      const response = await db.select().from(projects).where(eq(projects.id, projectId));

      if (!response[0]?.maxSize) {
        return { maxSize: 0 };
      }

      return { maxSize: response[0].maxSize };
    },
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
      });
    } catch {
      await db.delete(projects).where(eq(projects.id, project.id));
      throw new Error('Failed to create api key on project creation process');
    }

    try {
      await db.insert(projectUsers).values({
        projectId: project.id,
        userId: ownerId,
        permissions: ['all'],
      });
    } catch {
      await Promise.all([
        db.delete(apiKeys).where(eq(apiKeys.projectId, project.id)),
        db.delete(projects).where(eq(projects.id, project.id)),
      ]);
      throw new Error('Failed to insert project user on project creation process');
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
    permissions: ApiKeyPermissions[];
  }) {
    const { projectId, name, permissions } = input;
    return db.insert(apiKeys).values({
      name,
      projectId,
      permissions,
      secret: generateApiKey(),
    });
  },
  editApiKey: function (input: {
    projectId: string;
    name: string;
    currentName: string;
    permissions: ApiKeyPermissions[];
  }) {
    const { projectId, name, permissions } = input;
    return db
      .update(apiKeys)
      .set({ name, permissions })
      .where(and(eq(apiKeys.projectId, projectId), eq(apiKeys.name, input.currentName)));
  },
  deleteApiKey: async ({ projectId, apiKey }: { projectId: string; apiKey: string }) => {
    return await db
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
  updateProject: function (input: { projectId: string; title: string }): Promise<Projects[]> {
    const { projectId, title } = input;
    return db.update(projects).set({ title }).where(eq(projects.id, projectId)).returning();
  },
  deleteProject: function (input: { projectId: string }): Promise<Projects[]> {
    const { projectId } = input;
    return db.delete(projects).where(eq(projects.id, projectId)).returning();
  },
  editUserPermissions: function (input: {
    projectId: string;
    userId: string;
    permissions: ApiKeyPermissions[];
  }) {
    const { projectId, userId, permissions } = input;
    return db
      .update(projectUsers)
      .set({ permissions })
      .where(and(eq(projectUsers.projectId, projectId), eq(projectUsers.userId, userId)));
  },
  removeUser: function (input: { projectId: string; userId: string }): Promise<ProjectUsers[]> {
    const { projectId, userId } = input;
    return db
      .delete(projectUsers)
      .where(and(eq(projectUsers.projectId, projectId), eq(projectUsers.userId, userId)));
  },
};
