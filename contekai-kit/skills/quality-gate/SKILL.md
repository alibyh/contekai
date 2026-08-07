---
name: contekai-quality-gate
description: The pass/fail gate for every section of the Contekai build — anti-vibecode audit, copy rules, accessibility and performance floor, and the self-critique ritual. Run before marking any step done.
---

# Quality Gate

Run this in full before closing any step in `ORDER.md`. A step that fails any **BLOCKER** does not
ship. Record the result in `NOTES.md`.

---

## 1. The anti-vibecode audit (BLOCKERS)

Answer each honestly. Any "yes" in this list is a rejection.

**Composition**
- [ ] Is the hero a centred headline + subhead + two pill buttons + a floating glass mockup?
- [ ] Do three or more sections have identical vertical padding and identical centred headers?
- [ ] Is every section a full-width band with a max-width container and nothing else? (No variation
      in how content meets the edge.)
- [ ] Are feature cards `icon-in-a-pastel-square → bold title → two lines of grey text`, repeated?
- [ ] Is the pricing three equal columns with a "Most Popular" badge on the middle one?
- [ ] Is there a logo strip of grey placeholder company marks?

**Surface**
- [ ] Any purple/indigo gradient, mesh blob, glassmorphism blur, or glow?
- [ ] Gradient applied to text?
- [ ] Any emoji used as an icon?
- [ ] More than one icon style (filled + outline, or two libraries)?
- [ ] Border radius values other than 4 / 10 / 999 / 0?
- [ ] Any hex value hardcoded outside `tokens.css`?

**Motion**
- [ ] Does anything animate that does not communicate something?
- [ ] Does anything re-animate on scroll-back?
- [ ] Any character-by-character text animation, auto-advancing carousel, or scroll-jack?

**Copy**
- [ ] Any invented number, testimonial, or "trusted by N businesses" claim not in `CONTEXT.md`?
- [ ] Any sentence that would fit unchanged on a different company's site?
- [ ] Any lorem ipsum, any `Lorem`, any placeholder left unmarked?

**The substitution test** — the strongest single check:
> Swap the logo, the product name, and the palette for a different B2B SaaS. Does the page still
> work perfectly? **If yes, the design has no point of view and fails.** Something on the page must
> break when you remove Contekai from it.

For this build, what should break: the night/paper opposition (it only means something because of
power cuts), the receipt (only means something because of a POS), the dalasi figures, the
per-location stepper, and the towns in the testimonials.

---

## 2. Copy rules

Copy is design material. Bad copy makes good layout look templated.

**Voice:** plain, direct, concrete, unhurried. Sentence case. Short sentences. Written for a shop
owner reading on a phone, not for a procurement committee.

**Do**
- Name what happens: "Keep selling when the lights go out."
- Use real quantities: `D 1,500 per location, per month.` `7 days free.` `Syncs when you're back online.`
- Use active voice and the user's vocabulary: stock, branch, till, receipt, staff — not "SKU
  management", "multi-tenant", "seamless integration".
- Keep the label consistent through the flow: the button says **Start free trial**, so the page it
  lands on says **Start your free trial**, and the confirmation says **Trial started**.
- Say the awkward thing plainly where it builds trust: "The trial covers your first location."

**Don't**
- No "empower", "seamless", "revolutionise", "supercharge", "unlock", "elevate", "game-changing",
  "cutting-edge", "solutions", "leverage", "robust", "journey", "one-stop".
- No exclamation marks. No rhetorical questions as headings ("Ready to grow?").
- No feature name that is a noun phrase with no verb in it ("Smart Inventory Control" → "Know what's
  running out before it does").
- No claim the product can't back. If it isn't in `CONTEXT.md`, it doesn't go on the page.
- No idiom or wordplay that depends on native English fluency.

**Empty and failure states** (relevant to the pricing calculator and any form): say what happened and
what to do. "Enter at least 1 location." Not "Oops! Something went wrong."

---

## 3. Accessibility floor (BLOCKERS)

- [ ] Body text ≥ 4.5:1, large text and UI borders ≥ 3:1. Verified with a tool, not by eye.
- [ ] Every interactive element has a visible focus ring (`2px --kai-400`, offset 3px). Never
      `outline: none` without a replacement.
- [ ] Full keyboard path through the page: skip link → header → each section → footer. The card deck
      is arrow-key navigable. The stepper is `+`/`-` buttons *and* a real `<input type="number">`.
- [ ] Touch targets ≥ 44×44 with ≥ 8px between them, including the header menu button.
- [ ] One `<h1>`. Headings descend without skipping. Sections are `<section aria-labelledby>`.
- [ ] Images have real alt text; decorative ones have `alt=""`. The hero video is `aria-hidden` and
      carries no information not also in text.
- [ ] Nothing conveyed by colour alone — the `--signal` green always sits next to a word or icon.
- [ ] Page is usable at 200% zoom and at 320px width with no horizontal scroll (deck excepted).
- [ ] `prefers-reduced-motion` handled per `skills/motion/SKILL.md` §4.
- [ ] `<html lang="en">`, viewport meta present, zoom **not** disabled.

## 4. Performance floor (BLOCKERS)

Measured on a throttled **Fast 3G / 4× CPU** profile, not on the dev machine.

- [ ] LCP < 2.5 s. The LCP element is the hero headline or poster image — **never the video**.
- [ ] CLS < 0.1. Every image and video has explicit dimensions or an aspect-ratio box.
- [ ] JS ≤ 90 KB gzipped, total. Fonts ≤ 80 KB (two subset woff2 files).
- [ ] Images: AVIF with WebP fallback, `loading="lazy"` below the fold, `decoding="async"`, correct
      `sizes`.
- [ ] Video: `preload="none"`, poster always, loads after LCP, ≤ 2.5 MB, muted + playsinline + loop.
- [ ] No render-blocking third-party anything. No web font from a third-party origin.
- [ ] Lighthouse mobile ≥ 95 performance, 100 accessibility, 100 best practices.

## 5. Responsive floor

- [ ] Verified at 320, 375, 414, 768, 1024, 1440, 1920.
- [ ] Landscape phone (short viewport) does not break the hero — use `svh`, and let the hero shrink
      below `100svh` when height < 560px.
- [ ] No content depends on hover. Every hover affordance has a tap/focus equivalent.

---

## 6. The self-critique ritual (required per step)

Before marking a step complete, append to `NOTES.md`:

```md
### Step N — <section>
**Distinctive:** one thing here that could not appear on another company's site, and why.
**Templated:** the weakest, most generic thing still in this section.
**Removed:** the one element I cut to make it better. (Chanel's rule — there is always one.)
**Gate:** blockers passed / failed, with the failing item named.
```

If "Distinctive" is hard to write, the section is not done. If "Removed" is empty, you didn't look
hard enough — remove something and re-check.

## 7. Screenshot review

Where the environment allows it, screenshot each finished section at 1440px and 375px and look at
it. A picture catches what a diff never will: broken rhythm, a paragraph that runs too wide, a
button that has drifted to a pill, contrast that collapsed on the video scrim. Compare against
`PLAN.md` §5 and fix before moving on.
