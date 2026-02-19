---
label: Research Notes
date: February 11, 2026
title: Tool use isn't the hard part — knowing when not to is
excerpt: Most agents fail not because they can't use tools, but because they don't know when to stop.
---
# Tool use isn't the hard part — knowing when not to is

![](assets/banners/tools.png)

Tool use looks impressive in demos.

The agent calls an API.
It writes code.
It queries a database.
It chains actions together.

From the outside, this feels like progress. The system is *doing things*. But once you run agents for longer than a few minutes, a different problem shows up.

They don't struggle to use tools.

They struggle to **decide whether a tool should be used at all**.

## Tool use creates momentum — not judgment

Most agent architectures treat tools as affordances.

If a tool is available, it's considered an option. And once it's an option, the agent is incentivized to use it. Calling a tool feels like “making progress,” even when it isn't.

I've seen agents:
- re-query the same endpoint with slightly different parameters  
- call tools to confirm things they already know  
- chain actions long after the task is effectively complete  

Nothing is technically wrong. Every step is defensible in isolation. But the system accumulates motion without direction.

Tool use creates momentum.
Judgment is what's missing.

## The absence of a stopping signal

One thing that stands out is how few agents have a real notion of *enough*.

There's usually:
- a success condition  
- an error condition  

But almost nothing in between.

So when a task is mostly solved — or solved in spirit but not in form — the agent keeps going. It refines, verifies, rechecks, and expands scope. Not because the task requires it, but because nothing tells it to stop.

Humans do this intuitively.
Agents don't.

Without a stopping signal, tool use turns into quiet overreach.

## Tool confidence compounds mistakes

Another issue is how confident tool outputs feel to the system.

Once something comes back from a tool — an API response, a file read, a computation — it's treated as authoritative. That makes sense. Tools are supposed to ground the agent.

But when the *choice* to use the tool was unnecessary, the result still gets elevated.

The agent doesn't just act.
It **cements**.

A marginal decision followed by a confident tool result becomes a strong prior. And later reasoning builds on it as if it were required in the first place.

This is how small misjudgments turn into structural errors.

## More tools make this worse, not better

Adding more tools increases capability, but it also increases temptation.

With enough tools available, every ambiguity looks actionable. Every uncertainty becomes an excuse to do something. The agent stops sitting with ambiguity and starts trying to eliminate it through action.

That's not intelligence.
That's anxiety.

The best human operators know when *not* to touch the system. Most agents don't.

## What I think is missing

I don't think the solution is better tool descriptions or more examples.

What's missing is a concept of:
- **cost**, not just capability  
- **irreversibility**, not just success  
- **diminishing returns**, not just correctness  

Agents need to learn that doing nothing is sometimes the right move — and that restraint is a form of competence.

Right now, tool use is treated as neutral.
In reality, it should be expensive.

## Where this leaves me

I'm less interested in making agents that can use *more* tools.

I'm more interested in agents that know when a tool call would make things worse.

Until we give systems a way to value restraint, they'll keep mistaking activity for intelligence.

And they won't fail loudly.

They'll just keep doing things long after they should have stopped.