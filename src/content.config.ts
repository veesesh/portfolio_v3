import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const linkSchema = z.object({
  label: z.string(),
  href: z.url(),
});

/** Where I have worked. One entry per organization. */
const roles = defineCollection({
  loader: glob({ base: "./src/content/roles", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    organization: z.string(),
    role: z.string(),
    location: z.string(),
    start: z.coerce.date(),
    /** Controls the visible portfolio order. Lower values appear first. */
    displayOrder: z.number(),
    /** null means "still there". */
    end: z.coerce.date().nullable().default(null),
    summary: z.string(),
    href: z.url().optional(),
  }),
});

/** What I did in those roles. `org` points at a roles entry id. */
const projects = defineCollection({
  loader: glob({ base: "./src/content/projects", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    org: z.string(),
    descriptor: z.string(),
    summary: z.string(),
    year: z.string(),
    /** Sorts newest first within an org. */
    order: z.number(),
    /** The way a build appears on the public Build page. */
    category: z.enum(["initiative", "system", "personal"]),
    featured: z.boolean().default(false),
    href: z.url().optional(),
    links: z.array(linkSchema).default([]),
  }),
});

/** Things I have published, here or elsewhere. */
const writing = defineCollection({
  loader: glob({ base: "./src/content/writing", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    outlet: z.string(),
    summary: z.string(),
    url: z.url(),
  }),
});

/** Things worth reading, and why. */
const reading = defineCollection({
  loader: glob({ base: "./src/content/reading", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    kind: z.enum(["Book", "Essay", "Paper", "Talk"]),
    note: z.string(),
    order: z.number(),
    url: z.url().optional(),
  }),
});

export const collections = { roles, projects, writing, reading };
