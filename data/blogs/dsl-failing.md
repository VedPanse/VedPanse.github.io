---
label: Build Log
date: July 14, 2019
title: I tried to invent my own UI language
excerpt: 2019 me decided multiplatform UI frameworks were not enough and attempted to fix that.
---
# I tried to invent my own UI language

![Early notebook sketches of JavelinLang syntax](assets/blog/javelin/javelin.png)

In 2019, I decided that existing UI frameworks were inconvenient.

This is the kind of sentence that only makes sense if you are 16 and have just learned enough programming to be dangerous.

I had been building small apps and tools, and every time I switched platforms — Android, web, desktop — I felt personally offended that I had to rewrite everything. Same layout. Same components. Same logic. Different syntax. It felt inefficient in a way that bothered me more than it probably should have.

So naturally, I did what any rational teenager would do.

I tried to design my own language.

I called it JavelinLang.

## The original delusion

The idea was simple: describe UI once, target everywhere.

Instead of writing platform-specific UI code, you’d write a structured layout definition in JavelinLang. Components, state bindings, layout constraints — all declared in a platform-agnostic way. Then a compiler layer would translate it into native UI code for each target.

In my head, this was obvious. Why should layout logic be rewritten just because the rendering engine changes?

In practice, I quickly learned that “UI” is not just layout. It’s event handling. It’s lifecycle. It’s state synchronization. It’s rendering pipelines. It’s subtle platform conventions you don’t notice until they break.

But I was committed.

## What it actually looked like

The syntax was declarative. Component trees. Explicit state bindings. Minimal imperative logic in the view layer. I was trying to separate “what the UI is” from “how the platform renders it.”

Something like:
```kt
Screen {
    Column {
        Text("Hello World")
        Button("Click Me") {
            onClick: incrementCounter
        }
    }
}
```


Very original, I know.

The compiler would parse the tree and emit equivalent UI code in the target platform’s framework. I remember spending hours debugging the transpiler because indentation bugs in your own language feel especially embarrassing.

## What I did not understand in 2019

I did not understand how deep platform integration goes.

I did not understand performance tradeoffs.

I did not understand why native toolkits behave differently for reasons that have nothing to do with syntax.

I especially did not understand how hard it is to design a language that doesn’t slowly become a second, worse version of something that already exists.

But I learned a lot.

## Why it mattered anyway

JavelinLang didn’t become a real product. It didn’t replace anything. It barely escaped my laptop.

But it forced me to think about:

- parsing and AST construction  
- code generation  
- abstraction boundaries  
- the difference between declarative and imperative systems  
- why constraints exist in the first place  

It was the first time I stopped just *using* tools and started asking why they were shaped the way they were.

Looking back, it was wildly overambitious.

I still think that’s fine.

There’s something useful about building things that are slightly too big for you at the time. Even if the language never leaves your GitHub, the mental model does.

JavelinLang taught me that abstractions are expensive. And that designing one is much harder than complaining about one.

I still occasionally find old files from that project.

They’re chaotic.

I’m weirdly proud of them.