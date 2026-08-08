# public/media

## There is currently no hero video, on purpose

`hero.mp4`, `hero.webm` and `poster.avif` used to live here. They are gone, and
the hero no longer references them.

The kit's gate for §01 asks: *"Screenshot the hero with the `<video>` element
deleted. Still a finished, confident composition? If not, the video is carrying
the design and the design is wrong."* Re-measured against real screenshots, the
answer went the other way: the video was not carrying the design, it was
standing in for one. At 1440 it was an unreadable dark smear across 60% of the
frame; at 375 — the viewport this audience actually uses — the scrim swallowed
it entirely, so the mobile hero was a flat dark field with a 107 KB download
attached. The salvage work needed to make the client's clip usable at all
(cropping out the burned-in ConteKai logo and the English subtitle band,
blurring, regrading toward night) had removed everything that made it material
rather than wallpaper.

The window in the hero's right columns is now the product's own till, which
proves the headline by doing what it claims. See `src/components/sections/Hero.astro`.

## Bringing a video back

Everything needed is still in the repo. One command rebuilds the derived assets:

```bash
./scripts/build-hero-video.sh hero_vid.MOV
```

That script documents why each step exists and self-checks the two things that
matter: peak luma (which is what wins hero text contrast, not the scrim) and the
absence of an audio track. The last build produced 1024×330, 5.2 s, seamless
loop, 77 KB MP4 / 30 KB WebM, peak luma 103/255.

Reinstating it in the page is a deliberate design decision, not a config flip:
the hero's composition, its load sequence and its final beat are all now built
around the till, and `--scrim-hero` / `--scrim-hero-mobile` have been retired
from `tokens.css` (the build is down to exactly one gradient, the footer panel).
A new clip would need its own pass, not a re-enabled flag.

## Still worth asking the client for

| Asset | Spec |
|---|---|
| Hero video | **9:16 portrait**, a real counter at dusk with a real transaction. No watermark, no burned-in subtitles, no audio track. ≤ 12 s, ≤ 2.5 MB |
| Landscape crop | Same footage, 16:9, for wide viewports |
| Product screenshots | 2×, light background: POS, Transactions, Dashboard, Low-stock alert. **These would replace the hero till's illustrative line items** |
| Logo | Clean SVG: mark, horizontal lockup, inverted, 24px favicon crop |
| Testimonial photos | With written permission, plus name, business and town |
| OG card | 1200×630, built from the mark and the night/paper palette |

A new clip drops straight into the build script. Re-measure the bug and caption
positions first — the crop values in it are specific to this source.

## Rules that hold whatever the footage is

- The video **never** blocks LCP. `preload="none"`, poster always present,
  explicit `width`/`height`, sources attached only after `load`.
- Nothing is fetched at all when `saveData` is set or the connection reports
  2g / slow-2g. The poster stands.
- `muted playsinline loop`, inside an `aria-hidden` wrapper, carrying no
  information that is not also in the text.
- The composition must be finished with no video at all. That is now literally
  true rather than aspirational.
- Under `prefers-reduced-motion` the video does not autoplay; the poster stands
  and a labelled play control is offered.
