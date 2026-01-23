const toggleOverlay = (overlay, open) => {
  overlay.classList.toggle("is-open", open);
  overlay.setAttribute("aria-hidden", String(!open));
};

export const initSearchOverlay = () => {
  const overlay = document.querySelector("[data-search-overlay]");
  if (!overlay) return;

  const openButton = document.querySelector("[data-search-toggle]");
  const closeButton = overlay.querySelector("[data-search-close]");
  const input = overlay.querySelector("[data-search-input]");

  if (!openButton || !input) return;

  const open = () => {
    toggleOverlay(overlay, true);
    document.body.classList.add("is-search-open");
    input.focus();
  };

  const close = () => {
    toggleOverlay(overlay, false);
    document.body.classList.remove("is-search-open");
    input.value = "";
  };

  openButton.addEventListener("click", open);
  if (closeButton) {
    closeButton.addEventListener("click", close);
  }
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) close();
  });
  document.addEventListener("click", (event) => {
    if (!overlay.classList.contains("is-open")) return;
    if (openButton.contains(event.target)) return;
    if (overlay.contains(event.target) && overlay.querySelector(".search-panel")?.contains(event.target)) return;
    close();
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      open();
    }
  });
};
