---
name: contekai-design-system
description: The single source of truth for Contekai's colour, type, space, surface and component tokens. Read before writing any CSS or component. No value outside this file may be hardcoded in a component.
---

# Contekai Design System

If a value is not in this file, it does not exist. If you need one that isn't here, add it here
first, with a one-sentence job description, then use it.

---

## 1. Colour

```css
:root {
  /* ground — night */
  --ink-900: #0A151E;   /* page ground, dark sections */
  --ink-800: #0F1F2B;   /* dark section alternate band */
  --ink-700: #14293A;   /* raised dark surface, cards on dark */
  --ink-600: #1E3purple; /* INVALID — see note below */

  /* material — paper */
  --paper:    #F6F3EC;  /* light sections, cards, receipt */
  --paper-hi: #FFFDF8;  /* receipt face only, one step brighter than paper */

  /* brand */
  --laterite:      #B34A26;  /* primary action */
  --laterite-hover:#9C3E1F;
  --kai-600:       #1E6BA8;  /* links + emphasis ON PAPER */
  --kai-400:       #4E9BDC;  /* links + emphasis ON INK */

  /* status — only ever status */
  --signal: #2F9E6B;

  /* derived text — opacity ramps, not new hues */
  --on-ink:        #F6F3EC;
  --on-ink-muted:  rgb(246 243 236 / .68);
  --on-ink-faint:  rgb(246 243 236 / .44);
  --on-paper:      #16232E;
  --on-paper-muted:rgb(22 35 46 / .70);
  --hairline-ink:  rgb(246 243 236 / .14);
  --hairline-paper:rgb(22 35 46 / .12);
}
```

> **Note:** `--ink-600` above is deliberately left invalid. Delete the line. It is a tripwire: if it
> ships, nobody read this file.

**Rules**

- Six named hues. Tints come from opacity ramps on `--on-ink` / `--on-paper`, never from new hex.
- `--signal` green means *state* (synced, in stock, saved). It is never a background, never a
  heading colour, never decoration.
- Muted text stops at `.68` on ink and `.70` on paper. Below that it fails contrast — no grey-on-grey.
- Never put `--laterite` on `--ink-900` for text. It's an action fill with white text, or an outline.
- No gradients on text. One permitted gradient in the whole build: the hero video scrim
  (`--scrim-hero`, defined in `sections/01-hero.md`).

**Verified contrast pairs** (do not substitute without re-checking):

| Foreground | Background | Ratio | Use |
|---|---|---|---|
| `--paper` | `--ink-900` | 16.7:1 | body on dark |
| `--on-ink-muted` | `--ink-900` | ~11:1 | secondary on dark |
| `#FFFFFF` | `--laterite` | 5.4:1 | button label |
| `--laterite` | `--paper` | 4.8:1 | accent text on paper |
| `--kai-400` | `--ink-900` | 6.2:1 | link on dark |
| `--kai-600` | `--paper` | 5.1:1 | link on paper |
| `--on-paper` | `--paper` | 14.6:1 | body on paper |

---

## 2. Type

Two families. Both **variable**, both **self-hosted**, both **subset to latin + latin-ext**, both
`font-display: swap` with a metric-compatible fallback so nothing shifts.

```css
--font-sans: "Archivo Variable", "Archivo", system-ui, -apple-system, "Segoe UI", sans-serif;
--font-mono: "DM Mono", ui-monospace, "SF Mono", Menlo, monospace;
```

**Archivo does both display and body.** The separation is carried by the **width axis**, not by a
second family:

| Role | Family | Size (desktop) | Size (mobile) | wght | wdth | tracking | leading |
|---|---|---|---|---|---|---|---|
| Display / H1 | Archivo | `clamp(2.75rem, 6.5vw, 4.75rem)` | 2.75rem | 700 | 112 | -0.02em | 0.98 |
| H2 section | Archivo | `clamp(2rem, 3.6vw, 2.875rem)` | 2rem | 700 | 108 | -0.015em | 1.05 |
| H3 card | Archivo | 1.375rem | 1.25rem | 600 | 100 | -0.01em | 1.2 |
| Body-lg (hero sub, section intro) | Archivo | 1.1875rem | 1.0625rem | 400 | 100 | 0 | 1.55 |
| Body | Archivo | 1rem (16px floor) | 1rem | 400 | 100 | 0 | 1.6 |
| Small / caption | Archivo | 0.875rem | 0.875rem | 500 | 100 | 0 | 1.45 |
| **Eyebrow / rail / label** | DM Mono | 0.75rem | 0.75rem | 400 | — | 0.12em, uppercase | 1 |
| **Figure / price / total** | DM Mono | contextual | — | 500 | — | -0.01em | 1 |
| **Receipt line** | DM Mono | 0.8125rem | 0.8125rem | 400 | 0.02em | — | 1.7 |

**Rules**

- Body never below 16px. Captions never below 14px.
- Headlines are **left-aligned by default**. Centring is permitted only in the hero and in section
  intros ≤ 2 lines. A page of centred headings is a template signature.
- `font-variant-numeric: tabular-nums` on every price, total, and stepper value. Non-negotiable — a
  total that jitters while it counts is a bug.
- Max measure for prose: `68ch`. Section intros: `52ch`.
- Never letterspace lowercase body text. Tracking is for the mono eyebrows only.
- No text-transform on headings. Uppercase belongs to the mono labels alone.

**Loading**

