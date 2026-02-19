---
label: Work Blog
date: January 18, 2026
title: Falcon Eye — Making synthetic vision deterministic on constrained avionics
excerpt: Moving from “looks good in simulation” to “behaves predictably on real hardware,” which is the only version that matters in aviation.
---
# Falcon Eye — Making synthetic vision deterministic on constrained avionics

![Falcon Eye title card / synthetic vision visual](assets/work/falcon-eye/falcon-app.jpg)

Falcon Eye started as one of those projects that looks unfairly cool in simulation. You render terrain, you get this game-style 3D awareness, you fly a corridor through the world, and it feels like you've basically solved low-visibility flight. The catch is that simulation is a friendly liar. Everything is stable, your machine is fast, memory is abundant, and the worst-case inputs never show up unless you go looking for them. Real hardware doesn't lie like that, and avionics especially doesn't forgive it.

On our embedded targets, the same pipeline that looked smooth on my laptop would occasionally wobble. Not “crash and burn” wobble, more like the kind of jitter you notice out of the corner of your eye and then can't unsee. Frame pacing would drift, memory usage would spike at the wrong times, and parts of the stack behaved like they were optimized for average-case terrain instead of worst-case terrain. None of those things look dramatic in a demo, but they're exactly the things that make a pilot (or a certification reviewer) go: yeah… no.

So the real work ended up being less about making the visuals prettier and more about making the system boring. Predictable. Deterministic. The type of boring you actually want in a cockpit.

## Simulation-grade vs. flight-grade (this is where the project actually lived)

At some point I stopped thinking about it as a graphics problem and started treating it like a systems problem. Game pipelines get to be probabilistic about performance; flight software can't. If your frame time is “usually fine,” that's the same as not fine. If your memory allocations are “almost always small,” that's the same as not small. Variance is the enemy.

One thing that helped was forcing myself to profile the ugly scenarios instead of the fun ones: dense terrain, awkward camera angles, pathological geometry density, weird edge cases where the corridor intersects stuff at exactly the wrong distances. Basically, anything that made the pipeline sweat, because that's the version you have to ship.

![Profiler screenshot / frame-time histogram / worst-case scenario clip](assets/work/falcon-eye/falcon.png)

## What we changed (not a resume list, just the gist)

A big chunk of the rewrite was making memory behavior bounded. We moved away from opportunistic allocations in the hot path and into explicit pools, so the system didn't “decide” to become expensive at runtime. Then we split the rendering path into stages with explicit budgets, because if one stage can silently eat into another, you don't have a pipeline—you have a vibe.

We also cut out non-deterministic operations from the critical path wherever we could. Some things are fine in an offline precompute step, or in a background thread, or in a place where a missed deadline doesn't matter. But in the loop that decides what the pilot sees, unpredictability is basically a bug even if it's technically “working.”

The funny part is that the code got less clever. More explicit. More disciplined. Less “nice architecture,” more “this cannot exceed X.”

## Where it landed

Once the system behaved predictably under worst-case inputs, everything else got easier. Visual improvements actually stayed improvements instead of turning into “and now it sometimes stutters.” Demos stopped feeling fragile. We could talk about performance and reliability with a straight face, which matters a lot more than a shiny screenshot when you're trying to convince anyone serious.

We ended up holding consistent real-time rendering on low-power hardware (30 FPS in the scenarios we cared about), and that shift from “prototype visuals” to “deterministic behavior” was what made the project feel like it was crossing into the world of real flight software instead of living as a perpetual demo.

## The takeaway

If I had to compress this into one lesson: determinism isn't a metric you sprinkle on at the end. It's a design constraint you choose early, and then everything you build has to respect it. Aviation is a harsh teacher because the cost of variance is obvious, but honestly it's a good lesson for any system that touches the real world.

Also: building under constraints forces honesty. You find out what you actually understand, because the hardware doesn't care how clean your abstractions are.