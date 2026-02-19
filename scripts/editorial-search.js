const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "by",
  "for",
  "from",
  "how",
  "in",
  "is",
  "it",
  "of",
  "on",
  "or",
  "that",
  "the",
  "this",
  "to",
  "was",
  "we",
  "with",
  "you",
]);

const SYNONYM_CLUSTERS = [
  ["ai", "ml", "llm", "model", "models", "machine", "learning", "intelligence"],
  ["agent", "agents", "agentic", "assistant", "autonomous", "automation"],
  ["memory", "state", "context", "recall", "retention"],
  ["evaluation", "evaluate", "eval", "benchmark", "metrics", "testing"],
  ["tool", "tools", "api", "apis", "function", "functions"],
  ["research", "study", "analysis", "paper", "papers"],
  ["blog", "blogs", "post", "posts", "writing", "reflection"],
  ["build", "building", "ship", "shipping", "product", "products"],
  ["failure", "failing", "error", "errors", "mistake", "mistakes", "break", "breaking"],
];

const SYNONYM_MAP = (() => {
  const map = new Map();
  SYNONYM_CLUSTERS.forEach((cluster) => {
    const normalized = cluster.map((token) => token.toLowerCase());
    normalized.forEach((token) => {
      const set = map.get(token) || new Set();
      normalized.forEach((neighbor) => set.add(neighbor));
      map.set(token, set);
    });
  });
  return map;
})();

const normalizeText = (value = "") =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const stemToken = (value) => {
  let token = value;
  if (token.length > 5 && token.endsWith("ies")) token = `${token.slice(0, -3)}y`;
  else if (token.length > 4 && token.endsWith("ing")) token = token.slice(0, -3);
  else if (token.length > 3 && token.endsWith("ed")) token = token.slice(0, -2);
  if (token.length > 4 && token.endsWith("es")) token = token.slice(0, -2);
  else if (token.length > 3 && token.endsWith("s")) token = token.slice(0, -1);
  return token;
};

const tokenize = (value = "") =>
  normalizeText(value)
    .split(" ")
    .map((token) => stemToken(token.trim()))
    .filter((token) => token.length >= 2 && !STOP_WORDS.has(token));

const toTrigrams = (value = "") => {
  const normalized = normalizeText(value);
  if (!normalized) return new Set();
  const padded = `  ${normalized} `;
  const grams = new Set();
  for (let index = 0; index < padded.length - 2; index += 1) {
    grams.add(padded.slice(index, index + 3));
  }
  return grams;
};

const diceCoefficient = (left, right) => {
  if (!left.size || !right.size) return 0;
  let intersection = 0;
  left.forEach((gram) => {
    if (right.has(gram)) intersection += 1;
  });
  return (2 * intersection) / (left.size + right.size);
};

const addWeightedTokens = (target, tokens, weight) => {
  tokens.forEach((token) => {
    const current = target.get(token) || 0;
    target.set(token, current + weight);
  });
};

const computeVectorNorm = (weights) => {
  let total = 0;
  weights.forEach((value) => {
    total += value * value;
  });
  return Math.sqrt(total);
};

const buildQueryTerms = (queryTokens) => {
  const weighted = new Map();

  const add = (token, weight) => {
    const current = weighted.get(token) || 0;
    weighted.set(token, Math.max(current, weight));
  };

  queryTokens.forEach((token) => {
    add(token, 2.8);
    const synonyms = SYNONYM_MAP.get(token);
    if (synonyms) {
      synonyms.forEach((synonym) => {
        const stemmed = stemToken(synonym);
        if (stemmed !== token) add(stemmed, 1.2);
      });
    }
  });

  return weighted;
};

const buildDocument = (item) => {
  const title = item.title || "";
  const author = item.author || "";
  const tags = Array.isArray(item.tags) ? item.tags.join(" ") : "";
  const excerpt = item.excerpt || "";
  const content = item.content || "";

  const titleTokens = tokenize(title);
  const authorTokens = tokenize(author);
  const tagTokens = tokenize(tags);
  const excerptTokens = tokenize(excerpt);
  const bodyTokens = tokenize(content);

  const weightedTerms = new Map();
  addWeightedTokens(weightedTerms, titleTokens, 4.8);
  addWeightedTokens(weightedTerms, tagTokens, 4.1);
  addWeightedTokens(weightedTerms, authorTokens, 3.2);
  addWeightedTokens(weightedTerms, excerptTokens, 2.4);
  addWeightedTokens(weightedTerms, bodyTokens, 1.0);

  return {
    item,
    fields: {
      title: normalizeText(title),
      author: normalizeText(author),
      tags: normalizeText(tags),
      excerpt: normalizeText(excerpt),
      content: normalizeText(content),
    },
    tokenSets: {
      title: new Set(titleTokens),
      author: new Set(authorTokens),
      tags: new Set(tagTokens),
      excerpt: new Set(excerptTokens),
      body: new Set(bodyTokens),
      all: new Set([...titleTokens, ...authorTokens, ...tagTokens, ...excerptTokens, ...bodyTokens]),
    },
    weightedTerms,
    trigrams: toTrigrams([title, author, tags, excerpt, content].join(" ")),
    dateValue: Date.parse(item.date || "") || 0,
  };
};

