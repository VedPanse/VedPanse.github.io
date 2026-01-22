const RESEARCH_URL = "data/research.json";

const createElement = (tag, className) => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  return element;
};

const loadResearch = async () => {
  const response = await fetch(RESEARCH_URL);
  if (!response.ok) return [];
  const data = await response.json();
  return Array.isArray(data.items) ? data.items : [];
};

const renderItem = (item) => {
  const article = createElement("article", "research-item");

  const media = createElement("div", "research-media research-media--icon");
  media.setAttribute("aria-hidden", "true");
  const img = document.createElement("img");
  img.src = item.image || "";
  img.alt = "";
  img.loading = "lazy";
  media.appendChild(img);

  const content = createElement("div", "research-content");
  const label = createElement("span", "research-label");
  label.textContent = item.label || "";
  const title = document.createElement("h3");
  title.textContent = item.title || "";
  const date = createElement("p", "research-date");
  date.textContent = item.date || "";

  content.appendChild(label);
  content.appendChild(title);
  content.appendChild(date);

  article.appendChild(media);
  article.appendChild(content);
  return article;
};

export const initResearch = async () => {
  const grid = document.querySelector("[data-research-grid]");
  if (!grid) return;

  const items = await loadResearch();
  if (!items.length) return;

  grid.innerHTML = "";
  items.forEach((item, index) => {
    grid.appendChild(renderItem(item));
    if (index === 1 && items.length > 2) {
      grid.appendChild(createElement("div", "research-divider"));
    }
  });
};
