import { initPostPage } from "./post-page.js";
import "./footer.js";

initPostPage({
  directory: "data/work-blogs",
  indexUrl: "data/work-blogs/index.json",
  defaultLabel: "Work Blog",
  fallbackTitle: "Work Blog Post",
  titleSuffix: "Ved Panse",
  postUrl: "work-blog.html",
  topicBrowseHref: "index.html#work",
  topicAriaLabel: (topic) => `Browse ${topic} work blog posts`,
});
