---
label: Reflection
date: February 18, 2026
title: What a DSL taught me about failing slowly
excerpt: I started this project in grade 8 out of curiosity. It still isn't done. That's the point.
---
# What a DSL taught me about failing slowly

![Failing continuously](assets/banners/dsl.png)

I started building my DSL in grade 8, back when LLMs were not a thing.

There was no roadmap. No grand vision. I didn't even know the term “DSL” yet. I just wanted an easier way to express something I found annoying to write over and over again. So I started hacking.

That project is still alive today.

It's also failed more times than anything else I've worked on.

## Early failure looked like progress

At first, everything felt like momentum.

I'd invent syntax.
Then rewrite it.
Then scrap it.
Then build a parser.
Then throw it away.
Then start again.

Each version felt smarter than the last. More elegant. More powerful. I told myself that this was iteration — that every rewrite was a step forward.

In reality, I was mostly circling.

What I didn't understand back then is that **rewriting is the easiest form of optimism**. You get all the emotional reward of progress without having to live with consequences.

## The first hard lesson: expressiveness is a trap

My earliest versions of the language tried to do too much.

Every new annoyance turned into a new feature. Every edge case deserved syntax. Every limitation felt like a flaw instead of a boundary.

The language became expressive, clever, and completely unusable.

What I learned the hard way is that expressiveness feels like power — but power without constraint is noise. A DSL isn't successful when it can say everything. It's successful when it refuses to say most things.

Saying “no” in language design is harder than saying “yes.”
I avoided that for years.

## Failure forced me to think about users — even when the user was me

Eventually, something uncomfortable happened.

I stopped wanting to use my own language.

Not because it was broken — but because it was mentally expensive. I had to *remember* rules. I had to think about syntax instead of intent. I had built something impressive that made me slower.

That was a turning point.

It taught me that usability isn't about elegance or cleverness. It's about cognitive load. If a tool doesn't disappear while you're using it, it's failing — no matter how technically correct it is.

## Long-running projects expose your blind spots

Most projects end before they can teach you this.

Hackathons end.
Assignments ship.
Startups pivot.
Repos get archived.

This one didn't.

Because it stuck around, it kept exposing the same weaknesses in my thinking:
- I over-designed early  
- I chased flexibility instead of clarity  
- I optimized syntax before semantics  
- I rewrote instead of stabilizing  

Each failure wasn't dramatic. It was quiet. Accumulative. The kind you only notice after years.

## The project didn't fail — my mental model did

The biggest shift wasn't technical.

It was realizing that the project wasn't “behind” or “unfinished.” It was doing exactly what it was supposed to do: teach me how my instincts break down over time.

The DSL became less about shipping a language and more about learning restraint:
- committing to bad decisions long enough to feel their cost  
- resisting rewrites unless they fixed something real  
- designing around use, not possibility  

Ironically, progress only started once I stopped trying to make it perfect.

## Why I'm still working on it

This project outlived my attention span, my skill level at multiple stages, and several identities I had as a programmer.

That's why I keep it.

I started this DSL out of curiosity in grade 8.

I'm still working on it because it refuses to let me lie to myself about how I build things.