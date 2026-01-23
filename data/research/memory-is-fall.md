---
label: Research Notes
date: February 7, 2026
title: Memory is where agents quietly fall apart
excerpt: Most long-horizon failures I’ve seen don’t come from forgetting. They come from remembering too much, too confidently.
---
# Memory is where agents quietly fall apart

![](assets/banners/memory.png)

When agents fail, it’s usually not in a way that draws attention.

They don’t crash.  
They don’t obviously hallucinate.  
They don’t do anything that looks “wrong” in isolation.

They just get a little worse each time you run them.

They repeat themselves more. They lean on old assumptions. They stop reacting cleanly to new information. And if you weren’t watching closely, you’d think the system was basically fine.

In almost every case I’ve seen like this, the issue wasn’t reasoning. It was memory.

## Memory feels helpful at first

Early versions of agents feel forgetful. So the natural instinct is to fix that.

You add summaries. You persist state. You store past tool outputs. You attach embeddings. You keep track of what worked last time. And for a while, this genuinely helps. The agent feels more coherent. Less scattered. Less naive.

It starts to feel like it has continuity.

The problem is that continuity hardens faster than you expect.

## What actually goes wrong

Most memory systems only grow. They almost never shrink.

Once something gets written down — a conclusion, a preference, a partial plan — it sticks around. And the system starts to treat that stored state as truth, even when the conditions that produced it are long gone.

Over time, the agent stops reasoning directly from what it sees. It reasons *through* what it remembers.

That’s when things get dangerous.

Not because the memory is wrong, but because it’s unchallenged.

## Memory slowly becomes authority

I’ve noticed that when an agent’s memory conflicts with fresh input, memory usually wins.

The current signal might be noisy or incomplete. The stored state looks clean and confident. So the agent defers to it. That makes sense locally. But globally, it causes drift.

The system becomes consistent with itself and less aligned with the world.

Nothing breaks immediately. The agent still “works.” It just starts solving yesterday’s problems instead of today’s.

## Compression hides the reasons, not just the details

Another subtle issue is how memory gets compressed.

Summaries and embeddings preserve outcomes, but they tend to erase *why* something was decided. Uncertainty disappears first. Doubt never makes it into storage.

So later, when the agent revisits a past decision, it doesn’t see a hypothesis — it sees a fact. There’s no trace of hesitation, no record of alternatives that were considered and rejected.

The agent isn’t adapting anymore. It’s following precedent.

That looks a lot like intelligence until the environment shifts.

## Forgetting might actually be necessary

At this point, I don’t think better memory means more memory.

It probably means:
- letting old conclusions decay  
- revisiting assumptions instead of stacking on top of them  
- treating stored state as provisional, not authoritative  

We don’t have good primitives for this yet. Deleting memory can destabilize behavior. Keeping it all makes systems rigid. Right now, most implementations choose rigidity without meaning to.

## Where this leaves me

I’m increasingly convinced that long-horizon agent failures aren’t caused by ignorance.

They’re caused by certainty that should have expired.

Memory should help an agent stay grounded — not trap it in its own past. Until we figure out how to make memory revisable, degradable, and explicitly uncertain, agents will keep failing in the same quiet way.

They won’t explode.

They’ll just slowly stop being right.