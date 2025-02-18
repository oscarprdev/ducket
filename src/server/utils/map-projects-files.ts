import { type ProjectsWithFilesAndUser } from '../db/queries';
import { type Files, type Projects, type Users } from '../db/schema';

export const mapProjectsFilesAndUsers = (
  projects: { projects: Projects; files: Files | null; user: Users }[]
): ProjectsWithFilesAndUser[] => {
  const projectMap = new Map<string, ProjectsWithFilesAndUser>();

  projects.forEach(row => {
    const project = row.projects;
    const file = row.files;
    const user = row.user;

    if (!projectMap.has(project.id)) {
      projectMap.set(project.id, {
        ...project,
        user,
        files: file ? [file] : [],
      });
    } else if (file) {
      projectMap.get(project.id)?.files.push(file);
    }
  });

  return Array.from(projectMap.values());
};
