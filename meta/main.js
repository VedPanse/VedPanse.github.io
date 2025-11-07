import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

let xScale;
let yScale;
let hideTooltipTimeout = null;
let activeDot = null;

//
// 1. DATA LOADING
//
async function loadData() {
  const data = await d3.csv('loc.csv', (row) => ({
    ...row,
    line: Number(row.line),
    depth: Number(row.depth),
    length: Number(row.length),
    date: new Date(`${row.date}T00:00${row.timezone}`),
    datetime: new Date(row.datetime),
  }));
  return data;
}

//
// 2. DATA PROCESSING
//
function processCommits(data) {
  return d3
    .groups(data, (d) => d.commit)
    .map(([commit, lines]) => {
      const first = lines[0];
      const { author, date, time, timezone, datetime } = first;
      const ret = {
        id: commit,
        url: `https://github.com/VedPanse/VedPanse.github.io/commit/${commit}`,
        author,
        date,
        time,
        timezone,
        datetime,
        hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
        totalLines: lines.length,
      };

      Object.defineProperty(ret, 'lines', {
        value: lines,
        enumerable: false,
        writable: false,
        configurable: false,
      });

      return ret;
    });
}

//
// 3. SMALL UTILITIES
//
function humanizePeriod(period) {
  if (!period) return '—';
  const normalized = period.toLowerCase();
  if (normalized.includes('morning')) return 'Morning';
  if (normalized.includes('afternoon')) return 'Afternoon';
  if (normalized.includes('evening')) return 'Evening';
  if (normalized.includes('night')) return 'Night';
  return period;
}

//
// 4. TOOLTIP HELPERS
//
function renderTooltipContent(commit) {
  if (!commit || Object.keys(commit).length === 0) return;

  const tooltip = document.getElementById('commit-tooltip');
  const link = document.getElementById('commit-link');
  const date = document.getElementById('commit-date');
  const time = document.getElementById('commit-time');
  const author = document.getElementById('commit-author');
  const lines = document.getElementById('commit-lines');

  if (!tooltip || !link || !date || !time || !author || !lines) {
    console.warn('Tooltip elements are missing from the DOM.');
    return;
  }

  link.href = commit.url;
  link.textContent = commit.id ?? '—';
  date.textContent = commit.datetime?.toLocaleString('en', { dateStyle: 'full' }) ?? '—';
  time.textContent =
    commit.datetime?.toLocaleTimeString('en', {
      hour: '2-digit',
      minute: '2-digit',
    }) ?? '—';
  author.textContent = commit.author ?? '—';
  const totalLines = commit.totalLines ?? commit.lines?.length ?? 0;
  lines.textContent = `${totalLines} lines`;
}

function updateTooltipVisibility(isVisible) {
  const tooltip = document.getElementById('commit-tooltip');
  if (!tooltip) return;
  tooltip.toggleAttribute('hidden', !isVisible);
}

// robust positioning: fall back to 40,40 if we get weird coords
function updateTooltipPosition(event) {
  const tooltip = document.getElementById('commit-tooltip');
  if (!tooltip) return;

  let x = event.clientX;
  let y = event.clientY;

  // if clientX is 0 or undefined (can happen on SVG mouseenter), try d3.pointer
  if (!x && !y) {
    const ptr = d3.pointer(event, document.body);
    x = ptr[0];
    y = ptr[1];
  }

  if (!Number.isFinite(x)) x = 40;
  if (!Number.isFinite(y)) y = 40;

  const offsetX = 20;
  const offsetY = 20;
  tooltip.style.left = `${x + offsetX}px`;
  tooltip.style.top = `${y + offsetY}px`;
}

function scheduleTooltipHide(dotElement) {
  clearTimeout(hideTooltipTimeout);
  hideTooltipTimeout = setTimeout(() => {
    const tooltip = document.getElementById('commit-tooltip');
    if (tooltip && tooltip.matches(':hover')) return;
    if (dotElement) d3.select(dotElement).style('fill-opacity', 0.7);
    updateTooltipVisibility(false);
    if (dotElement && dotElement === activeDot) {
      activeDot = null;
    }
  }, 220);
}

function setupTooltipPersistence() {
  const tooltip = document.getElementById('commit-tooltip');
  if (!tooltip || tooltip.dataset.listenersAttached === 'true') return;

  tooltip.addEventListener('mouseenter', () => {
    clearTimeout(hideTooltipTimeout);
    updateTooltipVisibility(true);
  });

  tooltip.addEventListener('mouseleave', () => {
    scheduleTooltipHide(activeDot);
  });

  tooltip.dataset.listenersAttached = 'true';
}

