import { initSearchOverlay } from "./search.js";
import { applyLabelColor } from "./label-color.js";

const RESEARCH_DIR = "data/research";
const RESEARCH_INDEX_URL = `${RESEARCH_DIR}/index.json`;

const escapeHtml = (value) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");

const parseDateValue = (value) => {
  const parsed = Date.parse(value || "");
  return Number.isNaN(parsed) ? 0 : parsed;
};

const parseCommaValues = (value) =>
  (value || "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);

const parseLabels = (value, fallback) => {
  const labels = parseCommaValues(value);
  return labels.length ? labels : [fallback];
};

const createElement = (tag, className) => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  return element;
};

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const initTheme = () => {
  const root = document.documentElement;
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  const storedTheme = localStorage.getItem("theme") || "dark";
  root.dataset.theme = storedTheme;
  if (metaTheme) {
    metaTheme.setAttribute("content", storedTheme === "light" ? "#f5f5f7" : "#000000");
  }
};

const initThemeToggle = () => {
  const toggle = document.querySelector("[data-theme-toggle]");
  if (!toggle) return;

  const root = document.documentElement;
  const metaTheme = document.querySelector('meta[name="theme-color"]');

  const applyTheme = (theme) => {
    root.dataset.theme = theme;
    localStorage.setItem("theme", theme);
    const isLight = theme === "light";
    toggle.setAttribute("aria-pressed", String(isLight));
    toggle.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
    if (metaTheme) {
      metaTheme.setAttribute("content", isLight ? "#f5f5f7" : "#000000");
    }
  };

  applyTheme(root.dataset.theme || localStorage.getItem("theme") || "dark");

  toggle.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "light" ? "dark" : "light";
    applyTheme(nextTheme);
  });
};

const initNavMenu = () => {
  const toggle = document.querySelector("[data-nav-toggle]");
  const drawer = document.querySelector("[data-nav-drawer]");
  if (!toggle || !drawer) return;

  const root = document.documentElement;

  const closeMenu = () => {
    root.classList.remove("is-nav-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    drawer.setAttribute("aria-hidden", "true");
  };

  const openMenu = () => {
    root.classList.add("is-nav-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close menu");
    drawer.setAttribute("aria-hidden", "false");
  };

  toggle.addEventListener("click", () => {
    if (root.classList.contains("is-nav-open")) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  drawer.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 840) closeMenu();
  });
};

