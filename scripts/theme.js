const DEFAULT_THEME = "light";
const THEME_STORAGE_KEY = "theme";
const LIGHT_THEME_COLOR = "#f5f5f7";
const DARK_THEME_COLOR = "#000000";

const isThemeValue = (value) => value === "light" || value === "dark";

export const getStoredTheme = () => {
  try {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    return isThemeValue(storedTheme) ? storedTheme : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
};

export const applyDocumentTheme = (
  theme,
  {
    root = document.documentElement,
    metaTheme = document.querySelector('meta[name="theme-color"]'),
    persist = true,
  } = {}
) => {
  const resolvedTheme = isThemeValue(theme) ? theme : DEFAULT_THEME;
  const isLight = resolvedTheme === "light";

  root.dataset.theme = resolvedTheme;

  if (persist) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, resolvedTheme);
    } catch {
      // Ignore storage failures in private browsing or locked-down environments.
    }
  }

  if (metaTheme) {
    metaTheme.setAttribute("content", isLight ? LIGHT_THEME_COLOR : DARK_THEME_COLOR);
  }

  return resolvedTheme;
};

export const initThemeToggle = (
  toggle = document.querySelector("[data-theme-toggle]"),
  options = {}
) => {
  const root = options.root || document.documentElement;
  const metaTheme = options.metaTheme || document.querySelector('meta[name="theme-color"]');
  const activeTheme = applyDocumentTheme(root.dataset.theme || getStoredTheme(), {
    root,
    metaTheme,
    persist: true,
  });

  if (!toggle) {
    return activeTheme;
  }

  const syncToggleState = (theme) => {
    const isLight = theme === "light";
    toggle.setAttribute("aria-pressed", String(isLight));
    toggle.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
  };

  syncToggleState(activeTheme);
  toggle.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "light" ? "dark" : "light";
    syncToggleState(
      applyDocumentTheme(nextTheme, {
        root,
        metaTheme,
        persist: true,
      })
    );
  });

  return activeTheme;
};

export const initializeTheme = () => initThemeToggle();
