import { fetchJSON, renderProjects } from './global.js';

const section = document.querySelector('#latest-projects');
const projectsContainer = section?.querySelector('.latest-projects');
const statusElement = section?.querySelector('[data-projects-status]');

const renderLatestProjects = async () => {
  if (!projectsContainer) {
    console.warn('latest projects container not found on the home page.');
    return;
  }

  try {
    const projects = await fetchJSON('./lib/projects.json');
    const latestProjects = Array.isArray(projects) ? projects.slice(0, 3) : [];

    renderProjects(latestProjects, projectsContainer, 'h3');

    if (statusElement) {
      const count = latestProjects.length;
      const label = count === 1 ? 'project' : 'projects';
      statusElement.textContent = `${count} ${label}`;
    }
  } catch (error) {
    console.error('Unable to load latest projects for the home page.', error);
    projectsContainer.innerHTML = '';
    const message = document.createElement('p');
    message.className = 'text-sm text-gray-500';
    message.textContent = 'Projects are unavailable right now. Please try again soon.';
    projectsContainer.append(message);
  }
};

renderLatestProjects();
