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
  if (!email || !message) return;

  const validateAll = () => {
    validateField(email, "Please enter a valid email address.");
    validateField(message, "Please enter a message.");
  };

  form.addEventListener("submit", (event) => {
    validateAll();
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
