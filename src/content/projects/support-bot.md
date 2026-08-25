---
title: "Support bot"
org: "devfolio"
descriptor: "Retrieval · Devfolio Guide"
summary: "Everything in the Devfolio Guide, made answerable. It cites where each answer came from and backs off when the evidence is thin."
year: "2025 — now"
order: 4
category: "system"
---

## How it answers

It takes its context from the Devfolio Guide, combines semantic and full-text retrieval, expands neighbouring context,
returns source links, keeps conversation context, and escalates when the evidence
isn't strong enough to stand behind.

## What it runs on

TypeScript, PostgreSQL, vector embeddings, Redis-backed context, Telegram,
Discord, an HTTP API, and retrieval evaluation tests.
