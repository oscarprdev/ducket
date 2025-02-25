import { db } from '.';
import { mapProjectsFilesAndUsers } from '../utils/map-projects-files';
import {
  type ActivityLogs,
  type ApiKeys,
  type Files,
  type PasswordResetTokens,
  type ProjectUsers,
  type Projects,
  type ProjectsWithPermissions,
  type ProposalLikes,
  type ProposalsPopulated,
  type PublicFiles,
  type TransferRequestsWithUsers,
  type Users,
  activityLogs,
  apiKeys,
  files,
  passwordResetTokens,
  projectUsers,
  projects,
  proposalLikes,
  proposals,
  publicFiles,
  transferRequests,
  users,
} from './schema';
import { and, desc, eq, gt, lt, sql } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';

export interface ActivityLogsWithUser extends ActivityLogs {
  user: string;
}
export interface ActivityLogsWithUser extends ActivityLogs {
  user: string;
}

export interface ProjectsWithFilesAndUser extends Projects {
  files: Files[];
  user: Users;
}

export const QUERIES = {
  projects: {
    getAll: async ({ ownerId }: { ownerId: string }): Promise<ProjectsWithFilesAndUser[]> => {
      const projectsWithFiles = await db
        .select()
        .from(projects)
        .innerJoin(users, eq(users.id, ownerId))
        .leftJoin(files, eq(files.projectId, projects.id))
        .where(eq(projects.ownerId, ownerId))
        .orderBy(desc(projects.createdAt));

      return mapProjectsFilesAndUsers(
        projectsWithFiles.map(data => ({
          projects: data.projects,
          files: data.files,
          user: data.user,
        }))
      );
    },
    getShared: async ({ userId }: { userId: string }): Promise<ProjectsWithFilesAndUser[]> => {
      const result = await db
        .select()
        .from(projects)
        .innerJoin(projectUsers, eq(projectUsers.projectId, projects.id))
        .innerJoin(users, eq(users.id, userId))
        .leftJoin(files, eq(files.projectId, projects.id))
        .where(
          and(
            eq(projectUsers.email, users.email),
            eq(projectUsers.state, 'accepted'),
            eq(projectUsers.isOwner, false)
          )
        );

      return mapProjectsFilesAndUsers(
        result.map(data => ({ projects: data.projects, files: data.files, user: data.user }))
      );
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
  publicFiles: {
    getAll: async (): Promise<PublicFiles[]> => {
      return db.select().from(publicFiles);
    },
  },
  users: {
    getById: ({ id }: { id: string }): Promise<Users[]> => {
      return db.select().from(users).where(eq(users.id, id));
    },
    getByEmail: ({ email }: { email: string }): Promise<Users[]> => {
      return db.select().from(users).where(eq(users.email, email));
    },
    getByCredentials: ({
      email,
      passwordHash,
    }: {
      email: string;
      passwordHash: string;
    }): Promise<Users[]> => {
      return db
        .select()
        .from(users)
        .where(and(eq(users.email, email), eq(users.passwordHash, passwordHash)));
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
    getByUserEmail: ({
      email,
      projectId,
    }: {
      email: string;
      projectId: string;
    }): Promise<ProjectUsers[]> => {
      return db
        .select()
        .from(projectUsers)
        .where(
          and(
            eq(projectUsers.email, email),
            eq(projectUsers.state, 'accepted'),
            eq(projectUsers.projectId, projectId)
          )
        );
    },
    getByUserId: async ({
      userId,
      projectId,
    }: {
      userId: string;
      projectId: string;
    }): Promise<ProjectUsers[]> => {
      const result = await db
        .select()
        .from(projectUsers)
        .innerJoin(users, eq(users.id, userId))
        .where(
          and(
            eq(projectUsers.email, users.email),
            eq(projectUsers.state, 'accepted'),
            eq(projectUsers.projectId, projectId)
          )
        );
      return result.map(data => data.project_users);
    },
    getNoOwned: ({ email }: { email: string }): Promise<ProjectUsers[]> => {
      return db
        .select()
        .from(projectUsers)
        .where(and(eq(projectUsers.email, email), eq(projectUsers.isOwner, false)));
    },
    getInvitations: async ({ email }: { email: string }): Promise<ProjectsWithPermissions[]> => {
      const result = await db
        .select()
        .from(projects)
        .innerJoin(projectUsers, eq(projectUsers.projectId, projects.id))
        .where(and(eq(projectUsers.email, email), eq(projectUsers.isOwner, false)));
      return result.map(data => ({
        ...data.projects,
        ownerId: data.project_users.id,
        permissions: data.project_users.permissions,
        invitationState: data.project_users.state,
        createdAt: data.project_users.createdAt,
        invitedUserEmail: data.project_users.email,
      }));
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
  passwordResetTokens: {
    getByToken: async ({ token }: { token: string }): Promise<PasswordResetTokens[]> => {
      return db.select().from(passwordResetTokens).where(eq(passwordResetTokens.tokenHash, token));
    },
  },
  transferRequests: {
    getOutgoing: async ({ userId }: { userId: string }): Promise<TransferRequestsWithUsers[]> => {
      const fromUsers = alias(users, 'fromUsers');
      const toUsers = alias(users, 'toUsers');

      return await db
        .select({
          id: transferRequests.id,
          projectId: transferRequests.projectId,
          state: transferRequests.state,
          createdAt: transferRequests.createdAt,
          fromUserId: transferRequests.fromUserId,
          toUserId: transferRequests.toUserId,
          fromUser: fromUsers,
          toUser: toUsers,
          project: projects,
        })
        .from(transferRequests)
        .innerJoin(fromUsers, eq(transferRequests.fromUserId, fromUsers.id))
        .innerJoin(toUsers, eq(transferRequests.toUserId, toUsers.id))
        .innerJoin(projects, eq(transferRequests.projectId, projects.id))
        .where(eq(transferRequests.fromUserId, userId));
    },
    getIncoming: async ({ userId }: { userId: string }): Promise<TransferRequestsWithUsers[]> => {
      const fromUsers = alias(users, 'fromUsers');
      const toUsers = alias(users, 'toUsers');

      return await db
        .select({
          id: transferRequests.id,
          projectId: transferRequests.projectId,
          state: transferRequests.state,
          createdAt: transferRequests.createdAt,
          fromUserId: transferRequests.fromUserId,
          toUserId: transferRequests.toUserId,
          fromUser: fromUsers,
          toUser: toUsers,
          project: projects,
        })
        .from(transferRequests)
        .innerJoin(fromUsers, eq(transferRequests.fromUserId, fromUsers.id))
        .innerJoin(toUsers, eq(transferRequests.toUserId, toUsers.id))
        .innerJoin(projects, eq(transferRequests.projectId, projects.id))
        .where(eq(transferRequests.toUserId, userId));
    },
  },
  proposals: {
    getAll: async (): Promise<ProposalsPopulated[]> => {
      const result = await db.query.proposals.findMany({
        with: {
          likes: true,
          user: true,
        },
      });

      return result.sort((a, b) => b.likes.length - a.likes.length);
    },
    getByUserId: async ({ userId }: { userId: string }): Promise<ProposalsPopulated[]> => {
      const result = await db.query.proposals.findMany({
        with: {
          likes: true,
          user: true,
        },
        where: eq(proposals.userId, userId),
      });

      return result.sort((a, b) => b.likes.length - a.likes.length);
    },
    getLikes: async ({ proposalId }: { proposalId: string }): Promise<ProposalLikes[]> => {
      return await db.select().from(proposalLikes).where(eq(proposalLikes.proposalId, proposalId));
    },
    getById: async ({ id }: { id: string }): Promise<ProposalsPopulated | null> => {
      const result = await db.query.proposals.findFirst({
        with: {
          likes: true,
          user: true,
        },
        where: eq(proposals.id, id),
      });

      return result ?? null;
    },
  },
};
