const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const WORK_DATA_URL = "data/work.json";
const WORK_ASSETS_DIR = "assets/work";
const WORK_ASSETS_INDEX_URL = `${WORK_ASSETS_DIR}/index.json`;

const createElement = (tag, className) => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  return element;
};

const TAU = Math.PI * 2;
const GOLDEN_RATIO_CONJUGATE = 0.6180339887498949;
const fract = (value) => value - Math.floor(value);

const hashString = (value) => {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

const createSeededRng = (seed) => {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x9e3779b9) >>> 0;
    let mixed = state;
    mixed = Math.imul(mixed ^ (mixed >>> 16), 0x21f0aaad);
    mixed = Math.imul(mixed ^ (mixed >>> 15), 0x735a2d97);
    mixed ^= mixed >>> 15;
    return (mixed >>> 0) / 4294967296;
  };
};

const gaussianInfluence = (value, center, spread) => {
  const delta = value - center;
  return Math.exp(-(delta * delta) / (2 * spread * spread));
};

const harmonicHueWarp = (position, phaseA, phaseB) => {
  const waveA = Math.sin(TAU * (position + phaseA));
  const waveB = 0.56 * Math.sin(TAU * (2 * position + phaseB));
  const waveC = 0.28 * Math.sin(TAU * (3 * position + phaseA * 0.6 + phaseB * 0.4));
  return 0.11 * waveA + 0.07 * waveB + 0.04 * waveC;
};

const accentFromCompanyName = (name) => {
  const seed = (name || "work").trim().toLowerCase();
  const baseHash = hashString(seed) ^ hashString(`${seed}:accent`);
  const random = createSeededRng(baseHash);
  const primary = random();
  const secondary = random();
  const phaseA = random();
  const phaseB = random();
  const chromaNoise = random();
  const lightNoise = random();

  // Low-discrepancy base + harmonic warp gives broad hue coverage with deterministic uniqueness.
  const hueSeed = fract(primary + GOLDEN_RATIO_CONJUGATE * secondary);
  const warpedHue = fract(hueSeed + harmonicHueWarp(hueSeed, phaseA, phaseB) + (random() - 0.5) * 0.03);
  const hue = warpedHue * 360;
  const hueRadians = (hue * Math.PI) / 180;

  const warmPenalty = gaussianInfluence(hue, 62, 17);
  const cyanPenalty = gaussianInfluence(hue, 192, 22);
  const coolBoost = gaussianInfluence(hue, 292, 30);

  let saturation =
    76 +
    Math.round(chromaNoise * 12) +
    Math.round(6 * Math.cos(hueRadians - 0.4)) -
    Math.round(8 * cyanPenalty) +
    Math.round(5 * coolBoost);

  let lightness =
    54 +
    Math.round((lightNoise - 0.5) * 8) +
    Math.round(5 * Math.sin(hueRadians + 0.2)) -
    Math.round(7 * warmPenalty);

  saturation = clamp(saturation, 68, 92);
  lightness = clamp(lightness, 45, 62);

  return `hsl(${Math.round(hue)}, ${saturation}%, ${lightness}%)`;
};

