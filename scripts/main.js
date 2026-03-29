import { initIconBand } from "./icon-band.js";
import { initContent } from "./content.js";
import { initWorkSection, initWorkExperience } from "./work.js";
import { initProjectsCarousel } from "./projects.js";
import { initNavHighlight, initNavMenu } from "./nav.js";
import { initResearch } from "./research.js";
import { initBlogs } from "./blogs.js";
import { initContactForm } from "./contact.js";
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
