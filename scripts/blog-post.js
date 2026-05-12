import { initPostPage } from "./post-page.js?v=repo-refactor";
import "./footer.js";

initPostPage({
  directory: "data/blogs",
  indexUrl: "data/blogs/index.json",
  defaultLabel: "Blog",
  fallbackTitle: "Blog Post",
  titleSuffix: "Ved Panse",
  postUrl: "blog.html",
  topicBrowseHref: "index.html#blogs",
  topicAriaLabel: (topic) => `Browse ${topic} posts`,
  enableCopyPage: true,
});
