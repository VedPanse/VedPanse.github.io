# Research Markdown Syntax

Use this format for every file in `data/research/`.

## Required front matter

```yaml
---
label: Quick Read
date: December 8, 2025
title: Multimodal agents reach production with a new orchestration layer.
excerpt: A concise update on the tooling that made production-grade multimodal workflows possible.
---
```

- `label` shows above the title.
- `date` must be parseable (e.g., `December 8, 2025`).
- `title` must match the first `#` heading in the file.
- `excerpt` appears under the title on the post page and can be used for cards.

## Required content order

1) **Title** as an H1:

```md
# Your Research Title Here
```

2) **Hero image** immediately after the title:

```md
![Caption text that appears under the image](path/to/image.png)
```

The caption is pulled from the image alt text.

3) **Body content** (any order after the image):

- Paragraphs
- Headings (`##`, `###`)
- Bullet lists (`-`)
- Numbered lists (`1.`)
- Blockquotes (`> ...`)
- Code blocks (```)
- Tables

## Supported markdown features

- **Bold**: `**text**`
- *Italic*: `*text*`
- Links: `[label](https://example.com)`
- Images: `![caption](path/to/image.png)`
- Blockquotes: `> quoted text`
- Code blocks:

````md
```
const example = true;
```
````

- Tables:

```md
| Metric | Definition | Target |
| --- | --- | --- |
| Adoption | % of teams shipping with the system | 70%+ |
```

## File naming

- Filename must be the slug: `data/research/<slug>.md`.
- The link uses `research.html?post=<slug>`.

## Minimal template

```md
---
label: Update
date: January 15, 2026
title: Example research update title
excerpt: One-line summary for the hero area.
---
# Example research update title

![Caption that appears beneath the image](assets/banners/projects-banner.png)

First paragraph goes here.
```