export const initWorkSection = () => {
  const sections = Array.from(document.querySelectorAll(".scroll-transition-section"));
  if (!sections.length) return;

  const controllers = sections
    .map((section) => {
      const visual = section.querySelector(".work-visual");
      if (!visual) return null;

      let baseWidth = 0;
      let baseHeight = 0;
      let targetScale = 1;

      const measure = () => {
        const rect = visual.getBoundingClientRect();
        baseWidth = rect.width / (parseFloat(getComputedStyle(section).getPropertyValue("--work-scale")) || 1);
        baseHeight = rect.height / (parseFloat(getComputedStyle(section).getPropertyValue("--work-scale")) || 1);
        targetScale = Math.max(window.innerWidth / baseWidth, window.innerHeight / baseHeight);
      };

      const update = () => {
        const rect = section.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        const rawProgress = total > 0 ? -rect.top / total : 0;
        const progress = clamp(rawProgress, 0, 1);
        const holdStart = 0.4;
        const holdEnd = 0.7;
        let inOut = 0;
        if (progress <= holdStart) {
          inOut = progress / holdStart;
        } else if (progress <= holdEnd) {
          inOut = 1;
        } else {
          inOut = (1 - progress) / (1 - holdEnd);
        }
        inOut = clamp(inOut, 0, 1);

        const scale = 1 + (targetScale - 1) * inOut;
        const radius = (1 - inOut) * 36;
        const textProgress = clamp((inOut - 0.6) / 0.4, 0, 1);

        section.style.setProperty("--work-progress", progress.toFixed(4));
        section.style.setProperty("--work-scale", scale.toFixed(4));
        section.style.setProperty("--work-radius", `${radius.toFixed(2)}px`);
        section.style.setProperty("--work-text", textProgress.toFixed(4));
      };

      return { measure, update };
    })
    .filter(Boolean);

  if (!controllers.length) return;

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      controllers.forEach((controller) => controller.update());
      ticking = false;
    });
  };

  const onResize = () => {
    controllers.forEach((controller) => controller.measure());
    controllers.forEach((controller) => controller.update());
  };

  onResize();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize);
};

const normalizeStats = (item) => {
  if (Array.isArray(item.stats) && item.stats.length) {
    return item.stats.slice(0, 2).map((stat) => ({
      value: stat?.value || "",
      label: stat?.label || "",
    }));
  }

  return [
    {
      value: item.role || "Role",
      label: "engagement focus",
    },
    {
      value: "Delivered",
      label: "product and engineering outcomes",
    },
  ];
};

const normalizeItems = (items, workImages) =>
  items.map((item, index) => {
    const fallbackTitle = item.title || item.company || `Work ${index + 1}`;
    const visual = item.visual || {};
    const colorSeed = item.company || fallbackTitle;
    const workPostSlug = (item.workPostSlug || item.postSlug || item.slug || "").trim();
    const workPostUrl = workPostSlug ? `work-blog.html?post=${encodeURIComponent(workPostSlug)}` : "";

    return {
      tabLabel: item.tabLabel || fallbackTitle,
      title: fallbackTitle,
      description: item.description || "",
      stats: normalizeStats(item),
      ctaText: item.ctaText || `Read ${fallbackTitle} work blog`,
      ctaUrl: workPostUrl || item.ctaUrl || "#contact",
      visualImage: item.visualImage || (workImages.length ? workImages[index % workImages.length] : ""),
      visualAlt: item.visualAlt || `${fallbackTitle} showcase visual`,
      visual: {
        accent: accentFromCompanyName(colorSeed),
        label: visual.label || fallbackTitle,
        meta: visual.meta || "Case Study",
      },
    };
  });

const WORK_GRADIENT_MAP = {
  IBM: {
    primary: "#3b82f6",
    secondary: "#02030a",
    tertiary: "#6ea8ff",
  },
  "Falcon Eye": {
    primary: "#ef4444",
    secondary: "#040207",
    tertiary: "#fb7185",
  },
  Spuddie: {
    primary: "#8b5cf6",
    secondary: "#03020a",
    tertiary: "#a78bfa",
  },
  "Findability Sciences": {
    primary: "#10b981",
    secondary: "#010706",
    tertiary: "#6ee7b7",
  },
  "Venture Shares": {
    primary: "#f59e0b",
    secondary: "#080402",
    tertiary: "#fcd34d",
  },
};

const resolveGradient = (item) => {
  const palette = WORK_GRADIENT_MAP[item.title];
  if (palette) return palette;

  return {
    primary: item.visual.accent,
    secondary: "#050816",
    tertiary: "#7dd3fc",
  };
};

const listWorkImages = async () => {
  const response = await fetch(WORK_ASSETS_INDEX_URL);
  if (!response.ok) return [];
  const indexData = await response.json();
  if (!Array.isArray(indexData)) return [];
  return indexData.map((file) => (file.startsWith(WORK_ASSETS_DIR) ? file : `${WORK_ASSETS_DIR}/${file}`));
};

