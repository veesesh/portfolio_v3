import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const linkSchema = z.object({
  label: z.string(),
  href: z.url(),
});

const work = defineCollection({
  loader: glob({ base: "./src/content/work", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    kicker: z.string(),
    summary: z.string(),
    role: z.string(),
    period: z.string(),
    order: z.number(),
    featured: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    links: z.array(linkSchema).default([]),
  }),
});

const notes = defineCollection({
  loader: glob({ base: "./src/content/notes", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    kind: z.enum(["Field note", "Program note", "Published elsewhere"]),
    tags: z.array(z.string()).default([]),
    externalUrl: z.url().optional(),
  }),
});

const trove = defineCollection({
  loader: glob({ base: "./src/content/trove", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    category: z.enum([
      "Tools",
      "Reading",
      "Music",
      "Cricket",
      "Art",
      "Photography",
      "Video",
    ]),
    note: z.string(),
    order: z.number(),
    status: z.enum(["Collected", "Collecting"]),
    href: z.url().optional(),
  }),
});

export const collections = { work, notes, trove };
