const trimValue = (value) => value.replace(/\s+/g, " ").trim();
const MINIMUM_SUBMIT_DELAY_MS = 3500;
const MAXIMUM_SUBMIT_DELAY_MS = 45 * 60 * 1000;
const MINIMUM_INTERACTIONS = 2;

const createNonce = () => {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
};

const hashToken = async (value) => {
  const encoded = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
};

const validateField = (field, message) => {
  const trimmed = trimValue(field.value);
  if (!trimmed) {
    field.setCustomValidity(message);
  } else {
    field.setCustomValidity("");
  }
};

export const initContactForm = () => {
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;

  const email = form.querySelector("input[name=\"email\"]");
  const message = form.querySelector("textarea[name=\"message\"]");
  const honeypot = form.querySelector("input[name=\"_gotcha\"]");
  const decoys = Array.from(form.querySelectorAll("[data-contact-decoy]"));
  const startedAt = form.querySelector("[data-contact-started-at]");
  const nonce = form.querySelector("[data-contact-nonce]");
  const verifiedAt = form.querySelector("[data-contact-verified-at]");
  const proof = form.querySelector("[data-contact-proof]");
  const submitButton = form.querySelector("[data-contact-submit]");
  if (!email || !message) return;

  if (startedAt instanceof HTMLInputElement) {
    startedAt.value = String(Date.now());
  }
  if (nonce instanceof HTMLInputElement) {
    nonce.value = createNonce();
  }

  let interactionCount = 0;
  let hasKeyboardInteraction = false;
  let hasPointerInteraction = false;
  let isVerifiedSubmit = false;

  const recordInteraction = (event) => {
    interactionCount += 1;
    if (event.type === "keydown" || event.type === "input") {
      hasKeyboardInteraction = true;
    }
    if (event.type === "pointerdown" || event.type === "touchstart" || event.type === "mousedown") {
      hasPointerInteraction = true;
    }
  };

  form.addEventListener("pointerdown", recordInteraction, { passive: true });
  form.addEventListener("mousedown", recordInteraction, { passive: true });
  form.addEventListener("touchstart", recordInteraction, { passive: true });
  form.addEventListener("keydown", recordInteraction);
  email.addEventListener("input", recordInteraction);
  message.addEventListener("input", recordInteraction);

  const validateAll = () => {
    validateField(email, "Please enter a valid email address.");
    validateField(message, "Please enter a message.");
  };

  const hasFilledTrap = () => {
    if (honeypot instanceof HTMLInputElement && honeypot.value.trim()) {
      return true;
    }
    return decoys.some((field) => field instanceof HTMLInputElement && field.value.trim());
  };

  const hasHumanTiming = () => {
    if (!(startedAt instanceof HTMLInputElement)) {
      return false;
    }
    const openedAt = Number(startedAt.value || 0);
    const elapsed = Date.now() - openedAt;
    return Boolean(openedAt && elapsed >= MINIMUM_SUBMIT_DELAY_MS && elapsed <= MAXIMUM_SUBMIT_DELAY_MS);
  };

  const hasHumanInteraction = () =>
    interactionCount >= MINIMUM_INTERACTIONS && (hasKeyboardInteraction || hasPointerInteraction);

  const buildProof = async () => {
    if (
      !(startedAt instanceof HTMLInputElement) ||
      !(nonce instanceof HTMLInputElement) ||
      !(verifiedAt instanceof HTMLInputElement) ||
      !(proof instanceof HTMLInputElement)
    ) {
      return false;
    }

    verifiedAt.value = String(Date.now());
    proof.value = await hashToken(
      [
        nonce.value,
        startedAt.value,
        verifiedAt.value,
        String(interactionCount),
        trimValue(email.value).toLowerCase(),
        String(trimValue(message.value).length),
      ].join("|")
    );
    return true;
  };

  form.addEventListener("submit", async (event) => {
    if (isVerifiedSubmit) {
      return;
    }

    event.preventDefault();
    validateAll();
    if (hasFilledTrap()) {
      return;
    }

    if (!hasHumanTiming() || !hasHumanInteraction()) {
      if (startedAt instanceof HTMLInputElement && !hasHumanTiming()) {
        startedAt.value = String(Date.now());
      }
      return;
    }

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (!(await buildProof())) {
      return;
    }

    isVerifiedSubmit = true;
    if (submitButton instanceof HTMLButtonElement) {
      submitButton.disabled = true;
    }
    HTMLFormElement.prototype.submit.call(form);
  });

  ["input", "blur"].forEach((eventName) => {
    email.addEventListener(eventName, () => validateField(email, "Please enter a valid email address."));
    message.addEventListener(eventName, () => validateField(message, "Please enter a message."));
  });
};
