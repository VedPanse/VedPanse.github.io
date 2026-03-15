import { JsonRepository } from "./core/json-repository.js";

const CONTENT_URL = "data/content.json";

/**
 * @typedef {Record<string, string>} SiteContent
 */

class ContentRepository extends JsonRepository {
  constructor() {
    super(CONTENT_URL);
  }

  /**
   * @return {Promise<SiteContent>}
   */
  async loadContent() {
    const content = await this.load();
    if (!content || typeof content !== "object" || Array.isArray(content)) {
      return {};
    }
    return /** @type {SiteContent} */ (content);
  }
}

class ContentBinder {
  constructor() {
    this.targets_ = Array.from(document.querySelectorAll("[data-content]"));
  }

  /**
   * @param {SiteContent} content
   */
  bind(content) {
    this.targets_.forEach((element) => {
      const key = element.getAttribute("data-content");
      if (!key || !(key in content)) {
        return;
      }
      element.textContent = content[key];
    });
  }
}

class ContentController {
  constructor(repository, binder) {
    this.repository_ = repository;
    this.binder_ = binder;
  }

  async initialize() {
    const content = await this.repository_.loadContent();
    this.binder_.bind(content);
  }
}

export const initContent = async () => {
  const controller = new ContentController(
    new ContentRepository(),
    new ContentBinder()
  );
  await controller.initialize();
};
