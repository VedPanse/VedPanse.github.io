/**
 * @template T
 */
export class JsonRepository {
  /**
   * @param {string} resourceUrl
   */
  constructor(resourceUrl) {
    this.resourceUrl_ = resourceUrl;
  }

  /**
   * @return {Promise<T|null>}
   */
  async load() {
    const response = await fetch(this.resourceUrl_);
    if (!response.ok) {
      return null;
    }
    return /** @type {Promise<T>} */ (response.json());
  }
}