const renderWorkCard = (item) => {
  const article = createElement("article", "work-rail-card");
  const gradient = resolveGradient(item);
  article.style.setProperty("--work-visual-accent", gradient.primary);
  article.style.setProperty("--work-visual-base", gradient.secondary);
  article.style.setProperty("--work-visual-glow", gradient.tertiary);
  article.setAttribute("aria-label", `${item.title} work experience`);
  article.tabIndex = 0;

  const mediaLink = createElement("a", "work-rail-media");
  mediaLink.href = item.ctaUrl;
  mediaLink.setAttribute("aria-label", "Learn more");
  const image = document.createElement("img");
  image.className = "work-rail-media-image";
  image.src = item.visualImage;
  image.alt = item.visualAlt;
  image.loading = "lazy";
  mediaLink.appendChild(image);

  const copy = createElement("div", "work-rail-copy");

  const description = createElement("p", "work-rail-description");

  const title = createElement("span", "work-rail-title");
  title.textContent = `${item.title}. `;

  const summary = createElement("span", "work-rail-summary");
  summary.textContent = item.description;

  description.appendChild(title);
  description.appendChild(summary);

  const stats = createElement("div", "work-rail-stats");
  item.stats.forEach((stat) => {
    const statLine = createElement("p", "work-rail-stat");

    const value = createElement("span", "work-rail-stat-value");
    value.textContent = `${stat.value} `;

    const label = createElement("span", "work-rail-stat-label");
    label.textContent = stat.label;

    statLine.appendChild(value);
    statLine.appendChild(label);
    stats.appendChild(statLine);
  });

  const cta = createElement("a", "work-rail-link");
  cta.href = item.ctaUrl;
  cta.setAttribute("aria-label", "Learn more");

  const ctaLabel = createElement("span", "work-rail-link-label");
  ctaLabel.textContent = "Learn more";

  const ctaArrow = createElement("span", "work-rail-link-arrow");
  ctaArrow.textContent = "\u203a";
  ctaArrow.setAttribute("aria-hidden", "true");

  cta.appendChild(ctaLabel);
  cta.appendChild(ctaArrow);

  copy.appendChild(description);
  copy.appendChild(stats);
  copy.appendChild(cta);

  article.appendChild(mediaLink);
  article.appendChild(copy);
  return article;
};

export const initWorkExperience = async () => {
  const rail = document.querySelector("[data-work-rail]");
  const previousButton = document.querySelector("[data-work-prev]");
  const nextButton = document.querySelector("[data-work-next]");
  if (!rail || !previousButton || !nextButton) return;

  let items = [];
  try {
    const [response, workImages] = await Promise.all([fetch(WORK_DATA_URL), listWorkImages()]);
    if (!response.ok) return;
    const data = await response.json();
    if (!Array.isArray(data) || !data.length) return;
    items = normalizeItems(data, workImages);
  } catch {
    return;
  }

  rail.innerHTML = "";
  items.forEach((item) => {
    rail.appendChild(renderWorkCard(item));
  });
  rail.scrollLeft = 0;

  const getScrollAmount = () => {
    const firstCard = rail.querySelector(".work-rail-card");
    if (!firstCard) return rail.clientWidth;
    const styles = window.getComputedStyle(rail);
    const gap = parseFloat(styles.columnGap || styles.gap || "0");
    return firstCard.getBoundingClientRect().width + gap;
  };

  const updateControls = () => {
    const maxScrollLeft = rail.scrollWidth - rail.clientWidth - 2;
    previousButton.disabled = rail.scrollLeft <= 2;
    nextButton.disabled = rail.scrollLeft >= maxScrollLeft;
  };

  const scrollRail = (direction) => {
    rail.scrollBy({
      left: getScrollAmount() * direction,
      behavior: "smooth",
    });
  };

  previousButton.addEventListener("click", () => scrollRail(-1));
  nextButton.addEventListener("click", () => scrollRail(1));

  rail.addEventListener("scroll", () => {
    window.requestAnimationFrame(updateControls);
  }, { passive: true });

  rail.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollRail(1);
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollRail(-1);
    }
  });

  window.addEventListener("resize", updateControls);
  updateControls();
};