const renderInline = (text) => {
  const segments = text.split(/(`[^`]+`)/g);
  return segments
    .map((segment) => {
      if (segment.startsWith("`") && segment.endsWith("`")) {
        return `<code>${escapeHtml(segment.slice(1, -1))}</code>`;
      }

      let safe = escapeHtml(segment);
      safe = safe.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
        const cleanAlt = escapeHtml(alt);
        const cleanSrc = escapeHtml(src);
        return `<img src="${cleanSrc}" alt="${cleanAlt}" loading="lazy" />`;
      });
      safe = safe.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, label, href) => {
        const cleanLabel = escapeHtml(label);
        const cleanHref = escapeHtml(href);
        return `<a href="${cleanHref}" target="_blank" rel="noopener noreferrer">${cleanLabel}</a>`;
      });
      safe = safe.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
      safe = safe.replace(/__([^_]+)__/g, "<strong>$1</strong>");
      safe = safe.replace(/\*([^*]+)\*/g, "<em>$1</em>");
      safe = safe.replace(/_([^_]+)_/g, "<em>$1</em>");
      return safe;
    })
    .join("");
};

const parseMarkdown = (markdown) => {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const html = [];
  let paragraph = [];
  let list = null;
  let blockquote = [];
  let inCode = false;
  let codeLines = [];
  let skippedTitle = false;

  const flushParagraph = () => {
    if (!paragraph.length) return;
    html.push(`<p>${renderInline(paragraph.join(" ").trim())}</p>`);
    paragraph = [];
  };

  const flushList = () => {
    if (!list) return;
    const tag = list.type === "ol" ? "ol" : "ul";
    const items = list.items.map((item) => `<li>${renderInline(item)}</li>`).join("");
    html.push(`<${tag}>${items}</${tag}>`);
    list = null;
  };

  const flushBlockquote = () => {
    if (!blockquote.length) return;
    const content = blockquote.map((line) => renderInline(line)).join("<br />");
    html.push(`<blockquote>${content}</blockquote>`);
    blockquote = [];
  };

  const flushCode = () => {
    if (!codeLines.length) return;
    const content = escapeHtml(codeLines.join("\n"));
    html.push(`<pre><code>${content}</code></pre>`);
    codeLines = [];
  };

  const parseTableBlock = (startIndex) => {
    const headerLine = lines[startIndex]?.trim();
    const dividerLine = lines[startIndex + 1]?.trim();
    if (!headerLine || !dividerLine) return null;
    if (!headerLine.includes("|")) return null;
    if (!/^\s*\|?\s*[-:]+\s*(\|\s*[-:]+\s*)+\|?\s*$/.test(dividerLine)) return null;

    const readRow = (rowLine) =>
      rowLine
        .trim()
        .replace(/^\|/, "")
        .replace(/\|$/, "")
        .split("|")
        .map((cell) => cell.trim());

    const headers = readRow(headerLine);
    const rows = [];
    let i = startIndex + 2;
    while (i < lines.length) {
      const row = lines[i];
      if (!row.trim() || !row.includes("|")) break;
      rows.push(readRow(row));
      i += 1;
    }

    const thead = `<thead><tr>${headers.map((cell) => `<th>${renderInline(cell)}</th>`).join("")}</tr></thead>`;
    const tbody = `<tbody>${rows
      .map((row) => `<tr>${row.map((cell) => `<td>${renderInline(cell)}</td>`).join("")}</tr>`)
      .join("")}</tbody>`;
    return { html: `<table>${thead}${tbody}</table>`, nextIndex: i };
  };

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    const rawLine = lines[lineIndex];
    const line = rawLine.trimEnd();

    if (line.startsWith("```")) {
      if (inCode) {
        inCode = false;
        flushCode();
      } else {
        flushParagraph();
        flushList();
        flushBlockquote();
        inCode = true;
      }
      continue;
    }

    if (inCode) {
      codeLines.push(rawLine);
      continue;
    }

    if (!line.trim()) {
      flushParagraph();
      flushList();
      flushBlockquote();
      continue;
    }

    const imageBlock = line.match(/^\s*!\[([^\]]*)\]\(([^)]+)\)\s*$/);
    if (imageBlock) {
      flushParagraph();
      flushList();
      flushBlockquote();
      const alt = escapeHtml(imageBlock[1] || "");
      const src = escapeHtml(imageBlock[2] || "");
      const caption = alt ? `<figcaption>${alt}</figcaption>` : "";
      html.push(`<figure><img src="${src}" alt="${alt}" loading="lazy" />${caption}</figure>`);
      continue;
    }

    const tableBlock = parseTableBlock(lineIndex);
    if (tableBlock) {
      flushParagraph();
      flushList();
      flushBlockquote();
      html.push(tableBlock.html);
      lineIndex = tableBlock.nextIndex - 1;
      continue;
    }

    if (/^#{1,6}\s+/.test(line)) {
      flushParagraph();
      flushList();
      flushBlockquote();
      const level = line.match(/^#{1,6}/)[0].length;
      const text = line.replace(/^#{1,6}\s+/, "");
      if (level === 1 && !skippedTitle) {
        skippedTitle = true;
        continue;
      }
      html.push(`<h${level}>${renderInline(text)}</h${level}>`);
      continue;
    }

    if (/^(---|\*\*\*|___)$/.test(line.trim())) {
      flushParagraph();
      flushList();
      flushBlockquote();
      html.push("<hr />");
      continue;
    }

    if (line.startsWith("> ")) {
      flushParagraph();
      flushList();
      blockquote.push(line.replace(/^>\s?/, ""));
      continue;
    }

    const unordered = line.match(/^[-*+]\s+(.+)/);
    const ordered = line.match(/^\d+\.\s+(.+)/);
    if (unordered || ordered) {
      flushParagraph();
      flushBlockquote();
      if (!list) {
        list = { type: ordered ? "ol" : "ul", items: [] };
      }
      list.items.push((unordered || ordered)[1]);
      continue;
    }

    paragraph.push(line.trim());
  }

  flushParagraph();
  flushList();
  flushBlockquote();
  if (inCode) {
    flushCode();
  }

  return html.join("\n");
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

const extractExcerpt = (markdown) => {
  const lines = markdown
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const firstParagraph = lines.find((line) => !line.startsWith("#") && !line.startsWith("!") && !line.startsWith(">"));
  return firstParagraph || "";
};

const setText = (selector, value) => {
  const element = document.querySelector(selector);
  if (element) element.textContent = value;
};

const renderMeta = (item) => {
  const labels = Array.isArray(item?.labels) ? item.labels.filter(Boolean) : [];
  const normalizedLabels = labels.length ? labels : [item?.label || "Research"];
  const labelRoot = document.querySelector("[data-blog-label]");
  if (labelRoot) {
    labelRoot.innerHTML = "";
    normalizedLabels.forEach((labelValue) => {
      const chip = document.createElement("span");
      chip.className = "blog-label-chip";
      chip.textContent = labelValue;
      applyLabelColor(chip, labelValue);
      labelRoot.appendChild(chip);
    });
  }
  setText("[data-blog-date]", item?.date || "");
  setText("[data-blog-title]", item?.title || "Research Post");
  setText("[data-blog-excerpt]", item?.excerpt || "");
  const author = document.querySelector("[data-blog-author]");
  if (author) {
    const name = escapeHtml(item?.author || "Ved Panse");
    author.innerHTML = `Author: <span class="blog-author-name">${name}</span>`;
  }
  document.title = item?.title ? `${item.title} | Ved Panse` : "Research Post | Ved Panse";
};

const renderContent = (html) => {
  const container = document.querySelector("[data-blog-content]");
  if (!container) return;
  container.innerHTML = html;
};

const renderError = (message) => {
  renderMeta({ label: "Research", title: "Post not found", date: "", excerpt: message, author: "Ved Panse" });
  renderContent(`<p>${escapeHtml(message)}</p>`);
};

const listResearchFiles = async () => {
  const response = await fetch(RESEARCH_INDEX_URL);
  if (!response.ok) return [];
  const indexData = await response.json();
  if (!Array.isArray(indexData)) return [];
  return indexData.map((file) => (file.startsWith(RESEARCH_DIR) ? file : `${RESEARCH_DIR}/${file}`));
};

const loadResearchSummaries = async () => {
  const files = await listResearchFiles();
  const items = await Promise.all(
    files.map(async (file) => {
      const response = await fetch(file);
      if (!response.ok) return null;
      const markdown = await response.text();
      const { meta, body } = parseFrontMatter(markdown);
      const slug = file.split("/").pop().replace(/\.md$/i, "");
      const labels = parseLabels(meta.label, "Research");
      return {
        slug,
        title: meta.title || extractTitle(body) || "Untitled",
        label: labels[0],
        labels,
        date: meta.date || "",
      };
    })
  );

  return items.filter(Boolean).sort((a, b) => parseDateValue(a.date) - parseDateValue(b.date));
};

const renderLeftRail = (items, activeSlug) => {
  const recentRoot = document.querySelector("[data-blog-recent]");
  const topicsRoot = document.querySelector("[data-blog-topics]");
  if (!recentRoot || !topicsRoot) return;

  recentRoot.innerHTML = "";
  items.slice(0, 6).forEach((item) => {
    const link = document.createElement("a");
    link.className = "blog-recent-link";
    if (item.slug === activeSlug) link.classList.add("is-active");
    link.href = `research.html?post=${encodeURIComponent(item.slug)}`;
    link.textContent = item.title;
    link.setAttribute("aria-label", `Read ${item.title}`);
    recentRoot.appendChild(link);
  });

  const uniqueTopics = Array.from(
    new Set(
      items.flatMap((item) =>
        (Array.isArray(item.labels) && item.labels.length ? item.labels : [item.label]).filter(Boolean)
      )
    )
  ).slice(0, 6);
  topicsRoot.innerHTML = "";
  uniqueTopics.forEach((topic) => {
    const link = document.createElement("a");
    link.className = "blog-topic-link";
    link.href = "index.html#research";
    link.textContent = topic;
    link.setAttribute("aria-label", `Browse ${topic} research posts`);
    topicsRoot.appendChild(link);
  });
};

const renderPostNavigation = (items, activeSlug) => {
  const navRoot = document.querySelector("[data-blog-pagination]");
  if (!navRoot) return;

  navRoot.innerHTML = "";
  const activeIndex = items.findIndex((item) => item.slug === activeSlug);
  if (activeIndex === -1) {
    navRoot.hidden = true;
    return;
  }

  const previous = items[activeIndex - 1] || null;
  const next = items[activeIndex + 1] || null;
  if (!previous && !next) {
    navRoot.hidden = true;
    return;
  }

  const buildLink = (item, direction) => {
    const link = createElement("a", `blog-pagination-link blog-pagination-link--${direction}`);
    link.href = `research.html?post=${encodeURIComponent(item.slug)}`;
    link.textContent = direction === "previous" ? "← Previous" : "Next →";
    link.setAttribute(
      "aria-label",
      `${direction === "previous" ? "Previous" : "Next"}: ${item.title || "Untitled"}`
    );
    return link;
  };

  if (previous) navRoot.appendChild(buildLink(previous, "previous"));
  if (next) navRoot.appendChild(buildLink(next, "next"));
  navRoot.hidden = false;
};

const buildToc = () => {
  const tocRoot = document.querySelector("[data-blog-toc]");
  const content = document.querySelector("[data-blog-content]");
  if (!tocRoot || !content) return;

  const headings = Array.from(content.querySelectorAll("h2, h3"));
  if (!headings.length) {
    tocRoot.innerHTML = "";
    return;
  }

  const usedIds = new Set();
  headings.forEach((heading, index) => {
    const base = slugify(heading.textContent || `section-${index + 1}`) || `section-${index + 1}`;
    let id = base;
    let suffix = 2;
    while (usedIds.has(id)) {
      id = `${base}-${suffix}`;
      suffix += 1;
    }
    usedIds.add(id);
    heading.id = id;
  });

  tocRoot.innerHTML = "";
  const links = headings.map((heading) => {
    const link = document.createElement("a");
    link.className = "blog-toc-link";
    link.href = `#${heading.id}`;
    link.textContent = heading.textContent || "Section";
    if (heading.tagName === "H3") {
      link.style.paddingLeft = "20px";
      link.style.fontSize = "16px";
    }
    tocRoot.appendChild(link);
    return { heading, link };
  });

  const setActiveLink = (id) => {
    links.forEach(({ link, heading }) => {
      link.classList.toggle("is-active", heading.id === id);
    });
  };

  links.forEach(({ heading, link }) => {
    link.addEventListener("click", () => {
      setActiveLink(heading.id);
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (!visible.length) return;
      setActiveLink(visible[0].target.id);
    },
    {
      rootMargin: "-20% 0px -68% 0px",
      threshold: [0.1, 0.25, 0.45, 0.65],
    }
  );

  links.forEach(({ heading }) => observer.observe(heading));
  setActiveLink(links[0].heading.id);
};

const initResearchPost = async () => {
  initTheme();
  initThemeToggle();
  initNavMenu();
  initSearchOverlay();

  const params = new URLSearchParams(window.location.search);
  const slug = params.get("post");
  if (!slug) {
    renderError("Missing research post slug.");
    return;
  }

  const response = await fetch(`${RESEARCH_DIR}/${slug}.md`);
  let summaries = [];
  try {
    summaries = await loadResearchSummaries();
  } catch {
    summaries = [];
  }

  if (!response.ok) {
    renderError("The research content couldn't be loaded.");
    return;
  }

  renderLeftRail(summaries, slug);

  const markdown = await response.text();
  const { meta, body } = parseFrontMatter(markdown);
  const title = meta.title || extractTitle(body) || "Research Post";
  const labels = parseLabels(meta.label, "Research");
  renderMeta({
    label: labels[0],
    labels,
    title,
    date: meta.date || "",
    excerpt: meta.excerpt || extractExcerpt(body),
    author: meta.author || "Ved Panse",
  });

  const html = parseMarkdown(body);
  renderContent(html);
  renderPostNavigation(summaries, slug);
  buildToc();
};

initResearchPost();
