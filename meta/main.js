import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

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

function humanizePeriod(period) {
  if (!period) return '—';
  const normalized = period.toLowerCase();
  if (normalized.includes('morning')) return 'Morning';
  if (normalized.includes('afternoon')) return 'Afternoon';
  if (normalized.includes('evening')) return 'Evening';
  if (normalized.includes('night')) return 'Night';
  return period;
}

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

function renderScatterPlot(data, commits) {
  const chartRoot = d3.select('#chart');
  chartRoot.selectAll('*').remove();

  if (!commits.length) {
    chartRoot.append('p').attr('class', 'text-sm text-gray-400').text('No commit data available yet.');
    return;
  }

  const width = 1000;
  const height = 600;
  const margin = { top: 10, right: 10, bottom: 30, left: 40 };

  const svg = chartRoot
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('role', 'img')
    .attr('aria-label', 'Scatter plot showing commit times over calendar dates')
    .style('overflow', 'visible');

  const xScale = d3
    .scaleTime()
    .domain(d3.extent(commits, (d) => d.datetime))
    .range([0, width])
    .nice();

  const yScale = d3.scaleLinear().domain([0, 24]).range([height, 0]);

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

  const yTickValues = d3.range(0, 26, 2);
  gridlines.call(
    d3.axisLeft(yScale).tickValues(yTickValues).tickFormat('').tickSize(-usableArea.width),
  );

  const dots = svg.append('g').attr('class', 'dots');

  dots
    .selectAll('circle')
    .data(commits)
    .join('circle')
    .attr('cx', (d) => xScale(d.datetime))
    .attr('cy', (d) => yScale(d.hourFrac))
    .attr('r', 5);

  const formatTickDate = d3.timeFormat('%b %d');
  const xAxis = d3.axisBottom(xScale).tickPadding(8).tickFormat(formatTickDate);
  const yAxis = d3
    .axisLeft(yScale)
    .tickValues(yTickValues)
    .tickFormat((d) => `${String(d).padStart(2, '0')}:00`);

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
}

const data = await loadData();
const commits = processCommits(data);
renderCommitInfo(data, commits);
renderScatterPlot(data, commits);
