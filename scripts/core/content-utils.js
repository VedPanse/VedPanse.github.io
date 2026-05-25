const indexedFileCache = new Map();

export const parseDateValue = (value) => {
  const parsed = Date.parse(value || "");
  return Number.isNaN(parsed) ? 0 : parsed;
};

export const sortByDateDesc = (items) =>
  items.sort((a, b) => parseDateValue(b.date) - parseDateValue(a.date));

export const parseCommaValues = (value) =>
  (value || "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);

export const buildIndexedFilePath = (directory, file) =>
  file.startsWith(directory) ? file : `${directory}/${file}`;

/**
 * Loads a static directory index once per page lifetime.
 *
 * Several homepage modules share the same Markdown and image indexes. Caching
 * the in-flight promise prevents duplicate network requests during parallel
 * initialization while still allowing normal browser HTTP caching.
 */
export const loadIndexedFiles = (indexUrl, directory) => {
  const cacheKey = `${indexUrl}::${directory}`;
  if (!indexedFileCache.has(cacheKey)) {
    indexedFileCache.set(cacheKey, fetchIndexedFiles(indexUrl, directory));
  }

  return indexedFileCache.get(cacheKey);
};

const fetchIndexedFiles = async (indexUrl, directory) => {
  const response = await fetch(indexUrl);
  if (!response.ok) return [];

  const indexData = await response.json();
  if (!Array.isArray(indexData)) return [];

  return indexData.map((file) => buildIndexedFilePath(directory, file));
};
