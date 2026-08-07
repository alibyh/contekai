# SCAFFOLD-PROMPT

Paste the block below into Claude Code, from the repo root, with this kit present at `./kit/`.
It sets up the project and **stops** before building any section. Sections are built one at a time
via `ORDER.md`.

---

## Stack decision (made, not open)

**Astro 5 + plain modern CSS + TypeScript. No Tailwind. No UI framework.**

Rationale, so it isn't relitigated:
- The page is ~95% static content. Astro ships **zero JS by default**; the only client JS is the deck,
  the stepper, and one IntersectionObserver — comfortably inside the 90 KB budget. The audience is on
  mobile data on low-end Android; this is the deciding constraint (`CONTEXT.md` §6).
- Hand-written CSS with custom properties enforces the token system directly. Utility-class soup
  makes token drift invisible and is a visual signature of generated UI.
- One `.astro` component per section maps 1:1 onto `kit/sections/*.md`.

**Exception:** if the existing contekai.com front end is a React/Vite SPA that must absorb this page
rather than replace it, use **Vite + React + the same plain CSS token layer** instead. Do not
introduce Tailwind, styled-components, or a component library either way. Detect first, then say
which path you took.

---

```
Read, in this order and in full, before writing any code:
  kit/README.md
  kit/CONTEXT.md
  kit/PLAN.md
  kit/skills/design-system/SKILL.md
  kit/skills/motion/SKILL.md
  kit/skills/quality-gate/SKILL.md

If the skills `frontend-design`, `ui-ux-pro-max`, `taste`, `impeccable`, or `skillui` are available
in this environment, invoke them now and reconcile their guidance with the kit. Where they are more
specific, they win; where they conflict with kit tokens, keep the kit tokens and note the conflict in
NOTES.md. If `ui-ux-pro-max` is installed, run:

  python "${CLAUDE_PLUGIN_ROOT}/.claude/skills/ui-ux-pro-max/scripts/search.py" \
    "POS inventory SaaS west africa small business offline trust" \
    --design-system --variance 6 --motion 5 --density 4 -p "Contekai" \
    --persist --output-dir "."

and read the generated design-system/contekai/MASTER.md. If it returns nothing, say so explicitly
and proceed on the kit tokens alone. Do not present an unrun search as if it returned data.

TASK — scaffold only. Do not build any section yet.

1. Detect whether an existing contekai front end is present in this repo. Report the stack you
   found and which of the two paths above you are taking.

2. Scaffold this structure:

   src/
     pages/index.astro              — composes the sections, nothing else
     layouts/Base.astro             — <head>, meta, fonts, skip link, JSON-LD
     components/
       shell/Header.astro
       shell/Rail.astro
       shell/Footer.astro
       ui/Button.astro
       ui/Eyebrow.astro
       ui/Icon.astro                — Lucide, inlined SVG, one family
       sections/Hero.astro
       sections/Capabilities.astro
       sections/BuiltForHere.astro
       sections/Pricing.astro
       sections/Proof.astro
     styles/
       tokens.css                   — EVERY value from kit/skills/design-system/SKILL.md
       base.css                     — reset, @layer order, typography defaults, focus ring
       motion.css                   — tokens + [data-reveal] + reduced-motion block
     scripts/
       reveal.ts                    — one shared IntersectionObserver
       deck.ts                      — capabilities deck (built in step 3)
       pricing.ts                   — stepper + tally (built in step 5)
   public/
     fonts/                         — archivo-var-subset.woff2, dm-mono-subset.woff2
     media/                         — poster.avif, hero.mp4, hero.webm (placeholders for now)
   NOTES.md                         — running log + per-step self-critique

3. Write styles/tokens.css from the design system file. Transcribe it exactly, including the
   contrast table as a comment. Note: the file contains one deliberately invalid line
   (`--ink-600`) — delete it and confirm in your reply that you found it.

4. Set up @layer order: `@layer reset, tokens, base, layout, components, sections, utilities;`
   All section padding comes from a single `[data-section]` rule with a `--section-pad` override per
   section. Do not set section padding anywhere else.

5. Self-host both fonts. Subset to latin + latin-ext. Preload Archivo only. Add metric-adjusted
   fallbacks (size-adjust / ascent-override) so there is no shift on swap.

6. Build Base.astro: <html lang="en">, viewport (zoom NOT disabled), title + meta description +
   OG/Twitter tags written from CONTEXT.md, favicon from the mark, LocalBusiness/SoftwareApplication
   JSON-LD with the real dalasi pricing, a skip-to-content link, and the reduced-motion block.

7. Build ui/Button.astro, ui/Eyebrow.astro, ui/Icon.astro to spec. Three button variants, no more.

8. Stub every section component with a heading and a `<!-- built in ORDER.md step N -->` comment so
   index.astro composes and the dev server runs.

9. Verify the empty shell: dev server runs, Lighthouse passes on the stub page, keyboard path works,
   both fonts load without shift, no console errors.

Then STOP. Report: stack path taken, the tripwire line, anything in the kit that conflicted with a
skill, and what you need from the client before step 1 (hero video, screenshots, testimonials).
Do not start Hero until told to.
```

---

## After scaffolding

Proceed through `ORDER.md` one step at a time. One section per step, one commit per step, one
`NOTES.md` entry per step. Do not batch sections — the self-critique between them is the mechanism
that keeps the build from flattening into a template.
