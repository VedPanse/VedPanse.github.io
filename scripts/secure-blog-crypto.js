const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

const VALID_PATH_SEGMENT = /^[a-z0-9][a-z0-9._-]*$/i;

const base64ToBytes = (value) => {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
};

const deriveAesKey = async ({ password, salt, iterations }) => {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    textEncoder.encode(password.normalize("NFKC")),
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt,
      iterations,
    },
    keyMaterial,
    {
      name: "AES-GCM",
      length: 256,
    },
    false,
    ["decrypt"]
  );
};

export const isValidSecureBlogSegment = (value) => VALID_PATH_SEGMENT.test(value || "");

export const decryptSecureBlogPayload = async (payload, password) => {
  if (!payload || payload.alg !== "AES-256-GCM" || payload.kdf?.name !== "PBKDF2-SHA256") {
    throw new Error("Unsupported secure blog payload.");
  }

  const salt = base64ToBytes(payload.kdf.salt);
  const iv = base64ToBytes(payload.iv);
  const ciphertext = base64ToBytes(payload.ciphertext);
  const key = await deriveAesKey({
    password,
    salt,
    iterations: payload.kdf.iterations,
  });
  const plaintext = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ciphertext);

  return textDecoder.decode(plaintext);
};

export const loadSecureBlogMarkdown = async ({ vault, post, password }) => {
  if (!isValidSecureBlogSegment(vault) || !isValidSecureBlogSegment(post)) {
    throw new Error("Invalid secure blog path.");
  }

  const response = await fetch(`data/secure-blogs/${encodeURIComponent(vault)}/${encodeURIComponent(post)}.json`, {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error("Secure blog not found.");
  }

  return decryptSecureBlogPayload(await response.json(), password);
};
