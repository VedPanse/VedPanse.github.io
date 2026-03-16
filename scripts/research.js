const RESEARCH_DIR = "data/research";
const RESEARCH_INDEX_URL = `${RESEARCH_DIR}/index.json`;
const WORK_BANNERS_DIR = "assets/banners/work";
const WORK_BANNERS_INDEX_URL = `${WORK_BANNERS_DIR}/index.json`;

const createElement = (tag, className) => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  return element;
};

const parseFrontMatter = (markdown) => {
  if (!markdown.startsWith("---")) return { meta: {}, body: markdown };
  const end = markdown.indexOf("\n---", 3);
  if (end === -1) return { meta: {}, body: markdown };
  const raw = markdown.slice(3, end).trim();
  const meta = {};
  raw.split("\n").forEach((line) => {
    const [key, ...rest] = line.split(":");
    if (!key || !rest.length) return;
    meta[key.trim()] = rest.join(":").trim();
  });
  return { meta, body: markdown.slice(end + 4) };
};

const extractTitle = (markdown) => {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : "";
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

const listResearchFiles = async () => {
  const response = await fetch(RESEARCH_INDEX_URL);
  if (!response.ok) return [];
  const indexData = await response.json();
  if (!Array.isArray(indexData)) return [];
  return indexData.map((file) => (file.startsWith(RESEARCH_DIR) ? file : `${RESEARCH_DIR}/${file}`));
};

const listWorkBanners = async () => {
  const response = await fetch(WORK_BANNERS_INDEX_URL);
  if (!response.ok) return [];
  const indexData = await response.json();
  if (!Array.isArray(indexData)) return [];
  return indexData.map((file) =>
    file.startsWith(WORK_BANNERS_DIR) ? file : `${WORK_BANNERS_DIR}/${file}`
  );
};

const loadResearch = async () => {
  const [files, bannerImages] = await Promise.all([listResearchFiles(), listWorkBanners()]);
  const items = await Promise.all(
    files.map(async (file, index) => {
      const response = await fetch(file);
      if (!response.ok) return null;
      const markdown = await response.text();
      const { meta, body } = parseFrontMatter(markdown);
      const title = meta.title || extractTitle(body);
      const labels = parseCommaValues(meta.label);
      return {
        kind: labels[0] || "Research",
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

const buildHeroCard = (item) => {
  const link = createElement("a", "editorial-hero-card");
  link.href = `research.html?post=${encodeURIComponent(item.slug || "")}`;

  const imageWrap = createElement("div", "editorial-hero-media");
  const img = document.createElement("img");
  img.src = item.image;
  img.alt = item.imageAlt || "";
  img.loading = "lazy";
  imageWrap.appendChild(img);

  const overlay = createElement("div", "editorial-hero-overlay");
  const eyebrow = createElement("p", "editorial-hero-eyebrow");
  eyebrow.textContent = item.kind || "Research";
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

const buildMiniCard = (item) => {
  const link = createElement("a", "editorial-mini-card");
  link.href = `research.html?post=${encodeURIComponent(item.slug || "")}`;

  const media = createElement("div", "editorial-mini-media");
  const image = document.createElement("img");
  image.src = item.image;
  image.alt = item.imageAlt || "";
  image.loading = "lazy";
  media.appendChild(image);

  const overlay = createElement("div", "editorial-mini-overlay");
  const kicker = createElement("p", "editorial-mini-kicker");
  kicker.textContent = item.kind || "Research";
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

const renderItems = (heroRail, miniGrid, items, limit = items.length) => {
  const visibleItems = items.slice(0, limit);
  const heroCount = Math.floor(visibleItems.length / 2);
  renderBand(heroRail, visibleItems.slice(0, heroCount), buildHeroCard);
  renderBand(miniGrid, visibleItems.slice(heroCount), buildMiniCard);
};

export const initResearch = async () => {
  const heroRail = document.querySelector("[data-research-hero]");
  const miniGrid = document.querySelector("[data-research-grid]");
  const loadMoreButton = document.querySelector("[data-research-load-more]");
  if (!heroRail || !miniGrid || !loadMoreButton) return;

  const items = await loadResearch();
  if (!items.length) {
    loadMoreButton.hidden = true;
    return;
  }

  const visibleCount = items.length;

  const render = () => {
    renderItems(heroRail, miniGrid, items, visibleCount);
    loadMoreButton.hidden = true;
    loadMoreButton.disabled = true;
  };

  render();
};
