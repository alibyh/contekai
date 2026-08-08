# SCAFFOLD-PROMPT — Contekai Footer

> Paste this whole file into Claude Code from the root of the contekai.com repo.
> It is the build order. CONTEXT.md, PLAN.md and footer.SKILL.md sit beside it
> with the full spec — read them before writing code.

---

## Role & standard

You are the design-lead engineer on contekai.com — a point-of-sale and stock-control
product for shops in The Gambia. Build the site footer. This is production design work,
not a quick component: it must not look vibe-coded. Before writing any code, load and obey
these skills already installed in this project:

- **Frontend Design** — distinctive, intentional visual design; spend boldness in one place.
- **UI/UX Pro Max** — accessibility, touch targets, typography/color discipline.
- **Taste Skill**, **Impeccable**, **SkillUI** — polish, restraint, execution quality.

If any instruction below conflicts with those skills' hard rules (contrast, focus states,
touch size), the skill wins — fix it and note what you changed.

---

## What to build

A single footer component for the existing site. The design is fully specified — do not
redesign it, implement it. It is a **"digital receipt"** footer that carries the brand's
warmth: shops recognise a receipt, and the footer *being* one is the argument that Contekai
is a real POS product.

Reference implementation to match visually: see `PLAN.md` for the exact structure and the
working HTML/CSS reference it was derived from. Reproduce that layout and behaviour in this
project's actual framework and styling system (detect it from the repo — do not assume).

### Structure, top to bottom

1. **Torn top edge** — CSS mask, ~9px teeth, in the footer's own background colour. Torn edge on the bottom too.
2. **Brand block, centered** — the Contekai logo mark (reuse the existing SVG asset from the
   repo — do NOT redraw it), then the wordmark **"Contekai" set in the site's serif display
   face**, then the tagline "Point of sale and stock control for shops in The Gambia."
3. **Barcode strip** — a thin row of vertical bars of varying width, low opacity. Decorative,
   `aria-hidden`. Generate bar widths at build time or with a tiny inline script; keep it stable (no per-frame animation).
4. **Receipt line-items** — nav links styled as receipt rows: label on the left, a dotted
   leader line filling the middle, a small mono "route" value on the right (e.g. `/features`).
   Group under mono section labels:
   - **PRODUCT** — What it does, Offline mode, Pricing, Shops using it
   - **COMPANY** — Log in
   On hover, the label shifts to the clay accent and the dotted leader brightens.
   On viewports under 380px, hide the right-hand route values (`.val`).
5. **"Total" line = primary CTA** — a dashed rule, then a row with a mono `GET STARTED` label
   on the left and the **"Start 7 days free →"** button (clay, filled) on the right, sitting
   where a receipt's total would be.
6. **Offline status line** — a pulsing green dot + mono text "Works offline — syncs when
   you're back". The pulse must respect `prefers-reduced-motion`.
7. **The logo-shaped warmth panel** (see next section) — social links + WhatsApp + hours.
8. **Meta line** — mono, centered: "© {current year} Contekai · Built in The Gambia" and a
   second line "Terms · Privacy · Prices in GMD". Compute the year at runtime, don't hardcode.

### The warmth panel — shaped like the Contekai logo

This replaces the generic blob in the reference. **The panel's silhouette should echo the
Contekai logo mark** — the mark is a five-point radial burst (a central node with five spokes
to five outer dots). Render the panel as a soft, rounded **five-lobe shape** that reads as
that burst: a warm terracotta container with five gentle bulges around its perimeter, filled
with a clay gradient. Use an SVG `clip-path` (a hand-tuned five-lobe path, roughly a rounded
pentagon-star), NOT a plain `border-radius` blob and NOT a literal tracing of the logo.
Watermark the logo's asterisk mark very faintly (5–8% white) inside it, centered behind the content.

Keep it tasteful: the shape should be *felt*, not cartoonish — if it starts looking like a
splat or a flower, pull the lobes in. Provide a rectangular rounded fallback for
`@supports not (clip-path: …)` and for print.

Inside the panel:
- Heading "Say hello 👋" and sub "We're friendlier than most software." (white / white-80%).
- Social icons in white circles: **Instagram, TikTok, Facebook** (these are placeholders —
  wire to the real handles found in the repo/config; if none exist, leave `href="#"` and
  leave a `TODO` comment).
- A white **"Chat on WhatsApp"** pill button with the WhatsApp glyph in green.
- A mono "Online now · 9am–7pm GMT" line with a small white dot.
- WhatsApp number and hours are **placeholders** — pull real values from repo config if present,
  otherwise `TODO`.

---

## Palette & type (use the project's tokens if they exist; otherwise add these)

```
--footer-bg:    #121a27   (receipt paper — a hair lighter than page bg)
--ink:          #f4f6f9
--muted:        #8a94a3
--faint:        #5a6472
--line:         #212b3b
--clay:         #c8613b   (brand accent — buttons, hover)
--clay-2:       #e07a4e   (hover-lighter)
--green:        #4ea36b   (status)
--wa:           #25d366   (WhatsApp glyph only)
```
- Wordmark: the site's **serif display** face.
- Section labels, routes, status, meta: **mono** face.
- Everything else: the site's body sans.

Do not introduce the AI-default warm-cream / terracotta-on-cream look. The footer is dark;
clay is an accent only.

---

## Quality floor (non-negotiable — from the skills)

- Contrast ≥ 4.5:1 for all text. The muted greys on `--footer-bg` must pass — verify, don't eyeball.
- Every link and button has a **visible keyboard focus ring** and is ≥ 44×44px touch target.
- Social icon buttons have `aria-label`s. Barcode is `aria-hidden`.
- `prefers-reduced-motion: reduce` disables the status-dot pulse and any hover transforms.
- Semantic markup: `<footer>`, real `<a>`/`<button>`, headings where appropriate. No `<form>` unless the search were included (it isn't here).
- Responsive from 320px up; no horizontal scroll; the logo-shape panel must not clip its own content at narrow widths.
- Copy is sentence case, plain, active voice.

---

## Integration

1. Detect the framework and styling system from the repo (package.json / file structure).
   Match the existing component conventions — file location, naming, how tokens/vars are defined.
2. Reuse the existing logo SVG asset; do not paste a new hand-drawn mark.
3. Replace the current footer (or add one if absent) and mount it on every page that has the footer slot.
4. Wire nav links to real routes where they exist; leave `TODO` comments for any placeholder
   (WhatsApp number, social handles, unbuilt routes) — never invent real-looking data.

## Definition of done

- Footer renders on the live pages, matches the specified structure and the reference look.
- The warmth panel is visibly a soft five-lobe logo-echo shape, not a rectangle or a random blob.
- Passes the quality-floor list above. Reduced-motion and 320px both verified.
- No hardcoded year; no fabricated contact data.
- Briefly report: framework detected, files touched, any skill-driven deviations, and every `TODO` left.
