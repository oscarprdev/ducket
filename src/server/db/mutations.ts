import { db } from '.';
import generateApiKey from '../utils/generate-api-key';
import {
  type ActivityLogs,
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
import { and, eq, sql } from 'drizzle-orm';
import { type ApiKeyPermissions } from '~/lib/constants';

export const MUTATIONS = {
  users: {
    create: async function (input: {
      email: string;
      name: string;
      passwordHash: string;
    }): Promise<Users[]> {
      const { email, name, passwordHash } = input;
      return db.insert(users).values({ email, name, passwordHash });
    },
  },
  projects: {
    create: async function (input: {
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
        const [user] = await db.select().from(users).where(eq(users.id, ownerId));
        if (!user) throw new Error('User not found');

        await db.insert(projectUsers).values({
          projectId: project.id,
          email: user.email,
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
    update: function (input: { projectId: string; title: string }): Promise<Projects[]> {
      const { projectId, title } = input;
      return db.update(projects).set({ title }).where(eq(projects.id, projectId)).returning();
    },
    delete: function (input: { projectId: string }): Promise<Projects[]> {
      const { projectId } = input;
      return db.delete(projects).where(eq(projects.id, projectId)).returning();
    },
    transfer: function (input: { projectId: string; ownerId: string }): Promise<Projects[]> {
      const { projectId, ownerId } = input;
      return db.update(projects).set({ ownerId }).where(eq(projects.id, projectId)).returning();
    },
  },
  files: {
    create: function (input: {
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
    delete: function (input: { name: string }): Promise<Files[]> {
      const { name } = input;
      return db.delete(files).where(eq(files.fileName, name));
    },
  },
  apiKeys: {
    create: function (input: {
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
    edit: function (input: {
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
    delete: async ({ projectId, apiKey }: { projectId: string; apiKey: string }) => {
      return await db
        .delete(apiKeys)
        .where(and(eq(apiKeys.projectId, projectId), eq(apiKeys.secret, apiKey)));
    },
    updateUsage: async ({ projectId, apiKey }: { projectId: string; apiKey: string }) => {
      return db
        .update(apiKeys)
        .set({
          lastUsed: sql`CURRENT_TIMESTAMP`,
        })
        .where(and(eq(apiKeys.projectId, projectId), eq(apiKeys.secret, apiKey)));
    },
  },
  activityLogs: {
    create: function (input: {
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
  },
  projectUsers: {
    editPermissions: function (input: {
      projectId: string;
      email: string;
      permissions: ApiKeyPermissions[];
    }) {
      const { projectId, email, permissions } = input;
      return db
        .update(projectUsers)
        .set({ permissions })
        .where(and(eq(projectUsers.projectId, projectId), eq(projectUsers.email, email)));
    },
    remove: function (input: { projectId: string; email: string }): Promise<ProjectUsers[]> {
      const { projectId, email } = input;
      return db
        .delete(projectUsers)
        .where(and(eq(projectUsers.projectId, projectId), eq(projectUsers.email, email)));
    },
    invite: function (input: {
      projectId: string;
      email: string;
      permissions: string[];
    }): Promise<ProjectUsers[]> {
      const { projectId, email, permissions } = input;
      return db.insert(projectUsers).values({
        projectId,
        email,
        permissions,
      });
    },
    acceptInvitation: async function (input: { email: string }): Promise<void> {
      const { email } = input;
      await db.update(projectUsers).set({ confirmed: true }).where(eq(projectUsers.email, email));
    },
  },
};
