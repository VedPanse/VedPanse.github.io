const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

// Builds lightweight display assets and manifests for no-code site content.
const assetsDir = path.join(__dirname, "..", "assets");
const techIconsDir = path.join(assetsDir, "tech");
const projectIconsDir = path.join(assetsDir, "project-icons");
const companyLogosDir = path.join(assetsDir, "company-logo");
const workBannersDir = path.join(assetsDir, "banners", "work");
const dataDir = path.join(__dirname, "..", "data");
const blogsDir = path.join(dataDir, "blogs");
const researchDir = path.join(dataDir, "research");
const generatedAssetsDir = path.join(assetsDir, "generated");
const generatedTechIconsDir = path.join(generatedAssetsDir, "tech");
const generatedProjectIconsDir = path.join(generatedAssetsDir, "project-icons");
const generatedCompanyLogosDir = path.join(generatedAssetsDir, "company-logo");
const generatedWorkBannersDir = path.join(generatedAssetsDir, "banners", "work");
const techOutputFile = path.join(dataDir, "icons.json");
const projectOutputFile = path.join(dataDir, "project-icons.json");
const companyLogoOutputFile = path.join(dataDir, "company-logos.json");
const allowedExt = new Set([".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif", ".avif"]);
const optimizableExt = new Set([".png", ".jpg", ".jpeg", ".webp"]);
const WEBP_WARNING = "cwebp was not found; using original image assets.";

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

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const listImageFiles = (directory, extensions = allowedExt) => {
  if (!fs.existsSync(directory)) {
    return [];
  }

  return fs
    .readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => extensions.has(path.extname(name).toLowerCase()))
    .sort();
};

const readIcons = (directory, publicPath) =>
  listImageFiles(directory).map((file) => ({
    src: `${publicPath}/${file}`,
    label: labelFromFilename(file),
  }));

const iconKeyFromSrc = (src) => {
  const filename = path.basename(src || "");
  return path.basename(filename, path.extname(filename)).toLowerCase();
};

const readDisplayIcons = (sourceDirectory, sourcePublicPath, generatedDirectory, generatedPublicPath) =>
  listImageFiles(sourceDirectory).map((file) => {
    const generatedFile = generatedFilenameFor(file);
    const generatedPath = path.join(generatedDirectory, generatedFile);
    return {
      src: fs.existsSync(generatedPath) ? `${generatedPublicPath}/${generatedFile}` : `${sourcePublicPath}/${file}`,
      label: labelFromFilename(file),
    };
  });

const canGenerateWebp = (() => {
  let resultCache;
  return () => {
    if (typeof resultCache === "boolean") {
      return resultCache;
    }

    const result = spawnSync("cwebp", ["-version"], { stdio: "ignore" });
    resultCache = result.status === 0;
    return resultCache;
  };
})();

const generatedFilenameFor = (file) =>
  `${path.basename(file, path.extname(file))}.webp`;

const shouldRegenerate = (sourceFile, outputFile) => {
  if (!fs.existsSync(outputFile)) {
    return true;
  }

  return fs.statSync(outputFile).mtimeMs < fs.statSync(sourceFile).mtimeMs;
};

/**
 * Creates WebP derivatives for display-sized images.
 *
 * `height: 0` preserves aspect ratio while constraining width. The original
 * source directories stay untouched so new source images remain no-code.
 */
const ensureOptimizedImages = (sourceDirectory, generatedDirectory, { width, height, quality }) => {
  if (!fs.existsSync(sourceDirectory)) {
    return false;
  }

  if (!canGenerateWebp()) {
    console.warn(WEBP_WARNING);
    return false;
  }

  fs.mkdirSync(generatedDirectory, { recursive: true });

  listImageFiles(sourceDirectory, optimizableExt).forEach((file) => {
    const sourceFile = path.join(sourceDirectory, file);
    const outputFile = path.join(generatedDirectory, generatedFilenameFor(file));
    if (!shouldRegenerate(sourceFile, outputFile)) {
      return;
    }

    const result = spawnSync(
      "cwebp",
      [
        "-quiet",
        "-q",
        String(quality),
        "-resize",
        String(width),
        String(height),
        sourceFile,
        "-o",
        outputFile,
      ],
      { stdio: "inherit" }
    );

    if (result.status !== 0) {
      throw new Error(`Failed to optimize ${sourceFile}`);
    }
  });

  return true;
};

const writeJson = (file, data) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
};

const writeImageIndex = (directory) => {
  writeJson(path.join(directory, "index.json"), listImageFiles(directory));
};

