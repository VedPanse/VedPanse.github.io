import { fetchJSON, renderProjects, fetchGitHubData } from './global.js';

const GITHUB_USERNAME = 'VedPanse';

const section = document.querySelector('#latest-projects');
const projectsContainer = section?.querySelector('.latest-projects');
const statusElement = section?.querySelector('[data-projects-status]');
const profileStats = document.querySelector('#profile-stats');

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

const renderGitHubStats = async () => {
  if (!profileStats) {
    console.warn('Profile stats container not found on the home page.');
    return;
  }

  try {
    const githubData = await fetchGitHubData(GITHUB_USERNAME);
    console.log('GitHub profile data:', githubData);

    const formatMetric = (value) =>
      typeof value === 'number' ? value.toLocaleString() : value ?? '—';

    const updatedAt = githubData.updated_at ? new Date(githubData.updated_at) : null;
    const updatedLabel = updatedAt
      ? `Last updated ${updatedAt.toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })}`
      : 'Live stats refresh automatically.';

    profileStats.innerHTML = `
      <dl class="github-stats__list">
        <dt>Public Repos</dt><dd>${formatMetric(githubData.public_repos)}</dd>
        <dt>Public Gists</dt><dd>${formatMetric(githubData.public_gists)}</dd>
        <dt>Followers</dt><dd>${formatMetric(githubData.followers)}</dd>
        <dt>Following</dt><dd>${formatMetric(githubData.following)}</dd>
      </dl>
      <p class="github-stats__updated text-xs text-gray-500 mt-4">${updatedLabel}</p>
    `.trim();
  } catch (error) {
    console.error(`Unable to load GitHub stats for ${GITHUB_USERNAME}.`, error);
    profileStats.innerHTML =
      '<p class="text-sm text-gray-500">GitHub data unavailable right now.</p>';
  }
};

renderGitHubStats();