// NEW: force a debug tooltip so we can see it even without hover
function showDebugTooltip() {
  const tooltip = document.getElementById('commit-tooltip');
  if (!tooltip) return;
  tooltip.hidden = false;
  tooltip.style.left = '40px';
  tooltip.style.top = '40px';

  // if page loaded before loc.csv, at least put something
  const link = document.getElementById('commit-link');
  const date = document.getElementById('commit-date');
  const time = document.getElementById('commit-time');
  const author = document.getElementById('commit-author');
  const lines = document.getElementById('commit-lines');

  if (link) link.textContent = 'debug-commit';
  if (date) date.textContent = 'Tooltip is working';
  if (time) time.textContent = '—';
  if (author) author.textContent = '—';
  if (lines) lines.textContent = '—';
}

//
// 5. BRUSH HELPERS
//
function isCommitSelected(selection, commit) {
  if (!selection || !xScale || !yScale) return false;
  const [[x0, y0], [x1, y1]] = selection;
  const cx = xScale(commit.datetime);
  const cy = yScale(commit.hourFrac);
  return cx >= x0 && cx <= x1 && cy >= y0 && cy <= y1;
}

function renderSelectionCount(selection, commits) {
  const countElement = document.getElementById('selection-count');
  if (!countElement) return [];
  const selected = selection ? commits.filter((commit) => isCommitSelected(selection, commit)) : [];
  countElement.textContent = `${selected.length || 'No'} commits selected`;
  return selected;
}

function renderLanguageBreakdown(selection, commits, preselected = null) {
  const container = document.getElementById('language-breakdown');
  if (!container) return;

  const selected =
    preselected ?? (selection ? commits.filter((commit) => isCommitSelected(selection, commit)) : []);
  if (selection && selected.length === 0) {
    container.innerHTML = '<dt>No commits in selection</dt><dd>Expand the brush to include some commits.</dd>';
    return;
  }

  const source = selected.length ? selected : commits;

  if (!source.length) {
    container.innerHTML = '<dt>No language data available</dt><dd>Once lines are tracked, breakdown appears here.</dd>';
    return;
  }

  const lines = source.flatMap((commit) => commit.lines ?? []);
  if (!lines.length) {
    container.innerHTML = '<dt>No language data available</dt><dd>Lines are missing type information.</dd>';
    return;
  }

  const breakdown = d3.rollup(
    lines,
    (entries) => entries.length,
    (line) => line.type || 'unknown',
  );

  const heading = selected.length ? 'Languages in selection' : 'Languages in dataset';
  container.innerHTML = `<dt>${heading}</dt><dd>${lines.length} total lines</dd>`;

  for (const [language, count] of breakdown) {
    const proportion = count / lines.length;
    const formatted = d3.format('.1~%')(proportion);
    container.innerHTML += `<dt>${language}</dt><dd>${count} lines (${formatted})</dd>`;
  }
}

//
// 6. SUMMARY STATS RENDER
//
function renderCommitInfo(data, commits) {
  const target = d3.select('#stats');
  target.selectAll('*').remove();

  const fileGroups = d3.rollups(
    data,
    (rows) => d3.max(rows, (row) => row.line),
    (row) => row.file,
  );
  const longestFile = d3.greatest(fileGroups, (d) => d[1]);
  const avgFileLength = d3.mean(fileGroups, (d) => d[1]);

  const depthMax = d3.max(data, (d) => d.depth);
  const avgDepth = d3.mean(data, (d) => d.depth);

  const workByPeriod = d3.rollups(
    data,
    (rows) => rows.length,
    (row) => new Date(row.datetime).toLocaleString('en', { dayPeriod: 'long' }),
  );
  const busiestPeriod = d3.greatest(workByPeriod, (d) => d[1])?.[0];

  const formatNumber = d3.format(',');

  const stats = [
    {
      label: 'Total <abbr title="Lines of code">LOC</abbr>',
      value: formatNumber(data.length),
      detail: 'Lines tracked across the repo',
    },
    {
      label: 'Total commits',
      value: formatNumber(commits.length),
      detail: 'Unique Git revisions analyzed',
    },
    {
      label: 'Files tracked',
      value: formatNumber(fileGroups.length),
      detail: 'Distinct files with captured lines',
    },
    {
      label: 'Longest file',
      value: longestFile ? longestFile[0] : '—',
      detail: longestFile ? `${formatNumber(longestFile[1])} lines` : 'No data yet',
    },
    {
      label: 'Average file length',
      value: avgFileLength ? `${Math.round(avgFileLength).toLocaleString()} lines` : '—',
      detail: 'Mean lines per file',
    },
    {
      label: 'Max depth encountered',
      value: depthMax != null ? depthMax.toString() : '—',
      detail: 'Deepest indentation level',
    },
    {
      label: 'Average nesting depth',
      value: avgDepth != null ? avgDepth.toFixed(1) : '—',
      detail: 'Mean structural depth',
    },
    {
      label: 'Busiest time of day',
      value: humanizePeriod(busiestPeriod),
      detail: 'Based on commit timestamps',
    },
  ];

  const grid = target.append('div').attr('class', 'stats');
  const cards = grid.selectAll('.stats__card').data(stats).enter().append('article').attr('class', 'stats__card');

  cards.append('p').attr('class', 'stats__label').html((d) => d.label);
  cards.append('p').attr('class', 'stats__value').text((d) => d.value ?? '—');
  cards.append('p').attr('class', 'stats__detail').text((d) => d.detail ?? '');
}

