const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const easeOutCubic = (value) => 1 - ((1 - value) ** 3);

const setMotionVariable = (section, name, value) => {
  section.style.setProperty(name, value);
};

export const initEditorialMotion = (section, heroRail, miniGrid) => {
  if (!section || !heroRail || !miniGrid) return () => {};

  const cards = Array.from(section.querySelectorAll(".editorial-hero-card, .editorial-mini-card"));
  cards.forEach((card, index) => {
    card.style.setProperty("--editorial-card-index", String(index));
    card.style.setProperty("--editorial-card-delay", `${Math.min(index, 5) * 54}ms`);
  });

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    section.classList.add("is-editorial-ready");
    cards.forEach((card) => card.classList.add("is-visible"));
    return () => {};
  }

  let rafId = 0;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("is-visible", entry.isIntersecting);
      });
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.18 }
  );

  cards.forEach((card) => observer.observe(card));
  section.classList.add("is-editorial-motion", "is-editorial-ready");

  const applyMotion = () => {
    rafId = 0;
    const rect = section.getBoundingClientRect();
    const travel = window.innerHeight + rect.height;
    const rawProgress = travel > 0 ? (window.innerHeight - rect.top) / travel : 0;
    const progress = clamp(rawProgress, 0, 1);
    const intro = easeOutCubic(clamp(progress * 2.1, 0, 1));
    const exit = easeOutCubic(clamp((progress - 0.72) / 0.28, 0, 1));

    setMotionVariable(section, "--editorial-title-y", `${(1 - intro) * 34 - exit * 14}px`);
    setMotionVariable(section, "--editorial-title-opacity", (0.22 + intro * 0.78 - exit * 0.16).toFixed(3));
    setMotionVariable(section, "--editorial-hero-y", `${(1 - intro) * 46 - exit * 18}px`);
    setMotionVariable(section, "--editorial-mini-y", `${(1 - intro) * 66 - exit * 12}px`);
    setMotionVariable(section, "--editorial-rail-scale", (0.965 + intro * 0.035).toFixed(4));
    setMotionVariable(section, "--editorial-rail-opacity", (0.34 + intro * 0.66).toFixed(3));
    setMotionVariable(section, "--editorial-media-y", `${(0.5 - progress) * 26}px`);
  };

  const requestApplyMotion = () => {
    if (rafId) return;
    rafId = window.requestAnimationFrame(applyMotion);
  };

  window.addEventListener("scroll", requestApplyMotion, { passive: true });
  window.addEventListener("resize", requestApplyMotion);
  requestApplyMotion();

  return () => {
    window.removeEventListener("scroll", requestApplyMotion);
    window.removeEventListener("resize", requestApplyMotion);
    observer.disconnect();
    if (rafId) {
      window.cancelAnimationFrame(rafId);
    }
  };
};
