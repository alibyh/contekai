# 04 — Pricing (the signature)

Paper ground. The tallest, most generous section on the page. This is where the design spends its
boldness — everything else on the page is quiet so that this can be loud.

---

## Job

Contekai's pricing has one genuinely unusual property: **it is per location, and every plan has every
feature.** There is no feature-gating, so a three-column feature-comparison table has nothing to
compare — which is exactly why the standard SaaS pricing table would be both ugly and dishonest here.

What the buyer actually needs to compute is: *how many locations do I have, how long do I commit, what
do I pay?* So the section is a calculator that produces a receipt.

## The idea

A thermal receipt, printed live. Zero radius, torn top and bottom edge, `--paper-hi` face, DM Mono
throughout, tabular figures, a `TOTAL DUE` where a total belongs. The reader sets locations and term;
the receipt reprints.

This is the one place the receipt motif appears in a full form (the rail is its echo). It earns its
place because it **computes something real**, is **the artifact the product literally produces**, and
**answers the buyer's actual question** faster than a table would. If during the build it stops doing
those three things, cut it and ship a plain, well-set pricing panel instead — a gimmick that doesn't
compute is worse than a table that does.

## Layout

```
┌──┬──────────────────────────────────────────────────────────────┐
│ r│ ── PRICING                                                   │
│ a│                                                              │
│ i│ Pay per location.                                            │
│ l│ Nothing else.                                                │
│  │                                                              │
│  │  ┌── CONTROLS ────────────┐   ╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲            │
│  │  │                        │   │  CONTEKAI            │       │
│  │  │ Locations              │   │  POS & INVENTORY     │       │
│  │  │  [ − ]  3  [ + ]       │   │  ──────────────────  │       │
│  │  │                        │   │  QTY ITEM     AMOUNT │       │
│  │  │ Term                   │   │   3  Location ×      │       │
│  │  │  ( ) 1 month           │   │      12 months       │       │
│  │  │  ( ) 6 months          │   │              D54,000 │       │
│  │  │  (•) 12 months  −10%   │   │      Annual discount │       │
│  │  │                        │   │              −D5,400 │       │
│  │  │ Every plan includes    │   │  ──────────────────  │       │
│  │  │ every feature. The     │   │      TOTAL DUE       │       │
│  │  │ price is the only      │   │            D48,600   │       │
│  │  │ difference.            │   │  ──────────────────  │       │
│  │  │                        │   │  PER LOCATION/MONTH  │       │
│  │  └────────────────────────┘   │              D1,350  │       │
│  │                               │  ──────────────────  │       │
│  │                               │  FIRST 7 DAYS FREE   │       │
│  │                               │  PAID BY WAVE        │       │
│  │                               │                      │       │
│  │                               │  [ Start 7 days free]│       │
│  │                               ╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲            │
│  │                                                              │
│  │  Adding a location later is billed at the same rate from the │
│  │  day you add it.   [VERIFY: is there actually a discount?]   │
└──┴──────────────────────────────────────────────────────────────┘
```

Desktop: controls in columns 1–5, receipt in columns 7–12, receipt slightly taller than the controls
and offset upward by `--space-6` so it doesn't sit on the same baseline. Mobile: controls first,
receipt below, full width.

## The receipt — construction

- **Face:** `--paper-hi`, `--r-none`, `--shadow-lift`. No border — the torn edges define it.
- **Torn edges:** top and bottom, CSS mask, not an image:
  ```css
  --tear: 12px;
  mask-image:
    radial-gradient(var(--tear) at 50% 0, transparent 99%, #000 100%),
    radial-gradient(var(--tear) at 50% 100%, transparent 99%, #000 100%);
  mask-size: calc(var(--tear) * 2) 100%;
  mask-repeat: repeat-x;
  ```
  Tune so the scallop reads at 320px. It must be crisp, not fuzzy — a soft torn edge looks like a
  drop shadow bug.
- **Type:** DM Mono throughout, `0.8125rem`, leading `1.7`, `letter-spacing: .02em`. Dotted leader
  between label and figure (`border-bottom: 1px dotted` on a flex spacer), which is what makes it
  read as a printed docket rather than a styled div.
- **Figures:** `font-variant-numeric: tabular-nums`, right-aligned, always `D` + thousands separator.
- **Header block:** `CONTEKAI` / `POS & INVENTORY` / a mono date line showing today's date. The date
  is a small, real detail that sells the artifact — generate it client-side, format `07/08/2026`.
- **`TOTAL DUE`** is the only line at `1.25rem`, `wght 500`, with a double rule above it.
- **The CTA sits inside the receipt**, full width, `--laterite`, `--r-sm`. A primary button inside a
  paper artifact is the section's payoff.

