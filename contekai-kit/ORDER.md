# ORDER — build sequence

One step per session. One commit per step. One `NOTES.md` entry per step. Do not batch.

Before each step: re-read that step's `sections/*.md` file **and** `skills/quality-gate/SKILL.md`.
After each step: run the gate, write the self-critique, screenshot at 1440 and 375.

---

## Step 0 — Scaffold
**Do:** `SCAFFOLD-PROMPT.md` in full.
**Gate:** dev server runs · tokens.css complete and tripwire removed · fonts load with no shift ·
Lighthouse ≥ 95/100/100 on the empty shell · keyboard path and skip link work.

---

## Step 1 — Shell: header, rail, ground switching
**Read:** `sections/00-shell.md`
**Why first:** the header and the till-rail set the page's coordinate system. Building sections
before them means retrofitting the rail gutter into finished layouts.
**Gate:** header is 64px, solid, swaps ground over dark/paper sections without flicker · menu button
renders, focuses, has `aria-label`, does nothing (documented TODO) · rail shows section index and
label, collapses to a top progress line under 900px · anchors scroll with correct offset · no layout
shift on sticky.

## Step 2 — Hero
**Read:** `sections/01-hero.md` · `skills/motion/SKILL.md` §2A
**The most important section in the build.** Budget real time here.
**Gate:** LCP is the headline or poster, never the video · poster-only composition (video removed)
still looks finished — screenshot it and check · reduced-motion path verified · text contrast on
every frame of the video, not just the poster · works at 375×667 and in landscape · headline reads
as a claim about this product, not a category.

## Step 3 — Capabilities deck
**Read:** `sections/02-capabilities.md` · `skills/motion/SKILL.md` §2C
**Gate:** CSS scroll-snap, never auto-advancing · drag, arrows, keyboard, and swipe all work · no
vertical scroll trapping on touch · focus never lands on an off-screen card without scrolling it in ·
each card carries real product substance, not an icon chip · works with JS disabled (becomes a plain
horizontally scrollable row).

## Step 4 — Built for here
**Read:** `sections/03-built-for-here.md`
**Gate:** four claims, all from `CONTEXT.md` · ledger rows read as a record, not as cards · left-wipe
reveal fires once · no icon-in-a-chip anywhere · copy passes the substitution test.

## Step 5 — Pricing (the signature)
**Read:** `sections/04-pricing.md` · `skills/motion/SKILL.md` §2B
**This is where the boldness is spent.** If the receipt does not compute something real, cut it and
say so rather than shipping a gimmick.
**Gate:** stepper is buttons **and** a real number input · totals use tabular-nums and never jitter ·
term switch recomputes correctly and is announced to screen readers (`aria-live="polite"`) · the
`[VERIFY]` items (6-month price, multi-location discount) are either confirmed or visibly absent —
no invented numbers · receipt is legible at 320px · tear edge is CSS/SVG, not an image.

## Step 6 — Proof
**Read:** `sections/05-proof.md`
**Gate:** every testimonial has a real name, business, and town, or the section ships in its
reduced form · no five-star rows without attribution · no auto-advance · photos are optimised and
permissioned.

## Step 7 — Footer + closing action
**Read:** `sections/06-footer.md`
**Gate:** one primary CTA, matching the header's label exactly · contact channel present (WhatsApp
is the highest-value element here) · legal links resolve or are removed · attribution to Pilore
Solutions confirmed before it ships.

## Step 8 — Whole-page pass
1. Read the page top to bottom on a 375px viewport as a first-time visitor. Where do you stop?
2. Run the full `quality-gate` audit against the assembled page, not section by section.
3. Rhythm check: are any two adjacent sections the same shape and the same padding? Fix.
4. Remove one thing from the page. There is always one.
5. Lighthouse mobile, throttled. axe-core clean. Keyboard path end to end.
6. Verify with JS disabled and with reduced motion on: complete, legible, still good.

## Step 9 — Handover
Write `HANDOVER.md`: token map, asset inventory with what's still placeholder, the open `[VERIFY]`
list from `CONTEXT.md`, known trade-offs, and how to add a section without breaking the rhythm rule.

---

## Later kits (not this one)
- Login / signup screens — the client will request this separately. It inherits `tokens.css` and the
  motion grammar unchanged; forms follow `quality-gate` §2 (visible labels, inline errors near the
  field, no placeholder-as-label).
- Dashboard shell, if the app UI is refreshed to match.
- Wolof/Mandinka copy pass, if the client wants it.

---

## Per-step reply format

Every step ends with:

```
Built: <what shipped>
Distinctive: <the thing that couldn't be on another site>
Templated: <the weakest remaining part>
Removed: <what I cut>
Gate: <pass / the failing blocker>
Needs from client: <assets or answers>
```
