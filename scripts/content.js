const CONTENT_URL = "data/content.json";

const applyContent = (content) => {
  const targets = document.querySelectorAll("[data-content]");
  targets.forEach((element) => {
    const key = element.getAttribute("data-content");
    if (!key || !(key in content)) return;
    element.textContent = content[key];
  });
};

export const initContent = async () => {
  const response = await fetch(CONTENT_URL);
  if (!response.ok) return;
  const content = await response.json();
  if (!content || typeof content !== "object") return;
  applyContent(content);
};
