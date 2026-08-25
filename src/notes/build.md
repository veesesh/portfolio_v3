<!--
  The Build page, written as a note.

  This file is the page. Headings, nesting, bold and links render exactly as
  written, so it can be edited in Obsidian and pasted back whole — no card
  schema to satisfy, no fields to keep in sync.

  Two things the renderer adds on its own: heading ids (used by the links on
  the home page) and the ↗ on external links. Heading ids come from the
  heading text, so renaming a heading moves its anchor — `src/pages/index.astro`
  links to `#initiatives-and-hackathons`, `#programs`, `#agentic-systems`,
  `#community-experiments` and `#side-projects`.
-->

## At Devfolio

I've been around hackathons since 2020. They got me my first job.

At Devfolio, I manage bits of almost everything: community, ops, support, initiatives & student programs, video editing, photography and everything else in between.

I have a hard time staying in one lane, but one thing is common: **making the builder experience a little better.**

### Initiatives and Hackathons:

I have contributed to builder initiatives across formats, geographies and occasionally modes of transport.

- 3 with Anthropic
    - [Build India](https://buildindia2026.devfolio.co/): a builder-first AI sprint focused on products made for Indian realities;
    - [Push to Prod](https://push-to-prod.devfolio.co/) Hackathon with Genspark & Claude (Singapore)
        - My first try at editing a recap video [Video Recap](https://x.com/vee19twt/status/2082062590512160837)
    - [Push to Prod](https://pushtoprod-india.devfolio.co/overview) Hackathon: Building at the Frontier
- BlockTrain: 36-hour hackathon on train (so cool of us, right?)
- **ETHIndiaVilla** (yes, a hackathon in a villa): a smaller and more intentional builder format
- Online support for **ETHDenver 2026** and **The Synthesis** (one of the agentic hackathons)

### Programs:

I also ran the university program for [**Devfolio Student Hackathon Grants with AWS**](https://devfolio-student-hackathon-grants.devfolio.co/overview), helping student organisers access grants, resources, operational support, and the Devfolio platform.

I also handle a chunk of **University Relations** at Devfolio (so when you see a [hackathon](https://devfolio.co/hackathons) appear on Devfolio, there's a decent chance I've looked at it, spoken to the organizers, or clicked the button that lets it through)

### Agentic Systems:

#### The recurring problem:

Community and Support work contains a surprising amount of repeated judgment: finding the real request in a noisy inbox, locating the right internal context, deciding when to escalate, and turning scattered signals into something useful for builders.

I began treating those repetitions as systems-design opportunities, and here's what I built:

- Email Automation:
    - Got frustrated with support and built up a system that makes my life easier
    - An AI-powered email operations agent that reviews incoming support emails, classifies and prioritises requests, and drafts context-aware replies. It automates repetitive inbox work while escalating complex cases to the appropriate team.
- Community Agent:
    - I use Hermes as a personal operations layer I call Devfolio Brain
    - Devfolio Brain is an internal AI agent that turns Devfolio's Notion playbooks and meeting notes into quick, source-backed answers, drafts, and operational updates. It helps the community team plan events, retrieve context, and maintain shared knowledge without having to hunt through documents.
        - It connects to the tools around the work, retrieves context, runs scheduled routines, and improves as I turn decisions into reusable skills and operating rules.
        - Basically: **if I have to make the same decision enough times, I eventually try to make the computer remember it.**
- Support Bot:
    - Takes all the context from the Devfolio Guide
    - RAG-based support bot for anything related to the platform
    - I built a multi-channel RAG assistant around Devfolio's guide and blog. It combines semantic and full-text retrieval, expands neighbouring context, returns source links, keeps conversation context, and escalates when the evidence is not strong enough.

### Community Experiments:

- Vibe with Hermes:
    - Using Hermes internally eventually evolved into Vibe With Hermes Agent, a small, hands-on meetup focused on building agents with your own context.
    - This was probably the first event where I genuinely felt like I was doing everything: planning, organising, comms, programming, running the workshop, helping builders, and photographing the thing when I had a free hand (felt like a single-man army)
        - blog [here](https://devfolio.co/blog/vibe-with-hermes-agent/)
        - captured the event ([here](https://www.playbook.com/s/devfolio/vibe-with-hermes-agent))
- HMF
    - A small hardware-focused experiment.
    - I helped organise it
    - Captured the event ([photo gallery](https://www.playbook.com/s/devfolio/WJNkW5QDRKxqppgiAzr4wDBH))

## Side Projects

Things I make outside work, usually with friends, out of curiosity, and under a short deadline.

- [NAASH — Not Another AI Shell](https://github.com/Sushants-Git/team-gap): a natural-language terminal shell with clipboard and error-log history. Built with a team, and it won HackThisFall.
- [Scratch Blogs](https://github.com/veesesh/backend_scratchblogs): a multimodal writing environment for Markdown, diagrams and images. I worked on the backend.
- [Snippet Safe](https://github.com/Sushants-Git/SnippetsSafe): a bookmarking tool for storing and organising code snippets, built with a team. Won Frost Hacks.