## Controls

**Locations stepper**
- `[ − ]  <input type="number" min="1" max="99" value="1">  [ + ]`
- A **real number input**, not a display div. Keyboard users type; touch users tap. Both work.
- Buttons ≥ 44×44, `--r-sm`, `--border-paper`, labelled `aria-label="Fewer locations"` /
  `"More locations"`, `aria-disabled` at the bounds.
- Below the input, small text: `Most shops start with one.` Cut it if it reads as filler.

**Term selector**
- Three radios in a segmented control (`role="radiogroup"`, `aria-label="Billing term"`): `1 month`,
  `6 months`, `12 months`. Real inputs, visually styled; never divs with click handlers.
- The 12-month option shows `−10%` in `--laterite` next to it. Only state a discount that is real:
  `D18,000 → D16,200` is exactly 10%.
- Default selection: **12 months**, because it is the best value and the receipt should open on the
  most persuasive state. Do not add a "Most popular" badge — the maths is doing that job.

## Pricing maths (verify before shipping)

```
monthly rate               D 1,500  per location per month
1 month   → 1,500 × L
6 months  → [VERIFY]       ← CONTEXT.md §4. If unconfirmed, omit the 6-month option entirely.
12 months → 16,200 × L     (list 18,000 × L, discount −1,800 × L, = 10%)
per location / month = total ÷ L ÷ months
```

**Do not invent the 6-month price.** If the client hasn't confirmed it, ship two terms and note it in
`NOTES.md`. An invented number on a pricing page is the most damaging possible error.

Same rule for the multi-location discount the current site promises but never states: either the
client gives the number and the receipt shows a `MULTI-LOCATION DISCOUNT` line, or the promise is
removed from the copy. Do not ship an unquantified discount claim.

## The free trial

Not a fourth column. A single line above the controls, with a hairline rule:

> **7 days free, on your first location.** No card. Nothing to pay until you decide.

Facts from `CONTEXT.md`: full access to all features, no payment required, first location only,
upgrade anytime. Stating "first location only" plainly is a trust move — hiding it and surprising
someone at location two is not.

## Copy

- Eyebrow: `PRICING`
- H2: `Pay per location. Nothing else.`
- Intro (≤ 52ch): *Every plan has every feature. Longer terms cost less. That's the whole pricing
  page.*
- Under the receipt, Small, `--on-paper-muted`: *Prices in Gambian dalasi. Paid by Wave. Add or
  remove locations whenever you need to.*

## Motion

Per `skills/motion/SKILL.md` §2B.

- On first view: the receipt clips in from the top — `clip-path: inset(0 0 100% 0)` → `inset(0)` at
  `--dur-slow` — as if fed out of a printer. Once. This is the section's entrance.
- On change: the affected line flashes once at 8% `--laterite` over `--dur-slow`; the figures roll
  with `--ease-snap` at `--dur-base`. The `TOTAL DUE` changes without flashing.
- No confetti, no pulse on the CTA, no shimmer on the paper.

## Accessibility

- `<section id="pricing" aria-labelledby="pricing-title" data-ground="paper">`.
- The receipt is a `<table>` if it's tabular — and it is: qty / item / amount. Use real `<th>`s with
  a visually-hidden caption ("Your Contekai subscription"). Do not fake a table with flexbox divs.
- Wrap the computed region in `aria-live="polite"` and announce the total on change: *"Total due, 48,600 dalasi."*
- Every control is a real form element with a visible label.
- Focus ring visible on the stepper buttons against `--paper-hi`.
- At 200% zoom the receipt must remain readable — mono at 13px scales to 26px; check the tear mask
  doesn't clip text.

## Responsive

- < 768: single column. Controls first, receipt below at full container width. The receipt keeps its
  proportions — do not let it become a full-bleed panel; it needs its edges visible on both sides
  (`max-width: 420px`, centred) or it stops being an object.
- The receipt is the one element on the page permitted to be centred, because a receipt is symmetric.
- < 380: reduce mono to `0.75rem` and `--tear` to `9px`; verify no figure wraps.

## Gate additions

- [ ] The receipt computes a correct total for 1, 3, and 12 locations across every term. Check by hand.
- [ ] No invented prices. `[VERIFY]` items are confirmed or absent.
- [ ] Real `<input type="number">` and real radios; no div-with-onclick controls.
- [ ] Tabular figures; the total never jitters while changing.
- [ ] Announced via `aria-live`; keyboard-only path fully works.
- [ ] Torn edge is crisp at 320px and at 200% zoom.
- [ ] No "Most Popular" ribbon anywhere.
- [ ] Trial terms stated honestly, including "first location only".
