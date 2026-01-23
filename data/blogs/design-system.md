---
label: Build Log
date: January 4, 2026
title: How we shipped a multi-surface design system in six weeks
excerpt: A tight, repeatable playbook for shipping a shared system quickly.
---
# How we shipped a multi-surface design system in six weeks

![A fast-moving design system powering multiple surfaces](assets/banners/projects-banner.png)

Shipping a design system fast isn’t about cutting corners—it’s about **ruthless focus**, clear ownership, and a feedback loop that never sleeps. This long-form post documents the full playbook we used, including the exact rituals, artifacts, and decision frameworks that got us to production on time.

A design system should feel invisible when it works. Teams shouldn’t debate margins, colors, or component naming; they should build features with confidence. Our goal was to remove friction without removing craft.

We started with a premise: the system has to earn trust by shipping. So we aligned the roadmap with real product launches, not hypothetical future needs. Every sprint had a tangible deliverable inside a product.

## The one-sentence thesis

A design system only works when **tokens, components, and governance** are treated as a single product.

That meant we stopped treating the system as a library and started treating it as a platform team with a roadmap. There was an owner, a ship cadence, and a feedback loop. We defined what “done” meant every week.

We also defined what “not now” meant. Saying no quickly protected the integrity of the system. It prevented shadow components from taking root across teams.

### The subtitle mindset shift

We stopped treating the system as a library and started treating it as a platform team with a roadmap.

The key change was that the system wasn’t a side project. It had a backlog, a release train, and a steering group that could prioritize. That reduced churn and created a single narrative for how the system evolved.

## What we built

We launched a multi-surface system that ships to web, iOS, and internal tooling. The work happened in parallel across design, engineering, and ops.

We created a token layer, a component catalog, and a lightweight governance model. Then we instrumented adoption so we could see progress in real time.

### The components (and why they mattered)

- **Tokens**: color, type, spacing, motion.
- **Layouts**: grid, spacing, container rules.
- **Components**: buttons, cards, forms, navigation.
- **Patterns**: onboarding, search, empty states.

Each item had a real product touchpoint. Tokens powered theming, layouts mapped to marketing pages, and components replaced ad-hoc UI across apps. Patterns were built from what product teams already used, so adoption felt natural.

### A short checklist we used every week

1. Validate changes in two real products.
2. Update token documentation.
3. Review new components with accessibility.
4. Ship a release note.

The checklist became a weekly heartbeat. It kept quality high while maintaining speed. Everyone knew exactly what the finish line looked like.

## The operating model

We created a weekly governance loop. It was short, clear, and non-negotiable.

We met for thirty minutes. We reviewed live product screenshots, assessed drift, and decided what shipped. No debates outside the room. That consistency built trust fast.

> “A design system is only as good as its release cadence.”

### The ritual

Every Friday:

- Review new component requests.
- Audit live UI screenshots for drift.
- Decide what ships in the next release.

The ritual kept the system alive. Teams stopped asking, “Is this allowed?” and started asking, “When does this ship?” The system became predictable.

## The token pipeline

We used a minimal token pipeline that exports to CSS variables and Swift. Here’s the barebones shape:

```
{
  "color": {
    "brand": "#0a84ff",
    "surface": "#0b0b0c",
    "text": "#f5f5f7"
  },
  "spacing": {
    "xs": 4,
    "sm": 8,
    "md": 16,
    "lg": 24,
    "xl": 40
  }
}
```

The pipeline wasn’t fancy, but it was reliable. Consistency across platforms mattered more than a complex toolchain. We optimized for trust and clarity.

## Case study: the navigation component

We built a nav component that could live inside a product, but also feel at home in a newsroom. This is where **typography** and **spacing** did the heavy lifting.

The nav needed to scale down for mobile while staying sharp on desktop. We iterated through multiple sizing systems until we hit one that felt balanced across breakpoints.

### Why the spacing matters

A 2–4px shift in line height can change perceived quality. It also affects rhythm across entire pages.

Spacing is what makes a system feel premium. We measured spacing between every nav item, every icon, and every menu state. Small adjustments created a big leap in perceived polish.

## The metrics

We tracked the following every week:

- **Adoption** rate by product team.
- **Design debt** hours per feature.
- **Regression** count from UI drift.
- **Time-to-ship** for new components.

| Metric | Definition | Target |
| --- | --- | --- |
| Adoption | % of teams shipping with the system | 70%+ by week 6 |
| Design debt | Hours of UI rework per feature | < 4 hours |
| Regressions | UI bugs tied to drift | 0 critical |
| Time-to-ship | Days to release a new component | 3 days |

Those metrics were visible to everyone. It reduced debates and anchored decisions in evidence. If a component reduced design debt, it got priority.

## Results after six weeks

- 40% faster feature delivery on new surfaces
- Consistent UI across web + iOS in the first month
- Fewer regressions and fewer emergency fixes

The faster delivery wasn’t just from components. It came from alignment. When teams share a single visual language, decisions get easier.

## Common pitfalls

Avoid these early:

- Treating the system as a static library
- Shipping without accessibility review
- Letting teams fork components without governance

These pitfalls create drift. The system can’t recover if teams stop trusting it. Governance isn’t optional—it’s the glue.

---

## Final note

If you’re starting today, focus on **tokens, typography, and layout** before anything else. The system will scale from there.

Above all, make the system visible. Talk about it, ship with it, and celebrate teams that adopt it. That’s how it becomes durable.
