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
  const links = Array.from(
    document.querySelectorAll(".nav-links a[href^=\"#\"], .nav-drawer-links a[href^=\"#\"]")
  );
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

export const initNavMenu = () => {
  const toggle = document.querySelector("[data-nav-toggle]");
  const drawer = document.querySelector("[data-nav-drawer]");
  if (!toggle || !drawer) return;

  const root = document.documentElement;

  const closeMenu = () => {
    root.classList.remove("is-nav-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    drawer.setAttribute("aria-hidden", "true");
  };

  const openMenu = () => {
    root.classList.add("is-nav-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close menu");
    drawer.setAttribute("aria-hidden", "false");
  };

  toggle.addEventListener("click", () => {
    if (root.classList.contains("is-nav-open")) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  drawer.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 840) closeMenu();
  });
};
