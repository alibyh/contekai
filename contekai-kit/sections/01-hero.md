# 01 — Hero

The most important section in the build. It has to do one thing in one second: say that this shop
keeps selling when the lights go out, and prove it with footage of real shops.

---

## Thesis

Open with the most characteristic thing in the subject's world. For Contekai that is **the counter at
dusk** — a real Gambian shop, a real transaction, the till still working. The client's TikTok/Instagram
footage is the asset that makes this page impossible to mistake for a template, *if it is handled as
material rather than as wallpaper*.

## Layout — not centred

```
DESKTOP ≥ 1024                                            100svh
┌──┬──────────────────────────────────────────────────────────────┐
│  │                                                              │
│ r│  ── WORKS OFFLINE                          ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
│ a│                                            ▓▓  video   ▓▓▓▓ │
│ i│  Keep selling                              ▓▓  bleeds   ▓▓▓ │
│ l│  when the lights                           ▓▓  right &  ▓▓▓ │
│  │  go out.                                   ▓▓  bottom   ▓▓▓ │
│  │                                            ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
│  │  Point of sale and stock for Gambian       ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
│  │  shops. Every sale, every item, every      ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
│  │  dalasi — online or off.                                    │
│  │                                                              │
│  │  [ Start 7 days free ]   See pricing →                       │
│  │                                                              │
│  │  No card. Pay with Wave when you're ready.                   │
└──┴──────────────────────────────────────────────────────────────┘

MOBILE                                                    100svh
┌──────────────────────────────────────┐
│ ░░░░ video, full bleed, scrimmed ░░░ │  ← video is the ground
│                                      │
│  ── WORKS OFFLINE                    │
│  Keep selling                        │
│  when the lights                     │
│  go out.                             │
│                                      │
│  Point of sale and stock for         │
│  Gambian shops. Online or off.       │
│                                      │
│  [   Start 7 days free   ]           │  full width
│  [     See pricing       ]           │
│  No card. Pay with Wave when         │
│  you're ready.                       │
└──────────────────────────────────────┘
```

**Desktop composition rule:** the type block occupies columns 1–6, left-aligned, vertically centred.
The video occupies columns 7–12 and bleeds off the right and bottom edges — it is a *window into the
shop*, not a background behind the words. Cropping into the viewport edge is what stops it reading as
a stock hero video.

**Mobile:** video becomes the full ground because a 6-column split doesn't exist at 375px. Scrim
strengthens accordingly.

## Video handling — read carefully

Client footage from TikTok/Instagram is usually **9:16, phone-shot, variable quality, possibly with
burned-in captions or a watermark**. Rules:

1. **Never full-bleed the raw clip on desktop.** Use the 6-column window (which suits a vertical
   crop) or a centre-crop with `object-position` tuned to the subject.
2. **Reject any clip with a platform watermark or burned-in caption.** Ask the client for the
   original export. A visible TikTok watermark on a paid product's homepage destroys the credibility
   the section is there to build.
3. **Grade it toward the palette.** A single `filter: saturate(.9) contrast(1.05)` plus the scrim.
   No duotone, no colour overlay wash.
4. **Scrim** — the one permitted gradient in the build:
   ```css
   --scrim-hero: linear-gradient(
     100deg,
     var(--ink-900) 0%,
     rgb(10 21 30 / .94) 34%,
     rgb(10 21 30 / .62) 58%,
     rgb(10 21 30 / .28) 100%);
   ```
   Mobile switches to a vertical scrim, `.92` at top through `.55` at bottom. **Test contrast against
   the brightest frame of the video, not the poster.** If any headline pixel drops below 4.5:1 on any
   frame, strengthen the scrim.
5. **Loading order:** `poster` (AVIF, ≤ 60 KB, an actual good frame) renders first and is the LCP
   candidate. The `<video>` has `preload="none"` and its `src` is attached only after the `load`
   event, and only when `navigator.connection?.saveData !== true` and `effectiveType` is not `2g`/
   `slow-2g`. On a slow connection the poster simply stands. That is not a degraded experience — it
   is a correct one for this audience.
