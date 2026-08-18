---
title: "Agentic operations"
org: "devfolio"
descriptor: "Builder and daily operator"
summary: "Turning repeated support and community judgment into grounded, human-reviewed workflows — from inbox triage and knowledge retrieval to editorial automation."
year: "2025 — now"
order: 2
category: "system"
featured: true
links:
  - label: "Vibe With Hermes Agent"
    href: "https://devfolio.co/blog/vibe-with-hermes-agent/"
---

## The recurring problem

Community work contains a surprising amount of repeated judgment: finding the real request in a noisy inbox, locating the right internal context, deciding when to escalate, and turning scattered signals into something useful for builders.

I began treating those repetitions as systems-design opportunities. The goal was not to remove people from the loop. It was to give them a better first pass, stronger context, and more time for the decisions that actually need a person.

## Maxi, my operational agent

I use Hermes as a personal operations layer I call **Maxi**. It connects to the tools around the work, retrieves context, runs scheduled routines, and improves as I turn decisions into reusable skills and operating rules.

On a typical day, that means asking questions about community work, checking support, preparing drafts, retrieving program context, or setting up a small recurring job. I review its output, correct it, and fold useful lessons back into the system.

## What sits inside the system

### Support operations

The support workflow reviews complete Gmail threads, separates actionable requests from noise, categorizes issues, identifies urgency and ownership, and prepares reply-all drafts inside the original thread. It never sends on its own.

Historical support conversations became a sanitized knowledge layer: response patterns, escalation thresholds, edge cases, and the language the team uses when an answer is still uncertain.

### Support boards and the community agent

I also built Devfolio support boards that turn scattered support and community signals into a clearer operational view: what needs attention, who owns it, what is urgent, and what can wait. Alongside that, the community agent helps retrieve relevant context and surface useful next steps without replacing the person making the call.

### A grounded support assistant

I built a multi-channel RAG assistant around Devfolio's guide and blog. It combines semantic and full-text retrieval, expands neighboring context, returns source links, keeps conversation context, and escalates when the evidence is not strong enough.

The implementation spans TypeScript, PostgreSQL, vector embeddings, Redis-backed context, Telegram, Discord, an HTTP API, and retrieval evaluation tests.

### The Devfolio Times

The Devfolio Times is a newspaper-style editorial pipeline. It gathers builder signals from public sources, Devfolio surfaces, and carefully filtered internal community channels; curates and verifies them; avoids repeats; and prepares a static issue for human review before publishing.

## The boundary matters

These systems draft, retrieve, classify, and recommend. People still approve support replies, decide escalations, admit event applicants, and publish editorial work. That human boundary is part of the design rather than a fallback.

## From tool to community

Using Hermes in the open led to **Vibe With Hermes Agent**, a hands-on meetup at Devfolio's Bengaluru office. I shared the real workflows, brought builders together to create agents around their own context, and turned an internal practice into a community format.
