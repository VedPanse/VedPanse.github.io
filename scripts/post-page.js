import { applyLabelColor } from "./label-color.js";
import { parseFrontMatter, extractExcerpt, extractTitle, parseMarkdown, escapeHtml } from "./markdown.js";
import { initNavMenu } from "./nav.js";
import { initSearchOverlay } from "./search.js";
import { initializeTheme } from "./theme.js";

const DEFAULT_NOT_FOUND_URL = "/404.html";
const DEFAULT_AUTHOR = "Ved Panse";
const MAX_LEFT_RAIL_ITEMS = 6;

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

const setText = (selector, value) => {
  const element = document.querySelector(selector);
  if (element) {
    element.textContent = value;
  }
};

const createPaginationLink = (href, title, direction) => {
  const link = document.createElement("a");
  link.className = `blog-pagination-link blog-pagination-link--${direction}`;
  link.href = href;
  link.textContent = direction === "previous" ? "← Previous" : "Next →";
  link.setAttribute(
    "aria-label",
    `${direction === "previous" ? "Previous" : "Next"}: ${title || "Untitled"}`
  );
  return link;
};

const renderLabels = (labels) => {
  const labelRoot = document.querySelector("[data-blog-label]");
  if (!labelRoot) return;

  labelRoot.innerHTML = "";
  labels.forEach((labelValue) => {
    const chip = document.createElement("span");
    chip.className = "blog-label-chip";
    chip.textContent = labelValue;
    applyLabelColor(chip, labelValue);
    labelRoot.appendChild(chip);
  });
};

const renderMeta = ({ fallbackTitle, titleSuffix, item }) => {
  renderLabels(item.labels);
  setText("[data-blog-date]", item.date);
  setText("[data-blog-title]", item.title || fallbackTitle);
  setText("[data-blog-excerpt]", item.excerpt);

  const author = document.querySelector("[data-blog-author]");
  if (author) {
    author.innerHTML = `Author: <span class="blog-author-name">${escapeHtml(item.author)}</span>`;
  }

  document.title = item.title ? `${item.title} | ${titleSuffix}` : `${fallbackTitle} | ${titleSuffix}`;
};

const renderContent = (html) => {
  const container = document.querySelector("[data-blog-content]");
  if (container) {
    container.innerHTML = html;
  }
};

const redirectToNotFound = (url) => {
  window.location.replace(url);
};

const isValidSlug = (value) => /^[a-z0-9-]+$/i.test(value || "");

const buildIndexFilePath = (directory, file) => (file.startsWith(directory) ? file : `${directory}/${file}`);

const loadIndexFiles = async (indexUrl, directory) => {
  const response = await fetch(indexUrl);
  if (!response.ok) return [];

  const indexData = await response.json();
  if (!Array.isArray(indexData)) return [];

  return indexData.map((file) => buildIndexFilePath(directory, file));
};

const loadSummaries = async ({ directory, indexUrl, defaultLabel }) => {
  const files = await loadIndexFiles(indexUrl, directory);
  const items = await Promise.all(
    files.map(async (file) => {
      const response = await fetch(file);
      if (!response.ok) return null;

      const markdown = await response.text();
      const { meta, body } = parseFrontMatter(markdown);
      const labels = parseLabels(meta.label, defaultLabel);

      return {
        slug: file.split("/").pop().replace(/\.md$/i, ""),
        title: meta.title || extractTitle(body) || "Untitled",
        label: labels[0],
        labels,
        date: meta.date || "",
      };
    })
  );

  return items.filter(Boolean).sort((a, b) => parseDateValue(b.date) - parseDateValue(a.date));
};

