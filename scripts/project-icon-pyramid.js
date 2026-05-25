const PROJECT_ICON_MANIFEST_URL = "data/project-icons.json";
const IMAGE_EXTENSIONS = new Set(["png", "jpg", "jpeg", "webp", "svg", "gif", "avif"]);
let projectIconsPromise;

const titleizeToken = (token) => {
  if (!token) return "";
  const lower = token.toLowerCase();
  if (lower.length <= 3) return lower.toUpperCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
};

const labelFromFilename = (filename) =>
  filename
    .replace(/\.[^.]+$/, "")
    .split(/[-_]/g)
    .map(titleizeToken)
    .join(" ");

const isImageFile = (name) => {
  const extension = name.split(".").pop()?.toLowerCase();
  return extension ? IMAGE_EXTENSIONS.has(extension) : false;
};

const normalizeIcon = (icon) => {
  if (!icon || typeof icon !== "object" || !icon.src) return null;
  const src = String(icon.src);
  const filename = src.split("/").pop() || "Project icon";
  if (!isImageFile(filename)) return null;
  return {
    src,
    label: icon.label || labelFromFilename(filename),
  };
};

const loadProjectIcons = async () => {
  if (!projectIconsPromise) {
    projectIconsPromise = fetch(PROJECT_ICON_MANIFEST_URL)
      .then(async (response) => {
        if (!response.ok) return [];

        const data = await response.json();
        return Array.isArray(data.icons) ? data.icons.map(normalizeIcon).filter(Boolean) : [];
      })
      .catch(() => []);
  }

  return projectIconsPromise;
};

const getColumnCount = () => {
  const width = window.innerWidth;
  if (width < 520) return 4;
  if (width < 760) return 5;
  if (width < 1040) return 9;
  if (width < 1400) return 13;
  if (width < 1720) return 15;
  return 17;
};

const buildPyramidRows = (icons) => {
  const rows = [];
  let cursor = 0;
  const maxColumns = getColumnCount();
  const rowCount = Math.min(
    window.innerWidth < 760 ? 5 : 6,
    Math.max(1, Math.ceil(Math.sqrt(icons.length) / 1.2))
  );
  const weightedRows = rowCount > 1 ? rowCount - 1 : rowCount;
  const remainingIcons = rowCount > 1 ? icons.length - 1 : icons.length;
  const weights = Array.from({ length: weightedRows }, (_, index) => weightedRows - index);
  const weightTotal = weights.reduce((total, weight) => total + weight, 0);
  const capacities = weights.map((weight) => Math.max(1, Math.floor((remainingIcons * weight) / weightTotal)));
  if (rowCount > 1) {
    capacities.push(1);
  }
  let assigned = capacities.reduce((total, capacity) => total + capacity, 0);

  for (let index = 0; assigned < icons.length; index = (index + 1) % capacities.length) {
    capacities[index] += 1;
    assigned += 1;
  }

  for (let index = 0; index < capacities.length - 1; index += 1) {
    if (capacities[index] <= maxColumns) continue;
    const overflow = capacities[index] - maxColumns;
    capacities[index] = maxColumns;
    capacities[index + 1] += overflow;
  }

  capacities.forEach((capacity) => {
    const remaining = icons.length - cursor;
    if (remaining <= 0) return;
    const count = Math.min(capacity, remaining);
    rows.push(icons.slice(cursor, cursor + count));
    cursor += count;
  });

  return rows;
};

const createIcon = (icon, isPriority) => {
  const item = document.createElement("div");
  item.className = "project-icon-pyramid__item";

  const image = document.createElement("img");
  image.alt = icon.label;
  image.loading = isPriority ? "eager" : "lazy";
  image.decoding = "async";
  image.fetchPriority = isPriority ? "high" : "auto";
  image.src = icon.src;

  item.appendChild(image);
  return item;
};

const renderIcons = (grid, icons) => {
  grid.innerHTML = "";
  const fragment = document.createDocumentFragment();
  buildPyramidRows(icons).forEach((row, index, rows) => {
    const rowElement = document.createElement("div");
    rowElement.className = "project-icon-pyramid__row";
    rowElement.style.setProperty("--row-index", index);
    if (index === rows.length - 1 && row.length === 1) {
      rowElement.classList.add("project-icon-pyramid__row--single");
    }
    row.forEach((icon) => rowElement.appendChild(createIcon(icon, index === 0)));
    fragment.appendChild(rowElement);
  });
  grid.appendChild(fragment);
};

export const initProjectIconPyramid = async () => {
  const section = document.querySelector("[data-project-icon-pyramid]");
  const grid = document.querySelector("[data-project-icon-grid]");
  if (!section || !grid) return;

  const icons = await loadProjectIcons();
  if (!icons.length) {
    section.hidden = true;
    return;
  }

  section.hidden = false;
  renderIcons(grid, icons);

  let resizeTimer = 0;
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => renderIcons(grid, icons), 150);
  });
};
