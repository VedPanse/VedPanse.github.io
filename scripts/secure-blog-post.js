import { applyLabelColor } from "./label-color.js";
import { parseFrontMatter, extractExcerpt, extractTitle, parseMarkdown, escapeHtml } from "./markdown.js";
import { initNavMenu } from "./nav.js";
import { initSearchOverlay } from "./search.js";
import { loadSecureBlogMarkdown, isValidSecureBlogSegment } from "./secure-blog-crypto.js?v=secure-blogs";
import { initializeTheme } from "./theme.js";
import "./footer.js";

const DEFAULT_AUTHOR = "Ved Panse";

const parseLabels = (value) =>
  (value || "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);

const setText = (selector, value) => {
  const element = document.querySelector(selector);
  if (element) {
    element.textContent = value;
  }
};

const renderLabels = (labels) => {
  const labelRoot = document.querySelector("[data-blog-label]");
  if (!labelRoot) return;

  labelRoot.innerHTML = "";
  labels.forEach((labelValue) => {
    const chip = document.createElement("span");
    chip.className = "blog-label-chip";
    chip.textContent = labelValue;
    applyLabelColor(chip, labelValue);
    labelRoot.appendChild(chip);
  });
};

const renderLockedState = ({ vault, post }) => {
  setText("[data-secure-blog-vault]", vault || "secure blog");
  setText("[data-secure-blog-post]", post || "private post");
};

const renderError = (message) => {
  const status = document.querySelector("[data-secure-status]");
  if (status) {
    status.textContent = message;
    status.hidden = false;
  }
};

const clearError = () => {
  const status = document.querySelector("[data-secure-status]");
  if (status) {
    status.textContent = "";
    status.hidden = true;
  }
};

const renderPost = (markdown) => {
  const { meta, body } = parseFrontMatter(markdown);
  const title = meta.title || extractTitle(body) || "Secure Blog";
  const labels = parseLabels(meta.label || "Secure");
  const author = meta.author || DEFAULT_AUTHOR;
  const content = document.querySelector("[data-blog-content]");
  const gate = document.querySelector("[data-secure-gate]");
  const article = document.querySelector("[data-secure-article]");

  renderLabels(labels);
  setText("[data-blog-date]", meta.date || "");
  setText("[data-blog-title]", title);
  setText("[data-blog-excerpt]", meta.excerpt || extractExcerpt(body));

  const authorElement = document.querySelector("[data-blog-author]");
  if (authorElement) {
    authorElement.innerHTML = `Author: <span class="blog-author-name">${escapeHtml(author)}</span>`;
  }

  if (content) {
    content.innerHTML = parseMarkdown(body);
  }
  if (gate) {
    gate.hidden = true;
  }
  if (article) {
    article.hidden = false;
  }

  document.title = `${title} | Ved Panse`;
};

const initSecureBlogPost = () => {
  initializeTheme();
  initNavMenu();
  initSearchOverlay();

  const params = new URLSearchParams(window.location.search);
  const vault = params.get("vault") || "";
  const post = params.get("post") || "";
  const form = document.querySelector("[data-secure-form]");
  const passwordInput = document.querySelector("[data-secure-password]");
  const submitButton = document.querySelector("[data-secure-submit]");

  renderLockedState({ vault, post });

  if (!form || !passwordInput || !submitButton) return;
  if (!isValidSecureBlogSegment(vault) || !isValidSecureBlogSegment(post)) {
    submitButton.disabled = true;
    renderError("Invalid secure blog link.");
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearError();
    submitButton.disabled = true;
    submitButton.textContent = "Unlocking...";

    try {
      const markdown = await loadSecureBlogMarkdown({
        vault,
        post,
        password: passwordInput.value,
      });
      passwordInput.value = "";
      renderPost(markdown);
    } catch {
      renderError("Unable to unlock this post. Check the password and link.");
      passwordInput.select();
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Unlock";
    }
  });
};

initSecureBlogPost();
