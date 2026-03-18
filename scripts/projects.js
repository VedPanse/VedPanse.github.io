import { DomFactory } from "./core/dom-factory.js";
import { JsonRepository } from "./core/json-repository.js";

const PROJECTS_URL = "data/projects.json";
const STACK_COLUMNS = 3;
const AUTOPLAY_DURATION_MS = 10000;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

/**
 * @typedef {{
 *   accent?: string,
 *   description?: string,
 *   details?: string,
 *   longTitle?: string,
 *   name?: string,
 *   stack?: Array<{label?: string, src: string}>,
 *   url?: string
 * }} Project
 */

class ProjectsRepository extends JsonRepository {
  constructor() {
    super(PROJECTS_URL);
  }

  /**
   * @return {Promise<Array<Project>>}
   */
  async loadProjects() {
    const response = await fetch(PROJECTS_URL, { cache: "no-store" });
    if (!response.ok) {
      return [];
    }
    const data = await response.json();
    if (!data || typeof data !== "object" || !Array.isArray(data.projects)) {
      return [];
    }
    return /** @type {Array<Project>} */ (data.projects);
  }
}

class ProjectCardRenderer {
  /**
   * @param {Array<{label?: string, src: string}>} stack
   * @return {Array<Array<{label?: string, src: string}>>}
   */
  buildStackColumns_(stack) {
    const columns = Array.from({ length: STACK_COLUMNS }, () => []);
    stack.forEach((item, index) => {
      columns[index % STACK_COLUMNS].push(item);
    });
    return columns;
  }

  /**
   * @param {Array<{label?: string, src: string}>} stack
   * @return {HTMLElement}
   */
  createBackStackIcons_(stack) {
    const wrap = DomFactory.createElement("div", "project-back-stack-icons");
    stack.forEach((item) => {
      const icon = DomFactory.createElement("div", "app-icon");
      const image = document.createElement("img");
      image.src = item.src;
      image.alt = item.label || "Technology icon";
      image.loading = "lazy";
      icon.appendChild(image);
      wrap.appendChild(icon);
    });
    return wrap;
  }

  /**
   * @param {Project} project
   * @return {HTMLElement}
   */
  render(project) {
    const card = DomFactory.createElement("article", "project-card");
    card.setAttribute("data-project", "");
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    card.setAttribute("aria-expanded", "false");

    const rotator = DomFactory.createElement("div", "project-card-rotator");
    const front = DomFactory.createElement("div", "project-card-face project-card-face--front");
    const back = DomFactory.createElement("div", "project-card-face project-card-face--back");

    const inner = DomFactory.createElement("div", "project-card-inner");
    if (project.accent) {
      inner.style.setProperty("--project-accent", project.accent);
    }

    const meta = DomFactory.createElement("div", "project-meta");
    const heading = DomFactory.createElement("h3");
    const highlight = DomFactory.createElement("span", "project-highlight");
    highlight.textContent = project.name || "Project";
    heading.appendChild(highlight);
    heading.appendChild(document.createTextNode(` ${project.description || ""}`));
    meta.appendChild(heading);

    const stack = DomFactory.createElement("div", "project-stack");
    stack.setAttribute("aria-label", "Tech stack");
    const band = DomFactory.createElement("div", "project-icon-band");
    const columnsWrap = DomFactory.createElement("div", "project-icon-columns");
    const columns = this.buildStackColumns_(project.stack || []);

    columns.forEach((columnItems) => {
      const column = DomFactory.createElement("div", "project-icon-column");
      columnItems.forEach((item) => {
        const icon = DomFactory.createElement("div", "app-icon");
        const image = document.createElement("img");
        image.src = item.src;
        image.alt = item.label || "Technology icon";
        image.loading = "lazy";
        icon.appendChild(image);
        column.appendChild(icon);
      });
      columnsWrap.appendChild(column);
    });

    band.appendChild(columnsWrap);
    stack.appendChild(band);
    inner.appendChild(meta);
    inner.appendChild(stack);
    front.appendChild(inner);

    const backContent = DomFactory.createElement("div", "project-card-back");
    const backTitle = DomFactory.createElement("h3", "project-back-title");
    const fallbackTitle = project.name
      ? `${project.name} delivers a full-stack, production-ready experience.`
      : "Project details";
    backTitle.textContent = project.longTitle || fallbackTitle;

    const backDescription = DomFactory.createElement("p", "project-back-description");
    backDescription.textContent =
      project.details || project.description || "Project details are coming soon.";

    const backStack = this.createBackStackIcons_(project.stack || []);

    const backActions = DomFactory.createElement("div", "project-back-actions");
    const backLink = this.createBackLink_(project);
    backActions.appendChild(backLink);
    backContent.appendChild(backStack);
    backContent.appendChild(backTitle);
    backContent.appendChild(backDescription);
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
  }

