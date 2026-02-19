---
label: Work Blog
date: January 26, 2026
title: Spuddie - Building long-term memory for an AI companion
excerpt: A practical memory architecture for preserving user context across sessions without polluting relevance.
---
# Spuddie - Building long-term memory for an AI companion

The core challenge was continuity. Users expected the assistant to remember prior context naturally, not just recall isolated snippets.

## Failure mode in naive memory

Appending conversation history into a larger prompt increased cost and often reduced relevance. Important details were buried under noisy short-term context.

## Architecture decisions

- introduced structured memory objects instead of raw transcript replay
- separated episodic memories from stable user profile attributes
- added retrieval scoring tuned for recency, confidence, and task relevance

## Outcomes

- improved perceived response relevance across sessions
- reduced context bloat in prompt assembly
- enabled predictable debugging of memory retrieval behavior

## Key lesson

Long-term memory only works when retention and retrieval are independent systems. Storing everything is easy. Retrieving the right thing is the product.
