const BLOGS_DIR = "data/blogs";

const escapeHtml = (value) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");

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

const renderMeta = (item) => {
  const label = document.querySelector("[data-blog-label]");
  const date = document.querySelector("[data-blog-date]");
  const title = document.querySelector("[data-blog-title]");
  const excerpt = document.querySelector("[data-blog-excerpt]");

  if (label) label.textContent = item?.label || "Blog";
  if (date) date.textContent = item?.date || "";
  if (title) title.textContent = item?.title || "Blog Post";
  if (excerpt) excerpt.textContent = item?.excerpt || "";
  document.title = item?.title ? `${item.title} | Ved Panse` : "Blog Post | Ved Panse";
};

const renderContent = (html) => {
  const container = document.querySelector("[data-blog-content]");
  if (!container) return;
  container.innerHTML = html;
};

const renderError = (message) => {
  renderMeta({ label: "Blog", title: "Post not found", date: "", excerpt: message });
  renderContent(`<p>${escapeHtml(message)}</p>`);
};

const initBlogPost = async () => {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("post");
  if (!slug) {
    renderError("Missing blog post slug.");
    return;
  }

  const response = await fetch(`${BLOGS_DIR}/${slug}.md`);
  if (!response.ok) {
    renderError("The blog content couldn't be loaded.");
    return;
  }

  const markdown = await response.text();
  const { meta, body } = parseFrontMatter(markdown);
  const title = meta.title || extractTitle(body) || "Blog Post";
  renderMeta({
    label: meta.label || "Blog",
    title,
    date: meta.date || "",
    excerpt: meta.excerpt || extractExcerpt(body),
  });

  const html = parseMarkdown(body);
  renderContent(html);
};

initBlogPost();
