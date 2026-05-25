const fs = require("fs");
const path = require("path");

const assetsDir = path.join(__dirname, "..", "assets");
const techIconsDir = path.join(assetsDir, "tech");
const projectIconsDir = path.join(assetsDir, "project-icons");
const companyLogosDir = path.join(assetsDir, "company-logo");
const outputDir = path.join(__dirname, "..", "data");
const techOutputFile = path.join(outputDir, "icons.json");
const projectOutputFile = path.join(outputDir, "project-icons.json");
const companyLogoOutputFile = path.join(outputDir, "company-logos.json");
const allowedExt = new Set([".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif", ".avif"]);

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

const readExistingIcons = (file) => {
  if (!fs.existsSync(file)) {
    return [];
  }

  try {
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    return Array.isArray(data.icons) ? data.icons : [];
  } catch (error) {
    return [];
  }
};

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const readIcons = (directory, publicPath) => {
  if (!fs.existsSync(directory)) {
    return [];
  }

  return fs
    .readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => allowedExt.has(path.extname(name).toLowerCase()))
    .sort()
    .map((file) => ({
      src: `${publicPath}/${file}`,
      label: labelFromFilename(file),
    }));
};

const mergeWithExistingIcons = (generatedIcons, existingIcons) => {
  const generatedBySrc = new Map(generatedIcons.map((icon) => [icon.src, icon]));
  const used = new Set();
  const preserved = existingIcons
    .filter((icon) => generatedBySrc.has(icon.src))
    .map((icon) => {
      used.add(icon.src);
      return icon;
    });
  const additions = generatedIcons.filter((icon) => !used.has(icon.src));
  return [...preserved, ...additions];
};

const techIcons = mergeWithExistingIcons(readIcons(techIconsDir, "assets/tech"), readExistingIcons(techOutputFile));
const projectIcons = readIcons(projectIconsDir, "assets/project-icons");
const companyLogos = readIcons(companyLogosDir, "assets/company-logo");

fs.writeFileSync(techOutputFile, `${JSON.stringify({ icons: techIcons }, null, 2)}\n`);
fs.writeFileSync(projectOutputFile, `${JSON.stringify({ icons: projectIcons }, null, 2)}\n`);
fs.writeFileSync(companyLogoOutputFile, `${JSON.stringify({ icons: companyLogos }, null, 2)}\n`);
console.log(`Wrote ${techIcons.length} icons to ${techOutputFile}`);
console.log(`Wrote ${projectIcons.length} icons to ${projectOutputFile}`);
console.log(`Wrote ${companyLogos.length} icons to ${companyLogoOutputFile}`);
