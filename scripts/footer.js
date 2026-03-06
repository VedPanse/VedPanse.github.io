const FOOTER_SECTIONS = [
  {
    title: "Explore",
    links: [
      { label: "About", href: "index.html#icon-columns" },
      { label: "Projects", href: "index.html#projects" },
      { label: "Work", href: "index.html#work" },
      { label: "Current Focus", href: "index.html#current-focus" },
    ],
  },
  {
    title: "Writing",
    links: [
      { label: "Research", href: "index.html#research" },
      { label: "Blogs", href: "index.html#blogs" },
      { label: "Case Studies", href: "index.html#work" },
      { label: "Contact", href: "index.html#contact" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "Resume", href: "https://docs.google.com/document/d/1ZDx0G4urf-0tMZrS09Mm1j1v2rxYkVUnz44sVbKMg_E/edit?tab=t.0", external: true },
      { label: "Email", href: "__EMAIL__", external: true },
      { label: "GitHub", href: "https://github.com/vedpanse", external: true },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/vedpanse/", external: true },
    ],
  },
  {
    title: "Built For",
    links: [
      { label: "Product Engineering", href: "index.html#projects" },
      { label: "Intelligent Systems", href: "index.html#research" },
      { label: "Software Craft", href: "index.html#work" },
      { label: "Collaborations", href: "index.html#contact" },
    ],
  },
];

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const getBasePrefix = () => {
  const path = window.location.pathname;
  if (path === "/" || path.endsWith("/index.html")) return "";
  return path.endsWith(".html") ? "" : "/";
};

const resolveHref = (href) => {
  if (/^(mailto:|https?:|tel:|#)/.test(href)) return href;
  const prefix = getBasePrefix();
  return `${prefix}${href}`;
};

const EMAIL_CODEPOINTS = [118, 101, 100, 112, 97, 110, 115, 101, 64, 103, 109, 97, 105, 108, 46, 99, 111, 109];

const buildEmailAddress = () => String.fromCharCode(...EMAIL_CODEPOINTS);

const buildMailtoHref = () => `mailto:${buildEmailAddress()}`;

const renderLink = ({ label, href, external = false }) => {
  const attrs = external ? ' target="_blank" rel="noopener noreferrer"' : "";
  const resolvedHref = href === "__EMAIL__" ? "#" : resolveHref(href);
  const extraAttrs = href === "__EMAIL__" ? ' data-email-link="footer-nav"' : "";
  return `<li><a href="${escapeHtml(resolvedHref)}"${attrs}${extraAttrs}>${escapeHtml(label)}</a></li>`;
};

const renderSection = ({ title, links }) => `
  <section class="site-footer-column" aria-label="${escapeHtml(title)}">
    <h2>${escapeHtml(title)}</h2>
    <ul>
      ${links.map(renderLink).join("")}
    </ul>
  </section>
`;

export const initFooter = () => {
  if (document.querySelector("[data-site-footer]")) return;

  const footer = document.createElement("footer");
  footer.className = "site-footer";
  footer.setAttribute("data-site-footer", "");

  const year = new Date().getFullYear();
  footer.innerHTML = `
    <div class="site-footer-inner">
      <p class="site-footer-note">
        Product engineering, intelligent systems, research, and writing from Ved Panse.
      </p>
      <div class="site-footer-grid">
        ${FOOTER_SECTIONS.map(renderSection).join("")}
      </div>
      <div class="site-footer-shop">
        More ways to connect:
        <a href="#" data-email-link="footer-inline">Email</a>,
        <a href="https://github.com/vedpanse" target="_blank" rel="noopener noreferrer">GitHub</a>,
        <a href="https://www.linkedin.com/in/vedpanse/" target="_blank" rel="noopener noreferrer">LinkedIn</a>,
        or explore the <a href="${escapeHtml(resolveHref("index.html#contact"))}">contact section</a>.
      </div>
      <div class="site-footer-legal">
        <div class="site-footer-legal-links">
          <span>Copyright &copy; ${year} Ved Panse. All rights reserved.</span>
          <a href="${escapeHtml(resolveHref("index.html#projects"))}">Projects</a>
          <a href="${escapeHtml(resolveHref("index.html#research"))}">Research</a>
          <a href="${escapeHtml(resolveHref("index.html#blogs"))}">Blogs</a>
          <a href="${escapeHtml(resolveHref("index.html#contact"))}">Contact</a>
        </div>
        <span class="site-footer-region">United States</span>
      </div>
    </div>
  `;

  footer.querySelectorAll("[data-email-link]").forEach((link) => {
    link.setAttribute("href", buildMailtoHref());
    link.setAttribute("aria-label", `Email ${buildEmailAddress()}`);
  });

  document.body.append(footer);
};

initFooter();
