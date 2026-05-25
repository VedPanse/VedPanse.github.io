export const ICONS_URL = "data/icons.json";

const normalizeLabel = (value) => String(value || "").trim().toLowerCase();
let iconsPromise = null;

/**
 * @typedef {{label?: string, src: string}} TechIcon
 */

/**
 * @param {Array<TechIcon>} icons
 * @return {Map<string, TechIcon>}
 */
export const createTechIconIndex = (icons) => {
  const index = new Map();
  icons.forEach((icon) => {
    const key = normalizeLabel(icon.label);
    if (key && icon.src) {
      index.set(key, icon);
    }
  });
  return index;
};

/**
 * @return {Promise<Array<TechIcon>>}
 */
export const loadTechIcons = async () => {
  if (iconsPromise) {
    return iconsPromise;
  }

  iconsPromise = fetchTechIcons();
  return iconsPromise;
};

const fetchTechIcons = async () => {
  const response = await fetch(ICONS_URL);
  if (!response.ok) {
    return [];
  }
  const data = await response.json();
  return Array.isArray(data.icons) ? data.icons : [];
};

/**
 * @param {unknown} item
 * @return {string}
 */
const getStackLabel = (item) => {
  if (typeof item === "string") {
    return item;
  }
  if (item && typeof item === "object" && "label" in item) {
    return item.label || "";
  }
  return "";
};

/**
 * @param {unknown} stack
 * @param {Map<string, TechIcon>} iconIndex
 * @return {Array<TechIcon>}
 */
export const resolveTechStack = (stack, iconIndex) => {
  if (!Array.isArray(stack)) {
    return [];
  }

  return stack
    .map((item) => iconIndex.get(normalizeLabel(getStackLabel(item))))
    .filter(Boolean);
};
