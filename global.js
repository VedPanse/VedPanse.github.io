console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

(function setupNavHighlight() {
  const normalizePathname = (pathname) => {
    if (pathname === '/') return '/index.html';
    if (pathname.endsWith('/')) return `${pathname}index.html`;
    return pathname;
  };

  const normalizeHash = (hash) => {
    if (!hash) return '';
    const trimmed = hash.trim();
    if (!trimmed) return '';
    return `#${trimmed.replace(/^#/, '')}`;
  };

  const allowedSuffixes = ['/index.html', '/projects/index.html', '/404.html'];
  const normalizedInitial = normalizePathname(location.pathname);
  const isAllowedPage = allowedSuffixes.some((suffix) =>
    normalizedInitial.endsWith(suffix),
  );
  if (!isAllowedPage) return;

  const headerNav = document.querySelector('header nav');
  if (!headerNav) return;

  const navLinks = $$('a', headerNav);
  if (!navLinks.length) return;

  const matchesPage = (pathname, suffix) => {
    if (pathname.endsWith(suffix)) return true;
    if (suffix === '/index.html' && pathname === '/') return true;
    return false;
  };

  const findLink = (suffix, predicate) =>
    navLinks.find((link) => {
      const rawHref = link.getAttribute('href') ?? '';
      if (!rawHref || rawHref.startsWith('mailto:') || rawHref.startsWith('tel:')) {
        return false;
      }
      if (link.host && link.host !== location.host) return false;

      const normalizedLinkPath = normalizePathname(link.pathname);
      if (!matchesPage(normalizedLinkPath, suffix)) return false;

      const normalizedLinkHash = normalizeHash(link.hash);
      return predicate({ link, linkHash: normalizedLinkHash });
    });

  const applyHighlight = () => {
    navLinks.forEach((link) => link.classList.remove('current'));

    const normalizedLocation = normalizePathname(location.pathname);
    const matchedSuffix = allowedSuffixes.find((suffix) =>
      normalizedLocation.endsWith(suffix),
    );
    if (!matchedSuffix) return;

    const normalizedLocationHash = normalizeHash(location.hash);

    const currentLink =
      findLink(matchedSuffix, ({ linkHash }) => normalizedLocationHash && linkHash === normalizedLocationHash) ||
      findLink(matchedSuffix, ({ linkHash }) => !normalizedLocationHash && linkHash === '') ||
      findLink(matchedSuffix, ({ linkHash }) => !normalizedLocationHash && linkHash === '#home');

    currentLink?.classList.add('current');
  };

  applyHighlight();
  window.addEventListener('hashchange', applyHighlight, { passive: true });
  window.addEventListener('popstate', applyHighlight, { passive: true });
})();
