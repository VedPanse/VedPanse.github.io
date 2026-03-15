export class DomFactory {
  /**
   * @param {string} tagName
   * @param {string=} className
   * @return {HTMLElement}
   */
  static createElement(tagName, className = "") {
    const element = document.createElement(tagName);
    if (className) {
      element.className = className;
    }
    return element;
  }
}
