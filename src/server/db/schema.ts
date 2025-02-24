import { relations, sql } from 'drizzle-orm';
import {
  boolean,
  index,
  integer,
  pgTableCreator,
  primaryKey,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { type AdapterAccount } from 'next-auth/adapters';
import { INVITATION_STATES, TRANSFER_REQUEST_STATES } from '~/lib/constants';

export const createTable = pgTableCreator(name => `ducket_${name}`);

export type ProposalLikes = typeof proposalLikes.$inferSelect;
export const proposalLikes = createTable('proposal_likes', {
  id: varchar('id', { length: 255 })
    .notNull()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  proposalId: varchar('proposal_id', { length: 255 })
    .notNull()
    .references(() => proposals.id, { onDelete: 'cascade' }),
  userId: varchar('user_id', { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export type Proposals = typeof proposals.$inferSelect;
export interface ProposalsWithLikes extends Proposals {
  likesCount: number;
  isLiked: boolean;
  userImage: string | null;
  userName: string | null;
}
export const proposals = createTable('proposals', {
  id: varchar('id', { length: 255 })
    .notNull()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  userId: varchar('user_id', { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export type ApiKeys = typeof apiKeys.$inferSelect;
export const apiKeys = createTable('api_keys', {
  id: varchar('id', { length: 255 })
    .notNull()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: varchar('name', { length: 255 }).notNull().unique(),
  secret: varchar('secret', { length: 255 }).notNull(),
  permissions: text('permissions')
    .array()
    .notNull()
    .default(sql`ARRAY['all']::text[]`),
  projectId: varchar('project_id', { length: 255 })
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  lastUsed: timestamp('last_used', { withTimezone: true })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export type Files = typeof files.$inferSelect;
export const files = createTable('files', {
  id: varchar('id', { length: 255 })
    .notNull()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  projectId: varchar('project_id', { length: 255 })
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  fileUrl: text('file_url').notNull(),
  fileName: varchar('file_name', { length: 255 }),
  type: varchar('type', { length: 255 }),
  size: integer('size').notNull(),
  createdAt: timestamp('created_at', {
    mode: 'date',
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
});

export type PublicFiles = typeof publicFiles.$inferSelect;
export const publicFiles = createTable('public_files', {
  id: varchar('id', { length: 255 })
    .notNull()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  fileUrl: text('file_url').notNull(),
  fileName: varchar('file_name', { length: 255 }),
  type: varchar('type', { length: 255 }),
  size: integer('size').notNull(),
  createdAt: timestamp('created_at', {
    mode: 'date',
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
});

export type Projects = typeof projects.$inferSelect;
export const projects = createTable('projects', {
  id: varchar('id', { length: 255 })
    .notNull()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  ownerId: varchar('owner_id', { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  maxSize: integer('max_size').notNull().default(1073741824), // 1 GB in bytes (1024 * 1024 * 1024)
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export type Users = typeof users.$inferSelect;
export const users = createTable('user', {
  id: varchar('id', { length: 255 })
    .notNull()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: varchar('name', { length: 255 }),
  email: varchar('email', { length: 255 }).notNull(),
  emailVerified: timestamp('email_verified', {
    mode: 'date',
    withTimezone: true,
  }),
  image: varchar('image', { length: 255 }),
  passwordHash: varchar('password_hash', { length: 255 }).default(''),
});

export interface ProjectsWithPermissions extends Projects {
  ownerId: string;
  permissions: string[];
  invitationState: string;
  createdAt: Date;
  invitedUserEmail: string;
}
export type ProjectUsers = typeof projectUsers.$inferSelect;
export const projectUsers = createTable('project_users', {
  id: varchar('id', { length: 255 })
    .notNull()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  projectId: varchar('project_id', { length: 255 })
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  email: varchar('email', { length: 255 }).notNull(),
  permissions: text('permissions')
    .array()
    .notNull()
    .default(sql`ARRAY['read']::text[]`),
  state: text('state').notNull().default(INVITATION_STATES.accepted),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  isOwner: boolean('is_owner').notNull().default(false),
});

export interface TransferRequestsWithUsers extends TransferRequests {
  project: Projects;
  fromUser: Users;
  toUser: Users;
}
export type TransferRequests = typeof transferRequests.$inferSelect;
export const transferRequests = createTable('transfer_requests', {
  id: varchar('id', { length: 255 })
    .notNull()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  projectId: varchar('project_id', { length: 255 })
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  fromUserId: varchar('from_user_id', { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  toUserId: varchar('to_user_id', { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  state: text('state').notNull().default(TRANSFER_REQUEST_STATES.pending),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export type ActivityLogs = typeof activityLogs.$inferSelect;
export const activityLogs = createTable('activity_logs', {
  id: varchar('id', { length: 255 })
    .notNull()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  projectId: varchar('project_id', { length: 255 })
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  userId: varchar('user_id', { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  fileName: varchar('file_name', { length: 255 }),
  action: text('action').notNull(),
  timestamp: timestamp('timestamp', { withTimezone: true })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const accounts = createTable(
  'account',
  {
    userId: varchar('user_id', { length: 255 })
      .notNull()
      .references(() => users.id),
    type: varchar('type', { length: 255 }).$type<AdapterAccount['type']>().notNull(),
    provider: varchar('provider', { length: 255 }).notNull(),
    providerAccountId: varchar('provider_account_id', {
      length: 255,
    }).notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: varchar('token_type', { length: 255 }),
    scope: varchar('scope', { length: 255 }),
    id_token: text('id_token'),
    session_state: varchar('session_state', { length: 255 }),
  },
  account => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index('account_user_id_idx').on(account.userId),
  })
);

export type PasswordResetTokens = typeof passwordResetTokens.$inferSelect;
export const passwordResetTokens = createTable('password_reset_tokens', {
  id: varchar('id', { length: 255 })
    .notNull()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: varchar('user_id', { length: 255 })
    .notNull()
    .references(() => users.id),
  tokenHash: varchar('token_hash', { length: 255 }).notNull(),
  expiresAt: timestamp('expires_at', { mode: 'date' }).notNull(),
  isUsed: boolean('is_used').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const sessions = createTable(
  'session',
  {
    sessionToken: varchar('session_token', { length: 255 }).notNull().primaryKey(),
    userId: varchar('user_id', { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: timestamp('expires', {
      mode: 'date',
      withTimezone: true,
    }).notNull(),
  },
  session => ({
    userIdIdx: index('session_user_id_idx').on(session.userId),
  })
);

export const verificationTokens = createTable(
  'verification_token',
  {
    identifier: varchar('identifier', { length: 255 }).notNull(),
    token: varchar('token', { length: 255 }).notNull(),
    expires: timestamp('expires', {
      mode: 'date',
      withTimezone: true,
    }).notNull(),
  },
  vt => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

export const filesRelations = relations(files, ({ one }) => ({
  project: one(projects, {
    fields: [files.projectId],
    references: [projects.id],
  }),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  owner: one(users, { fields: [projects.ownerId], references: [users.id] }),
  files: many(files),
  apiKeys: many(apiKeys),
  users: many(projectUsers),
}));

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  projects: many(projectUsers),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const proposalsRelations = relations(proposals, ({ many }) => ({
  likes: many(proposalLikes),
}));

export const proposalLikesRelations = relations(proposalLikes, ({ one }) => ({
  proposal: one(proposals, {
    fields: [proposalLikes.proposalId],
    references: [proposals.id],
  }),
  user: one(users, {
    fields: [proposalLikes.userId],
    references: [users.id],
  }),
}));
