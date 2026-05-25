/**
 * @template T
 */
export class JsonRepository {
  /**
   * @param {string} resourceUrl
   * @param {RequestInit=} fetchOptions
   */
  constructor(resourceUrl, fetchOptions = {}) {
    this.resourceUrl_ = resourceUrl;
    this.fetchOptions_ = fetchOptions;
    this.loadPromise_ = null;
  }

  /**
   * @return {Promise<T|null>}
   */
  async load() {
    if (this.loadPromise_) {
      return this.loadPromise_;
    }

    this.loadPromise_ = this.fetch_();
    return this.loadPromise_;
  }

  async fetch_() {
    const response = await fetch(this.resourceUrl_, this.fetchOptions_);
    if (!response.ok) {
      return null;
    }
    return /** @type {Promise<T>} */ (response.json());
  }
}
