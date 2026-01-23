---
label: Research Notes
date: February 3, 2026
title: Evaluation is the real unsolved problem
excerpt: We know how to build capable agents. We still don’t know how to tell if they’re actually working.
---
# Evaluation is the real unsolved problem

![](assets/banners/evaluation.png)

Most conversations about agentic systems focus on capability.

Can it reason?
Can it plan?
Can it use tools?
Can it recover from errors?

Those questions matter — but they distract from the harder one:

**How do you know when an agent is doing its job well?**

## Why benchmarks stop helping early

Benchmarks feel comforting because they give numbers. Scores go up, charts look clean, and progress feels measurable.

But most benchmarks collapse the moment an agent leaves a tightly scoped environment.

They assume:
- a clear objective  
- a short time horizon  
- a single correct outcome  
- no memory of prior failure  

Real systems violate all of those assumptions.

An agent can “pass” a benchmark while failing in ways that matter — looping quietly, making redundant calls, or degrading performance over time without ever triggering a hard error.

From the outside, it looks fine.
From the inside, it’s drifting.

## The problem with binary success

Most evaluations treat outcomes as binary: success or failure.

But real agent behavior lives in between.

An agent that completes a task inefficiently.
An agent that succeeds but breaks invariants.
An agent that adapts, but in the wrong direction.
An agent that avoids failure by doing nothing.

These aren’t edge cases — they’re the dominant modes once systems run long enough.

Binary metrics flatten all of that nuance into a single bit.

And that bit lies.

## What actually needs to be measured

The hardest things to measure are also the most important:

- **Stability over time**  
- **Sensitivity to partial failure**  
- **Behavior under degraded inputs**  
- **Recovery paths, not just outcomes**  

Right now, we mostly ignore these because they’re inconvenient to formalize.

But systems don’t fail because they make one bad decision. They fail because small deviations compound without being noticed.

Evaluation should catch that.
It usually doesn’t.

## The uncomfortable implication

If evaluation is weak, optimization is blind.

You can improve models, prompts, and architectures indefinitely — but without better signals, you won’t know *what* you’re improving. You’ll just know that something changed.

This is why so many agent demos feel impressive but fragile.
They are optimized for being seen, not for being trusted.

## Open questions I don’t have answers to yet

- How do you score *graceful degradation*?
- How do you detect slow failure before users feel it?
- How do you evaluate systems whose goals evolve over time?
- What does a “unit test” even mean for long-horizon behavior?

I don’t think these questions are solved by larger models or better prompts.

They require different thinking — closer to systems engineering than ML benchmarking.

For now, this is where my attention is.

Not on making agents smarter —  
but on figuring out how to tell when they’re quietly breaking.
