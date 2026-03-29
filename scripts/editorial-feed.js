import { initEditorialScroll } from "./editorial-scroll.js";
import { extractTitle, parseFrontMatter } from "./markdown.js";

const WORK_BANNERS_DIR = "assets/banners/work";
const WORK_BANNERS_INDEX_URL = `${WORK_BANNERS_DIR}/index.json`;

const createElement = (tag, className) => {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  return element;
};

const parseDateValue = (value) => {
  const parsed = Date.parse(value || "");
  return Number.isNaN(parsed) ? 0 : parsed;
};

const parseCommaValues = (value) =>
  (value || "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);

const listIndexedFiles = async (indexUrl, directory) => {
  const response = await fetch(indexUrl);
  if (!response.ok) return [];

  const indexData = await response.json();
  if (!Array.isArray(indexData)) return [];

  return indexData.map((file) => (file.startsWith(directory) ? file : `${directory}/${file}`));
};

const listWorkBanners = async () => {
  const response = await fetch(WORK_BANNERS_INDEX_URL);
  if (!response.ok) return [];

  const indexData = await response.json();
  if (!Array.isArray(indexData)) return [];

  return indexData.map((file) => (file.startsWith(WORK_BANNERS_DIR) ? file : `${WORK_BANNERS_DIR}/${file}`));
};

const buildHeroCard = (item, postUrl, defaultKind) => {
  const link = createElement("a", "editorial-hero-card");
  link.href = `${postUrl}?post=${encodeURIComponent(item.slug || "")}`;

  const imageWrap = createElement("div", "editorial-hero-media");
  const image = document.createElement("img");
  image.src = item.image;
  image.alt = item.imageAlt || "";
  image.loading = "lazy";
  imageWrap.appendChild(image);

  const overlay = createElement("div", "editorial-hero-overlay");
  const eyebrow = createElement("p", "editorial-hero-eyebrow");
  eyebrow.textContent = item.kind || defaultKind;
  const title = createElement("h3", "editorial-hero-title");
  title.textContent = item.title || "Untitled";

  const footer = createElement("div", "editorial-hero-footer");
  const button = createElement("span", "editorial-hero-pill");
  button.textContent = "Read now";
  const summary = createElement("p", "editorial-hero-summary");
  const text = createElement("span", "editorial-hero-summary-text");
  text.textContent = item.excerpt || item.date || "";
  summary.appendChild(text);
  footer.appendChild(button);
  footer.appendChild(summary);

  overlay.appendChild(eyebrow);
  overlay.appendChild(title);
  overlay.appendChild(footer);
  link.appendChild(imageWrap);
  link.appendChild(overlay);

  return link;
};

const buildMiniCard = (item, postUrl, defaultKind) => {
  const link = createElement("a", "editorial-mini-card");
  link.href = `${postUrl}?post=${encodeURIComponent(item.slug || "")}`;

  const media = createElement("div", "editorial-mini-media");
  const image = document.createElement("img");
  image.src = item.image;
  image.alt = item.imageAlt || "";
  image.loading = "lazy";
  media.appendChild(image);

  const overlay = createElement("div", "editorial-mini-overlay");
  const kicker = createElement("p", "editorial-mini-kicker");
  kicker.textContent = item.kind || defaultKind;
  const title = createElement("h3", "editorial-mini-title");
  title.textContent = item.title || "Untitled";
  overlay.appendChild(kicker);
  overlay.appendChild(title);

  link.appendChild(media);
  link.appendChild(overlay);

  return link;
};

const renderBand = (container, items, buildItem) => {
  container.innerHTML = "";
  items.forEach((item) => {
    container.appendChild(buildItem(item));
  });
  container.scrollLeft = 0;
};

const loadFeedItems = async ({ directory, indexUrl, defaultKind }) => {
  const [files, bannerImages] = await Promise.all([listIndexedFiles(indexUrl, directory), listWorkBanners()]);
  const items = await Promise.all(
    files.map(async (file, index) => {
      const response = await fetch(file);
      if (!response.ok) return null;

      const markdown = await response.text();
      const { meta, body } = parseFrontMatter(markdown);
      const title = meta.title || extractTitle(body) || "Untitled";
      const labels = parseCommaValues(meta.label);

      return {
        kind: labels[0] || defaultKind,
        title,
        date: meta.date || "",
        author: meta.author || "Ved Panse",
        excerpt: meta.excerpt || "",
        image: bannerImages.length ? bannerImages[index % bannerImages.length] : "",
        imageAlt: title,
        slug: file.split("/").pop().replace(/\.md$/i, ""),
      };
    })
  );

  return items.filter(Boolean).sort((a, b) => parseDateValue(b.date) - parseDateValue(a.date));
};

export const initEditorialFeed = async ({
  directory,
  indexUrl,
  postUrl,
  sectionSelector,
  heroSelector,
  gridSelector,
  loadMoreSelector,
  defaultKind,
}) => {
  const section = document.querySelector(sectionSelector);
  const heroRail = document.querySelector(heroSelector);
  const miniGrid = document.querySelector(gridSelector);
  const loadMoreButton = document.querySelector(loadMoreSelector);

  if (!section || !heroRail || !miniGrid || !loadMoreButton) {
    return;
  }

  const items = await loadFeedItems({ directory, indexUrl, defaultKind });
  if (!items.length) {
    loadMoreButton.hidden = true;
    return;
  }

  const heroCount = Math.floor(items.length / 2);
  renderBand(heroRail, items.slice(0, heroCount), (item) => buildHeroCard(item, postUrl, defaultKind));
  renderBand(miniGrid, items.slice(heroCount), (item) => buildMiniCard(item, postUrl, defaultKind));

  initEditorialScroll(section, heroRail, miniGrid);
  loadMoreButton.hidden = true;
  loadMoreButton.disabled = true;
};
