const COMPANY_LOGO_MANIFEST_URL = "data/company-logos.json";
let companyLogosPromise;

const normalizeLogo = (logo) => {
  if (!logo || typeof logo !== "object" || !logo.src) return null;
  return {
    src: String(logo.src),
    label: logo.label || "Company logo",
  };
};

const loadCompanyLogos = async () => {
  if (!companyLogosPromise) {
    companyLogosPromise = fetch(COMPANY_LOGO_MANIFEST_URL)
      .then(async (response) => {
        if (!response.ok) return [];

        const data = await response.json();
        return Array.isArray(data.icons) ? data.icons.map(normalizeLogo).filter(Boolean) : [];
      })
      .catch(() => []);
  }

  return companyLogosPromise;
};

const createLogo = (logo) => {
  const item = document.createElement("div");
  item.className = "company-logo-strip__item";

  const image = document.createElement("img");
  image.alt = logo.label;
  image.loading = "lazy";
  image.decoding = "async";
  image.fetchPriority = "auto";
  image.src = logo.src;

  item.appendChild(image);
  return item;
};

export const initCompanyLogoStrip = async () => {
  const strip = document.querySelector("[data-company-logo-strip]");
  if (!strip) return;

  const logos = await loadCompanyLogos();
  if (!logos.length) {
    strip.hidden = true;
    return;
  }

  strip.innerHTML = "";
  const fragment = document.createDocumentFragment();
  logos.forEach((logo) => fragment.appendChild(createLogo(logo)));
  strip.appendChild(fragment);
  strip.hidden = false;
};
