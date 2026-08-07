# 03 — Built for here

Replaces "Why Businesses Choose Contekai". Dark ground — back to night, and the section where the
local argument gets made explicitly.

---

## Job

Answer the objection the reader is actually holding: *"POS software is built for shops that have
power and internet. Mine doesn't, always."* Four claims, each framed as a condition and a response.

The current site states these as four benefits with icons. Benefits are cheap. **Conditions are
credible** — naming the problem accurately is what proves you know the market.

## Structure — ledger rows, not cards

```
┌──┬──────────────────────────────────────────────────────────────┐
│ r│ ── BUILT FOR HERE                                            │
│ a│                                                              │
│ i│ Made for the way                                             │
│ l│ shops here actually run.                                     │
│  │                                                              │
│  │ ────────────────────────────────────────────────────────────│
│  │ 01   The power goes.        │  Sales and stock keep working  │
│  │      The network drops.     │  offline. Everything syncs the │
│  │                             │  moment you're back online.    │
│  │ ────────────────────────────────────────────────────────────│
│  │ 02   Staff change often.    │  Anyone can learn the till in  │
│  │                             │  a few minutes. Each person    │
│  │                             │  gets their own login and only │
│  │                             │  the access you give them.     │
│  │ ────────────────────────────────────────────────────────────│
│  │ 03   Stock walks, expires,  │  Alerts before you run out,    │
│  │      or runs out unnoticed. │  before things expire, and     │
│  │                             │  when a count doesn't match.   │
│  │ ────────────────────────────────────────────────────────────│
│  │ 04   You can't see where    │  Best sellers, busiest hours,  │
│  │      the money is made.     │  margin per item, profit per   │
│  │                             │  branch — in dalasis, daily.   │
│  │ ────────────────────────────────────────────────────────────│
└──┴──────────────────────────────────────────────────────────────┘
```

- Two columns: **condition** (left, `--on-ink`, Archivo 600, 1.375rem) and **response** (right,
  `--on-ink-muted`, Body, ≤ 46ch). Hairline rules top and bottom of each row — `--hairline-ink`.
- The index numbers **are** meaningful here: this is a checklist of four objections, and the reader
  can count them off. (Contrast with the deck, where the numbers are positional. Do not add numbers
  anywhere they don't carry information.)
- No icons. No cards. No background fills on rows. The rules and the two-column split are the entire
  structure. This is the quiet section — it sits between the deck and the receipt and its job is to
  slow the reader down and be believed.

**Row height varies with content.** Do not force equal heights; a ledger has uneven entries. Equal
heights here would push it back toward a card grid.

## Content

Facts from `CONTEXT.md` §4 "Why Contekai". Condition/response pairs as in the diagram above.

**Section header:**
- Eyebrow: `BUILT FOR HERE`
- H2: `Made for the way shops here actually run.`
- No intro paragraph. The rows are the argument; a preamble weakens them.

**One supporting element, at the end of the section:** a single line, DM Mono, `--on-ink-faint`,
right-aligned under the last rule:

> `THE GAMBIA · DALASIS · WAVE · OFFLINE-FIRST`

That is the whole flourish. Nothing else.

**Do not add:** a comparison table against "other POS systems", a stat band ("99.9% uptime"), or
customer logos. All three are unsubstantiated and all three are template reflexes.

## Motion

Rows wipe in from the left with `clip-path: inset(0 100% 0 0)` → `inset(0)` at `--dur-slow`,
staggered `60ms`, fired once by the shared observer. The wipe direction is the point: the rows are
being *written*, like entries in a book. The hairline rule draws first (`scaleX` from `0`, transform
origin left, `--dur-base`), then the text fades in behind it.

Four rows = four steps, inside the six-item stagger limit. Reduced motion: everything visible
immediately.

No hover state on the rows. They are not interactive and must not pretend to be.

## Responsive

- Below `768px` the two columns stack: condition on top (still 1.375rem), response below at Body,
  `--space-3` between, `--space-6` between rows. The hairline rules stay — they are what holds the
  section together at mobile width.
- The index number sits inline before the condition on mobile (`01  The power goes.`), in DM Mono
  with `--on-ink-faint`.
- Section padding is the largest on the page (`--space-10` desktop) — this section breathes more than
  its neighbours, which is part of the page's rhythm.

## Accessibility

- `<section id="built-for-here" aria-labelledby="bfh-title" data-ground="dark">`.
- Semantically this is a description list: `<dl>` with `<dt>` (condition) and `<dd>` (response). It
  reads correctly in a screen reader and the markup means what it looks like.
- Index numbers are `aria-hidden` — the list structure already conveys enumeration.
- Muted response text at `--on-ink-muted` (.68) on `--ink-900` ≈ 11:1. Do not lighten the ground or
  fade the text further.

## Gate additions

- [ ] Zero icons, zero cards, zero filled row backgrounds in this section.
- [ ] Rows are uneven in height and that is intentional.
- [ ] Marked up as `<dl>`, not divs.
- [ ] Wipe fires once, from the left, and reduced motion shows everything immediately.
- [ ] No invented stats, no competitor comparison, no logo strip.
- [ ] The conditions name real local problems in plain words a shop owner would use.