  /**
   * @param {Project} project
   * @return {HTMLAnchorElement|HTMLButtonElement}
   */
  createBackLink_(project) {
    if (project.url) {
      const link = document.createElement("a");
      link.href = project.url;
      link.target = "_blank";
      link.rel = "noopener";
      link.className = "project-back-link";
      link.textContent = "View project";
      return link;
    }

    const button = document.createElement("button");
    button.type = "button";
    button.className = "project-back-link is-disabled";
    button.textContent = "Coming soon";
    button.disabled = true;
    return button;
  }
}

class ProjectsCarousel {
  /**
   * @param {HTMLElement} section
   * @param {Array<Project>} projects
   * @param {ProjectCardRenderer} cardRenderer
   */
  constructor(section, projects, cardRenderer) {
    this.section_ = section;
    this.projects_ = projects;
    this.cardRenderer_ = cardRenderer;
    this.carousel_ = section.querySelector(".projects-carousel");
    this.dotsContainer_ = section.querySelector(".projects-dots");
    this.toggle_ = section.querySelector("[data-carousel-toggle]");
    this.controls_ = section.querySelector(".projects-controls");
    this.prefersReducedMotion_ = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.activeIndex_ = 0;
    this.autoPlay_ = !this.prefersReducedMotion_;
    this.isUserScrolling_ = false;
    this.scrollTimeout_ = 0;
    this.startTime_ = performance.now();
    this.progressValue_ = 0;
    this.autoPlayBeforeFlip_ = this.autoPlay_;
    this.cards_ = [];
    this.dots_ = [];
    this.activeCard_ = null;
  }

  /**
   * @return {boolean}
   */
  canInitialize() {
    return Boolean(this.carousel_ && this.dotsContainer_ && this.toggle_ && this.controls_);
  }

  initialize() {
    if (!this.canInitialize() || !this.projects_.length) {
      return;
    }

    this.render_();
    this.bindEvents_();
    this.updateDots_(this.activeIndex_);
    this.updateCardTransforms_();
    this.setProgress_(0);
    this.scrollToCard_(this.activeIndex_, "auto");
    this.updateControlsOffset_();

    if (!this.prefersReducedMotion_) {
      requestAnimationFrame((time) => this.tick_(time));
    } else {
      this.autoPlay_ = false;
    }

    this.updateToggleState_();
    this.observeVisibility_();
  }

  render_() {
    this.cards_ = this.projects_.map((project) => this.cardRenderer_.render(project));
    this.carousel_.innerHTML = "";
    this.cards_.forEach((card) => this.carousel_.appendChild(card));
    this.renderDots_();
    this.dots_ = Array.from(this.section_.querySelectorAll(".projects-dot"));
    this.activeCard_ = this.cards_[0] || null;
  }

  renderDots_() {
    this.dotsContainer_.innerHTML = "";
    for (let index = 0; index < this.projects_.length; index += 1) {
      const dot = DomFactory.createElement("button", "projects-dot");
      dot.type = "button";
      dot.setAttribute("aria-label", `Go to project ${index + 1}`);
      if (index === 0) {
        dot.classList.add("is-active");
      }
      dot.appendChild(DomFactory.createElement("span", "projects-dot-fill"));
      this.dotsContainer_.appendChild(dot);
    }
  }

