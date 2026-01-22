import { initIconBand } from "./icon-band.js";
import { initContent } from "./content.js";
import { initWorkSection } from "./work.js";
import { initProjectsCarousel } from "./projects.js";
import { initNavHighlight } from "./nav.js";
import { initResearch } from "./research.js";

const bootstrap = () => {
  initContent();
  initIconBand();
  initWorkSection();
  initProjectsCarousel();
  initNavHighlight();
  initResearch();
};

bootstrap();
