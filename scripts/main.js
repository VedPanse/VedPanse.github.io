import { initIconBand } from "./icon-band.js";
import { initContent } from "./content.js";
import { initWorkSection } from "./work.js";

const bootstrap = () => {
  initContent();
  initIconBand();
  initWorkSection();
};

bootstrap();
