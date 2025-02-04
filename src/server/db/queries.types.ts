// QUERIES
export type GetProjectsInput = {
  ownerId: string;
};

export type GetProjectInput = {
  projectId: string;
};

export type GetProjectByTitleInput = {
  title: string;
};

// MUTATIONS
export type CreateProjectInput = {
  ownerId: string;
  title: string;
  apiKey: string;
};

export type CreateFileInput = {
  projectId: string;
  fileName: string;
  type: string;
  fileUrl: string;
};
