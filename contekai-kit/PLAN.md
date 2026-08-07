# PLAN — the design spine

Read this before any code. Every decision downstream must trace back to something on this page.

---

## 1. Positioning sentence

> For shop owners in The Gambia, **Contekai** is the point-of-sale and stock system that **keeps
> selling when the power and the internet don't**.

One sentence, one job for the page: **get a shop owner to start the 7-day trial.** Everything else on
the page is in service of that or it is cut.

## 2. The thesis

Most POS marketing sells *features*. Contekai's real story is **continuity** — the shop keeps
running. That is a story about a specific place: a counter, at dusk, when the lights go and the
neighbours' shops go dark and this one doesn't.

So the page is built from two materials, and only two:

- **Night** — the dark ground of the page. The outage. The condition the product is designed for.
- **Paper** — warm, printed surfaces that sit on top of it. The receipt, the ledger, the record that
  keeps being produced regardless.

That opposition is the whole visual argument: *the lights go out, the paper keeps coming*.

## 3. Directions considered

**A — "Bright market" (rejected).** Daylight page, warm white ground, big photography of shops and
produce, colour from the goods themselves. Honest and human, but it sells *the market*, not the
software, and it collapses into stock-photo SaaS the moment the client's photography isn't excellent.
Also fails the bandwidth budget — a photo-led page is heavy.

**B — "Instrument panel" (rejected).** Treat the page as the dashboard: dense data surfaces, live
counters, chart fragments as decoration. Rejected because it flatters the builder, not the buyer.
The audience is not data-native, and charts-as-wallpaper is a well-worn AI-design tic.

**C — "Night counter" (chosen).** Dark ground, paper surfaces, the receipt as the recurring artifact.
It states the differentiator in the first second, it is cheap to load, it holds high contrast in
daylight on a phone, and it is specific to this product in a way A and B are not.

**Self-check against the known AI-design defaults.** The chosen direction is dark-first, which is
adjacent to the "near-black page with one bright accent" default. It is not that, and here is the
enforceable difference: the ground is a **blue-black with visible warmth in the shadows**, not
`#0a0a0a`; the page carries **warm paper surfaces at full size** (whole sections are paper, not just
cards); there are **two brand hues plus a status green**, not one neon; and the type is a **variable
grotesk set at width extremes**, not a serif display. If the build starts to look like a dark
template with an orange button, that is the failure mode — see the escape hatches in
`skills/quality-gate/SKILL.md`.

## 4. The signature: the receipt

**One memorable element, spent in one place.** The receipt.

Thermal-printer paper is the artifact this product physically produces hundreds of times a day. It
appears exactly twice on the page, and nowhere else:

1. **Pricing** is a real receipt — tear-off edge, monospaced line items, a locations stepper that
   re-tallies the total in front of you, `TOTAL` in the position a total actually occupies. Not a
   three-column table. This is where the boldness is spent.
2. **The rail** — a hairline vertical strip down the left gutter on desktop, carrying the section
   index and label in small mono, feeding as you scroll. On mobile it degrades to a 2px top progress
   line. It is the till roll running through the page.

Everything else is disciplined and quiet. If a third receipt motif appears, remove it.

## 5. Page architecture

Single scrolling page. Anchored nav. The menu button in the header is a **placeholder** for now (see
`sections/00-shell.md`) — it renders, it focuses, it does nothing.

```
┌──────────────────────────────────────────────────┐
│ header  [mark] Contekai        [menu] [Log in] [Start free] │  sticky, 64px, glass-free
├──┬───────────────────────────────────────────────┤
│  │ 01  HERO — video ground, lights-out thesis    │  100svh, dark
│ r│     H1 / sub / two actions / trust line       │
│ a├───────────────────────────────────────────────┤
│ i│ 02  CAPABILITIES — horizontal card deck ×6    │  paper
│ l│     drag / arrows / keyboard, snap            │
│  ├───────────────────────────────────────────────┤
│  │ 03  BUILT FOR HERE — 4 claims, ledger rows    │  dark
│  │     alternating problem → response            │
│  ├───────────────────────────────────────────────┤
│  │ 04  PRICING — the receipt + locations stepper │  paper, tallest section
│  ├───────────────────────────────────────────────┤
│  │ 05  PROOF — shops, one quote at a time        │  dark
│  ├───────────────────────────────────────────────┤
│  │ 06  FOOTER — closing action + contact         │  paper→dark
└──┴───────────────────────────────────────────────┘
```