//
// 7. SCATTERPLOT RENDER
//
function renderScatterPlot(data, commits) {
  const chartRoot = d3.select('#chart');
  chartRoot.selectAll('*').remove();

  if (!commits.length) {
    chartRoot.append('p').attr('class', 'text-sm text-gray-400').text('No commit data available yet.');
    return;
  }

  const width = 1000;
  const height = 600;
  const margin = { top: 10, right: 10, bottom: 30, left: 20 };

  const svg = chartRoot
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('role', 'img')
    .attr('aria-label', 'Scatter plot showing commit times over calendar dates')
    .style('overflow', 'visible');

  xScale = d3
    .scaleTime()
    .domain(d3.extent(commits, (d) => d.datetime))
    .range([0, width])
    .nice();

  yScale = d3.scaleLinear().domain([0, 24]).range([height, 0]);

  const usableArea = {
    top: margin.top,
    right: width - margin.right,
    bottom: height - margin.bottom,
    left: margin.left,
    width: width - margin.left - margin.right,
    height: height - margin.top - margin.bottom,
  };

  xScale.range([usableArea.left, usableArea.right]);
  yScale.range([usableArea.bottom, usableArea.top]);

  const gridlines = svg
    .append('g')
    .attr('class', 'gridlines')
    .attr('transform', `translate(${usableArea.left}, 0)`);

  gridlines.call(d3.axisLeft(yScale).tickFormat('').tickSize(-usableArea.width));

  const dots = svg.append('g').attr('class', 'dots');

  const sortedCommits = d3.sort(commits, (d) => -(d.totalLines ?? 0));
  const [minLinesRaw, maxLinesRaw] = d3.extent(sortedCommits, (d) => d.totalLines ?? 0);
  const minLines = Math.max(1, minLinesRaw ?? 1);
  const maxLines = Math.max(minLines, maxLinesRaw ?? minLines);
  const rScale = d3.scaleSqrt().domain([minLines, maxLines]).range([4, 28]);

  dots
    .selectAll('circle')
    .data(sortedCommits)
    .join('circle')
    .attr('cx', (d) => xScale(d.datetime))
    .attr('cy', (d) => yScale(d.hourFrac))
    .attr('r', (d) => rScale(Math.max(d.totalLines ?? 0, 1)))
    .attr('fill', 'steelblue')
    .style('fill-opacity', 0.7)
    .on('mouseenter', (event, commit) => {
      if (activeDot && activeDot !== event.currentTarget) {
        d3.select(activeDot).style('fill-opacity', 0.7);
      }
      activeDot = event.currentTarget;
      clearTimeout(hideTooltipTimeout);
      d3.select(activeDot).style('fill-opacity', 1);

      renderTooltipContent(commit);
      updateTooltipVisibility(true);
      updateTooltipPosition(event);
    })
    .on('mousemove', (event) => {
      updateTooltipPosition(event);
    })
    .on('mouseleave', (event) => {
      scheduleTooltipHide(event.currentTarget);
    });

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3
    .axisLeft(yScale)
    .tickFormat((d) => `${String(d % 24).padStart(2, '0')}:00`);

  svg
    .append('g')
    .attr('class', 'axis axis--x')
    .attr('transform', `translate(0, ${usableArea.bottom})`)
    .call(xAxis);

  svg
    .append('g')
    .attr('class', 'axis axis--y')
    .attr('transform', `translate(${usableArea.left}, 0)`)
    .call(yAxis);

  const brush = d3
    .brush()
    .extent([
      [usableArea.left, usableArea.top],
      [usableArea.right, usableArea.bottom],
    ])
    .on('start brush end', (event) => brushed(event, commits));

  svg.append('g').attr('class', 'brush-layer').call(brush);

  svg.selectAll('.dots, .axis').raise();
}

//
// 8. BRUSH HANDLER
//
function brushed(event, commits) {
  const selection = event.selection;
  const dots = d3.selectAll('.dots circle');
  dots.classed('selected', (commit) => isCommitSelected(selection, commit));
  const selected = renderSelectionCount(selection, commits);
  renderLanguageBreakdown(selection, commits, selected);
}

//
// 9. MAIN FLOW
//
const data = await loadData();
const commits = processCommits(data);

// show the debug tooltip immediately so we know CSS is ok
showDebugTooltip(); // <-- remove this later

renderCommitInfo(data, commits);
renderScatterPlot(data, commits);
renderSelectionCount(null, commits);
renderLanguageBreakdown(null, commits);
setupTooltipPersistence();
