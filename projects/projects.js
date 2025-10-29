import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';
import { fetchJSON, renderProjects } from '../global.js';

const PROJECTS_SOURCE = '../lib/projects.json';

const projectsContainer = document.querySelector('.projects');
const searchInput = document.querySelector('.searchBar');

let allProjects = [];
let query = '';
let selectedLabel = null;

const COLORBLIND_PALETTE = [
  '#0072B2', // blue
  '#E69F00', // orange
  '#009E73', // green
  '#F0E442', // yellow
  '#6A3D9A', // violet
  '#D55E00', // reddish orange
  '#CC79A7', // pink/purple
  '#999999', // grey
];
const colorScale = d3.scaleOrdinal(COLORBLIND_PALETTE);

if (searchInput) {
  query = searchInput.value ?? '';
}

const titleElement = document.querySelector('.projects-title');
const baseTitle = titleElement?.textContent?.trim() ?? '';

const updateTitleWithCount = (count) => {
  if (!titleElement) return;
  const label = count === 1 ? 'project' : 'projects';
  const prefix = baseTitle || 'Projects';
  titleElement.textContent = `${prefix} · ${count} ${label}`;
};

const renderErrorState = () => {
  if (projectsContainer) {
    projectsContainer.innerHTML = '';
    const message = document.createElement('p');
    message.className = 'text-sm text-gray-400';
    message.textContent = 'We could not load projects right now. Please try again later.';
    projectsContainer.append(message);
  }
  updateTitleWithCount(0);
};

const getProjectYear = (project) => {
  const rawYear = project?.year;
  if (rawYear === undefined || rawYear === null) return 'Unknown';
  const normalized = String(rawYear).trim();
  return normalized.length > 0 ? normalized : 'Unknown';
};

const lightenColor = (hex, intensity = 0.9) => {
  const color = d3.color(hex);
  if (!color) return hex;
  const clone = color.copy();
  return clone.brighter(intensity).formatHex?.() ?? hex;
};

const darkenColor = (hex, intensity = 0.8) => {
  const color = d3.color(hex);
  if (!color) return hex;
  const clone = color.copy();
  return clone.darker(intensity).formatHex?.() ?? hex;
};

const filterProjectsByQuery = (projectsList, searchTerm) => {
  if (!Array.isArray(projectsList)) return [];
  const normalizedQuery = (searchTerm ?? '').trim().toLowerCase();
  if (!normalizedQuery) return projectsList;
  return projectsList.filter((project) => {
    const values = Object.values(project ?? {}).map((value) => {
      if (Array.isArray(value)) return value.join(' ');
      return value == null ? '' : String(value);
    });
    const searchString = values.join('\n').toLowerCase();
    return searchString.includes(normalizedQuery);
  });
};

const getSearchFilteredProjects = () => filterProjectsByQuery(allProjects, query);

const getVisibleProjects = (projectsList) => {
  const base = Array.isArray(projectsList) ? projectsList : [];
  if (!selectedLabel) return base;
  return base.filter((project) => getProjectYear(project) === selectedLabel);
};