**Rhythm rule:** sections alternate ground (dark / paper / dark / paper / dark / dark) so the page has
a pulse instead of uniform bands. Section padding is **not** constant — hero is full viewport,
capabilities is tight and horizontal, pricing is generous, proof is compressed. See the space scale.

**Why one page:** the buyer is on mobile data and mid-decision. Splitting pricing onto its own route
adds a network round trip and a bounce point. The anchored nav gives navigation without navigation.

## 6. Token system (summary — full spec in `skills/design-system/SKILL.md`)

**Colour — 6 named jobs.**

| Token | Hex | Job |
|---|---|---|
| `--ink-900` | `#0A151E` | Page ground at night. Blue-black, warm shadow. |
| `--ink-700` | `#14293A` | Raised dark surfaces, dark section separation. |
| `--paper` | `#F6F3EC` | Light sections, cards, the receipt. |
| `--laterite` | `#B34A26` | Primary action. Taken from the mark. |
| `--kai` | `#1E6BA8` / `#4E9BDC` on dark | Links, secondary emphasis. From the wordmark. |
| `--signal` | `#2F9E6B` | Status only — synced, in stock, saved. Never decoration. |

Contrast verified: paper on ink 16.7:1 · white on laterite 5.4:1 · laterite on paper 4.8:1 ·
`#4E9BDC` on ink 6.2:1 · `#1E6BA8` on paper 5.1:1.

**Type — two families, both variable, both self-hosted and subset.**

- **Archivo Variable** (SIL OFL) — display *and* body. The width axis is the point: headlines at
  `wdth 112` / `wght 700` are broad and declarative; body at `wdth 100` / `wght 400` is plain and
  workmanlike. One family doing two jobs is a bandwidth decision as much as an aesthetic one.
- **DM Mono** (SIL OFL) — figures, receipt lines, the rail, tabular data. Restricted to numbers,
  labels, and the signature. Never for prose.

Rationale for not using the obvious pairing: a geometric like Poppins would echo the wordmark and
flatten the page; a high-contrast serif display would land straight in the AI-editorial default.
Archivo's width axis gives the page its own voice without adding a byte.

**Space:** 4px base, scale `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128`. Section rhythm uses
`--space-section-{tight|base|loose}` = `64 / 96 / 128` (desktop), `48 / 64 / 80` (mobile).

**Radius:** `--r-sm 4px` (inputs, chips) · `--r-md 10px` (cards) · `--r-full` (pills, avatars only).
No 24px "soft" cards. The receipt has **zero** radius and a torn edge instead.

**Elevation:** no blur-heavy shadows. Dark surfaces separate by value; paper surfaces separate by a
1px `--hairline` and a single low shadow `0 1px 2px rgb(10 21 30 / .08)`.

## 7. Motion posture (full grammar in `skills/motion/SKILL.md`)

One orchestrated moment (the hero load), one interactive moment (the pricing tally), one continuous
mechanic (the card deck). Everything else is a 200 ms opacity/translate reveal or nothing.

Motion must *mean*: content enters from the direction it lives, the total counts because a total is
being computed, the deck moves because you moved it.

## 8. Risks and how the build handles them

| Risk | Mitigation |
|---|---|
| Hero video is low quality, vertical phone footage | Never full-bleed raw. Constrained, graded, heavily scrimmed; the composition must work with the poster alone. See `sections/01-hero.md`. |
| Dark page reads as generic dark SaaS | Paper sections at full width, warm shadow ground, receipt signature. Enforced by the gate. |
| Card deck becomes a generic carousel | Cards are *product surfaces*, not icon+title+text. Each card carries a real screen fragment. |
| Receipt reads as gimmick | It computes something real (locations × term). If it stops being functional, it gets cut. |
| Fake-looking testimonials | Real names, businesses, towns, or the section does not ship. |
| Perf blowout from video + GSAP | Video lazy-loads after LCP; motion uses CSS + `IntersectionObserver` first, GSAP only if a section genuinely needs it. |
