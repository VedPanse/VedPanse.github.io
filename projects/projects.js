import { fetchJSON, renderProjects } from '../global.js';

const PROJECTS_SOURCE = '../lib/projects.json';

const projectsContainer = document.querySelector('.projects');

const titleElement = document.querySelector('.projects-title');
const baseTitle = titleElement?.textContent?.trim() ?? '';

const updateTitleWithCount = (count) => {
  if (!titleElement) return;
  const label = count === 1 ? 'project' : 'projects';
  const prefix = baseTitle || 'Projects';
  titleElement.textContent = `${prefix} · ${count} ${label}`;
};

const renderErrorState = () => {
  if (!projectsContainer) return;
  projectsContainer.innerHTML = '';
  const message = document.createElement('p');
  message.className = 'text-sm text-gray-400';
  message.textContent = 'We could not load projects right now. Please try again later.';
  projectsContainer.append(message);
};

if (projectsContainer) {
  try {
    const projects = await fetchJSON(PROJECTS_SOURCE);
    renderProjects(projects, projectsContainer, 'h3');
    updateTitleWithCount(Array.isArray(projects) ? projects.length : 0);
  } catch (error) {
    console.error('Unable to render projects:', error);
    renderErrorState();
  }
} else {
  console.warn('projects.js: No container found for rendering projects.');
}