const cosineScore = (queryWeights, queryNorm, documentWeights, documentNorm) => {
  if (!queryNorm || !documentNorm) return 0;
  let dot = 0;
  queryWeights.forEach((weight, token) => {
    dot += weight * (documentWeights.get(token) || 0);
  });
  return dot / (queryNorm * documentNorm);
};

export const createEditorialSearcher = (items) => {
  const docs = items.map((item) => buildDocument(item));

  const docFrequency = new Map();
  docs.forEach((doc) => {
    doc.tokenSets.all.forEach((token) => {
      docFrequency.set(token, (docFrequency.get(token) || 0) + 1);
    });
  });

  const totalDocs = Math.max(docs.length, 1);
  const idf = (token) => Math.log((totalDocs + 1) / ((docFrequency.get(token) || 0) + 1)) + 1;

  docs.forEach((doc) => {
    const tfidf = new Map();
    doc.weightedTerms.forEach((weight, token) => {
      tfidf.set(token, weight * idf(token));
    });
    doc.tfidf = tfidf;
    doc.tfidfNorm = computeVectorNorm(tfidf);
  });

  const newestDate = docs.reduce((max, doc) => Math.max(max, doc.dateValue), 0);
  const oldestDate = docs.reduce((min, doc) => (min ? Math.min(min, doc.dateValue) : doc.dateValue), 0);
  const dateRange = Math.max(newestDate - oldestDate, 1);

  return (query) => {
    const raw = normalizeText(query || "");
    if (!raw) return items;

    const queryTokens = tokenize(raw);
    if (!queryTokens.length) return [];

    const queryTerms = buildQueryTerms(queryTokens);
    const queryTfidf = new Map();
    queryTerms.forEach((weight, token) => {
      queryTfidf.set(token, weight * idf(token));
    });
    const queryNorm = computeVectorNorm(queryTfidf);
    const queryTrigrams = toTrigrams(raw);

    const ranked = docs
      .map((doc) => {
        let score = 0;
        let tokenHits = 0;

        const titleHasPhrase = doc.fields.title.includes(raw);
        const authorHasPhrase = doc.fields.author.includes(raw);
        const tagsHavePhrase = doc.fields.tags.includes(raw);
        const excerptHasPhrase = doc.fields.excerpt.includes(raw);
        const contentHasPhrase = doc.fields.content.includes(raw);

        if (titleHasPhrase) score += 115;
        if (tagsHavePhrase) score += 90;
        if (authorHasPhrase) score += 72;
        if (excerptHasPhrase) score += 42;
        if (contentHasPhrase) score += 34;

        queryTokens.forEach((token) => {
          if (doc.tokenSets.title.has(token)) {
            score += 34;
            tokenHits += 1;
          } else if (doc.tokenSets.tags.has(token)) {
            score += 28;
            tokenHits += 1;
          } else if (doc.tokenSets.author.has(token)) {
            score += 21;
            tokenHits += 1;
          } else if (doc.tokenSets.excerpt.has(token) || doc.tokenSets.body.has(token)) {
            score += 13;
            tokenHits += 1;
          }
        });

        const cosine = cosineScore(queryTfidf, queryNorm, doc.tfidf, doc.tfidfNorm);
        const trigram = diceCoefficient(queryTrigrams, doc.trigrams);
        score += cosine * 140;
        score += trigram * 72;

        const recencyBoost = doc.dateValue ? ((doc.dateValue - oldestDate) / dateRange) * 6 : 0;
        score += recencyBoost;

        const hasSignal =
          tokenHits > 0 || titleHasPhrase || tagsHavePhrase || authorHasPhrase || cosine > 0.08 || trigram > 0.2;
        if (!hasSignal) return null;

        return { item: doc.item, score };
      })
      .filter(Boolean)
      .sort((left, right) => right.score - left.score);

    return ranked.map((entry) => entry.item);
  };
};

export const markdownToSearchText = (markdown = "") =>
  markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^#+\s+/gm, "")
    .replace(/[*_~>#-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
