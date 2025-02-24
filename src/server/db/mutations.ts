import { db } from '.';
import {
  type ActivityLogs,
  type Files,
  type PasswordResetTokens,
  type ProjectUsers,
  type Projects,
  type Proposals,
  type PublicFiles,
  type TransferRequests,
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
import { and, eq, sql } from 'drizzle-orm';
import {
  type ApiKeyPermissions,
  INVITATION_STATES,
  type InvitationState,
  TRANSFER_REQUEST_STATES,
} from '~/lib/constants';

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
    delete: async function (input: { id: string }): Promise<Users[]> {
      const { id } = input;
      return db.delete(users).where(eq(users.id, id));
    },
    updatePassword: async function (input: { id: string; passwordHash: string }): Promise<Users[]> {
      const { id, passwordHash } = input;
      return db.update(users).set({ passwordHash }).where(eq(users.id, id));
    },
    updateInformation: async function (input: {
      id: string;
      name: string;
      email: string;
    }): Promise<Users[]> {
      const { id, name, email } = input;
      return db.update(users).set({ name, email }).where(eq(users.id, id));
    },
    updateImage: async function (input: { id: string; image: string }): Promise<Users[]> {
      const { id, image } = input;
      return db.update(users).set({ image }).where(eq(users.id, id));
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
          name: `${ownerId}/${title}/${apiKey}`,
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
          state: INVITATION_STATES.accepted,
          isOwner: true,
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
  publicFiles: {
    create: function (input: {
      fileName: string;
      type: string;
      fileUrl: string;
      size: number;
    }): Promise<PublicFiles[]> {
      const { fileName, type, fileUrl, size } = input;
      return db.insert(publicFiles).values({
        fileName,
        type,
        fileUrl,
        size,
      });
    },
    delete: function (input: { name: string }): Promise<PublicFiles[]> {
      const { name } = input;
      return db.delete(publicFiles).where(eq(publicFiles.fileName, name));
    },
  },
  apiKeys: {
    create: function (input: {
      projectId: string;
      name: string;
      permissions: ApiKeyPermissions[];
      secret: string;
    }) {
      const { projectId, name, permissions, secret } = input;
      return db.insert(apiKeys).values({
        name,
        projectId,
        permissions,
        secret,
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
      state: InvitationState;
    }): Promise<ProjectUsers[]> {
      const { projectId, email, permissions, state } = input;
      return db.insert(projectUsers).values({
        projectId,
        email,
        permissions,
        state,
      });
    },
    acceptInvitation: async function (input: { email: string; projectId: string }): Promise<void> {
      const { email, projectId } = input;
      await db
        .update(projectUsers)
        .set({ state: INVITATION_STATES.accepted })
        .where(and(eq(projectUsers.email, email), eq(projectUsers.projectId, projectId)));
    },
    declineInvitation: async function (input: { email: string; projectId: string }): Promise<void> {
      const { email, projectId } = input;
      await db
        .update(projectUsers)
        .set({ state: INVITATION_STATES.declined })
        .where(and(eq(projectUsers.email, email), eq(projectUsers.projectId, projectId)));
    },
    updateOwnership: async function (input: {
      projectId: string;
      newOwnerEmail: string;
    }): Promise<void> {
      const { projectId, newOwnerEmail } = input;
      await db
        .update(projectUsers)
        .set({ permissions: ['all'], isOwner: true })
        .where(and(eq(projectUsers.projectId, projectId), eq(projectUsers.email, newOwnerEmail)));
    },
    removeOwnership: async function (input: { projectId: string; email: string }): Promise<void> {
      const { projectId, email } = input;
      await db
        .update(projectUsers)
        .set({ isOwner: false })
        .where(and(eq(projectUsers.projectId, projectId), eq(projectUsers.email, email)));
    },
  },
  transferRequests: {
    create: function (input: {
      projectId: string;
      fromUserId: string;
      toUserId: string;
    }): Promise<TransferRequests[]> {
      const { projectId, fromUserId, toUserId } = input;
      return db.insert(transferRequests).values({ projectId, fromUserId, toUserId });
    },
    accept: function (input: { id: string }): Promise<TransferRequests[]> {
      const { id } = input;
      return db
        .update(transferRequests)
        .set({ state: TRANSFER_REQUEST_STATES.accepted })
        .where(eq(transferRequests.id, id));
    },
    decline: function (input: { id: string }): Promise<TransferRequests[]> {
      const { id } = input;
      return db
        .update(transferRequests)
        .set({ state: TRANSFER_REQUEST_STATES.declined })
        .where(eq(transferRequests.id, id));
    },
    delete: function (input: { id: string }): Promise<TransferRequests[]> {
      const { id } = input;
      return db.delete(transferRequests).where(eq(transferRequests.id, id));
    },
  },
  passwordResetTokens: {
    create: function (input: {
      userId: string;
      tokenHash: string;
      expiresAt: Date;
    }): Promise<PasswordResetTokens[]> {
      const { userId, tokenHash, expiresAt } = input;
      return db.insert(passwordResetTokens).values({ userId, tokenHash, expiresAt }).returning();
    },
    update: function (input: { id: string; isUsed: boolean }): Promise<PasswordResetTokens[]> {
      const { id, isUsed } = input;
      return db.update(passwordResetTokens).set({ isUsed }).where(eq(passwordResetTokens.id, id));
    },
    delete: function (input: { id: string }): Promise<PasswordResetTokens[]> {
      const { id } = input;
      return db.delete(passwordResetTokens).where(eq(passwordResetTokens.id, id));
    },
  },
  proposals: {
    create: function (input: {
      userId: string;
      title: string;
      description: string;
    }): Promise<Proposals[]> {
      const { userId, title, description } = input;
      return db.insert(proposals).values({ userId, title, description });
    },
    delete: function (input: { id: string }): Promise<Proposals[]> {
      const { id } = input;
      return db.delete(proposals).where(eq(proposals.id, id));
    },
    toggleLike: async function (input: {
      proposalId: string;
      userId: string;
    }): Promise<{ liked: boolean }> {
      const { proposalId, userId } = input;

      // Check if user already liked
      const [existingLike] = await db
        .select()
        .from(proposalLikes)
        .where(and(eq(proposalLikes.proposalId, proposalId), eq(proposalLikes.userId, userId)));

      if (existingLike) {
        // Unlike
        await db
          .delete(proposalLikes)
          .where(and(eq(proposalLikes.proposalId, proposalId), eq(proposalLikes.userId, userId)));
        return { liked: false };
      } else {
        // Like
        await db.insert(proposalLikes).values({
          proposalId,
          userId,
        });
        return { liked: true };
      }
    },
  },
};