  bindEvents_() {
    this.carousel_.addEventListener(
      "scroll",
      () => {
        requestAnimationFrame(() => this.onScroll_());
      },
      { passive: true }
    );

    window.addEventListener("resize", () => {
      this.updateControlsOffset_();
    });

    window.addEventListener(
      "scroll",
      () => {
        requestAnimationFrame(() => this.updateControlsOffset_());
      },
      { passive: true }
    );

    this.toggle_.addEventListener("click", () => this.toggleAutoPlay_());
    this.dots_.forEach((dot, index) => {
      dot.addEventListener("click", () => this.goToIndex_(index));
    });
    this.cards_.forEach((card) => this.bindCardEvents_(card));
  }

  /**
   * @param {HTMLElement} card
   */
  bindCardEvents_(card) {
    const closeButton = card.querySelector(".project-back-close");
    const backLink = card.querySelector(".project-back-link");

    const setCardState = (shouldFlip, focusClose = false) => {
      card.classList.toggle("is-flipped", shouldFlip);
      card.setAttribute("aria-expanded", String(shouldFlip));
      if (shouldFlip && focusClose && closeButton instanceof HTMLElement) {
        closeButton.focus();
      }
      this.updateGlobalFlipState_();
    };

    if (closeButton) {
      closeButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        setCardState(false);
      });
    }

    if (backLink instanceof HTMLAnchorElement) {
      backLink.addEventListener("click", (event) => {
        event.stopPropagation();
      });
    }

    card.addEventListener("click", (event) => {
      if (this.isUserScrolling_) {
        return;
      }
      if (event.target.closest(".project-back-link")) {
        return;
      }
      if (event.target.closest(".project-back-close")) {
        return;
      }
      if (card.classList.contains("is-flipped")) {
        return;
      }
      setCardState(true, true);
    });

    card.addEventListener("keydown", (event) => {
      if (event.target !== card) {
        return;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        setCardState(false);
        return;
      }
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        const shouldOpen = !card.classList.contains("is-flipped");
        setCardState(shouldOpen, shouldOpen);
      }
    });
  }

  onScroll_() {
    if (this.scrollTimeout_) {
      window.clearTimeout(this.scrollTimeout_);
    }
    this.isUserScrolling_ = true;
    this.updateActiveFromScroll_();
    this.updateCardTransforms_();
    this.updateControlsOffset_();
    this.scrollTimeout_ = window.setTimeout(() => {
      this.isUserScrolling_ = false;
      this.startTime_ = performance.now();
    }, 160);
  }

  updateActiveFromScroll_() {
    const center = this.carousel_.scrollLeft + this.carousel_.clientWidth / 2;
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    this.cards_.forEach((card, index) => {
      const cardCenter = card.offsetLeft + card.clientWidth / 2;
      const distance = Math.abs(center - cardCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    if (closestIndex === this.activeIndex_) {
      return;
    }

    this.activeIndex_ = closestIndex;
    this.activeCard_ = this.cards_[this.activeIndex_] || null;
    this.updateDots_(this.activeIndex_);
    this.setProgress_(0);
    this.startTime_ = performance.now();
  }

  updateCardTransforms_() {
    const center = this.carousel_.scrollLeft + this.carousel_.clientWidth / 2;
    this.cards_.forEach((card) => {
      const cardCenter = card.offsetLeft + card.clientWidth / 2;
      const distance = Math.abs(center - cardCenter);
      const ratio = clamp(distance / (this.carousel_.clientWidth * 0.6), 0, 1);
      const scale = 1 - ratio * 0.08;
      const lift = 24 * ratio;
      const opacity = 1 - ratio * 0.35;
      card.style.setProperty("--card-scale", scale.toFixed(3));
      card.style.setProperty("--card-lift", `${lift.toFixed(2)}px`);
      card.style.setProperty("--card-opacity", opacity.toFixed(3));
    });
  }

  updateControlsOffset_() {
    if (!this.activeCard_) {
      this.controls_.classList.remove("is-pinned");
      return;
    }

    this.controls_.style.removeProperty("transform");
    const carouselRect = this.carousel_.getBoundingClientRect();
    const sectionRect = this.section_.getBoundingClientRect();
    const pinOffset = 24;
    const shouldPin = carouselRect.top + carouselRect.height * 0.5 <= 0;
    const canRemainInSection = sectionRect.bottom > window.innerHeight - pinOffset;
    this.controls_.classList.toggle("is-pinned", shouldPin && canRemainInSection);
  }

  /**
   * @param {number} index
   * @param {ScrollBehavior} behavior
   */
  scrollToCard_(index, behavior) {
    const card = this.cards_[index];
    if (!card) {
      return;
    }
    const left = card.offsetLeft - (this.carousel_.clientWidth - card.clientWidth) / 2;
    this.carousel_.scrollTo({ left, behavior });
  }

  goNext_() {
    const nextIndex = (this.activeIndex_ + 1) % this.cards_.length;
    this.scrollToCard_(nextIndex, nextIndex === 0 ? "auto" : "smooth");
  }

  /**
   * @param {number} index
   */
  goToIndex_(index) {
    this.activeIndex_ = clamp(index, 0, this.cards_.length - 1);
    this.activeCard_ = this.cards_[this.activeIndex_] || null;
    this.updateDots_(this.activeIndex_);
    this.setProgress_(0);
    this.startTime_ = performance.now();
    this.scrollToCard_(this.activeIndex_, "smooth");
  }

  /**
   * @param {number} value
   */
  setProgress_(value) {
    this.progressValue_ = clamp(value, 0, 1);
    this.section_.style.setProperty("--carousel-progress", this.progressValue_.toFixed(4));
  }

  /**
   * @param {number} index
   */
  updateDots_(index) {
    this.dots_.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === index);
    });
  }

  updateToggleState_() {
    this.toggle_.setAttribute("aria-pressed", String(this.autoPlay_));
    this.toggle_.setAttribute("data-state", this.autoPlay_ ? "play" : "pause");
    this.toggle_.setAttribute(
      "aria-label",
      this.autoPlay_ ? "Pause autoplay" : "Play autoplay"
    );
  }

  toggleAutoPlay_() {
    this.autoPlay_ = !this.autoPlay_;
    this.updateToggleState_();
    this.startTime_ = performance.now() - this.progressValue_ * AUTOPLAY_DURATION_MS;
  }

  updateGlobalFlipState_() {
    const anyFlipped = this.section_.querySelector(".project-card.is-flipped");
    const isFlipped = Boolean(anyFlipped);
    document.documentElement.classList.toggle("is-card-flipped", isFlipped);
    if (isFlipped) {
      this.autoPlayBeforeFlip_ = this.autoPlay_;
      this.autoPlay_ = false;
    } else {
      this.autoPlay_ = this.autoPlayBeforeFlip_;
    }
    this.updateToggleState_();
    this.startTime_ = performance.now() - this.progressValue_ * AUTOPLAY_DURATION_MS;
  }

  /**
   * @param {number} time
   */
  tick_(time) {
    if (this.autoPlay_ && !this.isUserScrolling_) {
      const elapsed = time - this.startTime_;
      const nextProgress = elapsed / AUTOPLAY_DURATION_MS;
      if (nextProgress >= 1) {
        this.setProgress_(1);
        this.goNext_();
        this.setProgress_(0);
        this.startTime_ = time;
      } else {
        this.setProgress_(nextProgress);
      }
    } else {
      this.startTime_ = time - this.progressValue_ * AUTOPLAY_DURATION_MS;
    }

    requestAnimationFrame((frameTime) => this.tick_(frameTime));
  }

  observeVisibility_() {
    const controlsObserver = new IntersectionObserver(
      ([entry]) => {
        this.controls_.classList.toggle("is-hidden", !entry.isIntersecting);
      },
      { threshold: 0.25 }
    );
    controlsObserver.observe(this.section_);

    const marqueeObserver = new IntersectionObserver(
      ([entry]) => {
        document.documentElement.classList.toggle("is-projects-in-view", entry.isIntersecting);
      },
      { threshold: 0.25 }
    );
    marqueeObserver.observe(this.section_);
  }
}

export const initProjectsCarousel = async () => {
  const section = document.querySelector(".projects-section");
  if (!section) {
    return;
  }

  const repository = new ProjectsRepository();
  const projects = await repository.loadProjects();
  const carousel = new ProjectsCarousel(section, projects, new ProjectCardRenderer());
  carousel.initialize();
};
