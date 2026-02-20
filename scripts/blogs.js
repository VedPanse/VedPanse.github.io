import { createEditorialSearcher, markdownToSearchText } from "./editorial-search.js";
import { applyLabelColor } from "./label-color.js";

const BLOGS_DIR = "data/blogs";
const BLOG_INDEX_URL = `${BLOGS_DIR}/index.json`;

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
    files.map(async (file) => {
      const response = await fetch(file);
      if (!response.ok) return null;
      const markdown = await response.text();
      const { meta, body } = parseFrontMatter(markdown);
      const title = meta.title || extractTitle(body);
      const { alt, src } = extractFirstImage(body);
      const label = meta.label || "Blog";
      const excerpt = meta.excerpt || "";
      const content = markdownToSearchText(body);
      return {
        kind: label,
        title,
        date: meta.date || "",
        author: meta.author || "Ved Panse",
        tags: parseTags(meta, label),
        excerpt,
        content,
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
  link.href = `blog.html?post=${encodeURIComponent(item.slug || "")}`;
  link.target = "_blank";
  link.rel = "noopener noreferrer";

  const copy = createElement("div", "editorial-card-copy");

  const kicker = createElement("p", "editorial-card-kicker");
  kicker.textContent = item.kind || "Blog";
  applyLabelColor(kicker, item.kind || "Blog");

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
    applyLabelColor(chip, tag);
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

const renderItems = (grid, items, filtered = false) => {
  grid.innerHTML = "";
  if (!items.length) {
    const empty = createElement("p", "editorial-empty");
    empty.textContent = "No blog posts matched this search.";
    grid.appendChild(empty);
    return;
  }

  if (filtered) {
    const [top, ...rest] = items;
    if (top) grid.appendChild(buildCard(top, "featured"));
    rest.forEach((item) => grid.appendChild(buildCard(item, "default")));
    return;
  }

  const [featured, second, third, fourth, ...rest] = items;
  if (featured) grid.appendChild(buildCard(featured, "featured"));
  if (second) grid.appendChild(buildCard(second, "default"));
  if (third) grid.appendChild(buildCard(third, "default"));
  if (fourth) grid.appendChild(buildCard(fourth, "text-only"));
  rest.slice(0, 2).forEach((item) => grid.appendChild(buildCard(item, "default")));
};

export const initBlogs = async () => {
  const section = document.querySelector("#blogs");
  const grid = document.querySelector("[data-blogs-grid]");
  if (!grid || !section) return;

  const items = await loadBlogs();
  if (!items.length) return;

  const searchInput = section.querySelector('[data-editorial-search-input="blogs"]');
  const searchStatus = section.querySelector('[data-editorial-search-status="blogs"]');
  const search = createEditorialSearcher(items);

  const updateStatus = (count, query) => {
    if (!searchStatus) return;
    if (!query) {
      searchStatus.textContent = `${items.length} posts`;
      return;
    }
    searchStatus.textContent = `${count} result${count === 1 ? "" : "s"}`;
  };

  const applySearch = () => {
    const query = (searchInput?.value || "").trim();
    if (!query) {
      renderItems(grid, items, false);
      updateStatus(items.length, "");
      return;
    }

    const results = search(query);
    renderItems(grid, results, true);
    updateStatus(results.length, query);
  };

  renderItems(grid, items, false);
  updateStatus(items.length, "");

  if (searchInput) {
    searchInput.addEventListener("input", applySearch);
    searchInput.addEventListener("search", applySearch);
  }
};
