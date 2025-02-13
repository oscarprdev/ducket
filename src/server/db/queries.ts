import { db } from '.';
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
      return db.select().from(projects).where(eq(projects.id, projectId));
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
    getVisibility: async ({ projectId }: { projectId: string }): Promise<{ isShared: boolean }> => {
      const projectsUsers = await db
        .select()
        .from(projectUsers)
        .where(eq(projectUsers.projectId, projectId));
      return {
        isShared: projectsUsers.length > 1,
      };
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
