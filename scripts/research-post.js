import { initPostPage } from "./post-page.js";
import "./footer.js";

initPostPage({
  directory: "data/research",
  indexUrl: "data/research/index.json",
  defaultLabel: "Research",
  fallbackTitle: "Research Post",
  titleSuffix: "Ved Panse",
  postUrl: "research.html",
  topicBrowseHref: "index.html#research",
  topicAriaLabel: (topic) => `Browse ${topic} research posts`,
});
