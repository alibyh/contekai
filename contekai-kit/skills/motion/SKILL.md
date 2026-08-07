---
name: contekai-motion
description: The motion grammar for the Contekai site — tokens, easings, the three sanctioned choreographed moments, and the reduced-motion contract. Read before animating anything.
---

# Motion

Motion here has one job: make the page feel like a working instrument rather than a brochure. If an
animation does not carry meaning, it is decoration, and decoration is what makes a page read as
AI-generated. Cut it.

---

## 1. Tokens

```css
--dur-instant: 100ms;  /* state flips: checked, pressed */
--dur-fast:    160ms;  /* hover, focus, colour */
--dur-base:    240ms;  /* small position/opacity moves */
--dur-slow:    420ms;  /* section reveals, card transitions */
--dur-stage:   700ms;  /* the hero load sequence only */

--ease-out:  cubic-bezier(0.20, 0.70, 0.20, 1);   /* default: things arriving */
--ease-in:   cubic-bezier(0.55, 0, 0.85, 0.35);   /* things leaving — always faster */
--ease-snap: cubic-bezier(0.30, 1.20, 0.45, 1);   /* the stepper + tally only */
```

**Rules**

- Enter with `--ease-out`. Exit with `--ease-in` at **70% of the enter duration**. Things leave
  faster than they arrive.
- Animate **`transform` and `opacity` only**. Never `width`, `height`, `top`, `left`, `margin`, or
  `box-shadow` on a scroll- or hover-driven animation. `filter` only on the hero video, once.
- Nothing exceeds `--dur-slow` except the hero load.
- Stagger step is `60ms`, max 6 items in a chain. A seventh item makes the sequence feel slow and
  scripted.
- Distance is small: reveals move `12–20px`, never 60px. Long travel is the theatrical tell.
- No parallax on body content. No scroll-jacking. No pinned sections. The user's scroll is theirs.
- No looping ambient animation anywhere except the hero video itself.

---

## 2. The three sanctioned moments

Everything else in the build is a plain reveal (see §3).

### A. Hero load — orchestrated, once
The only sequence longer than 420ms. Fires on `DOMContentLoaded`, not on scroll.

```
0ms     poster frame visible, scrim at full
80ms    eyebrow  — mask-reveal up, 320ms
200ms   H1 line 1 — mask-reveal up, 420ms
260ms   H1 line 2 — mask-reveal up, 420ms
340ms   sub       — fade + 12px up, 380ms
440ms   actions   — fade + 12px up, 320ms
520ms   trust line— fade, 240ms
600ms   scrim eases from 1.0 → 0.82, 700ms   (the "lights coming up" beat)
+video begins playing only after LCP has settled
```

Mask-reveal = a wrapping `overflow: hidden` span with the inner text at `translateY(100%) → 0`. No
per-character splitting: character-by-character text animation is a signature AI-design flourish and
it wrecks screen-reader output.

### B. Pricing tally — interactive, on demand
The receipt total recomputes when the locations stepper changes or the term changes.

- Digits roll with `--ease-snap` at `--dur-base`. `tabular-nums` mandatory.
- The changed receipt **line** flashes its background once at 8% `--laterite`, `--dur-slow`, then
  settles. The total never flashes — it just changes.
- On first scroll into view, the total counts once from 0 to value over `--dur-slow`, then never
  again. Respect `prefers-reduced-motion` by rendering the final value immediately.

### C. Card deck — continuous, user-driven
The capabilities deck moves because the user moved it: drag, arrows, keyboard, or scroll-snap.

- Snap is CSS (`scroll-snap-type: x mandatory`), not JS. JS only wires the arrow buttons and the
  progress state.
- Cards adjacent to the active one sit at `opacity: .55` and `scale(.97)`; the active card at 1.
  Transition `--dur-base`, `--ease-out`. That is the entire effect.
- No 3D rotation, no perspective tilt, no coverflow. Never auto-advance — auto-advancing carousels
  are a documented usability failure and steal control from a user reading on a phone.

---

## 3. Default reveal (everything else)

```css
[data-reveal] {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity var(--dur-slow) var(--ease-out),
              transform var(--dur-slow) var(--ease-out);
}
[data-reveal].is-in { opacity: 1; transform: none; }
```

- Triggered by a single shared `IntersectionObserver` (`rootMargin: "0px 0px -12% 0px"`,
  `threshold: 0.15`), **unobserved after firing**. One observer for the whole page.
- Reveals fire **once**. Nothing re-animates on scroll-back — that is the fastest way to make a page
  feel like a demo reel.
- Direction carries meaning where it can: the ledger rows in §03 wipe in from the left (they are
  being written); the receipt in §04 clips in from the top (it is being printed). Both are still
  transform+opacity, implemented with `clip-path: inset()`, which is compositable.

---

## 4. Reduced motion — a real state, not a disclaimer

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 1ms !important;
    scroll-behavior: auto !important;
  }
}
```

That block is the floor, not the answer. Additionally, **in JS**:

- Hero video does not autoplay — the poster frame stands, and the play control is offered explicitly.
- The tally renders its final value; no count-up.
- The deck still snaps and still scrolls; only the scale/opacity falloff is dropped.
- All `[data-reveal]` elements are set to `.is-in` immediately at init, before paint.

**Acceptance test:** with reduced motion on and JS disabled, the page must be complete, legible, and
still good-looking. Screenshot it. If it looks broken, the motion was load-bearing and the design is
wrong.

---

## 5. Library policy

Default to **CSS transitions + one IntersectionObserver**. That covers §3 entirely and most of §2C.

GSAP is permitted **only** for the hero load sequence (§2A) if the CSS implementation becomes
unreadable, and only via a dynamically imported, deferred bundle loaded after LCP. If GSAP is used,
`gsap.matchMedia()` must gate the sequence on `(prefers-reduced-motion: no-preference)`.

Framer Motion / Lottie / AOS / particles: no. Budget is 90 KB JS gzipped for the whole page.

---

## 6. Performance rules

- Add `will-change: transform` **only** on the deck track while dragging; remove it after.
- Never animate more than ~6 elements in the same frame.
- The hero video: `preload="none"` until LCP settles, then swap in; `playsinline muted loop`,
  `poster` always present, `object-fit: cover`, explicit `width`/`height` to reserve space (CLS
  budget < 0.1).
- Test on a throttled 4× CPU profile. If the hero sequence drops frames there, simplify it — the
  audience's devices are slower than the dev machine.
