<!--
  The Build page, written as a note.

  This file is the page. Headings, nesting, bold and links render exactly as
  written, so it can be edited in Obsidian and pasted back whole — no card
  schema to satisfy, no fields to keep in sync.

  Two things the renderer adds on its own: heading ids (used by the links on
  the home page) and the ↗ on external links. Heading ids come from the
  heading text, so renaming a heading moves its anchor — `src/pages/index.astro`
  links to `#initiatives-and-hackathons`, `#programs`, `#agentic-systems`,
  `#community-experiments` and `#personal-projects`.
-->

<h2 id="at-devfolio"><img src="/images/logos/devfolio.png" alt="" class="note__logo" /> At Devfolio</h2>

I've been around hackathons since 2020. They got me my first job.

At [Devfolio](https://devfolio.co), I manage bits of almost everything: community, ops, support, initiatives & student programs, video editing, photography and everything else in between.

I have a hard time staying in one lane, but one thing is common:

**making the builder experience a little better.**

### Initiatives and Hackathons

I have contributed to builder initiatives across formats, geographies and <span class="hint" tabindex="0" aria-describedby="train-note">occasionally modes of transport<span class="hint__card" id="train-note" role="tooltip">A hackathon on a moving train. <a href="https://devfolio.co/blog/we-turned-a-train-into-indias-first-moving-web3-hackathon-and-it-was-beautifully-chaotic/" target="_blank" rel="noreferrer">BlockTrain</a>.</span></span>.

- 3 with Anthropic
    - [Build India](https://buildindia2026.devfolio.co/): a builder-first AI sprint focused on products made for Indian realities;
    - [Push to Prod](https://push-to-prod.devfolio.co/) Hackathon with Genspark & Anthropic (Singapore)
        - My first try at editing a recap video [Video Recap](https://x.com/vee19twt/status/2082062590512160837)
    - [Push to Prod](https://pushtoprod-india.devfolio.co/overview) Hackathon: Building at the Frontier
- [BlockTrain](https://blocktrain.devfolio.co/overview): 36-hour hackathon on train (so cool of us, right?)
- [ETHIndiaVilla](https://ethindia-villa.devfolio.co/overview) (yes, a hackathon in a villa): a smaller and more intentional builder format
- Online support for [ETHDenver 2026](https://ethdenver2026.devfolio.co/overview) and [The Synthesis](https://devfolio.co/blog/synthesis/) (one of the agentic hackathons)

### Programs

I also ran the university program for [**Devfolio Student Hackathon Grants with AWS**](https://devfolio-student-hackathon-grants.devfolio.co/overview), helping student organisers access grants, resources, operational support, and the Devfolio platform.

I handle a chunk of **University Relations** at Devfolio.

*(so when you see a [hackathon](https://devfolio.co/hackathons) appear on Devfolio, there's a decent chance I've looked at it, spoken to the organisers, or verified it)*

### Agentic Systems

#### The recurring problem

Community and support work contains a surprising amount of repeated judgment: finding the real request in a noisy inbox, locating the right internal context, deciding when to escalate, and turning scattered signals into something useful for builders.

I began treating those repetitions as systems-design opportunities, and here's what I built:

- Email Automation: an AI-powered email operations agent that reviews incoming support emails, classifies and prioritises requests, and drafts context-aware replies. It automates repetitive inbox work while escalating complex cases to the appropriate team.
- Community Agent:
    - I use Hermes as a personal operations layer I call Devfolio Brain
    - Devfolio Brain is an internal AI agent that turns Devfolio's Notion playbooks and meeting notes into quick, source-backed answers, drafts, and operational updates. It helps the community team plan events, retrieve context, and maintain shared knowledge without having to hunt through documents.
    - It connects to the tools around the work, retrieves context, runs scheduled routines, and improves as I turn decisions into reusable skills and operating rules.
- Support Bot:
    - I built a multi-channel RAG assistant around Devfolio's guide and blog. It combines semantic and full-text retrieval, expands neighbouring context, returns source links, keeps conversation context, and escalates when the evidence is not strong enough.
    - It runs as a Telegram bot, so anyone can ask it a question about the platform directly.

### Community Experiments

- Vibe With Hermes Agent:
    - Using Hermes internally eventually evolved into a small, hands-on meetup focused on building agents with your own context.
    - This was probably the first event where I genuinely felt like I was doing everything: planning, organising, comms, programming, running the workshop, helping builders, and photographing the thing when I had a free hand *(felt like a single-man army)*
        - blog [here](https://devfolio.co/blog/vibe-with-hermes-agent/)
        - captured the event ([here](https://www.playbook.com/s/devfolio/vibe-with-hermes-agent))
- [HMF, Hack Make Fix](https://devfolio.co/blog/the-first-edition-of-our-hardware/)
    - A small hardware-focused experiment I helped organise.
    - Captured the event ([photo gallery](https://www.playbook.com/s/devfolio/WJNkW5QDRKxqppgiAzr4wDBH))

## Personal Projects

Things I make outside work, usually with friends, out of curiosity, and under a short deadline.

### Scratch Blogs

*December 2024*

- A web-based tool for writing and formatting with Markdown, drawing diagrams in Excalidraw, and generating content from those drawings.
- Real-time diagram creation, seamless image uploads, and structured content built from the drawings themselves.
- Stack: React, TypeScript and Express, deployed on an Azure VM.
- [Backend on GitHub](https://github.com/veesesh/backend_scratchblogs)

### NAASH, Not Another AI Shell

*November 2024*

- An AI-powered terminal shell built for speed: natural-language interaction, clipboard management and error-log history.
- Won 1st prize at Hack This Fall Virtual, 1,000 USD.
- Stack: Node.js, CLI and AI.
- [On GitHub](https://github.com/Sushants-Git/team-gap)

### Snippet Safe

*January 2024*

- A bookmarking tool for storing and organising code snippets, using Hugging Face sentence-similarity models to compare text embeddings.
- Won 1st prize at FrostHacks, an in-person hackathon sponsored by MLH, 12,000 INR.
- [On GitHub](https://github.com/Sushants-Git/SnippetsSafe)