const renderLeftRail = ({ items, activeSlug, postUrl, topicBrowseHref, topicAriaLabel }) => {
  const recentRoot = document.querySelector("[data-blog-recent]");
  const topicsRoot = document.querySelector("[data-blog-topics]");

  if (!recentRoot || !topicsRoot) return;

  recentRoot.innerHTML = "";
  items.slice(0, MAX_LEFT_RAIL_ITEMS).forEach((item) => {
    const link = document.createElement("a");
    link.className = "blog-recent-link";
    if (item.slug === activeSlug) {
      link.classList.add("is-active");
    }
    link.href = `${postUrl}?post=${encodeURIComponent(item.slug)}`;
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
  ).slice(0, MAX_LEFT_RAIL_ITEMS);

  topicsRoot.innerHTML = "";
  uniqueTopics.forEach((topic) => {
    const link = document.createElement("a");
    link.className = "blog-topic-link";
    link.href = topicBrowseHref;
    link.textContent = topic;
    link.setAttribute("aria-label", topicAriaLabel(topic));
    topicsRoot.appendChild(link);
  });
};

const renderPostNavigation = ({ items, activeSlug, postUrl }) => {
  const navRoot = document.querySelector("[data-blog-pagination]");
  if (!navRoot) return;

  navRoot.innerHTML = "";
  const activeIndex = items.findIndex((item) => item.slug === activeSlug);
  if (activeIndex === -1) {
    navRoot.hidden = true;
    return;
  }

  const previous = items[activeIndex + 1] || null;
  const next = items[activeIndex - 1] || null;
  if (!previous && !next) {
    navRoot.hidden = true;
    return;
  }

  if (previous) {
    navRoot.appendChild(
      createPaginationLink(`${postUrl}?post=${encodeURIComponent(previous.slug)}`, previous.title, "previous")
    );
  }

  if (next) {
    navRoot.appendChild(
      createPaginationLink(`${postUrl}?post=${encodeURIComponent(next.slug)}`, next.title, "next")
    );
  }

  navRoot.hidden = false;
};

const initCopyPage = () => {
  const button = document.querySelector("[data-copy-page]");
  if (!button) return;

  const fallbackCopy = () => {
    const textArea = document.createElement("textarea");
    textArea.value = window.location.href;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
  };

  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      fallbackCopy();
    }

    button.textContent = "Copied";
    setTimeout(() => {
      button.textContent = "Copy Page";
    }, 1300);
  });
};

export const initPostPage = async ({
  directory,
  indexUrl,
  defaultLabel,
  fallbackTitle,
  titleSuffix,
  postUrl,
  topicBrowseHref,
  topicAriaLabel,
  enableCopyPage = false,
  notFoundUrl = DEFAULT_NOT_FOUND_URL,
}) => {
  initializeTheme();
  initNavMenu();
  initSearchOverlay();

  const params = new URLSearchParams(window.location.search);
  const slug = params.get("post");
  if (!slug || !isValidSlug(slug)) {
    redirectToNotFound(notFoundUrl);
    return;
  }

  const response = await fetch(`${directory}/${slug}.md`);
  let summaries = [];

  try {
    summaries = await loadSummaries({ directory, indexUrl, defaultLabel });
  } catch {
    summaries = [];
  }

  if (!response.ok) {
    redirectToNotFound(notFoundUrl);
    return;
  }

  renderLeftRail({
    items: summaries,
    activeSlug: slug,
    postUrl,
    topicBrowseHref,
    topicAriaLabel,
  });

  const markdown = await response.text();
  const { meta, body } = parseFrontMatter(markdown);
  const labels = parseLabels(meta.label, defaultLabel);

  renderMeta({
    fallbackTitle,
    titleSuffix,
    item: {
      title: meta.title || extractTitle(body) || fallbackTitle,
      date: meta.date || "",
      excerpt: meta.excerpt || extractExcerpt(body),
      author: meta.author || DEFAULT_AUTHOR,
      labels,
    },
  });

  renderContent(parseMarkdown(body));
  renderPostNavigation({
    items: summaries,
    activeSlug: slug,
    postUrl,
  });

  if (enableCopyPage) {
    initCopyPage();
  }
};
