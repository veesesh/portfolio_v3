/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
    theme: {
        extend: {
            fontFamily: {
                jetbrains: ["JetBrains Mono", "monospace"],
            },
            colors: {
                "border-contrast": "hsl(var(--border-contrast) / <alpha-value>)",
                bg: "var(--bg)",
                fg: "var(--fg)",
                muted: "hsl(var(--muted))",
            },
            backgroundImage: {
                dotted: "url('/assets/dotted.svg')",
            },
        },
    },
    plugins: [],
};
