console.log('IT’S ALIVE!');

const isLocalHost = ['localhost', '127.0.0.1'].includes(location.hostname);

const ensureLeadingSlash = (value) =>
  value.startsWith('/') ? value : `/${value}`;

const ensureTrailingSlash = (value) =>
  value.endsWith('/') ? value : `${value}/`;

const detectGitHubBase = () => {
  const rootCandidate = document.body?.dataset?.basePath;
  if (rootCandidate) {
    return ensureTrailingSlash(ensureLeadingSlash(rootCandidate));
  }

  if (!location.hostname.endsWith('.github.io')) return '/';

  const [subdomain] = location.hostname.split('.');
  const pathSegments = location.pathname.split('/').filter(Boolean);

  if (pathSegments.length && pathSegments[0] !== subdomain) {
    return ensureTrailingSlash(`/${pathSegments[0]}`);
  }

  return '/';
};

const BASE_PATH = isLocalHost ? '/' : detectGitHubBase();

const NAV_ITEMS = [
  { title: 'Research', url: 'index.html#research' },
  { title: 'Experience', url: 'index.html#experience' },
  { title: 'Projects', url: 'projects/' },
  { title: 'Awards', url: 'index.html#awards' },
  { title: 'Writing', url: 'index.html#writing' },
  { title: 'Contact', url: 'index.html#contact' },
  {
    title: 'Download CV',
    url: 'https://docs.google.com/document/d/1ZDx0G4urf-0tMZrS09Mm1j1v2rxYkVUnz44sVbKMg_E/edit?tab=t.0',
    className: 'site-nav__cta',
  },
];

const COLOR_SCHEMES = [
  { label: 'Automatic', value: 'light dark' },
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
];

const COLOR_SCHEME_STORAGE_KEY = 'colorScheme';
const DEFAULT_COLOR_SCHEME = COLOR_SCHEMES[0].value;

const isValidColorScheme = (value) =>
  COLOR_SCHEMES.some((scheme) => scheme.value === value);

const getStoredColorScheme = () => {
  try {
    const stored = localStorage.getItem(COLOR_SCHEME_STORAGE_KEY);
    return stored && isValidColorScheme(stored) ? stored : null;
  } catch (error) {
    console.warn('Unable to read saved color scheme preference.', error);
    return null;
  }
};

const storeColorScheme = (value) => {
  try {
    localStorage.setItem(COLOR_SCHEME_STORAGE_KEY, value);
  } catch (error) {
    console.warn('Unable to save color scheme preference.', error);
  }
};

const applyColorScheme = (value) => {
  const root = document.documentElement;
  if (value === DEFAULT_COLOR_SCHEME) {
    root.style.removeProperty('color-scheme');
  } else {
    root.style.setProperty('color-scheme', value);
  }
  const datasetValue = value === DEFAULT_COLOR_SCHEME ? 'auto' : value;
  root.dataset.colorScheme = datasetValue;
};

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

const resolveUrl = (url) => {
  if (!url) return BASE_PATH;
  if (url.startsWith('#')) return url;
  if (/^[a-z][a-z\d+\-.]*:/i.test(url)) return url;

  const cleaned = url.replace(/^\//, '');
  return `${BASE_PATH}${cleaned}`;
};

const buildNavigation = () => {
  if (document.querySelector('[data-generated-nav="true"]')) return null;

  const header = document.createElement('header');
  header.dataset.generatedNav = 'true';
  header.className =
    'no-print fixed top-0 left-0 right-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-black/30 bg-black/20 border-b border-white/10';

  const nav = document.createElement('nav');
  nav.className = 'site-nav';

  const brand = document.createElement('a');
  brand.className = 'site-nav__brand';
  brand.href = resolveUrl('index.html#home');
  brand.textContent = 'Ved Panse';

  nav.append(brand);

  const list = document.createElement('ul');
  list.className = 'site-nav__list';
  nav.append(list);

  const internalLinks = [];

  for (const item of NAV_ITEMS) {
    const listItem = document.createElement('li');
    listItem.className = 'site-nav__item';

    const link = document.createElement('a');
    const classes = ['link', 'site-nav__link'];
    if (item.className) classes.push(item.className);
    link.className = classes.join(' ');
    link.textContent = item.title;
    link.href = resolveUrl(item.url);
    link.dataset.navLink = 'true';

    const isExternal = link.host && link.host !== location.host;
    if (isExternal) {
      link.target = '_blank';
      link.rel = 'noreferrer noopener';
    } else {
      const linkUrl = new URL(link.href, location.origin);
      link.dataset.matchPath = normalizePathname(linkUrl.pathname);

      const hash = normalizeHash(linkUrl.hash);
      if (hash) {
        link.dataset.matchHash = hash;
      }

      internalLinks.push(link);
    }

    listItem.append(link);
    list.append(listItem);
  }

  header.append(nav);
  return { header, internalLinks };
};

const highlightCurrent = (links) => {
  if (!links.length) return;

  const normalizedLocationPath = normalizePathname(location.pathname);
  const normalizedLocationHash = normalizeHash(location.hash);

  let currentLink = null;

  for (const link of links) {
    const linkPath = link.dataset.matchPath;
    const linkHash = link.dataset.matchHash;

    const pathMatches = linkPath === normalizedLocationPath;
    const hashMatches =
      !linkHash || linkHash === normalizedLocationHash;

    if (pathMatches && hashMatches) {
      currentLink = link;
      break;
    }
  }

  for (const link of links) {
    const isCurrent = link === currentLink;
    link.classList.toggle('current', isCurrent);
    if (isCurrent) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  }
};

const insertHeader = (header) => {
  const skipLink = document.querySelector('a[href="#main"]');
  if (skipLink && skipLink.parentElement === document.body) {
    skipLink.insertAdjacentElement('afterend', header);
    return;
  }
  document.body.prepend(header);
};

const setupNavigation = () => {
  const navBundle = buildNavigation();
  if (!navBundle) return;

  insertHeader(navBundle.header);
  highlightCurrent(navBundle.internalLinks);

  const handleUpdate = () => highlightCurrent(navBundle.internalLinks);
  window.addEventListener('hashchange', handleUpdate, { passive: true });
  window.addEventListener('popstate', handleUpdate, { passive: true });
};

const buildColorSchemeSwitcher = () => {
  let label = document.querySelector('.color-scheme');
  let select = label?.querySelector('select');

  if (!label) {
    label = document.createElement('label');
    label.className = 'color-scheme';
    label.textContent = 'Theme:';
  }

  if (!select) {
    select = document.createElement('select');
    for (const optionData of COLOR_SCHEMES) {
      const option = document.createElement('option');
      option.value = optionData.value;
      option.textContent = optionData.label;
      select.append(option);
    }
    label.append(select);
  }

  if (!label.isConnected) {
    document.body.insertAdjacentElement('afterbegin', label);
  }

  return { label, select };
};

const setupColorSchemeSwitcher = () => {
  const switcher = buildColorSchemeSwitcher();
  if (!switcher) return;

  const select = switcher.select;
  const initialValue = getStoredColorScheme() ?? DEFAULT_COLOR_SCHEME;

  applyColorScheme(initialValue);
  select.value = initialValue;

  select.addEventListener('input', (event) => {
    const { value } = event.target;
    if (!isValidColorScheme(value)) return;

    applyColorScheme(value);
    storeColorScheme(value);
  });
};

const runOnReady = () => {
  setupNavigation();
  setupColorSchemeSwitcher();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', runOnReady, { once: true });
} else {
  runOnReady();
}
