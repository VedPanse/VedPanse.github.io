---

label: Research Note, Multimodal
date: March 16, 2026
title: From Multimodal Models to Multimodal Agents
excerpt: A research note exploring why multimodal models are not enough and what architectural layers are required to build real multimodal agents.
---

# From Multimodal Models to Multimodal Agents

![Multimodal agents combine perception, reasoning, and action](assets/banners/multimodal-agents.png)

### The Current Wave of Multimodal Models

Over the past few years we’ve seen rapid progress in multimodal AI models. Systems like GPT-4o, Gemini, and Claude can process text, images, audio, and sometimes video within the same model. They can answer questions about images, interpret diagrams, and even reason about visual scenes.

From a modeling perspective, this is impressive. A single network can learn joint representations across multiple modalities.

But most of these systems still function primarily as **interpreters**. They receive inputs, generate outputs, and then stop. The interaction ends once the model produces a response.

That behavior looks very different from what we would expect from a true agent.

### Models vs Agents

A **model** maps inputs to outputs.

An **agent** interacts with an environment over time.

Agents must:

* observe the world
* reason about the current state
* decide on actions
* execute those actions
* observe the consequences
* update their internal state

This loop continues indefinitely. The system is no longer just generating responses; it is participating in a process.

Multimodal models provide perception and reasoning capabilities, but the rest of the agent architecture often lives outside the model.

### The Missing Layers

To move from multimodal models to multimodal agents, several additional components are required.

A typical agent stack might look like this:

```
Perception
→ World Representation
→ Planner
→ Tool Execution
→ Environment Feedback
```

Each part plays a different role.

Perception processes raw inputs such as images, audio, and text.
The world representation maintains a structured view of the current environment.
The planner determines which actions should be taken.
Tool execution interacts with external systems or physical environments.
Feedback updates the agent’s understanding of the world.

Large multimodal models currently cover parts of perception and reasoning, but the surrounding architecture is equally important.

### Why Multimodality Matters for Agents

Multimodal perception dramatically expands what agents can understand.

Instead of relying only on text, an agent could interpret:

* visual scenes
* diagrams or documents
* physical environments through cameras
* audio signals or spoken instructions

This makes it possible for agents to operate in environments that are closer to the real world.

For example, a household robot might need to:

1. observe objects on a table
2. interpret a spoken instruction
3. determine which object the instruction refers to
4. plan a sequence of movements
5. execute those movements safely

Each step requires integrating information across multiple modalities.

### The Role of World Models

One emerging idea in agent design is the use of **world models**. Instead of reacting to inputs independently each time, the agent maintains a persistent representation of the environment.

This representation might include:

* object locations
* task progress
* previously executed actions
* predictions about future states

A world model allows the agent to reason over longer time horizons and plan sequences of actions more effectively.

Without something like this, agents tend to behave reactively rather than strategically.

### Toward Embodied Multimodal Agents

The most challenging setting for multimodal agents is the physical world.

Embodied systems must integrate:

* perception from sensors
* language instructions
* internal representations of the environment
* motor control

This is where ideas from robotics, multimodal modeling, and agent architectures begin to converge.

Vision-Language-Action systems are one example of this convergence, attempting to directly map perception and language inputs into actions.

### Closing Thoughts

Multimodal models are an important step forward, but they are only one part of the picture. Building true agents requires additional architectural layers that allow systems to maintain state, plan actions, and interact with environments over time.

The interesting research question is no longer just how to build better multimodal models. It is how to integrate those models into systems that can perceive, reason, and act continuously.

That transition—from models to agents—may end up being one of the most important shifts in modern AI.
