const RESEARCH_DIR = "data/research";
const RESEARCH_INDEX_URL = `${RESEARCH_DIR}/index.json`;

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
  const body = markdown.slice(end + 4);
  return { meta, body };
};

const extractTitle = (markdown) => {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : "";
};

const extractFirstImage = (markdown) => {
  const match = markdown.match(/!\[([^\]]*)\]\(([^)]+)\)/);
  if (!match) return { alt: "", src: "" };
  return { alt: match[1].trim(), src: match[2].trim() };
};

const parseDateValue = (value) => {
  const parsed = Date.parse(value || "");
  return Number.isNaN(parsed) ? 0 : parsed;
};

const parseTags = (meta, fallback) => {
  if (meta.tags) {
    return meta.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)
      .slice(0, 4);
  }
  return [fallback].filter(Boolean);
};

const listResearchFiles = async () => {
  const response = await fetch(RESEARCH_INDEX_URL);
  if (!response.ok) return [];
  const indexData = await response.json();
  if (!Array.isArray(indexData)) return [];
  return indexData.map((file) => (file.startsWith(RESEARCH_DIR) ? file : `${RESEARCH_DIR}/${file}`));
};

const loadResearch = async () => {
  const files = await listResearchFiles();
  const items = await Promise.all(
    files.map(async (file) => {
      const response = await fetch(file);
      if (!response.ok) return null;
      const markdown = await response.text();
      const { meta, body } = parseFrontMatter(markdown);
      const title = meta.title || extractTitle(body);
      const { alt, src } = extractFirstImage(body);
      const label = meta.label || "Research";
      return {
        kind: label,
        title,
        date: meta.date || "",
        author: meta.author || "Ved Panse",
        tags: parseTags(meta, label),
        image: src,
        imageAlt: alt,
        slug: file.split("/").pop().replace(/\.md$/i, ""),
      };
    })
  );

  return items.filter(Boolean).sort((a, b) => parseDateValue(b.date) - parseDateValue(a.date));
};

const buildCard = (item, variant = "default") => {
  const link = createElement("a", `editorial-card editorial-card--${variant}`);
  link.href = `research.html?post=${encodeURIComponent(item.slug || "")}`;
  link.target = "_blank";
  link.rel = "noopener noreferrer";

  const copy = createElement("div", "editorial-card-copy");

  const kicker = createElement("p", "editorial-card-kicker");
  kicker.textContent = item.kind || "Research";

  const title = createElement("h3", "editorial-card-title");
  title.textContent = item.title || "Untitled";

  const meta = createElement("div", "editorial-card-meta");
  const author = createElement("p", "editorial-card-author");
  author.textContent = item.author || "Ved Panse";
  const date = createElement("p", "editorial-card-date");
  date.textContent = item.date || "";

  const tags = createElement("div", "editorial-card-tags");
  (item.tags || []).forEach((tag) => {
    const chip = createElement("span", "editorial-card-tag");
    chip.textContent = tag;
    tags.appendChild(chip);
  });

  meta.appendChild(author);
  meta.appendChild(date);
  meta.appendChild(tags);

  copy.appendChild(kicker);
  copy.appendChild(title);
  copy.appendChild(meta);

  const media = createElement("div", "editorial-card-media");
  if (item.image) {
    const img = document.createElement("img");
    img.src = item.image;
    img.alt = item.imageAlt || "";
    img.loading = "lazy";
    media.appendChild(img);
  }

  if (variant === "text-only") {
    link.classList.add("editorial-card--text-only");
  }

  link.appendChild(copy);
  link.appendChild(media);
  return link;
};

export const initResearch = async () => {
  const grid = document.querySelector("[data-research-grid]");
  if (!grid) return;

  const items = await loadResearch();
  if (!items.length) return;

  grid.innerHTML = "";

  const [featured, second, third, fourth, ...rest] = items;
  if (featured) grid.appendChild(buildCard(featured, "featured"));
  if (second) grid.appendChild(buildCard(second, "default"));
  if (third) grid.appendChild(buildCard(third, "default"));
  if (fourth) grid.appendChild(buildCard(fourth, "text-only"));
  rest.slice(0, 2).forEach((item) => grid.appendChild(buildCard(item, "default")));
};
