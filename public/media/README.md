# public/media — placeholder assets

`poster.avif`, `hero.mp4` and `hero.webm` in this folder are **placeholders**, not
content. They are a diagonal hazard stripe in `--laterite` on `--ink-900`, at the
right dimensions and codecs, so the hero can be laid out (aspect-ratio box, CLS
budget, `preload="none"` swap) before the real footage exists. Nobody will mistake
them for a shop at dusk.

## What the client owes us

Tracked in `NOTES.md` and `kit/CONTEXT.md` §5.

| Asset | Spec |
|---|---|
| Hero video, landscape | 1920×1080, MP4 (H.264, faststart) + WebM (VP9), ≤ 2.5 MB, no audio track |
| Hero video, portrait | Same footage, 1080×1920 crop, same two codecs |
| Poster frame | One frame from the video, AVIF + WebP fallback, same dimensions |
| Product screenshots | 2×, light background: POS, Transactions, Dashboard, Low-stock alert |
| Logo | Clean SVG: mark, horizontal lockup, inverted, 24px favicon crop |
| Testimonial photos | With written permission to use, plus name, business and town |
| OG card | 1200×630, built from the mark and the night/paper palette |

## Constraints that apply when the real assets land

- The video **never** blocks LCP. `preload="none"`, poster always present,
  explicit `width`/`height`, loaded after LCP settles.
- `muted playsinline loop`, `aria-hidden`, and it carries no information that is
  not also in the text.
- The composition must be finished with the poster alone. If removing the video
  breaks the hero, the hero is wrong.
- Under `prefers-reduced-motion` the video does not autoplay; the poster stands
  and a play control is offered explicitly.
