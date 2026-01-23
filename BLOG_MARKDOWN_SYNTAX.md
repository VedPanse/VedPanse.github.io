# Blog Markdown Syntax

Use this format for every file in `data/blogs/`.

## Required front matter

```yaml
---
label: Build Log
date: January 4, 2026
title: How we shipped a multi-surface design system in six weeks
excerpt: A tight, repeatable playbook for shipping a shared system quickly.
---
```

- `label` shows above the title.
- `date` must be parseable (e.g., `January 4, 2026`).
- `title` must match the first `#` heading in the file.
- `excerpt` appears under the title on the post page and can be used for cards.

## Required content order

1) **Title** as an H1:

```md
# Your Blog Title Here
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

- Filename must be the slug: `data/blogs/<slug>.md`.
- The link uses `blog.html?post=<slug>`.

## Minimal template

```md
---
label: Deep Dive
date: January 12, 2026
title: Example blog post title
excerpt: One-line summary for the hero area.
---
# Example blog post title

![Caption that appears beneath the image](assets/banners/projects-banner.png)

First paragraph goes here.
```
