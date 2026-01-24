const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const PROJECTS_URL = "data/projects.json";
const STACK_COLUMNS = 3;

const createElement = (tag, className) => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  return element;
};

const loadProjects = async () => {
  const response = await fetch(PROJECTS_URL);
  if (!response.ok) return [];
  const data = await response.json();
  return Array.isArray(data.projects) ? data.projects : [];
};

const buildStackColumns = (stack) => {
  const columns = Array.from({ length: STACK_COLUMNS }, () => []);
  stack.forEach((item, index) => {
    columns[index % STACK_COLUMNS].push(item);
  });
  return columns;
};

const renderCard = (project) => {
  const card = createElement("article", "project-card");
  card.setAttribute("data-project", "");
  if (project.url) {
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "link");
    card.setAttribute("data-project-url", project.url);
  }

  const inner = createElement("div", "project-card-inner");
  if (project.accent) {
    inner.style.setProperty("--project-accent", project.accent);
  }

  const meta = createElement("div", "project-meta");
  const heading = createElement("h3");
  const highlight = createElement("span", "project-highlight");
  highlight.textContent = project.name || "Project";
  heading.appendChild(highlight);
  heading.appendChild(document.createTextNode(` ${project.description || ""}`));
  meta.appendChild(heading);

  const stack = createElement("div", "project-stack");
  stack.setAttribute("aria-label", "Tech stack");
  const band = createElement("div", "project-icon-band");
  const columnsWrap = createElement("div", "project-icon-columns");
  const columns = buildStackColumns(project.stack || []);

  columns.forEach((columnItems) => {
    const column = createElement("div", "project-icon-column");
    columnItems.forEach((item) => {
      const icon = createElement("div", "app-icon");
      const img = document.createElement("img");
      img.src = item.src;
      img.alt = item.label || "Technology icon";
      img.loading = "lazy";
      icon.appendChild(img);
      column.appendChild(icon);
    });
    columnsWrap.appendChild(column);
  });

  band.appendChild(columnsWrap);
  stack.appendChild(band);
  inner.appendChild(meta);
  inner.appendChild(stack);
  card.appendChild(inner);
  return card;
};

const renderDots = (container, count) => {
  container.innerHTML = "";
  for (let i = 0; i < count; i += 1) {
    const dot = createElement("button", "projects-dot");
    dot.type = "button";
    dot.setAttribute("aria-label", `Go to project ${i + 1}`);
    if (i === 0) dot.classList.add("is-active");
    const fill = createElement("span", "projects-dot-fill");
    dot.appendChild(fill);
    container.appendChild(dot);
  }
};

