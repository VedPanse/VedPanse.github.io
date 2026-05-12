import { createCipheriv, pbkdf2Sync, randomBytes } from "node:crypto";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_DIR = path.join(ROOT_DIR, "secure-blogs");
const OUTPUT_DIR = path.join(ROOT_DIR, "data", "secure-blogs");
const ITERATIONS = 600000;
const KEY_LENGTH = 32;
const SALT_LENGTH = 16;
const IV_LENGTH = 12;
const VALID_PATH_SEGMENT = /^[a-z0-9][a-z0-9._-]*$/i;

const toBase64 = (buffer) => Buffer.from(buffer).toString("base64");

const slugFromFileName = (fileName) => fileName.replace(/\.md$/i, "");

const passwordEnvName = (vault) =>
  `SECURE_BLOG_PASSWORD_${vault.toUpperCase().replace(/[^A-Z0-9]/g, "_")}`;

const getVaultPassword = async (vault) => {
  const specificPassword = process.env[passwordEnvName(vault)];
  if (specificPassword) return specificPassword;

  const sharedPassword = process.env.SECURE_BLOG_PASSWORD;
  if (sharedPassword) return sharedPassword;

  const passwordFile = path.join(SOURCE_DIR, vault, ".password");
  try {
    return (await readFile(passwordFile, "utf8")).trim();
  } catch {
    throw new Error(
      `Missing password for ${vault}. Set ${passwordEnvName(vault)}, SECURE_BLOG_PASSWORD, or secure-blogs/${vault}/.password.`
    );
  }
};

const encryptMarkdown = (markdown, password) => {
  const salt = randomBytes(SALT_LENGTH);
  const iv = randomBytes(IV_LENGTH);
  const key = pbkdf2Sync(password.normalize("NFKC"), salt, ITERATIONS, KEY_LENGTH, "sha256");
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(markdown, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  return {
    version: 1,
    alg: "AES-256-GCM",
    kdf: {
      name: "PBKDF2-SHA256",
      iterations: ITERATIONS,
      salt: toBase64(salt),
    },
    iv: toBase64(iv),
    ciphertext: toBase64(Buffer.concat([encrypted, tag])),
  };
};

const listDirectories = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true }).catch(() => []);
  return entries
    .filter((entry) => entry.isDirectory() && VALID_PATH_SEGMENT.test(entry.name))
    .map((entry) => entry.name)
    .sort();
};

const listMarkdownFiles = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true }).catch(() => []);
  return entries
    .filter((entry) => entry.isFile() && /\.md$/i.test(entry.name) && VALID_PATH_SEGMENT.test(slugFromFileName(entry.name)))
    .map((entry) => entry.name)
    .sort();
};

const writeJson = async (filePath, data) => {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, { mode: 0o600 });
};

const encryptVault = async (vault) => {
  const sourceVaultDir = path.join(SOURCE_DIR, vault);
  const outputVaultDir = path.join(OUTPUT_DIR, vault);
  const password = await getVaultPassword(vault);
  const files = await listMarkdownFiles(sourceVaultDir);

  for (const fileName of files) {
    const slug = slugFromFileName(fileName);
    const markdown = await readFile(path.join(sourceVaultDir, fileName), "utf8");
    await writeJson(path.join(outputVaultDir, `${slug}.json`), encryptMarkdown(markdown, password));
  }

  return { vault, count: files.length };
};

const main = async () => {
  const vaults = await listDirectories(SOURCE_DIR);
  if (!vaults.length) {
    console.log("No secure blog vaults found under secure-blogs/.");
    return;
  }

  const results = [];
  for (const vault of vaults) {
    results.push(await encryptVault(vault));
  }

  results.forEach(({ vault, count }) => {
    console.log(`Encrypted ${count} post(s) for secure-blogs/${vault}.`);
  });
};

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
