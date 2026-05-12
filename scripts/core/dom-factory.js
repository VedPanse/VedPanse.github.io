/**
 * @param {string} tagName
 * @param {string=} className
 * @return {HTMLElement}
 */
export const createElement = (tagName, className = "") => {
  const element = document.createElement(tagName);
  if (className) {
    element.className = className;
  }
  return element;
};

export class DomFactory {
  /**
   * @param {string} tagName
   * @param {string=} className
   * @return {HTMLElement}
   */
  static createElement(tagName, className = "") {
    return createElement(tagName, className);
  }
}