export const initProjectsCarousel = async () => {
  const section = document.querySelector(".projects-section");
  if (!section) return;

  const carousel = section.querySelector(".projects-carousel");
  const dotsContainer = section.querySelector(".projects-dots");
  const toggle = section.querySelector("[data-carousel-toggle]");
  const controls = section.querySelector(".projects-controls");

  if (!carousel || !toggle || !dotsContainer || !controls) return;

  const projects = await loadProjects();
  if (!projects.length) return;

  const cards = projects.map(renderCard);
  carousel.innerHTML = "";
  cards.forEach((card) => carousel.appendChild(card));
  renderDots(dotsContainer, cards.length);
  const dots = Array.from(section.querySelectorAll(".projects-dot"));

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const duration = 10000;
  let activeIndex = 0;
  let autoPlay = !prefersReducedMotion;
  let isUserScrolling = false;
  let scrollTimeout = 0;
  let startTime = performance.now();
  let progressValue = 0;
  let activeCard = cards[0];

  const setProgress = (value) => {
    progressValue = clamp(value, 0, 1);
    section.style.setProperty("--carousel-progress", progressValue.toFixed(4));
  };

  const scrollToCard = (index, behavior = "smooth") => {
    const card = cards[index];
    if (!card) return;
    const left = card.offsetLeft - (carousel.clientWidth - card.clientWidth) / 2;
    carousel.scrollTo({ left, behavior });
  };

  const updateDots = (index) => {
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === index);
    });
  };

  const updateActiveFromScroll = () => {
    const center = carousel.scrollLeft + carousel.clientWidth / 2;
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    cards.forEach((card, index) => {
      const cardCenter = card.offsetLeft + card.clientWidth / 2;
      const distance = Math.abs(center - cardCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    if (closestIndex !== activeIndex) {
      activeIndex = closestIndex;
      activeCard = cards[activeIndex];
      updateDots(activeIndex);
      setProgress(0);
      startTime = performance.now();
    }
  };

  const updateCardTransforms = () => {
    const center = carousel.scrollLeft + carousel.clientWidth / 2;
    cards.forEach((card) => {
      const cardCenter = card.offsetLeft + card.clientWidth / 2;
      const distance = Math.abs(center - cardCenter);
      const ratio = clamp(distance / (carousel.clientWidth * 0.6), 0, 1);
      const scale = 1 - ratio * 0.08;
      const lift = 24 * ratio;
      const opacity = 1 - ratio * 0.35;
      card.style.setProperty("--card-scale", scale.toFixed(3));
      card.style.setProperty("--card-lift", `${lift.toFixed(2)}px`);
      card.style.setProperty("--card-opacity", opacity.toFixed(3));
    });
  };

  const updateControlsOffset = () => {
    if (!activeCard) return;
    const rect = activeCard.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const desiredBottom = 10;
    const targetBottom = rect.bottom + 15;
    const delta = Math.min(0, targetBottom - (viewportHeight - desiredBottom));
    controls.style.transform = `translateX(-50%) translateY(${delta.toFixed(1)}px)`;
  };

  const onScroll = () => {
    if (scrollTimeout) window.clearTimeout(scrollTimeout);
    isUserScrolling = true;
    updateActiveFromScroll();
    updateCardTransforms();
    updateControlsOffset();
    scrollTimeout = window.setTimeout(() => {
      isUserScrolling = false;
      startTime = performance.now();
    }, 160);
  };

  const goNext = () => {
    const nextIndex = (activeIndex + 1) % cards.length;
    const behavior = nextIndex === 0 ? "auto" : "smooth";
    scrollToCard(nextIndex, behavior);
  };

  const goToIndex = (index) => {
    activeIndex = clamp(index, 0, cards.length - 1);
    updateDots(activeIndex);
    setProgress(0);
    startTime = performance.now();
    scrollToCard(activeIndex);
  };

  const tick = (time) => {
    if (autoPlay && !isUserScrolling) {
      const elapsed = time - startTime;
      const nextProgress = elapsed / duration;
      if (nextProgress >= 1) {
        setProgress(1);
        goNext();
        setProgress(0);
        startTime = time;
      } else {
        setProgress(nextProgress);
      }
    } else {
      startTime = time - progressValue * duration;
    }

    requestAnimationFrame(tick);
  };

  const updateToggleState = () => {
    toggle.setAttribute("aria-pressed", String(autoPlay));
    toggle.setAttribute("data-state", autoPlay ? "play" : "pause");
    toggle.setAttribute("aria-label", autoPlay ? "Pause autoplay" : "Play autoplay");
  };

  const toggleAutoPlay = () => {
    autoPlay = !autoPlay;
    updateToggleState();
    startTime = performance.now() - progressValue * duration;
  };

  carousel.addEventListener("scroll", () => {
    requestAnimationFrame(onScroll);
  }, { passive: true });

  window.addEventListener("resize", () => {
    updateControlsOffset();
  });

  toggle.addEventListener("click", toggleAutoPlay);

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      goToIndex(index);
    });
  });

  cards.forEach((card, index) => {
    const project = projects[index];
    const url = project && project.url ? project.url : "";
    if (!url) return;
    const openLink = () => {
      window.open(url, "_blank", "noopener");
    };

    card.addEventListener("click", () => {
      if (isUserScrolling) return;
      openLink();
    });

    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLink();
      }
    });
  });

  updateDots(activeIndex);
  updateCardTransforms();
  setProgress(0);
  scrollToCard(activeIndex, "auto");
  updateControlsOffset();

  if (!prefersReducedMotion) {
    requestAnimationFrame(tick);
  } else {
    autoPlay = false;
    updateToggleState();
  }

  updateToggleState();

  const observer = new IntersectionObserver(
    ([entry]) => {
      controls.classList.toggle("is-hidden", !entry.isIntersecting);
    },
    { threshold: 0.25 }
  );
  observer.observe(section);
};
