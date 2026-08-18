import type { CollectionEntry } from "astro:content";

/**
 * Current roles first, then most recent. Sorting on start date alone buries an
 * ongoing role (Hackerabad, 2022 — now) beneath a finished internship.
 */
export function byRoleRecency(a: CollectionEntry<"roles">, b: CollectionEntry<"roles">) {
  const ongoing = Number(b.data.end === null) - Number(a.data.end === null);
  if (ongoing !== 0) return ongoing;
  return b.data.start.valueOf() - a.data.start.valueOf();
}

/** Public Work order is editorial rather than chronological. */
export function byRoleDisplayOrder(a: CollectionEntry<"roles">, b: CollectionEntry<"roles">) {
  return a.data.displayOrder - b.data.displayOrder;
}

/**
 * Work done in a role outranks a side build, then each collection's own order.
 * `order` only has to be unique within an org, so it can't sort a mixed list.
 */
export function byFeatureRank(a: CollectionEntry<"projects">, b: CollectionEntry<"projects">) {
  const own = Number(a.data.org === "own") - Number(b.data.org === "own");
  if (own !== 0) return own;
  return a.data.order - b.data.order;
}
