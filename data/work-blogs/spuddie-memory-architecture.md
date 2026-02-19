---
label: Work Blog
date: January 26, 2026
title: Spuddie - Building long-term memory for an AI companion
excerpt: A practical memory architecture for preserving user context across sessions without polluting relevance.
---
# Spuddie - Building long-term memory for an AI companion

![Spuddie logo](assets/work/spuddie/spuddie.png)

Spuddie didn’t start as a memory problem. It started as a vibe problem. The assistant felt sharp in a single session and oddly forgetful across sessions, like it had great short-term instincts but no sense of continuity. Users would say something meaningful one day and expect it to still matter the next. The system technically had access to history, but access isn’t the same thing as memory.

The naive approach was obvious: just append more conversation history. That worked until it didn’t. Prompts got longer, cost went up, and relevance quietly went down. Important signals were buried under small talk. The assistant would recall something technically related but emotionally off, or latch onto a recent trivial detail instead of a stable preference that had been expressed weeks ago. It wasn’t forgetting; it was mis-prioritizing.

So the problem became less about storage and more about structure.

## Why transcript replay fails

A raw transcript is not a memory model. It’s a log. Logs are great for auditing, not for reasoning. When you replay a transcript into a prompt, you’re asking the model to rediscover structure every time. That’s wasteful and brittle. It also makes debugging nearly impossible, because you can’t explain why a specific sentence was retrieved beyond “it was in the last N tokens.”

What we needed was a way to separate noise from signal without pretending we knew everything upfront.

## The architecture shift

Instead of replaying transcripts, we introduced structured memory objects. Short-term conversational context stayed in one lane. Longer-term facts moved into another. Preferences, constraints, recurring projects, tone cues—those became typed entries rather than raw text blobs.

We separated episodic memory (things that happened in specific conversations) from stable profile attributes (things that define the user more persistently). That separation alone reduced a lot of accidental bleed-through, where a one-off statement would masquerade as a permanent preference.

Retrieval was treated as its own system. We scored memories by recency, confidence, and task relevance rather than dumping everything into the prompt. The model would get a curated set of context instead of a wall of text. That made behavior more predictable and, importantly, explainable.

![Memory object schema + retrieval scoring diagram](assets/work/spuddie/spuddie-flow.png)

## What changed in practice

Responses started feeling less erratic. The assistant would remember ongoing goals without rehashing irrelevant details. Prompt size stabilized. Debugging got easier because retrieval became observable; we could inspect which memories were selected and why.

It also made failures clearer. When something was wrong, we could ask: was it stored incorrectly, or retrieved incorrectly? Before, everything was tangled together.

## What I took away

Long-term memory isn’t about hoarding data. It’s about disciplined retention and disciplined retrieval. Storing everything is easy. Retrieving the right thing, at the right time, without polluting the present—that’s the real product.

And once you separate those two concerns, the system starts to behave less like a clever demo and more like something you can reason about.