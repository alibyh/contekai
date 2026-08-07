# 05 — Proof

Dark ground. Compressed — the shortest section on the page. It follows the receipt, so it has to be
brief or it dilutes the decision the reader just made.

---

## Job

Make one shop owner's experience specific enough to be believed. Not "loved by business owners" —
*this person, this shop, this town, this problem solved*.

## The honesty rule (blocking)

**A testimonial without a real name, a real business, and a real town does not ship.** Five gold
stars over an anonymous quote is the single most recognisable fake-social-proof pattern and it costs
more trust than it buys — especially in a small market where the reader may know the shop.

Three states, in order of preference:

1. **Full:** 3–5 real testimonials with name, business, town, and (with permission) a photo.
2. **Reduced:** 1–2 real testimonials, same treatment, no carousel. Perfectly good — one credible
   quote beats five hollow ones.
3. **Absent:** if the client can't supply attributable quotes yet, **cut the section entirely** and
   replace it with a single line under the pricing receipt: *Contekai is in use by shops across The
   Gambia.* `[VERIFY]` — and only if that's true.

Do not ship star ratings unless they come from a real, linkable review source.

## Layout — one quote at a time

```
┌──┬──────────────────────────────────────────────────────────────┐
│ r│ ── SHOPS USING IT                                            │
│ a│                                                              │
│ i│  “I have two other businesses aside of Kerr ———————————      │
│ l│   ————————————————————————————————————————————               │
│  │   ————————————————————————.”                                 │
│  │                                                              │
│  │   ┌────┐                                                     │
│  │   │ 📷 │  Name Surname                                       │
│  │   └────┘  Business name · Serekunda                          │
│  │                                                              │
│  │   ┌──┐ ┌──┐ ┌──┐ ┌──┐        ← other shops: 56px thumbnails, │
│  │   └──┘ └──┘ └──┘ └──┘          clicking swaps the quote      │
└──┴──────────────────────────────────────────────────────────────┘
```

- The quote is set **large** — Archivo `wdth 104 / wght 400`, `clamp(1.5rem, 2.6vw, 2.125rem)`,
  leading `1.35`, max `26ch` per line, left-aligned, `--on-ink`. It is the only place on the page
  where body-weight type is set at display size, and that is what gives it presence without a card
  around it.
- **No card, no quotation-mark graphic, no background panel.** The quote sits directly on the ground.
  A quote in a rounded card with a giant `"` glyph is the template treatment.
- Opening and closing typographic quotes are part of the text, hung into the left margin
  (`text-indent: -0.4em`) so the first letter aligns to the grid. Small detail; it's the difference
  between typeset and typed.
- Attribution: 40px photo (circle, the only `--r-full` on the page besides pills), name in Archivo
  600, business + town in DM Mono `--on-ink-muted`.
- The thumbnail row is the selector. Active thumbnail at full opacity with a 2px `--laterite` ring;
  others at `.5`. This is the navigation — no dots, no arrows.

## Interaction

- Click/tap a thumbnail → the quote crossfades (`--dur-base`, out at 70% of in) and the attribution
  swaps. The thumbnails do not move.
- Arrow keys move between thumbnails (`role="tablist"` / `role="tab"` / `role="tabpanel"` — this is
  genuinely a tab pattern, so use it properly rather than inventing one).
- **No auto-advance.** No swipe-only interaction.
- Reduced motion: instant swap, no crossfade.
- No JS: render all testimonials stacked, each with its attribution. Still correct, just longer.

## Content

From `CONTEXT.md` §4 — currently only a fragment is known: *"I have two other businesses aside of
Kerr…"*.

`[VERIFY]` before build:
- Full quote text for each testimonial (edit only for length, never for meaning; mark any ellipsis).
- Name, business name, town.
- Written permission to use name and photo.
- What each person actually values — the best testimonials name a **specific** thing ("I stopped
  losing sales during power cuts", "I found out which of my two shops was actually making money"),
  not a general compliment.

**Section header:**
- Eyebrow: `SHOPS USING IT`
- H2: `From shops around the country.`
- No intro paragraph.

Do not write, generate, or "example" a testimonial. If copy is needed before the real ones arrive,
render the placeholder state: a `--hairline-ink` box with mono text
`AWAITING REAL TESTIMONIAL — NAME, BUSINESS, TOWN, PERMISSION`.

## Motion

Section reveal only: the quote fades + 16px up, attribution `60ms` later, thumbnails `120ms` later.
Fires once. Nothing else moves.

## Responsive

- < 768: quote drops to `clamp(1.3rem, 5vw, 1.75rem)`; thumbnails scroll horizontally with snap if
  more than four; attribution stacks under the photo.
- Photos: AVIF/WebP, `loading="lazy"`, explicit dimensions, `object-fit: cover`, ≤ 20 KB each at 2×.

## Accessibility

- `<section id="shops" aria-labelledby="proof-title" data-ground="dark">`.
- Use `<figure>` + `<blockquote>` + `<figcaption>` for each testimonial. The attribution belongs in
  the figcaption, not inside the blockquote.
- Tab pattern: `aria-selected`, `aria-controls`, roving `tabindex`. Panels labelled by their tab.
- Photo alt: the person's name. Not "customer photo".
- Contrast: quote at `--on-ink` (16.7:1); attribution at `--on-ink-muted` (~11:1).

## Gate additions

- [ ] Every visible testimonial has name + business + town, or the section is in its reduced/absent state.
- [ ] No invented quotes. No stars without a linkable source.
- [ ] No card, no giant quote-mark graphic, no auto-advance, no dots.
- [ ] Proper tab semantics, keyboard navigable.
- [ ] `<blockquote>` / `<figcaption>` markup, not divs.
- [ ] Section is visibly shorter than pricing — check the rhythm against `PLAN.md` §5.
