---
label: Research Notes,Web Spiders,Siri++
date: February 19, 2026
title: Multi-modal agents with faster browser automation
excerpt: Existing AI agents which rely on browser automation are slow. We can augment these technologies by using simple graph theory algorithms.
---
# A tool-using, multi-modal agent

![](assets/banners/evaluation.png)

Most conversations about agentic systems focus on capability.

Can it reason?
Can it plan?
Can it use tools?
Can it recover from errors?

Those questions matter — but they distract from the harder one:

**How can agents, in the face of uncertainty, learn a new task under an unforeseen mode of input?**
In pursuit of finding an answer, I started working on [Siri++](https://github.com/VedPanse/SiriPlusPlus), a virtual assistant that can assist the user by interacting with multiple input modes and output modes, with sequential tool usage pipelines to handle complicated requests.

### Complicated requests over LLM models create noise
Think of a complicated user request you would want Siri to handle: "When I get back home, order the usual dinner for me via Doordash."

Simple GPT wrappers over orchestration layers usually fail this request because although the request seems easy to understand, the sheer number of tools it is going to use and plan are too complex for a simple LLM:
1. Ping the user's location frequency (to check if they got back home and initialize the request)
2. Recall user's usual dinner (recall from memory. If you don't have it stored, the user is going to be disappointed. So we need to account for missing data as well before initializing the command sequence.)
3. Connect to the Doordash service
4. Place an order
5. Complete safe payment checkout

(Optionally, alert the user when the delivery person arrives at their doorstep — listen to Doordash.)

This creates a huge space for LLM models to hallucinate, and when they do, bring down the entire user request. This problem is particularly big when we talk about AI agents that automate your browser to perform online tasks.

### Service might not exist
In the previous example, Doordash luckily exposes its API endpoints for us to make requests. But what if it didn't? It is more than likely that a user will request a service without an exposed API endpoint, in which case, we have to pretend to be the user. This is where tools like [Browser Use](https://browser-use.com) come into play. Think of these tools as the smarter version of [Selenium](https://www.selenium.dev), a browser automation service.

**But browser automation is slow for handling every web-based user request.**
I am not a big fan of browser automation either, only to realize that it might be needed after all. Web scraping is not always straightforward legally, especially not when in the hands of untested AI agents. [Even OpenAI faced lawsuits related to data scraping.](https://www.americanbar.org/groups/business_law/resources/business-law-today/2025-february/openai-sued-data-scraping-canada/)

But I have been thinking about using Graph Theory to speed browser automation up. Very simply put, a user will tend to repeat their requests, since every (human) user will have a set routine. We can avoid visiting redundant sites by using shortest-path style algorithms from graph theory. This graph, put simply, looks like:

![A graph of the exact websites our AI agent visited](assets/research/multi-modal/init_diagram.png)

The border colors mean the following:
- Red: Error (3XX, 4XX, 5XX, ...)
- Green: Success (AI agent marked the action as complete and satisfied)
- Yellow: A complex action was performed here

A complex action, in this context, simply means a non-trivial re-routing. Think of something like signing into your Doordash account — not just a simple webpage change, but something we need to do in order to achieve the success state.

### Faster goal achievement using Graph Theory
Since, by our theory, a yellow state might contain an important and necessary step, we cannot skip it. Our goal is to minimize the number of webpages visited while still reaching the green success state.

We can use a traversal approach conceptually similar to pruning redundant branches in a Disjoint Set (Union-Find) structure: remove unnecessary or disconnected paths, and preserve only the connections that lead to a valid success state. In practice, this means removing irrelevant (white) links and computing a shortest valid path through required yellow states to the green state.

The path we must therefore store in the AI agent's memory, so that it can be recalled again upon an overlapping request, would be:

![The final graph stored in memory](assets/research/multi-modal/fin_diagram.png)

There are multiple methods we can use to make this graph shorter (like first scanning for all sinks and checking if the success state even lies in our domain, else rejecting the storage), but my goal in this research blog was to lay down the architecture and framework on which Siri++ browser automation will work.

More to come.