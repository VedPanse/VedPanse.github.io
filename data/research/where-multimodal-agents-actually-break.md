---
label: Research Notes
date: January 31, 2026
title: Where multimodal agents actually break
excerpt: Early failures in multimodal systems rarely come from models — they come from orchestration, latency, and brittle assumptions.
---
# Where multimodal agents actually break

![Abstract pixel diagram of signals diverging across systems](assets/banners/multimodal-breaks.png)

Multimodal agents tend to fail in places that don’t show up in demos.

In controlled settings, combining text, vision, and tools looks straightforward. Each modality performs well in isolation, and early integrations feel surprisingly capable. But once these systems are pushed into longer-running workflows — especially ones that involve uncertainty, retries, or partial failure — a different set of problems emerges.

Most of them are not model problems.

They are systems problems.

## The illusion of early success

The first thing that breaks is confidence.

A multimodal agent that succeeds three times in a row feels reliable. But those successes are often tightly scoped:
- short contexts  
- single-shot reasoning  
- clean inputs  
- predictable tool behavior  

As soon as the agent is asked to operate over longer horizons, the cracks appear. The failures are subtle at first — delayed responses, slightly off interpretations, repeated tool calls — but they compound quickly.

What looks like intelligence at small scale turns into fragility at larger ones.

## Failure mode 1: orchestration drift

The most common failure I’ve observed is **orchestration drift**.

As agents make decisions across multiple modalities, the control logic that coordinates them slowly loses alignment with the original task. The agent isn’t “confused” in a human sense — it’s following its incentives too literally.

Symptoms include:
- repeated calls to the same tool with slightly different parameters  
- over-weighting one modality (often text) when signals disagree  
- escalating complexity instead of converging  

This isn’t a reasoning failure. It’s a coordination failure.

## Failure mode 2: latency compounds into behavior

Latency is not just a performance issue — it’s a behavioral one.

In multimodal systems, delays between perception, reasoning, and action change how agents behave. Vision outputs arrive late. Tool calls block. Retries stack. The agent begins making decisions based on stale or partial state.

At that point, even a strong model will appear unreliable.

What’s interesting is that these failures don’t show up in unit tests. They only emerge when systems run continuously, under load, with real delays.

## Failure mode 3: brittle assumptions between modalities

Each modality carries implicit assumptions:
- text assumes clarity  
- vision assumes stable framing  
- tools assume deterministic responses  

When those assumptions collide, the agent has no natural way to arbitrate. Most systems default to whichever signal arrives first or looks most confident.

That choice is rarely correct.

The agent doesn’t need more intelligence here — it needs better rules.

## What this suggests (and what it doesn’t)

These failures don’t suggest that multimodal agents are fundamentally flawed. They suggest that we’ve been over-attributing success to models and under-investing in orchestration.

Better prompts won’t fix this.
Larger models won’t fix this.
More data won’t fix this.

What will help:
- explicit control layers  
- clearer termination conditions  
- tighter feedback loops between modalities  

## Open questions

There are still things I don’t understand yet:
- How to detect orchestration drift early, before behavior degrades  
- Whether some modalities should be intentionally weakened to stabilize the whole  
- How to evaluate long-horizon multimodal behavior without oversimplifying it  

This is ongoing work. These notes reflect where my thinking is *now*, not where it will end up.

For now, the main lesson is simple:  
**multimodal agents don’t break because models are weak — they break because systems are brittle.**