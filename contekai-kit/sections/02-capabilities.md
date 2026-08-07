# 02 — Capabilities (the card deck)

Replaces the six-card vertical scroll on the current site with a horizontal deck the reader moves
through. Paper ground — the first light after the hero's night.

---

## Job

Show that this is a complete system, not a single tool, in less than a screen of height. The old
section made the reader scroll past six near-identical cards; the deck lets them flick through six
and stop at the one that matters to them.

## The card is a product surface, not an icon card

This is the section that most easily collapses into the generic feature grid. The rule that prevents
it: **every card carries a fragment of the real product.** A cropped screenshot, a real receipt line,
a real low-stock alert, a real dalasi figure. The icon is small and secondary; the evidence is the
subject.

```
┌─────────────────────────────────┐
│ 01 ─────────────                │  ← DM Mono index + hairline
│                                 │
│ ┌─────────────────────────────┐ │
│ │  real product fragment      │ │  ← 16:10, cropped tight, 2× screenshot
│ │  (screenshot / receipt /    │ │     on --paper-hi, hairline frame
│ │   alert / figure)           │ │
│ └─────────────────────────────┘ │
│                                 │
│ Ring up a sale in seconds       │  ← H3, verb-first
│                                 │
│ Scan the barcode, take cash,    │  ← Body, 2–3 lines, ≤ 38ch
│ Wave or bank transfer, print    │
│ the receipt. Done.              │
│                                 │
│ ⟵ icon 20px, --laterite, inline with a 12px mono tag: BARCODE · RECEIPTS
└─────────────────────────────────┘
   360px wide desktop · 84vw mobile · 480px tall
```

**Banned card treatment:** pastel rounded square + centred icon + bold title + two lines of grey
text. If the card would still make sense with the image removed, the image isn't doing work — fix
the image, don't remove it.

## Layout

```
┌──┬─────────────────────────────────────────────────────────────┐
│ r│ ── WHAT IT DOES                                             │
│ a│                                          [←] [→]  01 / 06   │
│ i│ From the counter                                            │
│ l│ to the books.                                               │
│  │                                                             │
│  │ ┌───────┐ ┌───────┐ ┌───────┐ ┌────                        │
│  │ │ card1 │ │ card2 │ │ card3 │ │ car…  →  bleeds off right  │
│  │ └───────┘ └───────┘ └───────┘ └────                        │
│  │ ▬▬▬▬▬▬▬▬░░░░░░░░░░░░░░░░░░░░░░░░░░░  ← scrub bar, draggable │
└──┴─────────────────────────────────────────────────────────────┘
```

- Section header is **left-aligned**; the arrows and the `01 / 06` counter sit on the same baseline,
  right. That asymmetry is deliberate — a centred header over a horizontal deck is the template shape.
- The track bleeds off the right viewport edge (no right container padding on the track). The
  visible partial card is the affordance that tells you it moves. Left padding aligns with the grid.
- Below the track: a thin scrub bar (`4px`, `--hairline-paper` under, `--laterite` fill) that is also
  a drag target. It is the only progress indicator — no dots. Six dots under a carousel is filler.

## Content — six cards, verb-first titles

Facts from `CONTEXT.md` §4. Titles rewritten so each names an action, not a category.

| # | Title | Body | Fragment | Tag |
|---|---|---|---|---|
| 01 | Ring up a sale in seconds | Scan the barcode, take cash, Wave, or bank transfer, print the receipt. Done. | POS screen, cropped to the cart + payment row | `BARCODE · RECEIPTS` |
| 02 | Know what's running out | Live stock counts, low-stock alerts, expiry dates, and a reorder list that writes itself. | Low-stock alert row, real product names | `ALERTS · EXPIRY` |
| 03 | See the day's profit | Sales, expenses, and profit in dalasis — today, this week, this month. | Dashboard profit figure, `GMD` visible | `DALASIS · REPORTS` |
| 04 | Run every branch from one place | Add locations, give staff their own logins and permissions, see who sold what. | Locations list + a role dropdown | `BRANCHES · STAFF` |
| 05 | Find your best sellers | Top products, busiest hours, margins per item. The numbers you'd otherwise guess at. | A single real chart from the app — one, not a collage | `TRENDS · MARGINS` |
| 06 | Keep going when the network doesn't | Sales and stock updates carry on offline. Everything syncs the moment you're back. | Offline badge + `Synced` state in `--signal` | `OFFLINE · SYNC` |

Card 06 is the thesis card. Put it last so the deck ends on the differentiator, and give it the
`--ink-700` dark treatment — one dark card in a paper deck, echoing the hero. That is the only
variation in the set.

**Section header copy:**
- Eyebrow: `WHAT IT DOES`
- H2: `From the counter to the books.`
- Intro (≤ 52ch, optional — cut it if the deck reads without it): *Six things Contekai does for a
  shop, every day.*

## Interaction

Per `skills/motion/SKILL.md` §2C.

- **Snap:** CSS only — `scroll-snap-type: x mandatory` on the track, `scroll-snap-align: start` on
  cards, `scroll-padding-left` matching the grid inset.
- **Drag:** pointer events on desktop (`pointerdown/move/up`, with `setPointerCapture`). Native touch
  scroll on touch devices — do not intercept it.
- **Arrows:** scroll by one card width + gap using `scrollBy({ behavior: 'smooth' })`. Disable the
  arrow at each end with `aria-disabled` and reduced opacity — never hide it (a control that
  disappears makes the layout jump).
- **Keyboard:** the track is `tabindex="0"`, `role="group"`, `aria-label="Capabilities"`; Left/Right
  arrows move one card, Home/End jump to the ends. Each card's link/tag is separately focusable and
  focusing it scrolls it into view.
- **Never auto-advance.**
- **No JS:** the track is a plain `overflow-x: auto` row with snap. Fully usable.

**Adjacent-card falloff:** non-active cards at `opacity: .55`, `scale(.97)`, `--dur-base`. Driven by
an IntersectionObserver on the track (threshold `0.6`), or by CSS scroll-driven animations where
supported — feature-detect, don't polyfill.

## Responsive

| Width | Cards visible | Card width |
|---|---|---|
| < 480 | 1 + a sliver | `84vw` |
| 480–767 | 1.4 | `72vw` |
| 768–1023 | 2.2 | `340px` |
| ≥ 1024 | 3.2 | `360px` |

Gap `--space-5`. Card height is fixed per breakpoint (`480px` desktop, `440px` mobile) so the track
never reflows mid-drag; body copy is capped at 3 lines with the fragment absorbing the difference.

## Accessibility

- `<section id="what-it-does" aria-labelledby="cap-title" data-ground="paper">`.
- Track: `role="group"` with a label; cards are `<article>` with an `<h3>`.
- Arrow buttons: `aria-label="Previous capability"` / `"Next capability"`, ≥ 44×44.
- `01 / 06` counter is `aria-live="polite"` so the position is announced on change.
- Card images: real alt text describing the screen ("Low stock alert showing three products below
  reorder level"), not "screenshot".
- No horizontal scroll trap: `touch-action: pan-x pan-y` on the track.

## Gate additions

- [ ] Every card carries a real product fragment; none is icon-chip + title + grey text.
- [ ] No dots. No auto-advance. No 3D tilt or coverflow.
- [ ] Works with JS off and with keyboard only.
- [ ] Track bleeds off the right edge; header is left-aligned with controls on the right.
- [ ] Card 06 is the dark card and closes the deck.
- [ ] Titles are verb-first — none is a bare noun phrase.