```html
<link rel="preload" as="font" type="font/woff2"
      href="/fonts/archivo-var-subset.woff2" crossorigin>
```
Preload Archivo only. DM Mono loads normally — it appears below the fold except in the rail, where a
fallback mono is acceptable for the first paint.

---

## 3. Space & layout

```css
--space-1: 4px;  --space-2: 8px;   --space-3: 12px;  --space-4: 16px;
--space-5: 24px; --space-6: 32px;  --space-7: 48px;  --space-8: 64px;
--space-9: 96px; --space-10: 128px;

--gutter: clamp(20px, 5vw, 40px);
--container: 1200px;      /* standard content */
--container-wide: 1400px; /* card deck, receipt spread */
--container-text: 68ch;   /* prose */
--rail: 44px;             /* left till-rail gutter, desktop only */
--header-h: 64px;
```

**Grid:** 12 columns, `gap: var(--space-5)`, inside `--container`. Below `900px` the grid collapses
to a single column and `--rail` collapses to `0`.

**Breakpoints:** `480 · 768 · 1024 · 1280`. Mobile-first, `min-width` only. No fixed-px container
widths, no horizontal scroll anywhere except the card deck (which is intentional, snap-based, and
must not trap vertical scroll on touch).

**Section rhythm — do not make these equal:**

| Section | Desktop padding-block | Mobile |
|---|---|---|
| Hero | `100svh` flex, `--space-8` inset | `100svh`, `--space-6` |
| Capabilities | `--space-9` top / `--space-8` bottom | `--space-8` / `--space-7` |
| Built for here | `--space-10` | `--space-8` |
| Pricing | `--space-10` top / `--space-9` bottom | `--space-8` |
| Proof | `--space-8` | `--space-7` |
| Footer | `--space-9` top / `--space-6` bottom | `--space-8` / `--space-5` |

**CSS specificity discipline:** all section padding is set by a single `[data-section]` attribute
selector with a `--section-pad` custom property override per section. Never set section padding in
two places — that is where the cancelling-selector bugs live.

---

## 4. Surface & shape

```css
--r-sm: 4px;    /* inputs, chips, small controls */
--r-md: 10px;   /* cards */
--r-full: 999px;/* pills and avatars ONLY */
--r-none: 0;    /* the receipt */

--shadow-paper: 0 1px 2px rgb(10 21 30 / .08), 0 8px 24px -16px rgb(10 21 30 / .18);
--shadow-lift:  0 2px 4px rgb(10 21 30 / .10), 0 16px 40px -20px rgb(10 21 30 / .28);
--border-paper: 1px solid var(--hairline-paper);
--border-ink:   1px solid var(--hairline-ink);
```

- Dark surfaces separate by **value** (`--ink-900` → `--ink-700`), not by shadow. Shadows on dark
  are invisible and just cost paint.
- No `backdrop-filter` anywhere. No glass panels. It is the single fastest way to look templated,
  and it is expensive on the low-end Android devices this audience uses.
- The sticky header sits on a solid `--ink-900` (over dark) / `--paper` (over paper) with a hairline
  bottom border. It changes ground based on the section behind it — that transition is the only
  header effect.

---

## 5. Components

**Button** — three variants only.

| Variant | Fill | Label | Border | Use |
|---|---|---|---|---|
| `primary` | `--laterite` | `#fff` | none | Start free trial. **One per viewport.** |
| `secondary` | transparent | current | `--border-ink` / `--border-paper` | See pricing, secondary nav |
| `quiet` | none | `--kai-*` underlined on hover | none | inline text actions |

- Height `48px` desktop, `52px` mobile. Min touch target `44×44` including nav icons.
- Padding `0 var(--space-5)`. Radius `--r-sm`. **Not pills** — pill buttons plus a dark hero is the
  template tell. Weight 600, width 100.
- Focus: `outline: 2px solid var(--kai-400); outline-offset: 3px;` — visible on both grounds, never
  removed.
- Hover: background/border shift only, `150ms`. No scale, no lift on primary CTAs.
- Every button has a real label. No icon-only buttons except the header menu, which carries
  `aria-label="Open menu"`.

**Card (paper)** — `background: var(--paper-hi)`, `--border-paper`, `--r-md`, `--shadow-paper`,
padding `--space-6`. On hover: `--shadow-lift` + `translateY(-2px)` at `180ms`. Nothing else moves.

**Eyebrow** — DM Mono, uppercase, `.12em`, `--on-*-muted`, preceded by a 24px hairline rule. This is
the one repeated structural device in the build, and it earns its place because it carries the
section index from the rail.

**Icons** — **Lucide**, 1.5px stroke, 20px in body / 24px in nav, `currentColor`. One family, no
mixing, no emoji, no filled/outline mixing. Icons never appear in a coloured rounded chip — that
exact treatment (pastel square + icon + bold title + two grey lines) is the single most recognisable
vibe-coded artefact and is banned in this build.

---

## 6. Anti-defaults for this project

Do not ship any of the following, even if they "look fine":

- Pastel icon chips on feature cards.
- `border-radius: 24px` soft cards. Our card radius is 10px and it is a decision.
- Pill-shaped primary buttons.
- Purple/indigo anything. The palette above is complete.
- Gradient text, gradient borders, glow effects, blob/mesh backgrounds.
- `backdrop-filter: blur()` navbars.
- Centred everything. Left-align by default; centre deliberately.
- Identical padding on every section.
- Emoji anywhere in the interface.
