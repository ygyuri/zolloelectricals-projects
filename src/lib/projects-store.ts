import { Redis } from '@upstash/redis';
import type { Project } from '@/types/project';

const PROJECTS_KEY = 'zollo:projects';

function getRedis(): Redis | null {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

let memoryStore: Project[] = [];

export async function getProjects(): Promise<Project[]> {
  const redis = getRedis();
  if (redis) {
    try {
      const data = await redis.get<Project[]>(PROJECTS_KEY);
      return Array.isArray(data) ? data : [];
    } catch {
      return memoryStore.length ? memoryStore : [];
    }
  }
  return memoryStore;
}

export async function setProjects(projects: Project[]): Promise<void> {
  const redis = getRedis();
  if (redis) {
    await redis.set(PROJECTS_KEY, projects);
    return;
  }
  memoryStore = projects;
}

export async function addProject(project: Omit<Project, 'id'>): Promise<Project> {
  const list = await getProjects();
  const id = String(Date.now());
  const newProject: Project = { ...project, id };
  list.unshift(newProject);
  await setProjects(list);
  return newProject;
}
