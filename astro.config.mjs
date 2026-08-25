import { defineConfig } from "astro/config";
import { satteri } from "@astrojs/markdown-satteri";

/**
 * Markdown links come out as plain anchors, but every external link elsewhere
 * on the site opens in a new tab and says so. This gives markdown links the
 * same treatment.
 *
 * The visible ↗ is left to CSS (`.note a[target="_blank"]::after`); only the
 * screen-reader half is added here, because it is real text and CSS `content`
 * is not a dependable place to put any.
 */
const externalLinks = {
  name: "external-links",
  element: {
    filter: ["a"],
    visit(node, ctx) {
      const href = node.properties?.href;
      if (typeof href !== "string" || !/^https?:\/\//.test(href)) return;

      ctx.setProperty(node, "target", "_blank");
      ctx.setProperty(node, "rel", "noreferrer");
      ctx.appendChild(node, {
        type: "element",
        tagName: "span",
        properties: { className: ["sr-only"] },
        children: [{ type: "text", value: " (opens in a new tab)" }],
      });
    },
  },
};

export default defineConfig({
  prefetch: true,
  markdown: {
    processor: satteri({ hastPlugins: [externalLinks] }),
  },
});
