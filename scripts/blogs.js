import { initEditorialFeed } from "./editorial-feed.js";

export const initBlogs = () =>
  initEditorialFeed({
    directory: "data/blogs",
    indexUrl: "data/blogs/index.json",
    postUrl: "blog.html",
    sectionSelector: ".blogs-section",
    heroSelector: "[data-blogs-hero]",
    gridSelector: "[data-blogs-grid]",
    loadMoreSelector: "[data-blogs-load-more]",
    defaultKind: "Blog",
  });
