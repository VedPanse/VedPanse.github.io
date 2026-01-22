const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export const initWorkSection = () => {
  const section = document.querySelector(".work-section");
  if (!section) return;

  const visual = section.querySelector(".work-visual");
  if (!visual) return;

  let baseWidth = 0;
  let baseHeight = 0;
  let targetScale = 1;

  const measure = () => {
    const rect = visual.getBoundingClientRect();
    baseWidth = rect.width / (parseFloat(getComputedStyle(section).getPropertyValue("--work-scale")) || 1);
    baseHeight = rect.height / (parseFloat(getComputedStyle(section).getPropertyValue("--work-scale")) || 1);
    targetScale = Math.max(window.innerWidth / baseWidth, window.innerHeight / baseHeight);
  };

  const update = () => {
    const rect = section.getBoundingClientRect();
    const total = rect.height - window.innerHeight;
    const rawProgress = total > 0 ? -rect.top / total : 0;
    const progress = clamp(rawProgress, 0, 1);
    const holdStart = 0.4;
    const holdEnd = 0.7;
    let inOut = 0;
    if (progress <= holdStart) {
      inOut = progress / holdStart;
    } else if (progress <= holdEnd) {
      inOut = 1;
    } else {
      inOut = (1 - progress) / (1 - holdEnd);
    }
    inOut = clamp(inOut, 0, 1);

    const scale = 1 + (targetScale - 1) * inOut;
    const radius = (1 - inOut) * 36;
    const textProgress = clamp((inOut - 0.6) / 0.4, 0, 1);

    section.style.setProperty("--work-progress", progress.toFixed(4));
    section.style.setProperty("--work-scale", scale.toFixed(4));
    section.style.setProperty("--work-radius", `${radius.toFixed(2)}px`);
    section.style.setProperty("--work-text", textProgress.toFixed(4));
  };

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      update();
      ticking = false;
    });
  };

  const onResize = () => {
    measure();
    update();
  };

  measure();
  update();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize);
};
