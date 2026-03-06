const trimValue = (value) => value.replace(/\s+/g, " ").trim();

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
  const startedAt = form.querySelector("[data-contact-started-at]");
  if (!email || !message) return;

  if (startedAt instanceof HTMLInputElement) {
    startedAt.value = String(Date.now());
  }

  const validateAll = () => {
    validateField(email, "Please enter a valid email address.");
    validateField(message, "Please enter a message.");
  };

  form.addEventListener("submit", (event) => {
    validateAll();
    if (honeypot instanceof HTMLInputElement && honeypot.value.trim()) {
      event.preventDefault();
      return;
    }

    if (startedAt instanceof HTMLInputElement) {
      const openedAt = Number(startedAt.value || 0);
      const elapsed = Date.now() - openedAt;

      if (!openedAt || elapsed < 2500) {
        event.preventDefault();
        startedAt.value = String(Date.now());
        return;
      }
    }

    if (!form.checkValidity()) {
      event.preventDefault();
      form.reportValidity();
    }
  });

  ["input", "blur"].forEach((eventName) => {
    email.addEventListener(eventName, () => validateField(email, "Please enter a valid email address."));
    message.addEventListener(eventName, () => validateField(message, "Please enter a message."));
  });
};
