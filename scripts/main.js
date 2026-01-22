import { initIconBand } from "./icon-band.js";
import { initContent } from "./content.js";
import { initWorkSection } from "./work.js";
import { initProjectsCarousel } from "./projects.js";

const bootstrap = () => {
  initContent();
  initIconBand();
  initWorkSection();
  initProjectsCarousel();
};

bootstrap();