const parseCommaValues = (value) =>
  (value || "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);

const parseFrontMatter = (markdown) => {
  if (!markdown.startsWith("---")) {
    return { meta: {}, body: markdown };
  }

  const end = markdown.indexOf("\n---", 3);
  if (end === -1) {
    return { meta: {}, body: markdown };
  }

  const meta = {};
  markdown
    .slice(3, end)
    .trim()
    .split("\n")
    .forEach((line) => {
      const [key, ...rest] = line.split(":");
      if (!key || !rest.length) return;
      meta[key.trim()] = rest.join(":").trim();
    });

  return {
    meta,
    body: markdown.slice(end + 4),
  };
};

const extractTitle = (markdown) => {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : "";
};

const buildFeedIndex = (directory, defaultKind) => {
  const indexFile = path.join(directory, "index.json");
  if (!fs.existsSync(indexFile)) {
    return [];
  }

  const files = JSON.parse(fs.readFileSync(indexFile, "utf8"));
  if (!Array.isArray(files)) {
    return [];
  }

  return files
    .map((file) => {
      const markdownFile = path.join(directory, file);
      if (!fs.existsSync(markdownFile)) {
        return null;
      }

      const markdown = fs.readFileSync(markdownFile, "utf8");
      const { meta, body } = parseFrontMatter(markdown);
      const title = meta.title || extractTitle(body) || "Untitled";
      const labels = parseCommaValues(meta.label);
      return {
        kind: labels[0] || defaultKind,
        title,
        date: meta.date || "",
        author: meta.author || "Ved Panse",
        excerpt: meta.excerpt || "",
        imageAlt: title,
        slug: file.replace(/\.md$/i, ""),
      };
    })
    .filter(Boolean);
};

const mergeWithExistingIcons = (generatedIcons, existingIcons) => {
  const generatedByKey = new Map(generatedIcons.map((icon) => [iconKeyFromSrc(icon.src), icon]));
  const used = new Set();
  const preserved = existingIcons
    .filter((icon) => generatedByKey.has(iconKeyFromSrc(icon.src)))
    .map((icon) => {
      const key = iconKeyFromSrc(icon.src);
      const generatedIcon = generatedByKey.get(key);
      used.add(key);
      return {
        ...generatedIcon,
        label: icon.label || generatedIcon.label,
      };
    });
  const additions = generatedIcons.filter((icon) => !used.has(iconKeyFromSrc(icon.src)));
  return [...preserved, ...additions];
};

const hasOptimizedTechIcons = ensureOptimizedImages(techIconsDir, generatedTechIconsDir, {
  width: 256,
  height: 256,
  quality: 82,
});
const hasOptimizedProjectIcons = ensureOptimizedImages(projectIconsDir, generatedProjectIconsDir, {
  width: 256,
  height: 256,
  quality: 82,
});
const hasOptimizedCompanyLogos = ensureOptimizedImages(companyLogosDir, generatedCompanyLogosDir, {
  width: 256,
  height: 256,
  quality: 82,
});
const hasOptimizedWorkBanners = ensureOptimizedImages(workBannersDir, generatedWorkBannersDir, {
  width: 960,
  height: 0,
  quality: 78,
});
const techIconCandidates = hasOptimizedTechIcons
  ? readDisplayIcons(techIconsDir, "assets/tech", generatedTechIconsDir, "assets/generated/tech")
  : readIcons(techIconsDir, "assets/tech");
const techIcons = mergeWithExistingIcons(techIconCandidates, readExistingIcons(techOutputFile));
const projectIcons = hasOptimizedProjectIcons
  ? readIcons(generatedProjectIconsDir, "assets/generated/project-icons")
  : readIcons(projectIconsDir, "assets/project-icons");
const companyLogos = hasOptimizedCompanyLogos
  ? readIcons(generatedCompanyLogosDir, "assets/generated/company-logo")
  : readIcons(companyLogosDir, "assets/company-logo");

writeJson(techOutputFile, { icons: techIcons });
writeJson(projectOutputFile, { icons: projectIcons });
writeJson(companyLogoOutputFile, { icons: companyLogos });
if (hasOptimizedWorkBanners) {
  writeImageIndex(generatedWorkBannersDir);
}
const blogFeedItems = buildFeedIndex(blogsDir, "Blog");
const researchFeedItems = buildFeedIndex(researchDir, "Research");
writeJson(path.join(blogsDir, "feed.json"), blogFeedItems);
writeJson(path.join(researchDir, "feed.json"), researchFeedItems);
console.log(`Wrote ${techIcons.length} icons to ${techOutputFile}`);
console.log(`Wrote ${projectIcons.length} icons to ${projectOutputFile}`);
console.log(`Wrote ${companyLogos.length} icons to ${companyLogoOutputFile}`);
if (hasOptimizedWorkBanners) {
  console.log(`Wrote optimized work banner index to ${path.join(generatedWorkBannersDir, "index.json")}`);
}
console.log(`Wrote ${blogFeedItems.length} blog feed items to ${path.join(blogsDir, "feed.json")}`);
console.log(`Wrote ${researchFeedItems.length} research feed items to ${path.join(researchDir, "feed.json")}`);
