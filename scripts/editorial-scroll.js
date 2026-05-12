const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const easeOutCubic = (value) => 1 - ((1 - value) ** 3);
const HERO_SCROLL_TRAVEL_FACTOR = 0.42;
const MINI_SCROLL_TRAVEL_FACTOR = 0.58;

const scrollToNearestCard = (rail, targetLeft) => {
  const cards = Array.from(rail.children);
  if (!cards.length) {
    rail.scrollLeft = targetLeft;
    return;
  }

  const railCenter = targetLeft + rail.clientWidth / 2;
  let closestLeft = targetLeft;
  let closestDistance = Infinity;

  cards.forEach((card) => {
    const cardCenter = card.offsetLeft + card.clientWidth / 2;
    const distance = Math.abs(cardCenter - railCenter);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestLeft = card.offsetLeft - (rail.clientWidth - card.clientWidth) / 2;
    }
  });

  rail.scrollLeft = clamp(closestLeft, 0, rail.scrollWidth - rail.clientWidth);
};

export const initEditorialScroll = (section, heroRail, miniGrid) => {
  if (!section || !heroRail || !miniGrid) return () => {};
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};

  let rafId = 0;
  const heroSnapType = heroRail.style.scrollSnapType;
  const heroScrollBehavior = heroRail.style.scrollBehavior;
  const miniSnapType = miniGrid.style.scrollSnapType;
  const miniScrollBehavior = miniGrid.style.scrollBehavior;

  heroRail.style.scrollSnapType = "none";
  heroRail.style.scrollBehavior = "auto";
  miniGrid.style.scrollSnapType = "none";
  miniGrid.style.scrollBehavior = "auto";

  const applyScroll = () => {
    rafId = 0;

    const heroMax = Math.max(0, heroRail.scrollWidth - heroRail.clientWidth);
    const miniMax = Math.max(0, miniGrid.scrollWidth - miniGrid.clientWidth);
    if (!heroMax && !miniMax) return;

    const rect = section.getBoundingClientRect();
    const startOffset = window.innerHeight * 0.82;
    const totalTravel = startOffset + rect.height;
    if (totalTravel <= 0) return;

    const rawProgress = (startOffset - rect.top) / totalTravel;
    const progress = easeOutCubic(clamp(rawProgress, 0, 1));

    scrollToNearestCard(heroRail, heroMax * progress * HERO_SCROLL_TRAVEL_FACTOR);
    scrollToNearestCard(miniGrid, miniMax * (1 - progress * MINI_SCROLL_TRAVEL_FACTOR));
  };

  const requestApplyScroll = () => {
    if (rafId) return;
    rafId = window.requestAnimationFrame(applyScroll);
  };

  window.addEventListener("scroll", requestApplyScroll, { passive: true });
  window.addEventListener("resize", requestApplyScroll);
  requestApplyScroll();

  return () => {
    window.removeEventListener("scroll", requestApplyScroll);
    window.removeEventListener("resize", requestApplyScroll);
    heroRail.style.scrollSnapType = heroSnapType;
    heroRail.style.scrollBehavior = heroScrollBehavior;
    miniGrid.style.scrollSnapType = miniSnapType;
    miniGrid.style.scrollBehavior = miniScrollBehavior;
    if (rafId) {
      window.cancelAnimationFrame(rafId);
    }
  };
};
