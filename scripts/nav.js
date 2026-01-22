const buildSectionMap = (links) => {
  const map = new Map();
  links.forEach((link) => {
    const hash = link.getAttribute("href");
    if (!hash || !hash.startsWith("#")) return;
    const target = document.querySelector(hash);
    if (!target) return;
    map.set(target, link);
  });
  return map;
};

const setActiveLink = (links, activeLink) => {
  links.forEach((link) => {
    link.classList.toggle("is-active", link === activeLink);
  });
};

export const initNavHighlight = () => {
  const links = Array.from(document.querySelectorAll(".nav-links a[href^=\"#\"]"));
  if (!links.length) return;

  const sectionMap = buildSectionMap(links);
  const targets = Array.from(sectionMap.keys());
  if (!targets.length) return;

  const entries = new Map();
  const observer = new IntersectionObserver(
    (observed) => {
      observed.forEach((entry) => {
        entries.set(entry.target, entry);
      });

      let bestEntry = null;
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        if (!bestEntry || entry.intersectionRatio > bestEntry.intersectionRatio) {
          bestEntry = entry;
        }
      });

      if (!bestEntry) return;
      const activeLink = sectionMap.get(bestEntry.target);
      if (activeLink) setActiveLink(links, activeLink);
    },
    {
      rootMargin: "-20% 0px -50% 0px",
      threshold: [0, 0.25, 0.5, 0.75, 1],
    }
  );

  targets.forEach((target) => observer.observe(target));

  const onHashChange = () => {
    const current = links.find((link) => link.getAttribute("href") === window.location.hash);
    if (current) setActiveLink(links, current);
  };

  window.addEventListener("hashchange", onHashChange);
  onHashChange();
};
