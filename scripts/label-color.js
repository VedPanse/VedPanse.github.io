const hashString = (value) => {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

const TAU = Math.PI * 2;
const GOLDEN_RATIO_CONJUGATE = 0.6180339887498949;
const fract = (value) => value - Math.floor(value);

const createSeededRng = (seed) => {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x9e3779b9) >>> 0;
    let mixed = state;
    mixed = Math.imul(mixed ^ (mixed >>> 16), 0x21f0aaad);
    mixed = Math.imul(mixed ^ (mixed >>> 15), 0x735a2d97);
    mixed ^= mixed >>> 15;
    return (mixed >>> 0) / 4294967296;
  };
};

const gaussianInfluence = (value, center, spread) => {
  const delta = value - center;
  return Math.exp(-(delta * delta) / (2 * spread * spread));
};

const harmonicHueWarp = (position, phaseA, phaseB) => {
  const waveA = Math.sin(TAU * (position + phaseA));
  const waveB = 0.56 * Math.sin(TAU * (2 * position + phaseB));
  const waveC = 0.28 * Math.sin(TAU * (3 * position + phaseA * 0.6 + phaseB * 0.4));
  return 0.11 * waveA + 0.07 * waveB + 0.04 * waveC;
};

// Mirrors the accent color logic used in Work Experience cards.
const accentFromLabel = (label) => {
  const seed = (label || "label").trim().toLowerCase();
  const baseHash = hashString(seed) ^ hashString(`${seed}:accent`);
  const random = createSeededRng(baseHash);
  const primary = random();
  const secondary = random();
  const phaseA = random();
  const phaseB = random();
  const chromaNoise = random();
  const lightNoise = random();

  const hueSeed = fract(primary + GOLDEN_RATIO_CONJUGATE * secondary);
  const warpedHue = fract(hueSeed + harmonicHueWarp(hueSeed, phaseA, phaseB) + (random() - 0.5) * 0.03);
  const hue = warpedHue * 360;
  const hueRadians = (hue * Math.PI) / 180;

  const warmPenalty = gaussianInfluence(hue, 62, 17);
  const cyanPenalty = gaussianInfluence(hue, 192, 22);
  const coolBoost = gaussianInfluence(hue, 292, 30);

  let saturation =
    76 +
    Math.round(chromaNoise * 12) +
    Math.round(6 * Math.cos(hueRadians - 0.4)) -
    Math.round(8 * cyanPenalty) +
    Math.round(5 * coolBoost);

  let lightness =
    54 +
    Math.round((lightNoise - 0.5) * 8) +
    Math.round(5 * Math.sin(hueRadians + 0.2)) -
    Math.round(7 * warmPenalty);

  saturation = Math.min(Math.max(saturation, 68), 92);
  lightness = Math.min(Math.max(lightness, 45), 62);

  return { hue: Math.round(hue), saturation, lightness };
};

export const applyLabelColor = (element, label) => {
  if (!element) return;
  const { hue, saturation, lightness } = accentFromLabel(label);
  const darkBgLight = Math.max(14, Math.min(28, lightness - 30));
  const darkTextLight = Math.max(70, Math.min(86, lightness + 22));
  const lightBgLight = Math.max(92, Math.min(97, 100 - (lightness - 50) * 0.2));
  const lightTextLight = Math.max(24, Math.min(40, lightness - 20));

  element.style.setProperty("--label-hue", String(hue));
  element.style.setProperty("--label-sat", `${saturation}%`);
  element.style.setProperty("--label-dark-bg-light", `${darkBgLight}%`);
  element.style.setProperty("--label-dark-text-light", `${darkTextLight}%`);
  element.style.setProperty("--label-light-bg-light", `${lightBgLight}%`);
  element.style.setProperty("--label-light-text-light", `${lightTextLight}%`);
};
