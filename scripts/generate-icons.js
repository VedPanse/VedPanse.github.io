const fs = require("fs");
const path = require("path");

const assetsDir = path.join(__dirname, "..", "assets");
const outputDir = path.join(__dirname, "..", "data");
const outputFile = path.join(outputDir, "icons.json");
const allowedExt = new Set([".png", ".jpg", ".jpeg", ".webp", ".svg"]);

const titleizeToken = (token) => {
  if (!token) return "";
  const lower = token.toLowerCase();
  if (lower === "js") return "JavaScript";
  if (lower === "ts") return "TypeScript";
  if (lower === "cpp") return "C++";
  if (lower === "c") return "C";
  if (lower === "go") return "Go";
  if (lower === "github") return "GitHub";
  if (token.length <= 3) return token.toUpperCase();
  return token.charAt(0).toUpperCase() + token.slice(1);
};

const labelFromFilename = (filename) => {
  const base = path.basename(filename, path.extname(filename));
  return base
    .split(/[-_]/g)
    .map(titleizeToken)
    .join(" ");
};

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const icons = fs
  .readdirSync(assetsDir, { withFileTypes: true })
  .filter((entry) => entry.isFile())
  .map((entry) => entry.name)
  .filter((name) => allowedExt.has(path.extname(name).toLowerCase()))
  .sort()
  .map((file) => ({
    src: `assets/${file}`,
    label: labelFromFilename(file),
  }));

fs.writeFileSync(outputFile, JSON.stringify({ icons }, null, 2));
console.log(`Wrote ${icons.length} icons to ${outputFile}`);
