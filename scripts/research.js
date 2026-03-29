import { initEditorialFeed } from "./editorial-feed.js";

export const initResearch = () =>
  initEditorialFeed({
    directory: "data/research",
    indexUrl: "data/research/index.json",
    postUrl: "research.html",
    sectionSelector: ".research-section",
    heroSelector: "[data-research-hero]",
    gridSelector: "[data-research-grid]",
    loadMoreSelector: "[data-research-load-more]",
    defaultKind: "Research",
  });
