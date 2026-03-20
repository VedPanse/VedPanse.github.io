import { initIconBand } from "./icon-band.js";
import { initContent } from "./content.js";
import { initWorkSection, initWorkExperience } from "./work.js";
import { initProjectsCarousel } from "./projects.js";
import { initNavHighlight, initNavMenu } from "./nav.js";
import { initResearch } from "./research.js";
import { initBlogs } from "./blogs.js";
import { initContactForm } from "./contact.js";
import { initSearchOverlay } from "./search.js";
import "./footer.js";

class ThemeController {
  constructor() {
    this.toggle_ = document.querySelector("[data-theme-toggle]");
    this.root_ = document.documentElement;
    this.metaTheme_ = document.querySelector('meta[name="theme-color"]');
  }

  initialize() {
    if (!this.toggle_) {
      return;
    }

    const storedTheme = localStorage.getItem("theme");
    const initialTheme = storedTheme || "light";
    this.applyTheme_(initialTheme);
    this.toggle_.addEventListener("click", () => {
      const nextTheme = this.root_.dataset.theme === "light" ? "dark" : "light";
      this.applyTheme_(nextTheme);
    });
  }

  /**
   * @param {string} theme
   */
  applyTheme_(theme) {
    if (!this.toggle_) {
      return;
    }

    this.root_.dataset.theme = theme;
    localStorage.setItem("theme", theme);
    const isLight = theme === "light";
    this.toggle_.setAttribute("aria-pressed", String(isLight));
    this.toggle_.setAttribute(
      "aria-label",
      isLight ? "Switch to dark theme" : "Switch to light theme"
    );
    if (this.metaTheme_) {
      this.metaTheme_.setAttribute("content", isLight ? "#f5f5f7" : "#000000");
    }
  }
}

class PortfolioApplication {
  constructor() {
    this.initializers_ = [
      initContent,
      initIconBand,
      initWorkSection,
      initWorkExperience,
      initProjectsCarousel,
      initNavHighlight,
      initNavMenu,
      initResearch,
      initBlogs,
      initContactForm,
      () => new ThemeController().initialize(),
      initSearchOverlay,
    ];
  }

  async bootstrap() {
    for (const initialize of this.initializers_) {
      await initialize();
    }
  }
}

const application = new PortfolioApplication();
application.bootstrap();