const renderProjectsPieChart = (projects = [], highlightedLabel = null) => {
  const svg = d3.select('#projects-pie-plot');
  const legend = d3.select('.legend');
  if (svg.empty()) return;

  const safeProjects = Array.isArray(projects) ? projects : [];

  const rolledData =
    safeProjects.length > 0
      ? d3
          .rollups(
            safeProjects,
            (group) => group.length,
            (item) => getProjectYear(item)
          )
          .sort((a, b) => {
            const yearA = Number.parseInt(a[0], 10);
            const yearB = Number.parseInt(b[0], 10);
            if (Number.isNaN(yearA) || Number.isNaN(yearB)) {
              return a[0].localeCompare(b[0]);
            }
            return yearB - yearA;
          })
      : [];

  const data = rolledData.map(([year, count]) => ({
    value: count,
    label: year,
  }));

  colorScale.domain(data.map((d) => d.label));
  const sliceColors = new Map(data.map((d) => [d.label, colorScale(d.label)]));
  const getBaseColor = (label) => sliceColors.get(label) ?? COLORBLIND_PALETTE[0];

  const sliceGenerator = d3.pie().value((d) => d.value);
  const arcGenerator = d3.arc().innerRadius(0).outerRadius(50);

  if (data.length === 0) {
    svg.selectAll('path').remove();
    if (!legend.empty()) {
      legend.selectAll('li').remove();
    }
    return;
  }

  const arcData = sliceGenerator(data);

  const slices = svg
    .selectAll('path')
    .data(arcData, (d) => d.data.label)
    .join((enter) =>
      enter
        .append('path')
        .attr('d', arcGenerator)
        .attr('data-label', (d) => d.data.label)
        .attr('aria-label', (d) => `Filter projects from ${d.data.label}`)
    );

  slices
    .attr('role', 'button')
    .attr('tabindex', 0)
    .attr('focusable', true)
    .attr('d', arcGenerator)
    .attr('fill', (d) =>
      highlightedLabel && d.data.label === highlightedLabel
        ? lightenColor(getBaseColor(d.data.label), 0.6)
        : getBaseColor(d.data.label)
    )
    .style('--slice-stroke', (d) => {
      const base = getBaseColor(d.data.label);
      const isSelected = highlightedLabel && d.data.label === highlightedLabel;
      return isSelected
        ? `color-mix(in srgb, ${base} 65%, #ffffff 35%)`
        : `color-mix(in srgb, ${base} 65%, #000000 35%)`;
    })
    .style('--slice-stroke-width', (d) =>
      highlightedLabel && d.data.label === highlightedLabel ? '3.4px' : '0.6px'
    )
    .style('--slice-glow', (d) => {
      const base = getBaseColor(d.data.label);
      const isSelected = highlightedLabel && d.data.label === highlightedLabel;
      return isSelected ? `drop-shadow(0 0 20px ${lightenColor(base, 1.15)}) drop-shadow(0 0 6px ${lightenColor(base, 1.4)})` : 'none';
    })
    .attr('aria-pressed', (d) => (highlightedLabel && d.data.label === highlightedLabel ? 'true' : 'false'))
    .classed('selected', (d) => Boolean(highlightedLabel && d.data.label === highlightedLabel))
    .on('click', (event, d) => {
      event.preventDefault();
      handleSliceClick(d.data.label);
    })
    .on('keydown', (event, d) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleSliceClick(d.data.label);
      }
    });

  if (!legend.empty()) {
    const legendItems = legend
      .selectAll('li')
      .data(data, (d) => d.label)
      .join((enter) =>
        enter
          .append('li')
      );

    legendItems
      .attr('role', 'button')
      .attr('tabindex', 0)
      .attr('class', (d) =>
        `legend__item${highlightedLabel && d.label === highlightedLabel ? ' selected' : ''}`
      )
      .attr('style', (d) => {
        const base = getBaseColor(d.label);
        return `--color:${base};`;
      })
      .attr('aria-pressed', (d) => (highlightedLabel && d.label === highlightedLabel ? 'true' : 'false'))
      .html((d) => `<span class="legend__swatch"></span> ${d.label} <em>(${d.value})</em>`)
      .on('click', (event, d) => {
        event.preventDefault();
        handleSliceClick(d.label);
      })
      .on('keydown', (event, d) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handleSliceClick(d.label);
        }
      });
  }
};

const renderProjectsSection = () => {
  const searchFiltered = getSearchFilteredProjects();

  if (selectedLabel && !searchFiltered.some((project) => getProjectYear(project) === selectedLabel)) {
    selectedLabel = null;
  }

  const visibleProjects = getVisibleProjects(searchFiltered);

  if (projectsContainer) {
    renderProjects(visibleProjects, projectsContainer, 'h3');
  }

  updateTitleWithCount(visibleProjects.length);
  renderProjectsPieChart(searchFiltered, selectedLabel);
};

const handleSearchInput = (event) => {
  query = event.target?.value ?? '';
  renderProjectsSection();
};

function handleSliceClick(label) {
  selectedLabel = selectedLabel === label ? null : label;
  renderProjectsSection();
}

document.addEventListener('color-scheme:change', () => {
  renderProjectsPieChart(getSearchFilteredProjects(), selectedLabel);
});

if (searchInput) {
  searchInput.addEventListener('input', handleSearchInput);
  searchInput.addEventListener('change', handleSearchInput);
}
if (projectsContainer || searchInput) {
  try {
    const projects = await fetchJSON(PROJECTS_SOURCE);
    allProjects = Array.isArray(projects) ? projects : [];
    renderProjectsSection();
  } catch (error) {
    console.error('Unable to render projects:', error);
    allProjects = [];
    selectedLabel = null;
    renderErrorState();
    renderProjectsPieChart([], selectedLabel);
  }

  if (!projectsContainer) {
    console.warn('projects.js: No container found for rendering projects.');
  }
} else {
  console.warn('projects.js: No container found for rendering projects.');
  renderProjectsPieChart([], selectedLabel);
}
