const ICONS_URL = "data/icons.json";
const CARDS_PER_COLUMN = 3;
const DEFAULT_ICON_SIZE = 96;
const DEFAULT_GAP = 20;

const readCssNumber = (value) => {
  const parsed = parseFloat(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const shuffle = (items) => {
  const array = [...items];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const buildSequence = (icons, totalNeeded) => {
  const sequence = [];
  let pool = shuffle(icons);
  while (sequence.length < totalNeeded) {
    if (!pool.length) {
      pool = shuffle(icons);
    }
    const next = pool.shift();
    const last = sequence[sequence.length - 1];
    if (last && next && last.src === next.src) {
      pool.push(next);
      continue;
    }
    sequence.push(next);
  }
  return sequence;
};

const createIconCard = (icon) => {
  const card = document.createElement("div");
  card.className = "app-icon";
  const img = document.createElement("img");
  img.src = icon.src;
  img.alt = icon.label || "Language icon";
  img.loading = "lazy";
  card.appendChild(img);
  return card;
};

const getLayoutMetrics = (band) => {
  const styles = getComputedStyle(band);
  return {
    iconSize: readCssNumber(styles.getPropertyValue("--icon-size")) || DEFAULT_ICON_SIZE,
    gap: readCssNumber(styles.getPropertyValue("--icon-gap")) || DEFAULT_GAP,
  };
};

const renderColumns = (columns, icons, metrics) => {
  const { iconSize, gap } = metrics;
  const columnsNeeded = Math.ceil(window.innerWidth / (iconSize + gap)) + 2;
  const totalNeeded = columnsNeeded * CARDS_PER_COLUMN;
  const sequence = buildSequence(icons, totalNeeded);
  columns.innerHTML = "";

  for (let i = 0; i < columnsNeeded; i += 1) {
    const column = document.createElement("div");
    column.className = "icon-column";
    const start = i * CARDS_PER_COLUMN;
    sequence.slice(start, start + CARDS_PER_COLUMN).forEach((icon) => {
      column.appendChild(createIconCard(icon));
    });
    columns.appendChild(column);
  }
};

const loadIcons = async () => {
  const response = await fetch(ICONS_URL);
  if (!response.ok) {
    return [];
  }
  const data = await response.json();
  return Array.isArray(data.icons) ? data.icons : [];
};

const throttle = (callback, delayMs) => {
  let timeoutId = null;
  return () => {
    if (timeoutId !== null) return;
    timeoutId = window.setTimeout(() => {
      timeoutId = null;
      callback();
    }, delayMs);
  };
};

export const initIconBand = async () => {
  const band = document.querySelector(".icon-band");
  const columns = document.querySelector(".icon-columns");
  if (!band || !columns) return;

  const icons = await loadIcons();
  if (!icons.length) return;

  const render = () => renderColumns(columns, icons, getLayoutMetrics(band));
  render();
  window.addEventListener("resize", throttle(render, 150));
};
