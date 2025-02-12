'use server';

import { QUERIES } from '~/server/db/queries';

export interface GetActivityLogsInput {
  projectId?: string;
  offset: number;
  limit: number;
}
export async function getActivityLogs({ projectId, offset, limit }: GetActivityLogsInput) {
  try {
    if (!projectId) {
      return {
        error: 'Project ID is required',
      };
    }

    const logs = await QUERIES.activityLogs.getByProject({
      projectId,
      offset,
      limit,
    });

    return {
      data: logs,
      error: null,
    };
  } catch (error) {
    return {
      data: [],
      error: error instanceof Error ? error.message : 'Failed to get activity logs',
    };
  }
}
