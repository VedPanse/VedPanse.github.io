import { initIconBand } from "./icon-band.js?v=repo-refactor";
import { initContent } from "./content.js";
import { initWorkSection, initWorkExperience } from "./work.js?v=repo-refactor";
import { initProjectsCarousel } from "./projects.js?v=project-back-scroll";
import { initProjectIconPyramid } from "./project-icon-pyramid.js?v=manifest-only";
import { initNavHighlight, initNavMenu } from "./nav.js";
import { initResearch } from "./research.js?v=no-editorial-motion";
import { initBlogs } from "./blogs.js?v=no-editorial-motion";
import { initContactForm } from "./contact.js?v=contact-protection";
import { initSearchOverlay } from "./search.js";
import { initializeTheme } from "./theme.js";
import "./footer.js";

class PortfolioApplication {
  constructor() {
    this.initializers_ = [
      initContent,
      initIconBand,
      initWorkSection,
      initWorkExperience,
      initProjectIconPyramid,
      initProjectsCarousel,
      initNavHighlight,
      initNavMenu,
      initResearch,
      initBlogs,
      initContactForm,
      initializeTheme,
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
