import { initIconBand } from "./icon-band.js";
import { initContent } from "./content.js";
import { initWorkSection } from "./work.js";
import { initProjectsCarousel } from "./projects.js";
import { initNavHighlight } from "./nav.js";
import { initResearch } from "./research.js";
import { initBlogs } from "./blogs.js";
import { initContactForm } from "./contact.js";

const initThemeToggle = () => {
  const toggle = document.querySelector("[data-theme-toggle]");
  if (!toggle) return;

  const root = document.documentElement;
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  const storedTheme = localStorage.getItem("theme");
  const initialTheme = storedTheme || "dark";

  const applyTheme = (theme) => {
    root.dataset.theme = theme;
    localStorage.setItem("theme", theme);
    const isLight = theme === "light";
    toggle.setAttribute("aria-pressed", String(isLight));
    toggle.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
    if (metaTheme) {
      metaTheme.setAttribute("content", isLight ? "#f5f5f7" : "#000000");
    }
  };

  applyTheme(initialTheme);

  toggle.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "light" ? "dark" : "light";
    applyTheme(nextTheme);
  });
};

const bootstrap = () => {
  initContent();
  initIconBand();
  initWorkSection();
  initProjectsCarousel();
  initNavHighlight();
  initResearch();
  initBlogs();
  initContactForm();
  initThemeToggle();
};

bootstrap();
