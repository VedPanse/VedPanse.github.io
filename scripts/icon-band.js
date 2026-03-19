const ICONS_URL = "data/icons.json";
const PROJECTS_URL = "data/projects.json";
const CARDS_PER_COLUMN = 3;
const DEFAULT_ICON_SIZE = 96;
const DEFAULT_GAP = 20;
const LOOP_SEGMENTS = 3;
const DRAG_THRESHOLD_PX = 8;
const INTRO_MARQUEE_DURATION_MS = 4200;
const INTRO_MARQUEE_DISTANCE_RATIO = 0.42;

const readCssNumber = (value) => {
  const parsed = parseFloat(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const shuffle = (items) => {
  const array = [...items];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const buildSequence = (icons, totalNeeded) => {
  const sequence = [];
  let pool = shuffle(icons);
  while (sequence.length < totalNeeded) {
    if (!pool.length) {
      pool = shuffle(icons);
    }
    const next = pool.shift();
    const last = sequence[sequence.length - 1];
    if (last && next && last.src === next.src) {
      pool.push(next);
      continue;
    }
    sequence.push(next);
  }
  return sequence;
};

const PALETTE = [
  ["#f9f9fb", "#eceff6"],
  ["#f8fafc", "#eef2f8"],
  ["#f9f6ff", "#eee7ff"],
  ["#fff7f2", "#ffe8dd"],
  ["#f4fbff", "#e5f2ff"],
  ["#f7fff5", "#e8f7ee"],
  ["#fffdf3", "#f7f0d8"],
  ["#fef6fb", "#f4e7f1"],
  ["#f3fbf8", "#e4f3ee"],
  ["#f7f7f7", "#ededed"],
];

const hashString = (value) => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const pickTileBackground = (icon) => {
  const key = icon.label || icon.src || "icon";
  const index = hashString(key) % PALETTE.length;
  const [from, to] = PALETTE[index];
  return `linear-gradient(180deg, ${from} 0%, ${to} 100%)`;
};

const normalizeValue = (value) => (value || "").trim().toLowerCase();

const createIconCard = (icon) => {
  const card = document.createElement("button");
  card.type = "button";
  card.className = "app-icon app-icon--interactive";
  card.style.setProperty("--tile-bg", pickTileBackground(icon));
  card.setAttribute("aria-label", icon.label ? `Open ${icon.label} projects` : "Open technology projects");
  card.setAttribute("aria-expanded", "false");
  if (icon.label) {
    card.dataset.techLabel = icon.label;
  }
  if (icon.src) {
    card.dataset.techSrc = icon.src;
  }

  const img = document.createElement("img");
  img.src = icon.src;
  img.alt = icon.label || "Language icon";
  img.loading = "lazy";
  card.appendChild(img);
  return card;
};

const getLayoutMetrics = (band) => {
  const styles = getComputedStyle(band);
  return {
    iconSize: readCssNumber(styles.getPropertyValue("--icon-size")) || DEFAULT_ICON_SIZE,
    gap: readCssNumber(styles.getPropertyValue("--icon-gap")) || DEFAULT_GAP,
  };
};

const buildColumnsFragment = (icons, metrics) => {
  const { iconSize, gap } = metrics;
  const columnsNeeded = Math.ceil(window.innerWidth / (iconSize + gap)) + 2;
  const totalNeeded = columnsNeeded * CARDS_PER_COLUMN;
  const sequence = buildSequence(icons, totalNeeded);
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < columnsNeeded; i += 1) {
    const column = document.createElement("div");
    column.className = "icon-column";
    const start = i * CARDS_PER_COLUMN;
    sequence.slice(start, start + CARDS_PER_COLUMN).forEach((icon) => {
      column.appendChild(createIconCard(icon));
    });
    fragment.appendChild(column);
  }

  return fragment;
};

const renderLoopingColumns = (band, columns, icons, metrics) => {
  columns.innerHTML = "";
  const baseFragment = buildColumnsFragment(icons, metrics);
  const baseColumns = Array.from(baseFragment.childNodes);

  for (let segment = 0; segment < LOOP_SEGMENTS; segment += 1) {
    baseColumns.forEach((node) => {
      columns.appendChild(node.cloneNode(true));
    });
  }

  const cycleWidth = columns.scrollWidth / LOOP_SEGMENTS;
  band.scrollLeft = cycleWidth;
  return cycleWidth;
};

const loadIcons = async () => {
  const response = await fetch(ICONS_URL);
  if (!response.ok) {
    return [];
  }
  const data = await response.json();
  return Array.isArray(data.icons) ? data.icons : [];
};

const loadProjects = async () => {
  const response = await fetch(PROJECTS_URL);
  if (!response.ok) {
    return [];
  }
  const data = await response.json();
  return Array.isArray(data.projects) ? data.projects : [];
};

const buildTechUsageIndex = (projects) => {
  const byLabel = new Map();
  const bySrc = new Map();

  projects.forEach((project) => {
    if (!Array.isArray(project.stack)) {
      return;
    }

    project.stack.forEach((item) => {
      const labelKey = normalizeValue(item.label);
      const srcKey = normalizeValue(item.src);
      if (labelKey) {
        const entries = byLabel.get(labelKey) || [];
        entries.push(project);
        byLabel.set(labelKey, entries);
      }
      if (srcKey) {
        const entries = bySrc.get(srcKey) || [];
        entries.push(project);
        bySrc.set(srcKey, entries);
      }
    });
  });

  return { byLabel, bySrc };
};

const createProjectLink = (project) => {
  if (project.url) {
    const link = document.createElement("a");
    link.href = project.url;
    link.target = "_blank";
    link.rel = "noopener";
    link.className = "project-back-link tech-detail-project__link";
    link.textContent = "View project";
    return link;
  }

  const button = document.createElement("button");
  button.type = "button";
  button.className = "project-back-link tech-detail-project__link is-disabled";
  button.textContent = "Coming soon";
  button.disabled = true;
  return button;
};

const renderTechProjects = (container, projects) => {
  container.innerHTML = "";

  if (!projects.length) {
    return;
  }

  projects.forEach((project) => {
    const item = document.createElement("div");
    item.className = "tech-detail-project";
    if (project.accent) {
      item.style.setProperty("--panel-accent", project.accent);
    }

    const copy = document.createElement("div");
    copy.className = "tech-detail-project__body";
    const meta = document.createElement("div");
    meta.className = "tech-detail-project__meta";
    const description = project.details || project.description || "Featured project";
    const trimmed = description.trim();
    const firstSpace = trimmed.search(/\s/);
    if (firstSpace === -1) {
      const firstWord = document.createElement("span");
      firstWord.className = "tech-detail-project__lead";
      firstWord.textContent = trimmed;
      meta.appendChild(firstWord);
    } else {
      const firstWord = document.createElement("span");
      firstWord.className = "tech-detail-project__lead";
      firstWord.textContent = trimmed.slice(0, firstSpace);
      meta.appendChild(firstWord);
      meta.appendChild(document.createTextNode(trimmed.slice(firstSpace)));
    }

    const actions = document.createElement("div");
    actions.className = "tech-detail-project__actions";

    const focus = document.createElement("div");
    focus.className = "tech-detail-project__focus";
    focus.textContent = Array.isArray(project.focus) && project.focus.length
      ? project.focus[0]
      : "Featured project";

    copy.appendChild(meta);
    actions.appendChild(focus);
    actions.appendChild(createProjectLink(project));
    copy.appendChild(actions);

    const visual = document.createElement("div");
    visual.className = "tech-detail-project__visual";

    const visualShell = document.createElement("div");
    visualShell.className = "tech-detail-project__visual-shell";

    const stack = document.createElement("div");
    stack.className = "tech-detail-project__stack";
    (Array.isArray(project.stack) ? project.stack : []).slice(0, 3).forEach((tech) => {
      const stackIcon = document.createElement("div");
      stackIcon.className = "tech-detail-project__stack-icon";
      const image = document.createElement("img");
      image.src = tech.src;
      image.alt = tech.label || "Technology icon";
      image.loading = "lazy";
      stackIcon.appendChild(image);
      stack.appendChild(stackIcon);
    });

    visualShell.appendChild(document.createElement("div"));
    visualShell.appendChild(stack);
    visualShell.appendChild(document.createElement("div"));
    visual.appendChild(visualShell);

    item.appendChild(copy);
    item.appendChild(visual);
    container.appendChild(item);
  });
};

const throttle = (callback, delayMs) => {
  let timeoutId = null;
  return () => {
    if (timeoutId !== null) return;
    timeoutId = window.setTimeout(() => {
      timeoutId = null;
      callback();
    }, delayMs);
  };
};

export const initIconBand = async () => {
  const band = document.querySelector(".icon-band");
  const columns = document.querySelector(".icon-columns");
  const detailShell = document.querySelector("[data-tech-detail-shell]");
  const detailIcon = document.querySelector("[data-tech-icon]");
  const detailTitle = document.querySelector("[data-tech-title]");
  const detailDescription = document.querySelector("[data-tech-description]");
  const detailProjects = document.querySelector("[data-tech-projects]");
  const closeButton = document.querySelector("[data-tech-close]");
  if (!band || !columns || !detailShell || !detailIcon || !detailTitle || !detailDescription || !detailProjects || !closeButton) {
    return;
  }

  const [icons, projects] = await Promise.all([loadIcons(), loadProjects()]);
  if (!icons.length) return;

  const usageIndex = buildTechUsageIndex(projects);
  let activeButton = null;
  let cycleWidth = 0;
  let isAdjustingScroll = false;
  let isPointerDown = false;
  let isDragging = false;
  let dragStartX = 0;
  let dragStartScrollLeft = 0;
  let introAnimationFrame = 0;
  let hasPlayedIntro = false;
  let userInterruptedIntro = false;

  const setActiveButton = (button) => {
    if (activeButton) {
      activeButton.classList.remove("is-active");
      activeButton.setAttribute("aria-expanded", "false");
    }
    activeButton = button;
    if (activeButton) {
      activeButton.classList.add("is-active");
      activeButton.setAttribute("aria-expanded", "true");
    }
  };

  const closeDetails = () => {
    setActiveButton(null);
    detailShell.hidden = true;
    document.body.classList.remove("is-tech-detail-open");
  };

  const openDetails = (button) => {
    const labelKey = normalizeValue(button.dataset.techLabel);
    const srcKey = normalizeValue(button.dataset.techSrc);
    const label = button.dataset.techLabel || "Technology";
    const matches = usageIndex.byLabel.get(labelKey) || usageIndex.bySrc.get(srcKey) || [];
    const uniqueMatches = Array.from(
      new Map(matches.map((project) => [`${project.name || ""}::${project.url || ""}`, project])).values()
    );

    detailIcon.src = button.dataset.techSrc || "";
    detailTitle.textContent = label;
    detailDescription.textContent = uniqueMatches.length
      ? `${label} appears in ${uniqueMatches.length} featured project${uniqueMatches.length === 1 ? "" : "s"}.`
      : `${label} is in the icon band, but not yet attached to a featured project card.`;
    renderTechProjects(detailProjects, uniqueMatches);
    detailShell.hidden = false;
    document.body.classList.add("is-tech-detail-open");
    setActiveButton(button);
  };

  const render = () => {
    cycleWidth = renderLoopingColumns(band, columns, icons, getLayoutMetrics(band));
    if (activeButton) {
      const labelSelector = activeButton.dataset.techLabel
        ? `[data-tech-label="${CSS.escape(activeButton.dataset.techLabel)}"]`
        : "";
      const srcSelector = activeButton.dataset.techSrc
        ? `[data-tech-src="${CSS.escape(activeButton.dataset.techSrc)}"]`
        : "";
      const replacement = (labelSelector && columns.querySelector(labelSelector))
        || (srcSelector && columns.querySelector(srcSelector));
      if (replacement instanceof HTMLButtonElement) {
        setActiveButton(replacement);
      } else {
        closeDetails();
      }
    }
  };

  const stopIntroMarquee = () => {
    if (introAnimationFrame) {
      window.cancelAnimationFrame(introAnimationFrame);
      introAnimationFrame = 0;
    }
  };

  const playIntroMarquee = () => {
    if (hasPlayedIntro || userInterruptedIntro || !cycleWidth) {
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      hasPlayedIntro = true;
      return;
    }

    hasPlayedIntro = true;
    const startScrollLeft = band.scrollLeft;
    const targetScrollLeft = startScrollLeft + cycleWidth * INTRO_MARQUEE_DISTANCE_RATIO;
    const startTime = performance.now();

    const step = (now) => {
      if (userInterruptedIntro) {
        stopIntroMarquee();
        return;
      }

      const elapsed = now - startTime;
      const progress = Math.min(elapsed / INTRO_MARQUEE_DURATION_MS, 1);
      const eased = 1 - ((1 - progress) ** 3);
      band.scrollLeft = startScrollLeft + ((targetScrollLeft - startScrollLeft) * eased);

      if (progress < 1) {
        introAnimationFrame = window.requestAnimationFrame(step);
      } else {
        stopIntroMarquee();
      }
    };

    introAnimationFrame = window.requestAnimationFrame(step);
  };

  render();
  window.requestAnimationFrame(playIntroMarquee);

  band.addEventListener(
    "scroll",
    () => {
      if (isAdjustingScroll || !cycleWidth) {
        return;
      }

      const lowerBound = cycleWidth * 0.5;
      const upperBound = cycleWidth * 1.5;

      if (band.scrollLeft < lowerBound) {
        isAdjustingScroll = true;
        band.scrollLeft += cycleWidth;
        isAdjustingScroll = false;
      } else if (band.scrollLeft > upperBound) {
        isAdjustingScroll = true;
        band.scrollLeft -= cycleWidth;
        isAdjustingScroll = false;
      }
    },
    { passive: true }
  );

  band.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }
    isPointerDown = true;
    userInterruptedIntro = true;
    stopIntroMarquee();
    isDragging = false;
    dragStartX = event.clientX;
    dragStartScrollLeft = band.scrollLeft;
  });

  band.addEventListener("pointermove", (event) => {
    if (!isPointerDown) {
      return;
    }
    const deltaX = event.clientX - dragStartX;
    if (!isDragging) {
      if (Math.abs(deltaX) < DRAG_THRESHOLD_PX) {
        return;
      }
      isDragging = true;
      band.classList.add("is-dragging");
      band.setPointerCapture?.(event.pointerId);
    }
    band.scrollLeft = dragStartScrollLeft - deltaX;
  });

  const endDrag = (event) => {
    if (!isPointerDown) {
      return;
    }
    isPointerDown = false;
    isDragging = false;
    band.classList.remove("is-dragging");
    if (event && typeof event.pointerId === "number" && band.hasPointerCapture?.(event.pointerId)) {
      band.releasePointerCapture(event.pointerId);
    }
  };

  band.addEventListener("pointerup", endDrag);
  band.addEventListener("pointercancel", endDrag);
  band.addEventListener("pointerleave", (event) => {
    if (event.pointerType !== "mouse") {
      return;
    }
    endDrag(event);
  });

  columns.addEventListener("click", (event) => {
    userInterruptedIntro = true;
    stopIntroMarquee();
    const button = event.target.closest(".app-icon--interactive");
    if (!(button instanceof HTMLButtonElement)) {
      return;
    }
    if (button === activeButton) {
      closeDetails();
      return;
    }
    openDetails(button);
  });

  closeButton.addEventListener("click", closeDetails);
  detailShell.addEventListener("click", (event) => {
    if (event.target === detailShell) {
      closeDetails();
    }
  });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !detailShell.hidden) {
      closeDetails();
    }
  });
  window.addEventListener("resize", throttle(render, 150));
};
