const RESEARCH_DIR = "data/research";
const RESEARCH_INDEX_URL = `${RESEARCH_DIR}/index.json`;
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
  const body = markdown.slice(end + 4);
  return { meta, body };
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

const loadResearch = async () => {
  const files = await listResearchFiles();
  const items = await Promise.all(
    files.map(async (file) => {
      const response = await fetch(file);
      if (!response.ok) return null;
      const markdown = await response.text();
      const { meta, body } = parseFrontMatter(markdown);
      const title = meta.title || extractTitle(body);
      const labels = parseCommaValues(meta.label);
      const banner = WORK_BANNERS[files.indexOf(file) % WORK_BANNERS.length];
      return {
        kind: labels[0] || "Research",
        title,
        date: meta.date || "",
        author: meta.author || "Ved Panse",
        excerpt: meta.excerpt || "",
        image: banner,
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
  if (item.image) {
    const img = document.createElement("img");
    img.src = item.image;
    img.alt = item.imageAlt || "";
    img.loading = "lazy";
    imageWrap.appendChild(img);
  }

  const overlay = createElement("div", "editorial-hero-overlay");
  const eyebrow = createElement("p", "editorial-hero-eyebrow");
  eyebrow.textContent = item.kind || "Research";

  const title = createElement("h3", "editorial-hero-title");
  title.textContent = item.title || "Untitled";

  const footer = createElement("div", "editorial-hero-footer");
  const button = createElement("span", "editorial-hero-pill");
  button.textContent = "Read now";

  const summary = createElement("p", "editorial-hero-summary");
  const strong = createElement("span", "editorial-hero-summary-strong");
  strong.textContent = `${item.author || "Ved Panse"} \u2022 `;
  const text = createElement("span", "editorial-hero-summary-text");
  text.textContent = item.excerpt || item.date || "";

  summary.appendChild(strong);
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
  if (item.image) {
    const image = document.createElement("img");
    image.src = item.image;
    image.alt = item.imageAlt || "";
    image.loading = "lazy";
    media.appendChild(image);
  }

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

const renderLoopingBand = (container, items, buildItem) => {
  container.innerHTML = "";
  if (!items.length) return;

  const sequence =
    items.length > 1 ? [items[items.length - 1], ...items, items[0]] : items.slice();
  container.dataset.loopLead = items.length > 1 ? "1" : "0";
  container.dataset.loopItems = String(items.length);

  sequence.forEach((item) => {
    container.appendChild(buildItem(item));
  });
};

const getLoopLeadOffset = (container) => {
  const leadCount = Number(container.dataset.loopLead || "0");
  if (!leadCount) return 0;
  const firstCard = container.firstElementChild;
  if (!firstCard) return 0;
  const styles = window.getComputedStyle(container);
  const gap = parseFloat(styles.columnGap || styles.gap || "0");
  return (firstCard.getBoundingClientRect().width + gap) * leadCount;
};

const getBandPeekOffset = (container) => {
  const styles = window.getComputedStyle(container);
  return parseFloat(styles.paddingLeft || "0");
};

const getLoopCycleWidth = (container) => {
  const itemCount = Number(container.dataset.loopItems || "0");
  if (!itemCount) return 0;
  const firstCard = container.firstElementChild;
  if (!firstCard) return 0;
  const styles = window.getComputedStyle(container);
  const gap = parseFloat(styles.columnGap || styles.gap || "0");
  return (firstCard.getBoundingClientRect().width + gap) * itemCount;
};

const getLoopStartOffset = (container) =>
  Math.max(0, getLoopLeadOffset(container) - getBandPeekOffset(container));

const resetBandPosition = (container) => {
  container.scrollLeft = getLoopStartOffset(container);
};

const bindLoopReset = (container) => {
  if (container.dataset.loopResetBound === "true") return;
  container.dataset.loopResetBound = "true";

  container.addEventListener(
    "scroll",
    () => {
      const cycleWidth = getLoopCycleWidth(container);
      const startOffset = getLoopStartOffset(container);
      if (cycleWidth && container.scrollLeft >= startOffset + cycleWidth) {
        container.scrollLeft = startOffset;
      }
    },
    { passive: true }
  );
};

const initLoopingBand = (container, speed = 0.35) => {
  if (!container) return;
  if (container.dataset.loopBound === "true") return;
  container.dataset.loopBound = "true";

  let frameId = 0;
  let lastTime = 0;
  let isPaused = false;

  const tick = (time) => {
    if (!lastTime) lastTime = time;
    const delta = time - lastTime;
    lastTime = time;

    if (!isPaused) {
      container.scrollLeft += speed * delta;
      const cycleWidth = getLoopCycleWidth(container);
      const startOffset = getLoopStartOffset(container);
      if (cycleWidth && container.scrollLeft >= startOffset + cycleWidth) {
        container.scrollLeft = startOffset;
      }
    }

    frameId = window.requestAnimationFrame(tick);
  };

  const pause = () => {
    isPaused = true;
  };

  const resume = () => {
    isPaused = false;
  };

  container.addEventListener("mouseenter", pause);
  container.addEventListener("mouseleave", resume);
  container.addEventListener("focusin", pause);
  container.addEventListener("focusout", resume);

  frameId = window.requestAnimationFrame(tick);
  container.dataset.loopFrame = String(frameId);
};

const renderItems = (heroRail, miniGrid, items, limit = items.length) => {
  heroRail.innerHTML = "";
  miniGrid.innerHTML = "";

  const visibleItems = items.slice(0, limit);
  const heroCount = Math.ceil(visibleItems.length / 2);
  const heroItems = visibleItems.slice(0, heroCount);
  const miniItems = visibleItems.slice(heroCount);

  renderLoopingBand(heroRail, heroItems, buildHeroCard);
  renderLoopingBand(miniGrid, miniItems, buildMiniCard);
  resetBandPosition(heroRail);
  resetBandPosition(miniGrid);
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

  const render = () => {
    renderItems(heroRail, miniGrid, items, items.length);
  };

  render();
  loadMoreButton.hidden = true;
  loadMoreButton.disabled = true;
};
