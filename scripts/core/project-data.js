import { JsonRepository } from "./json-repository.js?v=repo-refactor";

export const PROJECTS_URL = "data/projects.json";

const projectsRepository = new JsonRepository(PROJECTS_URL, { cache: "no-store" });

export const loadProjects = async () => {
  const data = await projectsRepository.load();
  return data && typeof data === "object" && Array.isArray(data.projects) ? data.projects : [];
};
