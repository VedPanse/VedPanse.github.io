const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const WORK_DATA_URL = "data/work.json";

const createElement = (tag, className) => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  return element;
};

export const initWorkSection = () => {
  const section = document.querySelector(".work-section");
  if (!section) return;

  const visual = section.querySelector(".work-visual");
  if (!visual) return;

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

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      update();
      ticking = false;
    });
  };

  const onResize = () => {
    measure();
    update();
  };

  measure();
  update();
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

const normalizeItems = (items) =>
  items.map((item, index) => {
    const fallbackTitle = item.title || item.company || `Work ${index + 1}`;
    const visual = item.visual || {};

    return {
      tabLabel: item.tabLabel || fallbackTitle,
      title: fallbackTitle,
      description: item.description || "",
      stats: normalizeStats(item),
      ctaText: item.ctaText || `Learn more about ${fallbackTitle}`,
      ctaUrl: item.ctaUrl || "#contact",
      visualImage: item.visualImage || "",
      visualAlt: item.visualAlt || `${fallbackTitle} showcase visual`,
      visual: {
        start: visual.start || "#101319",
        end: visual.end || "#06080d",
        accent: visual.accent || "#0f62fe",
        label: visual.label || fallbackTitle,
        meta: visual.meta || "Case Study",
      },
    };
  });

const renderPanel = (panel, item, tabId) => {
  panel.innerHTML = "";
  panel.setAttribute("role", "tabpanel");
  panel.setAttribute("aria-labelledby", tabId);

  const body = createElement("div", "work-showcase-body");

  const content = createElement("div", "work-showcase-content");
  const title = createElement("h3", "work-showcase-company");
  title.textContent = item.title;

  const description = createElement("p", "work-showcase-description");
  description.textContent = item.description;

  const stats = createElement("div", "work-showcase-stats");
  item.stats.forEach((stat) => {
    const statCard = createElement("div", "work-showcase-stat");

    const value = createElement("p", "work-showcase-stat-value");
    value.textContent = stat.value;

    const label = createElement("p", "work-showcase-stat-label");
    label.textContent = stat.label;

    statCard.appendChild(value);
    statCard.appendChild(label);
    stats.appendChild(statCard);
  });

  const cta = createElement("a", "work-showcase-link");
  cta.href = item.ctaUrl;
  cta.textContent = item.ctaText;
  cta.setAttribute("aria-label", item.ctaText);

  const arrow = createElement("span", "work-showcase-link-arrow");
  arrow.textContent = "\u2192";
  arrow.setAttribute("aria-hidden", "true");

  cta.appendChild(arrow);

  content.appendChild(title);
  content.appendChild(description);
  content.appendChild(stats);
  content.appendChild(cta);

  const media = createElement("div", "work-showcase-media");

  if (item.visualImage) {
    const image = document.createElement("img");
    image.className = "work-showcase-media-image";
    image.src = item.visualImage;
    image.alt = item.visualAlt;
    image.loading = "lazy";
    media.appendChild(image);
  } else {
    media.style.setProperty("--work-visual-start", item.visual.start);
    media.style.setProperty("--work-visual-end", item.visual.end);
    media.style.setProperty("--work-visual-accent", item.visual.accent);

    const fallback = createElement("div", "work-showcase-media-fallback");

    const meta = createElement("p", "work-showcase-media-meta");
    meta.textContent = item.visual.meta;

    const label = createElement("p", "work-showcase-media-label");
    label.textContent = item.visual.label;

    fallback.appendChild(meta);
    fallback.appendChild(label);
    media.appendChild(fallback);
  }

  body.appendChild(content);
  body.appendChild(media);
  panel.appendChild(body);
};

export const initWorkExperience = async () => {
  const tabs = document.querySelector("[data-work-tabs]");
  const panel = document.querySelector("[data-work-panel]");
  if (!tabs || !panel) return;

  let items = [];
  try {
    const response = await fetch(WORK_DATA_URL);
    if (!response.ok) return;
    const data = await response.json();
    if (!Array.isArray(data) || !data.length) return;
    items = normalizeItems(data);
  } catch {
    return;
  }

  tabs.innerHTML = "";
  panel.id = "work-panel";
  tabs.style.setProperty("--work-tab-count", String(items.length));

  let activeIndex = 0;
  const tabButtons = [];

  const setActive = (nextIndex, focus = false) => {
    activeIndex = nextIndex;

    tabButtons.forEach((button, index) => {
      const isActive = index === activeIndex;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-selected", String(isActive));
      button.tabIndex = isActive ? 0 : -1;
      if (focus && isActive) button.focus();
    });

    renderPanel(panel, items[activeIndex], tabButtons[activeIndex].id);
  };

  items.forEach((item, index) => {
    const tab = createElement("button", "work-showcase-tab");
    tab.type = "button";
    tab.id = `work-tab-${index}`;
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-controls", "work-panel");
    tab.setAttribute("aria-selected", "false");
    tab.tabIndex = -1;

    const label = createElement("span", "work-showcase-tab-label");
    label.textContent = item.tabLabel;
    tab.appendChild(label);

    tab.addEventListener("click", () => {
      setActive(index);
    });

    tab.addEventListener("keydown", (event) => {
      if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;

      event.preventDefault();

      if (event.key === "Home") {
        setActive(0, true);
        return;
      }

      if (event.key === "End") {
        setActive(items.length - 1, true);
        return;
      }

      const delta = event.key === "ArrowRight" ? 1 : -1;
      const next = (activeIndex + delta + items.length) % items.length;
      setActive(next, true);
    });

    tabs.appendChild(tab);
    tabButtons.push(tab);
  });

  setActive(0);
};