6. Attributes: `muted playsinline loop autoplay disablepictureinpicture aria-hidden="true"`, explicit
   `width`/`height`, `object-fit: cover`. Two sources: WebM (VP9/AV1) then MP4 (H.264 baseline).
   Budget ≤ 2.5 MB, ≤ 12 s, no audio track at all (strip it — it saves weight and removes any
   autoplay-policy risk).
7. **Reduced motion:** no autoplay. Poster stands, with a small labelled play button
   (`Play video, 12 seconds, no sound`) bottom-right of the video window.

**Placeholder until the client delivers:** a solid `--ink-800` panel with a `--hairline-ink` frame and
centred mono text `AWAITING CLIENT FOOTAGE — 9:16, no watermark, ≤ 12s`. Obvious, ugly on purpose, not
a stock video, not a gradient.

## Copy

**Eyebrow** (DM Mono, uppercase, preceded by a 24px hairline):
`WORKS OFFLINE`

**H1** — three lines, mask-revealed line by line:
```
Keep selling
when the lights
go out.
```
Set `wdth 112 / wght 700`, leading `0.98`, `-0.02em`. The line breaks are authored with `<span>`
wrappers, not left to the browser — but each `<span>` must still reflow gracefully below 400px.

*Alternatives if the client rejects the primary (do not use more than one; pick and commit):*
- `The till that doesn't stop.`
- `Power cut. Still selling.`

**Sub** (Body-lg, max 46ch):
> Point of sale and stock control for shops in The Gambia. Every sale, every item, every dalasi —
> whether you're online or not.

**Actions:**
- Primary: `Start 7 days free` → `/signup` `[VERIFY route]`
- Secondary (quiet, with arrow): `See pricing` → `#pricing`

One primary per viewport — the header CTA and the hero CTA are the same action with the same label,
which is correct; there is no third button.

**Trust line** (Small, `--on-ink-muted`):
> No card needed. Pay with Wave when you're ready.

**What is deliberately absent:** the "Trusted by businesses across The Gambia" pill. It is an
unsubstantiated claim, and a badge above a headline is a template reflex. The proof section does that
job with real names, which is worth more.

## Motion

Follow `skills/motion/SKILL.md` §2A exactly. The sequence is the page's one orchestrated moment.

The final beat matters most: at `+600ms` the scrim eases from `1.0` to `0.82` over `700ms` — the shop
comes up out of the dark as the words settle. That single move *is* the thesis, performed. Do not add
anything else to it.

No scroll indicator, no bouncing chevron, no "scroll to explore". The video edge bleeding off the
bottom already tells the reader there's more.

## Responsive

- `min-height: 100svh` (not `vh` — mobile browser chrome). Below `560px` viewport height, drop to
  `auto` with `--space-8` padding so landscape phones don't crush the type.
- H1 `clamp(2.75rem, 6.5vw, 4.75rem)`. Check the three-line break at 375, 414, 768.
- Buttons stack full-width below 480px, `52px` tall, `--space-3` gap.
- The rail's 44px gutter is inside the hero, not outside — content starts after it.

## Accessibility

- One `<h1>`, containing all three lines; the line `<span>`s must not fragment it for screen readers.
  Mask-reveal wrappers are `aria-hidden`-free and must not use per-character splitting.
- `<section id="top" aria-labelledby="hero-title" data-ground="dark">`.
- Video `aria-hidden="true"`, no captions needed because it carries no information not in the text.
- Contrast on every frame ≥ 4.5:1 (see scrim rules).
- The play control (reduced-motion path) is a real button with a text label, ≥ 44×44.

## Gate additions

- [ ] Screenshot the hero with the `<video>` element deleted. Still a finished, confident composition?
      If not, the video is carrying the design and the design is wrong.
- [ ] LCP element is the H1 or the poster. Confirm in a Lighthouse trace, don't assume.
- [ ] No watermark, no burned-in caption, no audio track in the shipped video.
- [ ] Headline contrast checked against the brightest video frame.
- [ ] Reduced-motion path: poster + play button, no autoplay, all text visible immediately.
- [ ] The hero is not centred, has no glass card, and has no bouncing scroll cue.
