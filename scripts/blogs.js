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

const extractExcerpt = (markdown) => {
  const lines = markdown
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const firstParagraph = lines.find((line) => !line.startsWith("#") && !line.startsWith("!") && !line.startsWith(">"));
  return firstParagraph || "";
};

const parseDateValue = (value) => {
  const parsed = Date.parse(value || "");
  return Number.isNaN(parsed) ? 0 : parsed;
};

const listBlogFiles = async () => {
  const indexResponse = await fetch(BLOG_INDEX_URL);
  if (indexResponse.ok) {
    const indexData = await indexResponse.json();
    if (Array.isArray(indexData)) {
      return indexData.map((file) => (file.startsWith(BLOGS_DIR) ? file : `${BLOGS_DIR}/${file}`));
    }
  }

  const dirResponse = await fetch(`${BLOGS_DIR}/`);
  if (!dirResponse.ok) return [];
  const html = await dirResponse.text();
  const doc = new DOMParser().parseFromString(html, "text/html");
  return Array.from(doc.querySelectorAll("a"))
    .map((link) => link.getAttribute("href"))
    .filter((href) => href && href.endsWith(".md"))
    .map((href) => (href.startsWith(BLOGS_DIR) ? href : `${BLOGS_DIR}/${href}`));
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
      const date = meta.date || "";
      return {
        label: meta.label || "Blog",
        title,
        date,
        image: src,
        imageAlt: alt,
        slug: file.split("/").pop().replace(/\.md$/i, ""),
        excerpt: meta.excerpt || extractExcerpt(body),
      };
    })
  );

  return items
    .filter(Boolean)
    .sort((a, b) => parseDateValue(b.date) - parseDateValue(a.date));
};

const renderItem = (item) => {
  const link = createElement("a", "blogs-item-link");
  const slug = item.slug || "";
  link.href = slug ? `blog.html?post=${encodeURIComponent(slug)}` : "#";
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.setAttribute("aria-label", item.title ? `Open blog post: ${item.title}` : "Open blog post");

  const article = createElement("article", "blogs-item");

  const media = createElement("div", "blogs-media blogs-media--icon");
  media.setAttribute("aria-hidden", "true");
  const img = document.createElement("img");
  img.src = item.image || "";
  img.alt = item.imageAlt || "";
  img.loading = "lazy";
  media.appendChild(img);

  const content = createElement("div", "blogs-content");
  const label = createElement("span", "blogs-label");
  label.textContent = item.label || "";
  const title = document.createElement("h3");
  title.textContent = item.title || "";
  const date = createElement("p", "blogs-date");
  date.textContent = item.date || "";

  content.appendChild(label);
  content.appendChild(title);
  content.appendChild(date);

  article.appendChild(media);
  article.appendChild(content);
  link.appendChild(article);
  return link;
};

export const initBlogs = async () => {
  const grid = document.querySelector("[data-blogs-grid]");
  if (!grid) return;

  const items = await loadBlogs();
  if (!items.length) return;

  grid.innerHTML = "";
  items.slice(0, 4).forEach((item, index) => {
    grid.appendChild(renderItem(item));
    if (index === 1 && items.length > 2) {
      grid.appendChild(createElement("div", "blogs-divider"));
    }
  });
};
