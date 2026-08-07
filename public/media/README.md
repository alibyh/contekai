# public/media

`hero.mp4`, `hero.webm` and `poster.avif` are **derived assets**. Do not hand-edit
them. They are built from the client's raw clip by:

```bash
./scripts/build-hero-video.sh hero_vid.MOV
```

That script documents why each step exists and self-checks the two things that
matter: peak luma (which is what wins hero text contrast, not the scrim) and the
absence of an audio track.

## Current state

Built from `hero_vid.MOV`. The raw clip could not be used as delivered: the
ConteKai logo is burned into every frame, English subtitles into ~90% of them,
and most of its runtime is founders talking to camera in a bright office. The
script crops the bug and the caption band out of frame, keeps only the two
b-roll segments with lit screens, and grades the result toward night.

| | |
|---|---|
| Duration | 5.2 s, seamless loop (join and loop point both crossfaded) |
| Frame | 1024×330, cropped from 1024×576 |
| MP4 | 77 KB, H.264, faststart, no audio |
| WebM | 30 KB, VP9, no audio |
| Poster | 1.4 KB AVIF |
| Peak luma | 103/255 → `--on-ink` at 4.9:1 before the scrim applies |

## Still worth asking the client for

A purpose-shot clip beats salvaged b-roll. What to request:

| Asset | Spec |
|---|---|
| Hero video | **9:16 portrait**, a real counter at dusk with a real transaction. No watermark, no burned-in subtitles, no audio track. ≤ 12 s, ≤ 2.5 MB |
| Landscape crop | Same footage, 16:9, for wide viewports |
| Product screenshots | 2×, light background: POS, Transactions, Dashboard, Low-stock alert |
| Logo | Clean SVG: mark, horizontal lockup, inverted, 24px favicon crop |
| Testimonial photos | With written permission, plus name, business and town |
| OG card | 1200×630, built from the mark and the night/paper palette |

A new clip drops straight into the script. Re-measure the bug and caption
positions first — the crop values in it are specific to this source.

## Rules that hold whatever the footage is

- The video **never** blocks LCP. `preload="none"`, poster always present,
  explicit `width`/`height`, sources attached only after `load`.
- Nothing is fetched at all when `saveData` is set or the connection reports
  2g / slow-2g. The poster stands.
- `muted playsinline loop`, inside an `aria-hidden` wrapper, carrying no
  information that is not also in the text.
- The composition must be finished with the poster alone, and with no video at
  all. Setting `heroFootage()` to `null` in `Hero.astro` drops back to a plain
  `--ink-900` ground and nothing else needs to change.
- Under `prefers-reduced-motion` the video does not autoplay; the poster stands
  and a labelled play control is offered.
