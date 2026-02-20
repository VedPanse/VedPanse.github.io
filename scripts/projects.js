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
  card.setAttribute("tabindex", "0");
  card.setAttribute("role", "button");
  card.setAttribute("aria-expanded", "false");

  const rotator = createElement("div", "project-card-rotator");
  const front = createElement("div", "project-card-face project-card-face--front");
  const back = createElement("div", "project-card-face project-card-face--back");

  const inner = createElement("div", "project-card-inner");
  if (project.accent) {
    inner.style.setProperty("--project-accent", project.accent);
  }

  const meta = createElement("div", "project-meta");
  const heading = createElement("h3");
  const highlight = createElement("span", "project-highlight");
  highlight.textContent = project.name || "Project";
  heading.appendChild(highlight);
  meta.appendChild(heading);

  const summary = createElement("p");
  summary.textContent = project.description || "Project details are coming soon.";
  meta.appendChild(summary);

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
  front.appendChild(inner);

  const backContent = createElement("div", "project-card-back");
  const backTitle = createElement("h3", "project-back-title");
  const fallbackTitle = project.name
    ? `${project.name} delivers a full-stack, production-ready experience.`
    : "Project details";
  backTitle.textContent = project.longTitle || fallbackTitle;

  const backDescription = createElement("p", "project-back-description");
  backDescription.textContent = project.details
    ? project.details
    : project.description || "Project details are coming soon.";

  const stackLabels = (project.stack || [])
    .map((item) => item.label)
    .filter(Boolean);

  const backStack = createElement("p", "project-back-stack");
  backStack.textContent = stackLabels.length
    ? `Stack: ${stackLabels.join(", ")}.`
    : "Stack details are coming soon.";

  const backActions = createElement("div", "project-back-actions");
  let backLink;

  if (project.url) {
    backLink = document.createElement("a");
    backLink.href = project.url;
    backLink.target = "_blank";
    backLink.rel = "noopener";
    backLink.className = "project-back-link";
    backLink.textContent = "View project";
  } else {
    backLink = document.createElement("button");
    backLink.type = "button";
    backLink.className = "project-back-link is-disabled";
    backLink.textContent = "Coming soon";
    backLink.disabled = true;
  }

  backActions.appendChild(backLink);
  backContent.appendChild(backTitle);
  backContent.appendChild(backDescription);
  backContent.appendChild(backStack);
  backContent.appendChild(backActions);

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.className = "project-back-close";
  closeButton.setAttribute("aria-label", "Close project details");

  back.appendChild(backContent);
  back.appendChild(closeButton);

  rotator.appendChild(front);
  rotator.appendChild(back);
  card.appendChild(rotator);
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
  let autoPlayBeforeFlip = autoPlay;

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

  const updateGlobalFlipState = () => {
    const anyFlipped = section.querySelector(".project-card.is-flipped");
    const isFlipped = Boolean(anyFlipped);
    document.documentElement.classList.toggle("is-card-flipped", isFlipped);
    if (isFlipped) {
      autoPlayBeforeFlip = autoPlay;
      autoPlay = false;
    } else {
      autoPlay = autoPlayBeforeFlip;
    }
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

  cards.forEach((card) => {
    const closeButton = card.querySelector(".project-back-close");
    const backLink = card.querySelector(".project-back-link");

    const setCardState = (shouldFlip, focusClose = false) => {
      card.classList.toggle("is-flipped", shouldFlip);
      card.setAttribute("aria-expanded", String(shouldFlip));
      if (shouldFlip && focusClose && closeButton) {
        closeButton.focus();
      }
      updateGlobalFlipState();
    };

    const openCard = () => setCardState(true, true);
    const closeCard = () => setCardState(false);

    if (closeButton) {
      closeButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        closeCard();
      });
    }

    if (backLink && backLink.tagName === "A") {
      backLink.addEventListener("click", (event) => {
        event.stopPropagation();
      });
    }

    card.addEventListener("click", (event) => {
      if (isUserScrolling) return;
      if (event.target.closest(".project-back-link")) return;
      if (event.target.closest(".project-back-close")) return;
      if (card.classList.contains("is-flipped")) return;
      openCard();
    });

    card.addEventListener("keydown", (event) => {
      if (event.target !== card) return;
      if (event.key === "Escape") {
        event.preventDefault();
        closeCard();
        return;
      }
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        const shouldOpen = !card.classList.contains("is-flipped");
        setCardState(shouldOpen, shouldOpen);
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

  const marqueeObserver = new IntersectionObserver(
    ([entry]) => {
      document.documentElement.classList.toggle("is-projects-in-view", entry.isIntersecting);
    },
    { threshold: 0.25 }
  );
  marqueeObserver.observe(section);
};
