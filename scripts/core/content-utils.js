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

export const loadIndexedFiles = async (indexUrl, directory) => {
  const response = await fetch(indexUrl);
  if (!response.ok) return [];

  const indexData = await response.json();
  if (!Array.isArray(indexData)) return [];

  return indexData.map((file) => buildIndexedFilePath(directory, file));
};
