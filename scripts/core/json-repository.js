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
  }

  /**
   * @return {Promise<T|null>}
   */
  async load() {
    const response = await fetch(this.resourceUrl_, this.fetchOptions_);
    if (!response.ok) {
      return null;
    }
    return /** @type {Promise<T>} */ (response.json());
  }
}
