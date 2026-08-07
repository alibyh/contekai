import { defineConfig } from "astro/config";

// Static output. No integrations, no UI framework — see NOTES.md "Stack decision".
// The only client JS on the finished page is reveal.ts, deck.ts and pricing.ts.
export default defineConfig({
  site: "https://contekai.com",
  output: "static",
  build: {
    // One stylesheet, inlined below 4 KB. Keeps the critical path to: HTML + 1 CSS + 1 font.
    inlineStylesheets: "auto",
  },
  vite: {
    build: {
      cssMinify: "lightningcss",
    },
  },
});
