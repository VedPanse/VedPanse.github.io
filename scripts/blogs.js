const BLOGS_DIR = "data/blogs";
const BLOG_INDEX_URL = `${BLOGS_DIR}/index.json`;
const PAGE_SIZE = 4;
const WORK_BANNERS = [
  "assets/banners/work/Aqua_1280x789.png",
  "assets/banners/work/Client_1280x789.png",
  "assets/banners/work/Code With Me_1280x789.png",
  "assets/banners/work/DataSpell_1280x789.png",
  "assets/banners/work/dotCover_1280x789.png",
  "assets/banners/work/GoLand_1280x789.png",
  "assets/banners/work/jetbrains.png",
  "assets/banners/work/RubyMine_1280x789.png",
  "assets/banners/work/webstorm.png",
];

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

const listBlogFiles = async () => {
  const response = await fetch(BLOG_INDEX_URL);
  if (!response.ok) return [];
  const indexData = await response.json();
  if (!Array.isArray(indexData)) return [];
  return indexData.map((file) => (file.startsWith(BLOGS_DIR) ? file : `${BLOGS_DIR}/${file}`));
};

const loadBlogs = async () => {
  const files = await listBlogFiles();
  const items = await Promise.all(
    files.map(async (file, index) => {
      const response = await fetch(file);
      if (!response.ok) return null;
      const markdown = await response.text();
      const { meta, body } = parseFrontMatter(markdown);
      const title = meta.title || extractTitle(body);
      const labels = parseCommaValues(meta.label);
      return {
        kind: labels[0] || "Blog",
        title,
        date: meta.date || "",
        author: meta.author || "Ved Panse",
        excerpt: meta.excerpt || "",
        image: WORK_BANNERS[index % WORK_BANNERS.length],
        imageAlt: title,
        slug: file.split("/").pop().replace(/\.md$/i, ""),
      };
    })
  );

  return items.filter(Boolean).sort((a, b) => parseDateValue(b.date) - parseDateValue(a.date));
};

const buildHeroCard = (item) => {
  const link = createElement("a", "editorial-hero-card");
  link.href = `blog.html?post=${encodeURIComponent(item.slug || "")}`;

  const imageWrap = createElement("div", "editorial-hero-media");
  const img = document.createElement("img");
  img.src = item.image;
  img.alt = item.imageAlt || "";
  img.loading = "lazy";
  imageWrap.appendChild(img);

  const overlay = createElement("div", "editorial-hero-overlay");
  const eyebrow = createElement("p", "editorial-hero-eyebrow");
  eyebrow.textContent = item.kind || "Blog";
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
  link.href = `blog.html?post=${encodeURIComponent(item.slug || "")}`;

  const media = createElement("div", "editorial-mini-media");
  const image = document.createElement("img");
  image.src = item.image;
  image.alt = item.imageAlt || "";
  image.loading = "lazy";
  media.appendChild(image);

  const overlay = createElement("div", "editorial-mini-overlay");
  const kicker = createElement("p", "editorial-mini-kicker");
  kicker.textContent = item.kind || "Blog";
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
  const heroCount = Math.ceil(visibleItems.length / 2);
  renderBand(heroRail, visibleItems.slice(0, heroCount), buildHeroCard);
  renderBand(miniGrid, visibleItems.slice(heroCount), buildMiniCard);
};

export const initBlogs = async () => {
  const heroRail = document.querySelector("[data-blogs-hero]");
  const miniGrid = document.querySelector("[data-blogs-grid]");
  const loadMoreButton = document.querySelector("[data-blogs-load-more]");
  if (!heroRail || !miniGrid || !loadMoreButton) return;

  const items = await loadBlogs();
  if (!items.length) {
    loadMoreButton.hidden = true;
    return;
  }

  let visibleCount = PAGE_SIZE;

  const render = () => {
    renderItems(heroRail, miniGrid, items, visibleCount);
    loadMoreButton.hidden = true;
    loadMoreButton.disabled = true;
  };

  render();
};
