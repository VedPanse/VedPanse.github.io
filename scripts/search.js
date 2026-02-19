const toggleOverlay = (overlay, open) => {
  overlay.classList.toggle("is-open", open);
  overlay.setAttribute("aria-hidden", String(!open));
};

export const initSearchOverlay = () => {
  const overlay = document.querySelector("[data-search-overlay]");
  if (!overlay) return;

  const openButton = document.querySelector("[data-search-toggle]");
  const closeButton = overlay.querySelector("[data-search-close]");
  const input = overlay.querySelector("[data-search-input]");
  const list = overlay.querySelector("[data-search-list]");
  const emptyState = overlay.querySelector("[data-search-empty]");
  const kicker = overlay.querySelector("[data-search-kicker]");

  if (!openButton || !input || !list) return;

  const originalList = list.innerHTML;
  const documents = [];
  let indexLoaded = false;

  const BLOG_INDEX_URL = "data/blogs/index.json";
  const RESEARCH_INDEX_URL = "data/research/index.json";
  const WORK_BLOG_INDEX_URL = "data/work-blogs/index.json";

  const normalize = (text) =>
    text
      .toLowerCase()
      .replace(/[`~!@#$%^&*()_+={}\[\]|\\:;"'<>,.?/]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const stripMarkdown = (markdown) =>
    markdown
      .replace(/```[\s\S]*?```/g, " ")
      .replace(/`[^`]*`/g, " ")
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, " $1 ")
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, " $1 ")
      .replace(/^#{1,6}\s+/gm, "")
      .replace(/^>\s+/gm, "")
      .replace(/\|/g, " ")
      .replace(/[-*_]{3,}/g, " ")
      .replace(/\s+/g, " ")
      .trim();

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
    const firstParagraph = lines.find(
      (line) => !line.startsWith("#") && !line.startsWith("!") && !line.startsWith(">") && !line.startsWith("|")
    );
    return firstParagraph || "";
  };

  const loadIndex = async (url) => {
    const response = await fetch(url);
    if (!response.ok) return [];
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  };

  const buildDocs = async () => {
    if (indexLoaded) return;
    indexLoaded = true;
    const [blogs, research, workBlogs] = await Promise.all([
      loadIndex(BLOG_INDEX_URL),
      loadIndex(RESEARCH_INDEX_URL),
      loadIndex(WORK_BLOG_INDEX_URL),
    ]);
    const items = [
      ...blogs.map((file) => ({ file: `data/blogs/${file}`, type: "Blog", url: `blog.html?post=${file.replace(/\.md$/i, "")}` })),
      ...research.map((file) => ({
        file: `data/research/${file}`,
        type: "Research",
        url: `research.html?post=${file.replace(/\.md$/i, "")}`,
      })),
      ...workBlogs.map((file) => ({
        file: `data/work-blogs/${file}`,
        type: "Work Blog",
        url: `work-blog.html?post=${file.replace(/\.md$/i, "")}`,
      })),
    ];

    const fetched = await Promise.all(
      items.map(async (item) => {
        const response = await fetch(item.file);
        if (!response.ok) return null;
        const markdown = await response.text();
        const { meta, body } = parseFrontMatter(markdown);
        const title = meta.title || extractTitle(body) || "Untitled";
        const excerpt = meta.excerpt || extractExcerpt(body);
        const content = stripMarkdown(body);
        return {
          title,
          excerpt,
          content,
          type: item.type,
          url: item.url,
        };
      })
    );

    fetched.filter(Boolean).forEach((doc) => documents.push(doc));
  };

  const renderList = (items) => {
    list.innerHTML = items
      .map(
        (item) =>
          `<li><a href="${item.url}" data-search-item>${item.title}<span class="search-tag">${item.type}</span></a></li>`
      )
      .join("");
  };

  const applyFilter = (query) => {
    const term = normalize(query);
    if (!term) {
      list.innerHTML = originalList;
      if (kicker) kicker.textContent = "Quick Links";
      if (emptyState) emptyState.hidden = true;
      return;
    }

    const tokens = term.split(" ").filter((token) => token.length > 1);
    const scored = documents
      .map((doc) => {
        const haystack = normalize(`${doc.title} ${doc.excerpt} ${doc.content}`);
        let score = 0;
        if (haystack.includes(term)) score += 6;
        if (normalize(doc.title).includes(term)) score += 4;
        if (normalize(doc.excerpt).includes(term)) score += 2;
        tokens.forEach((token) => {
          if (haystack.includes(token)) score += 1;
        });
        return { ...doc, score };
      })
      .filter((doc) => doc.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);

    if (kicker) kicker.textContent = "Results";
    if (!scored.length) {
      list.innerHTML = "";
      if (emptyState) emptyState.hidden = false;
      return;
    }

    if (emptyState) emptyState.hidden = true;
    renderList(scored);
  };

  const open = () => {
    toggleOverlay(overlay, true);
    document.body.classList.add("is-search-open");
    input.focus();
    buildDocs().then(() => applyFilter(input.value || ""));
  };

  const close = () => {
    toggleOverlay(overlay, false);
    document.body.classList.remove("is-search-open");
    input.value = "";
    applyFilter("");
  };

  openButton.addEventListener("click", open);
  if (closeButton) {
    closeButton.addEventListener("click", close);
  }
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) close();
  });
  document.addEventListener("click", (event) => {
    if (!overlay.classList.contains("is-open")) return;
    if (openButton.contains(event.target)) return;
    if (overlay.contains(event.target) && overlay.querySelector(".search-panel")?.contains(event.target)) return;
    close();
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      open();
    }
  });

  input.addEventListener("input", (event) => {
    applyFilter(event.target.value || "");
  });
};
