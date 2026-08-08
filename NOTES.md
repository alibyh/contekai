# NOTES — Contekai build log

Running log plus per-step self-critique. Newest step at the bottom.

---

## Stack decision

**Astro 5 + plain modern CSS + TypeScript. No Tailwind, no UI framework.**

Detection result: the repo contained only `contekai-kit/` and a `.DS_Store`. No
`package.json`, no React/Vite SPA, no existing front end of any kind, and it was
not a git repository. The "existing SPA must absorb this page" exception in
`SCAFFOLD-PROMPT.md` therefore does not apply, and the greenfield Astro path was
taken.

Note: the kit is at `contekai-kit/`, not `kit/` as the scaffold prompt assumes.
Paths in this file refer to the real location.

Zero JS ships by default. The three client scripts named in the plan
(`reveal.ts`, `deck.ts`, `pricing.ts`) are the only JS the finished page will
carry. At scaffold, `reveal.ts` compiles small enough that Astro inlines it into
the HTML, so the page currently makes **zero** JS requests.

---

## Skills: what ran and what did not

| Skill | Status | Effect |
|---|---|---|
| `impeccable` | **installed, invoked** | Brand register loaded and reconciled below. |
| `frontend-design` | present on disk but **not installed** (`~/.claude/plugins/installed_plugins.json` is empty). Read directly from the marketplace checkout as reference. | Its AI-default calibration list is reconciled below. |
| `ui-ux-pro-max` | **NOT INSTALLED.** `scripts/search.py` does not exist anywhere on this machine — a filesystem-wide search returned nothing. | **The search was not run and returned no data.** No `design-system/contekai/MASTER.md` exists. Proceeding on the kit tokens alone, as `README.md` §"Reference standards" instructs. Nothing in this build is attributed to that skill. |
| `taste` | not installed | — |
| `skillui` | not installed | — |

`impeccable` also expects `PRODUCT.md` / `DESIGN.md` at the project root; neither
exists, and neither was created. `CONTEXT.md`, `PLAN.md` and
`skills/design-system/SKILL.md` in the kit are the equivalent and are more
specific to this brief, so they were used in that role. Register identified as
**brand** (marketing landing page: the design is the product).

### Conflicts between the skills and the kit

Kit tokens win in every case below, per the scaffold instruction. Recorded so
they are decisions rather than oversights.

1. **Warm-cream + terracotta is a named AI default.** `frontend-design`
   calibration flags "a warm cream background (near `#F4F1EA`) with a
   high-contrast serif display and a terracotta accent" as default #1. Our
   `--paper` is `#F6F3EC` and `--laterite` is a terracotta. Two of the three
   legs match.
   **Kept, with an enforceable difference.** The kit dodges the third leg (a
   variable grotesk at width extremes, not a serif display) and inverts the
   first (paper is a *material laid on night*, never the page ground — `html`
   itself is `--ink-900`). The rules that keep it out of the default: paper only
   ever appears as whole sections sitting on the night ground, and `--laterite`
   is an action fill, never a headline colour. If a future section makes paper
   the page's own background, this has drifted and needs the escape hatches in
   `quality-gate` §1.

2. **Repeated tracked labels above every section heading.** `impeccable`'s brand
   register bans this "unless it's a deliberate, named brand system." The kit
   makes the Eyebrow exactly that — the one repeated structural device, carrying
   the same section index that runs down the till-rail.
   **Kept.** The escape clause is satisfied *because* of the index. Enforcement:
   `Eyebrow.astro` documents that an eyebrow without a section index behind it
   has stopped doing work and should be deleted.

3. **OKLCH.** `impeccable` requires colours in OKLCH. The kit specifies hex, and
   its contrast table is computed against those exact hex values.
   **Kit wins.** Converting would invalidate a verified contrast table for no
   user-visible gain.

4. **"Never use `#000` or `#fff`."** `impeccable`'s rule. The kit specifies
   `#FFFFFF` on `--laterite` and verifies it at 5.4:1.
   **Kit wins**, but the raw hex is gone: it is now the `--on-laterite` token in
   `tokens.css`, so no component writes a literal colour.

5. **"No bounce, no elastic; ease out with exponential curves."**
   `impeccable`'s motion rule. The kit's `--ease-snap`
   (`cubic-bezier(.3, 1.2, .45, 1)`) overshoots.
   **Kit wins.** It is scoped to exactly two things (the pricing stepper and the
   tally) where the overshoot reads as a mechanism responding, not as decoration.
   It must not spread beyond those.

6. **No em dashes in copy.** `impeccable`'s rule; the kit is silent.
   **Adopted** — it is more specific and costs nothing. Applies to user-facing
   copy only (the page title now reads `Contekai: point of sale…`, not
   `Contekai — point of sale…`). Code comments are not copy.

7. **`impeccable` brand: zero imagery is a bug.** Agrees with the kit's
   "use the real screens." Reinforces that capability cards must carry real
   product surfaces, not icon chips. No conflict, recorded as a constraint.

### Corrections to the kit itself

- **DM Mono is not a variable font.** `PLAN.md` §6 and `design-system` §2 both
  say both families are variable. DM Mono ships as statics (300/400/500 plus
  italics). The design system uses weight 400 and 500, so **two** static woff2
  files ship rather than one variable file. Archivo genuinely is variable
  (`wght` 100–900, `wdth` 62–125).
- **Type table, "Receipt line" row**: the `wdth` column holds `0.02em` and the
  tracking column holds `—`. Read as tracking `0.02em`, leading `1.7`, which is
  the only coherent reading. Encoded as `--track-receipt` / `--lh-receipt`.
- **Hover duration**: `design-system` §5 says `150ms`; the motion tokens have no
  `150ms`. Used `--dur-fast` (160ms). Token discipline beats a loose number.

---

## Step 0 — Scaffold

**Built:** Astro 5 project; `tokens.css` / `base.css` / `motion.css`;
`Base.astro` with meta, structured data, skip link and font loading; `Button`,
`Eyebrow`, `Icon`; shell `Header` / `Rail` / `Footer`; five section stubs;
`index.astro`; self-hosted subset fonts; placeholder favicon and media.

### The tripwire

Found and deleted. `skills/design-system/SKILL.md` line 21 carried
`--ink-600: #1E3purple;` — an invalid hex, flagged in the file as a deliberate
tripwire. It is **not** in `tokens.css`, and it was deleted rather than
"repaired" into a plausible value, because there is no `--ink-600` in the
system. Verified in the browser: `getPropertyValue("--ink-600")` returns empty.

### Fonts

Budget arithmetic drove a real decision here. Archivo, subset to latin +
latin-ext with both axes intact, is **84 KB** — over the whole 80 KB font budget
on its own, before DM Mono. Two kit rules collide: `design-system` §2 says
"subset to latin + latin-ext", `quality-gate` §4 says "Fonts ≤ 80 KB" and marks
it a BLOCKER, and `CONTEXT.md` §6 calls bandwidth "the hard constraint."

Resolved so both hold:

1. Axes instanced down to the range the design system actually uses
   (`wght 400:700`, `wdth 100:112`) rather than shipping 100–900 / 62–125.
2. latin-ext split into its own `@font-face` with a `unicode-range`. An English
   page never downloads it; the coverage exists the moment a codepoint needs it.

| File | Size | Downloaded on an English page |
|---|---|---|
| `archivo-var-subset.woff2` (latin, 2 axes) | 49.2 KB | yes, preloaded |
| `archivo-var-ext-subset.woff2` (latin-ext) | 44.6 KB | no |
| `dm-mono-subset.woff2` (400) | 8.1 KB | yes |
| `dm-mono-500-subset.woff2` (500) | 8.1 KB | only where 500 is used |
| **Delivered total** | **65.4 KB** | under the 80 KB budget |

Metric-adjusted fallbacks are computed from the real font tables, not guessed:
Archivo 400/wdth 100 against Arial (`size-adjust: 101.05%`) and against Roboto
(`104.33%`, the case that matters for this audience's Android devices); DM Mono
against Roboto Mono / Courier New, which share its 0.6em advance. Measured CLS
is **0**.

### Section padding

One rule sets it: `[data-section] { padding-block: var(--section-pad) }` in
`base.css` @layer layout. Each section overrides `--section-pad` and nothing
else. Verified in the browser, desktop:

```
hero            64/64   (plus min-height: 100svh — sized by viewport, not padding)
capabilities    96/64
built-for-here 128/128
pricing        128/96
proof           64/64
footer          96/32
```

Six sections, five distinct paddings. Hero and Proof share `--space-8`, which is
what the design system's rhythm table specifies, and they do not read as the
same shape because Hero is viewport-height.

### Cascade layers

`@layer reset, tokens, base, layout, components, sections, utilities;` declared
once, at the top of `base.css`. Verified in the **built** stylesheet: lightningcss
hoists the layer blocks into exactly that order and drops the now-redundant
statement. Order is preserved through minification, not just in source.

### Verification

Measured against `dist/` served over a gzipping static server, not the dev
server. (An unrelated Astro dev server was squatting on port 4321 and the first
audit measured *it* — 1.9 MB of dev toolbar, LCP 12.5 s. Discarded.)

| | Mobile (Slow 4G, 4× CPU) | Desktop |
|---|---|---|
| Performance | **100** | **100** |
| Accessibility | **100** | **100** |
| Best practices | **100** | **100** |
| SEO | **100** | **100** |
| LCP | 1.4 s | 0.3 s |
| CLS | **0** | **0** |
| Total transfer | 66 KB | 66 KB |

- LCP element is `h1#hero-title`. Correct: the headline, never the video.
- Five requests total: HTML (2.9 KB gz), CSS (4.2 KB gz), two fonts, favicon.
  **Zero JS requests** — `reveal.ts` is inlined.
- `astro check`: 0 errors, 0 warnings, 0 hints.
- Console: clean, no messages of any kind.
- Keyboard path verified in Chrome: skip link → logo → Log in → Start free trial
  → menu. Order matches `sections/00-shell.md`. Every stop takes focus and shows
  the ring. Rail is `aria-hidden` and contains zero focusables.
- One `<h1>`; headings descend without skipping.
- No horizontal scroll.
- Menu button: 44×44, labelled, focusable, **not** `disabled`, inert, TODO
  documented in the markup.

**One defect found and fixed:** the header CTA was 40×118 — the shell spec's
compact height, but 4 px under the 44×44 touch minimum in `quality-gate` §3.
Both kit rules are now satisfied: the painted box stays 40 px, an absolutely
positioned `::after` extends the hit area to 44 px without changing layout.
Hit-tested at 2 px above the painted edge; it lands on the CTA.

### Deliberate omissions

- **`LocalBusiness` JSON-LD is not emitted.** It requires a real postal address
  and telephone; `CONTEXT.md` §5 lists both as missing. Inventing them would
  fail the no-invented-facts rule and would be flagged invalid by search engines
  anyway. `SoftwareApplication` ships with the real dalasi offers (D 1,500/month
  per location; D 16,200/year per location, saving D 1,800). Add `LocalBusiness`
  in step 7 when the address and WhatsApp number land.
- **The 6-month tier is absent** from the structured data. Its price is
  `[VERIFY]`. No invented number.
- **The multi-location discount is not mentioned anywhere.** The current site
  promises one and never states it. Either the number arrives or the promise
  gets dropped — it does not ship as a vague claim.
- **`og:image` is omitted**, not pointed at a URL that 404s. Needs a 1200×630
  card; step 8.
- **`Pilore Solutions` attribution is not on the page yet.** `[VERIFY]` in
  `CONTEXT.md`; it ships in step 7 or not at all.

### Placeholders, all obviously placeholders

- `public/favicon.svg` and the header lockup: a five-node cluster drawn from the
  written description in `CONTEXT.md` §3. Carries `data-placeholder`. **Not the
  brand mark.**
- `public/media/{poster.avif,hero.mp4,hero.webm}`: diagonal hazard stripes in
  `--laterite` on `--ink-900`, correct dimensions and codecs so the hero's
  aspect-ratio box and `preload="none"` swap can be built before the footage
  exists. Nobody will mistake them for a shop at dusk. Spec in
  `public/media/README.md`.
- Section stubs carry `<!-- COPY: written in ORDER.md step N -->`. No lorem
  ipsum anywhere.

### Self-critique

**Distinctive:** the ground model. `html` is night; paper is a material laid on
top of it, and each section republishes four ground-dependent tokens
(`--muted`, `--hairline`, `--link`, `--border-current`) under neutral names.
Components read those and never branch on the ground, so a component cannot
hardcode a colour that only works on one material. That is the night/paper
thesis made structural rather than decorative — it only exists because this
product's story is about the lights going out.

**Templated:** the section stubs are, unavoidably, eyebrow + heading + container
six times over. That is the exact shape `quality-gate` §1 rejects, and it is the
shape the page will keep if steps 2–7 are built lazily. The stubs are scaffolding
for the composition, not a layout proposal, and each one carries its section's
gate in its header comment specifically so the next step has to argue with it.

**Removed:** the `--container` wrapper as a default. It started on every stub;
`impeccable`'s "don't wrap everything in a container" and `quality-gate`'s "is
every section a full-width band with a max-width container and nothing else?"
are the same objection. The container class still exists for content that needs
a measure, but sections no longer get one by reflex, and how content meets the
edge is now a per-section decision.

**Gate:** passed. No blockers. Accessibility 100, best practices 100,
performance 100 on both profiles, CLS 0, tripwire removed, no hex outside
`tokens.css` (the sole exception is the `theme-color` meta attribute, where a
custom property cannot reach — commented in place).

### Open questions for the client, before step 1

Blocking or near-blocking, in priority order:

1. **CTA destinations.** Do `/signup` and `/login` exist at those exact paths?
   Currently wired on the assumption they do.
2. **The logo as clean SVG** — mark, horizontal lockup, inverted, favicon crop.
3. **Hero video** — landscape and portrait crops, MP4 (H.264) + WebM, poster
   frame. Blocks step 2's finished form, not its start.
4. **Testimonials** — full text, names, businesses, towns, photo permission.
   Step 6 does not ship without these; unattributed five-star cards read as fake.
5. **The 6-month price**, and **what the multi-location discount actually is**.
   Blocks step 5.
6. **WhatsApp number and/or phone.** No contact channel exists on the current
   site, which is a conversion problem in this market. Blocks step 7 and the
   `LocalBusiness` structured data.
7. **Fresh 2× product screenshots** — POS, Transactions, Dashboard, Low-stock
   alert, on a light background. Blocks step 3's cards carrying real substance.
8. Confirm **Pilore Solutions** as the attribution, and whether privacy and
   terms pages exist.

---

## Step 2 — Hero

**Built:** the full hero. Not-centred two-column composition, authored three-line
headline with the mask-reveal load sequence, sub, two actions, trust line, and
the complete video apparatus (poster-first loading, connection gating, the
scrim, the reduced-motion play control) behind a single `footage` switch.

### The client footage: rejected, with reasons

`hero_vid.MOV` was inspected frame by frame (a 27-frame contact sheet across the
whole 15.4 s, plus format probing) rather than assumed. It is:

- a **founders-to-camera brand film** — Pa Sulay Jobe and Muhammad Basheer in a
  bright office, with lower-third name cards, plus laptop/phone b-roll. Not a
  counter, not a shop, not dusk, no transaction, no till.
- carrying the **ConteKai logo bug burned into every single frame**, top-left.
- carrying **burned-in English subtitles on roughly 90% of frames**. One of them
  reads *"So the vision of Contekai is to empower small and medium-sized
  business owners"* — "empower" is on the quality-gate banned-word list, so the
  page would be displaying banned copy as pixels.
- 16:9 landscape at 1024×576 and 213 kbps (soft), with an **AAC audio track**,
  running **15.4 s** against a ≤ 12 s budget.

`sections/01-hero.md` §"Video handling" rule 2 is unambiguous: reject any clip
with a watermark or a burned-in caption and ask for the original export. The
audio and the runtime are trivially fixable; the other three are not.

Cropping was evaluated and does not work. The bug sits top-left and the captions
bottom-centre, so the only clean region is roughly **819×305** of an already-soft
source — wrong aspect for the desktop window and useless for the mobile
full-bleed. And no crop fixes the deeper problem: a **silent** talking-head is
someone mouthing words, and it argues for the company rather than for continuity.

**Decision (confirmed with the client):** build video-ready, request the clean
export. The window carries the marked placeholder panel meanwhile. This clip is
genuinely good material and should go to Proof (step 6), played on demand with
sound, where its captions become an asset instead of a defect.

### The video apparatus is built and tested, not aspirational

`footage` in `Hero.astro` is a single switch. It was flipped to the hazard-stripe
placeholders in `public/media`, every branch exercised in headless Chrome, then
flipped back. Measured:

| Case | Result |
|---|---|
| At DOMContentLoaded | 0 `<source>` elements, `preload="none"` |
| After load, normal connection | 2 sources attached, playing, `muted` `loop` `aria-hidden` |
| `prefers-reduced-motion` | paused; play control revealed, labelled *"Play video, 12 seconds, no sound"* |
| `saveData: true` | **0 sources ever fetched**; the poster stands |
| `effectiveType: slow-2g` | **0 sources ever fetched**; the poster stands |
| Scrim, desktop | `100deg` diagonal, settles at `0.82` after the beat |
| Scrim, mobile | vertical `0.92 → 0.55`, video becomes the full ground |

### Scrim contrast: a threshold, computed, not eyeballed

The gate says to test contrast against the brightest video frame. There is no
real footage yet, so the worst case was computed instead and recorded in
`tokens.css` beside the token:

The mobile scrim settles at `0.82` opacity, so the effective ink alpha at the
bottom stop is `0.82 × 0.55 = 0.45`. Over a **white** frame that puts `--on-ink`
text at **2.7:1 — a failure**. The top stop is fine (`0.82 × 0.92 = 0.75`, about
7.3:1). For 4.5:1 against white the effective alpha must be ≥ 0.61, so the lower
stop must be **≥ 0.75**.

The spec's `.55` is correct for the dusk-lit shop the section is written around.
If the delivered footage is bright, raise it. The number is in the file so
whoever drops the export in does not have to rediscover it.

On desktop this cannot bite: the type occupies columns 1–7 and the video 8–12,
so the headline never overlaps the footage at all.

### Deviations from the section spec, and why

1. **Columns 1–7 / 8–12, split at 1280, not 1–6 / 7–12 at 1024.** Measured, the
   6/6 split does not survive its own headline: *"when the lights"* at the design
   system's H1 scale needs about 640px, and a 6-column type block only reaches
   that at 1440px and up. At 1024 and 1280 the authored three lines broke into
   four — at exactly the width where the composition is supposed to arrive.
   Two ways out: retune the H1 clamp, or widen the type block. Widening wins;
   the type scale is the token system's spine and a column span is a per-section
   layout decision. Below 1280 the stacked layout gives the headline the full
   measure. Verified: three lines hold at 414, 768, 1024, 1280, 1366, 1440, 1920.

2. **The CTA label is now "Start 7 days free" everywhere.** `00-shell.md` names
   the header action *"Start free trial"*, `01-hero.md` names the hero action
   *"Start 7 days free"*, and `00-shell.md` §Accessibility also requires the two
   to be identical. All three cannot hold. The hero's label wins: it carries a
   real quantity, which the copy rules explicitly prefer over vague phrasing.
   Header and footer were changed to match. It is also kept at **every** width
   rather than shortened to "Start free" below 480px as the shell's responsive
   table suggests — a label that changes at a breakpoint is precisely the
   inconsistency the rule exists to prevent, and it was measured to fit at 320px.

3. **"when the lights" reflows to two lines at 375 and 320.** Left as is: the
   section spec explicitly anticipates this ("each `<span>` must still reflow
   gracefully below 400px"). Holding three lines at 375 would need the H1 floor
   below the design system's 2.75rem, which is token drift on the page's most
   load-bearing type decision.

4. **The "lights coming up" beat does not exist yet.** It animates the scrim,
   and there is no scrim without footage. Deliberate: putting the beat on the
   placeholder would mean animating an `--ink-800` panel to slightly-less-ink,
   which communicates nothing. It arrives with the export.

### The load sequence is pure CSS

No JS at all. CSS animations start at parse, so the sequence cannot be stranded
by a failed module and there is nothing to strand with JS disabled. The kit's
§2A table enumerates two headline lines; the headline has three, so the 60ms
stagger continues to a third at 320ms. That makes seven beats in the chain
against the "max 6" rule — §2A is the named orchestrated moment and is the
sanctioned exception to it.

The global reduced-motion block collapses durations but leaves **delays**
intact, which would have held the hero at opacity 0 for 600ms before snapping
in. `motion.css` now zeroes animation and transition delays under reduced motion
too. Verified: at 150ms with reduced motion every element is already at
opacity 1.

### Two defects found by measuring, not by looking

- **Horizontal scroll at 320–375.** `justify-items: start` on the type block and
  `place-items: center` on the placeholder panel both size children to
  **max-content**, so the headline and the mono label refused to wrap and pushed
  the document past the viewport. Both replaced with alignment that does not
  resize the item. Verified 0 horizontal overflow at 320, 375, 414, 768, 1024,
  1280, 1366, 1440, 1920.
  Worth recording how this was nearly missed: `chrome --headless --screenshot`
  renders at a layout viewport that does not match `--window-size`, so its
  images showed clipping that was not real and hid overflow that was. Puppeteer
  with an explicit `setViewport` is the measurement of record.
- **`--faint` used as a text colour** in the placeholder panel. It is
  `--on-ink-faint` at `.44` alpha, and the design system's own rule stops muted
  text at `.68`. axe caught it: accessibility dropped to 95 on `color-contrast`.
  Switched to `--muted`, back to 100. `base.css` now says in the token's own
  comment that `--faint` is not a text colour.

### Verification

| | Placeholder state (ships) | With footage (proven) |
|---|---|---|
| Performance / A11y / Best practices / SEO | **100 / 100 / 100 / 100** | 100 / 100 / 100 |
| LCP (Slow 4G, 4× CPU) | 1.4 s | 1.5 s |
| CLS | **0** | **0** |
| Total transfer | 67 KB | 67 KB + poster + post-LCP video |
| JS requests | **0** (both scripts inlined into the HTML) | 0 |

**On the LCP element, precisely.** The gate asks for the H1 or the poster, never
the video. With footage, Chrome attributes LCP to the `<video>` box — and the
pixels painted at that moment are the **poster**, because the sources are not
attached until after `load` (measured above: 0 sources at DOMContentLoaded).
So the video's own frames never block LCP. In the placeholder state LCP is the
panel's label, which is an artifact of having no footage and disappears with it.
The H1 is never the LCP element in either state, because the mask-reveal means
it is not painted at first paint. That is a consequence of the specified motion,
not a regression.

Also verified: one `<h1>` whose accessible text is the unfragmented sentence
"Keep selling when the lights go out."; headings descend `H1 > H2 ×5`; tab order
runs skip link → logo → Log in → header CTA → menu → hero CTA → See pricing;
exactly one gradient rule in the whole stylesheet and it is on `:root` (the
scrim tokens); no emoji in the DOM; complete and legible with JS disabled and
with reduced motion on.

### Self-critique

**Distinctive:** the headline is a claim about a power cut, and the section is
built so that the claim is what survives when everything else is taken away.
With no video, no JS and no motion, the page still says *keep selling when the
lights go out* over a blue-black ground with a hairline till-rail beside it.
That sentence cannot appear on another company's site, and the composition is
arranged around it rather than around a product shot.

**Templated:** the action row. Filled primary next to a text link with a right
arrow is the most ordinary thing in the section, and the arrow in particular is
doing no work that the words are not already doing. It stays for now because
"See pricing" needs to read as a jump rather than a second button, but it is the
first thing I would cut in step 8.

**Removed:** the container. The hero has no `.container` at all now — the type
block is measured by its own column span and the sub by `46ch`, and the window
runs to the viewport edge. That is what turns the section from a centred band
into a composition, and it is the difference the gate's "is every section a
full-width band with a max-width container and nothing else?" is asking about.

**Gate:** passed. No blockers. Deliberately deferred, and dependent on the clean
export rather than on anything in the code: contrast against the brightest video
frame (threshold computed and recorded), and the "no watermark, no burned-in
caption, no audio track in the shipped video" check, which the current clip
fails and is why it is not shipped.

### What I need from the client, in priority order

1. **The clean hero export.** No logo bug, no burned-in subtitles, no audio
   track. **9:16 vertical** — the delivered clip is 16:9, and vertical is what
   both the desktop window and the mobile full-bleed want. ≤ 12 s, ≤ 2.5 MB,
   MP4 (H.264 baseline) + WebM (VP9/AV1), plus one good poster frame as AVIF.
   Shot at a counter, at dusk, with a real transaction, if that footage exists.
2. **Confirm `/signup` and `/login`** are the real routes. Both hero and header
   CTAs point there on assumption.
3. **The logo as clean SVG.** The header lockup and the favicon are still the
   stand-in drawn from the written description.
4. Permission to use `hero_vid.MOV` in Proof with sound and its existing
   captions, and the co-founders' names as they should be spelled.

---

## Step 2, revision — video as the hero ground

Client feedback: the design was bad, and the video belongs in the **background**
of the hero, not in a panel under it. Both fair. The previous version put a
large empty panel where footage should be, which read as unfinished because it
was, and the "window in columns 8–12" reading was mine, not something the brief
demanded.

### What changed

- **The video is the ground.** Full-bleed behind the whole section at every
  width, scrim over it, type on top. No window, no panel.
- **The column split is gone entirely**, and with it the 7/5 deviation logged
  above. There is no 12-column grid in the hero any more: the type block is
  capped at `50rem` by its own measure and sits left. That is simpler, it
  removes a breakpoint, and the headline now holds its three authored lines at
  **414px and up, including 1024 and 1280** where the old split broke it.
- The **"lights coming up" beat is real now.** It animates a scrim that covers
  the viewport, so at +600ms the whole shop comes up out of the dark as the
  words settle. In the panel version it would have been animating a small dark
  rectangle to a slightly less dark rectangle.
- The awaiting-footage placeholder is deleted. `heroFootage()` returning `null`
  now drops to a plain `--ink-900` ground, which is a composition that stands.

### Using the client's clip without shipping its problems

The clip was asked for twice, so it is in. It is not in as delivered. The encode
lives in `scripts/build-hero-video.sh`, is reproducible, and self-checks:

| Problem in the source | What the encode does |
|---|---|
| ConteKai logo burned into every frame, measured at x 50–205, y 50–85 | Crops to y 90–420. The bug is **out of frame**, not hidden under blur. |
| Subtitles burned into ~90% of frames, x 270–755, y 424–488 | Same crop. The caption band is out of frame. |
| Mostly founders talking to camera | Dropped. Only the two b-roll segments with lit screens survive (1.5–4.2s, 11.5–15.0s). A silent talking head is someone mouthing words. |
| Bright office, which argues against "when the lights go out" | Blurred hard and graded to night: desaturated, shadows pushed blue toward `--ink-900`, output white capped near 0.40. It reads as light and shadow in a room. |
| AAC audio track | `-an`. No audio stream at all. Verified by the script. |
| Hard cut between segments, and at the loop point | Both crossfaded. The tail is crossfaded back into the head, so the loop has no visible seam. |

Result: **5.2s, 77 KB MP4 / 30 KB WebM / 4.4 KB poster**, against a 2.5 MB budget.

### Contrast is won in the encode, not by the scrim

Measured peak luma of the graded video is **103/255**. That puts `--on-ink` text
at **4.9:1 against the brightest pixel with no scrim at all**; the scrim only
improves it. So the scrim is doing composition rather than rescue, which is why
the spec's `.55` bottom stop is safe here when the arithmetic in the previous
entry said it would fail against bright footage.

That coupling is now documented in `tokens.css` beside the token, and the build
script fails loudly if a future clip grades brighter than 120/255.

### One more thing measuring caught

The poster at crf 30 was 1.4 KB, which is **0.046 bits per pixel**. Chrome
discards LCP candidates below roughly 0.05 bpp as low-entropy placeholders, so
the LCP element fell through to the header wordmark — neither the H1 nor the
poster, which the section gate requires. Re-encoded at crf 8: 4.4 KB, 0.105 bpp,
and the LCP element is the poster again. It also stops a dark gradient banding.

### Verification after the change

| | |
|---|---|
| Lighthouse mobile (Slow 4G, 4× CPU) | **100 / 100 / 100 / 100** |
| LCP | 1.5 s, element is the poster |
| CLS | **0** |
| Total transfer | 102 KB |
| Horizontal scroll | none at 320, 375, 414, 768, 1024, 1440, 1920 |
| Headline | three authored lines at 414 and up; reflows at 375 and 320, which the spec permits below 400px |
| `saveData` / `slow-2g` | 0 video bytes fetched; poster stands |
| `prefers-reduced-motion` | no autoplay, labelled play control, all text visible at 150ms |
| JS disabled | complete and legible |

### Still open

The best version of this section is still a purpose-shot **9:16 clip of a real
counter at dusk with a real transaction**. What ships now is salvaged b-roll from
a corporate film, blurred until it is atmosphere. It works, and it is honest
about being atmosphere rather than pretending to be evidence, but it is not the
thing the section was designed around. `public/media/README.md` states what to
ask for, and a new clip drops straight into the build script.

---

## Step 3 — Capabilities deck

**Built:** six-card horizontal deck on paper, CSS scroll-snap, arrows + counter
right of a left-aligned header, draggable scrub bar, track bleeding off the
right edge. Card 06 is the one dark card and closes the deck.

### The fragments, and the screenshot problem

The section's central rule is that every card carries a fragment of the real
product, and the spec asks for cropped 2× screenshots. Those are still a client
asset (CONTEXT.md §5). Shipping six marked placeholder boxes would have
reproduced exactly the empty-panel problem the hero just got fixed for.

So the fragments are **built in markup instead of imaged**, from the product
vocabulary `CONTEXT.md` §4 actually records: the payment methods (Cash / Mobile
Money / Bank transfer), GMD totals, per-location billing, stock and expiry
alerts, the offline/synced state. Rendered in this design system they read as
*specimens* of the product rather than photographs of it, which is more honest
than a soft screenshot, costs no bandwidth, stays sharp at any density, and
reflows at 320px.

`GMD 1,580.00` is the one real figure and it comes from the Transactions screen
in `CONTEXT.md` §4. Every value the source does not record — stock quantities,
sales-by-hour bar heights, expenses and profit — is marked `data-illustrative`
in the markup. None of it is a claim about the business, and all of it should be
replaced by real 2× screenshots when they arrive.

### The falloff had to change, and axe is why

The motion spec asks for non-active cards at `opacity: .55`. Measured, that
drags a card's muted body text from 5.7:1 to **2.3:1** and its accent text to
2.3:1. Lighthouse accessibility fell to 96 on `color-contrast`, naming eleven
elements. The accessibility floor is a BLOCKER and the falloff is an effect, so
the falloff gave way.

Contrast-safe substitute doing the same job: the inactive card recedes by
**value** rather than by opacity — dropping from `--paper-hi` to the section's
own `--paper` and losing its lift, while the active card keeps `--paper-hi` and
`--shadow-paper`. `scale(.97)` is unchanged from the spec. Every glyph keeps
full contrast. Still no 3D, no perspective, no coverflow.

Same class of problem, found in the same pass: **`--signal` is 3.05:1 on
`--paper`**. That is fine for a graphic (≥ 3:1) and fails for 12px text
(4.5:1). So on the paper cards the word "In stock" takes normal ink and only the
tick carries the green; on the dark card `--signal` measures 5.5:1 and can
colour text, which is what card 06 does. The design system's verified-pairs
table does not cover signal-on-paper — worth adding.

### Two bugs the browser found that reading would not have

- **Every card was dimmed, including the active one.** `active` was initialised
  to `0`, so `render()` early-returned on its own first call and no card ever
  received `[data-active]`. The falloff rule then matched all six. It showed up
  as cards measuring 349px instead of 360 — `scale(.97)` applied to everything.
- **The Next arrow never disabled at 375px.** With `scroll-snap-type: mandatory`
  the browser settles on the last card's snap point, which sits short of true
  max scroll by the track's trailing padding, so `scrollLeft >= maxScroll` was
  never true. End state is now measured from the cards ("is the last card fully
  in view"), which is both robust and what the control actually means.

Also: the counter read `03 / 06` at the end of the track on desktop, because
with 3.2 cards visible the leftmost card at max scroll *is* card 3. Literally
true, reads as broken. Clamped to first and last at the extremes.

### Verification

| | |
|---|---|
| Lighthouse mobile | **100 / 100 / 100 / 100** |
| LCP / CLS / total | 1.7 s · 0 · 115 KB |
| JS | 2 requests, 1.4 KB + 0.6 KB transferred |
| Horizontal page scroll | none at 320, 375, 768, 1440 |
| Fragment clipping | none at 320, 375, 768, 1440 (checked by comparing scrollHeight to clientHeight, not by eye) |
| JS disabled | track still scrolls and snaps, all six cards at full opacity, nothing hidden |
| Reduced motion | falloff dropped, deck still snaps and scrolls |
| Keyboard | ArrowRight steps one card; End → `06 / 06`; Home → `01 / 06`; focus inside an off-screen card scrolls it in |
| Semantics | `role="group"` + label, `tabindex="0"`, `<article>` + `<h3>` per card, counter `aria-live="polite"`, arrows 44×44 with `aria-disabled` |
| Dots | zero |

The card height rose from the spec's 440px to 500px below 480px width. A narrow
card wraps its title and body onto more lines, and the thing being squeezed out
was the fragment — the evidence the card exists to show. All cards still share
one fixed height per breakpoint, so the track never reflows mid-drag.

### Self-critique

**Distinctive:** the fragments. Card 03 shows `GMD 1,580.00` because that is the
figure on Contekai's own Transactions screen, card 04 lists Serekunda, Banjul and
Brikama, and card 06 shows a sale sitting in a queue waiting for the network.
Swap in another company and every one of those has to be rebuilt from scratch,
which is the substitution test passing.

**Templated:** the tag row at the foot of each card — small icon plus two
uppercase mono words. It is the most decorative thing in the section and it is
close to the icon-chip reflex the spec bans, saved only by being small and
textual. If anything else in this section gets cut, it is that.

**Removed:** the three payment-method chips under the POS fragment. They were
pill-shaped, they wrapped and clipped at the card's fixed height, and they were
restating the body copy. One quiet mono line, `Cash · Mobile Money · Bank
transfer`, says the same thing in a quarter of the space.

**Gate:** passed. No blockers, after the falloff and `--signal` fixes above.

---

## Step 4 — Built for here

**Built:** four ledger rows on dark, each a condition and a response, marked up
as a `<dl>`. Hairline rules, a mono index per row, and one closing stamp line.
Zero icons, zero cards, zero row backgrounds.

The framing is the point. The current site states these as four benefits with
icons; benefits are cheap and interchangeable. Naming the condition accurately
("The power goes. The network drops.") is what proves the product knows this
market, and it answers the objection the reader is actually holding rather than
the one a brochure would invent.

### The reveal needed restructuring to do what the spec describes

The spec asks for two beats: the hairline rule draws first, left to right, then
the text wipes in behind it. Those cannot both live on the row, because a
`clip-path` on the row clips its rule pseudo-elements too and the two beats
collapse into one.

So the row is only the observer target — its base `[data-reveal]` transform and
opacity are cancelled — and the animation sits on its parts: `::before` and
`::after` carry the rules as `scaleX(0) → 1`, and the `<dt>`/`<dd>` carry the
`clip-path` wipe one `--dur-base` behind. Borders cannot be scaled, which is why
the rules are pseudo-elements rather than `border-block-start`.

Verified by sampling the animation frame by frame rather than trusting it:

```
 ~60ms  ruleScaleX 0,0,0,0                textOpacity 0.00,0.00,0.00,0.00
~300ms  ruleScaleX 0.97,0.71,0,0          textOpacity 0.00,0.00,0.00,0.00
~500ms  ruleScaleX 1,1,0.83,0             textOpacity 0.74,0.14,0.00,0.00
~900ms  ruleScaleX 1,1,1,0                textOpacity 1.00,1.00,0.95,0.00
```

Rules lead, text follows, rows stagger at 60ms. Scrolling away and back does not
replay it. Four rows, four steps, inside the six-item limit.

### Uneven rows had to be earned, not declared

The spec is explicit that a ledger has uneven entries and that equal heights
would push this back toward a card grid. Measured at 1440 with the spec's 46ch
response cap, all four rows came out at exactly **147px** — every response
wrapping to exactly two lines. Nothing was forcing equality; the copy just
happened to be that even, and the result was a uniform grid.

46ch is a maximum, not a target. Measured across candidates:

| Measure | Response lines | Row heights |
|---|---|---|
| 46ch / 44ch / 42ch | 2 / 2 / 2 / 2 | 147 / 147 / 147 / 147 |
| **40ch** | **2 / 3 / 2 / 2** | **147 / 173 / 147 / 147** |
| 36ch | 3 / 3 / 2 / 2 | 173 / 173 / 147 / 147 |

40ch is inside the cap and lets the longest response take the third line it
needs, which is the shape the spec's own diagram draws (row 02 is the long one).
No row height is set anywhere.

### `--on-ink-faint` is not a text colour, and the specs keep reaching for it

The section spec asks for the closing stamp in `--on-ink-faint`. Measured, that
is **4.06:1** at 12px and fails the 4.5:1 floor. This is the second section spec
to reach for `--faint` as a text colour after the hero placeholder did, and the
design system's own rule already says muted text stops at `.68` on ink. Switched
to `--muted` (~11:1). It costs a little of the intended whisper and it stays
readable in daylight on a cheap phone, which is the audience the brief names as
deciding.

### Verification

| | |
|---|---|
| Lighthouse mobile | **100 / 100 / 100 / 100** |
| LCP / CLS / total | 1.7 s · 0 · 116 KB |
| Markup | `<dl>` with `<dt>`/`<dd>`, index `aria-hidden` |
| Icons in section | **0** |
| Row backgrounds | all `rgba(0,0,0,0)` |
| Row heights | uneven at both 1440 and 375 |
| Section padding | 128px desktop / 64px mobile, the largest on the page |
| Horizontal scroll | none |
| Reduced motion | everything visible at 250ms, no wipe |
| JS disabled | all rows visible, `clip-path: none`, rules drawn |

### Self-critique

**Distinctive:** the left column. "The power goes. The network drops." is not a
feature, a benefit, or a value proposition — it is a description of a Tuesday in
Serekunda. No other B2B SaaS page would open a section by naming the customer's
infrastructure failing, and the whole argument only works because it does.

**Templated:** the closing stamp, `THE GAMBIA · DALASIS · WAVE · OFFLINE-FIRST`.
Middot-separated uppercase mono keywords is a well-worn move, and having lost
its faintness to the contrast fix it now sits louder than a flourish should. It
is the first thing I would cut in the step 8 pass.

**Removed:** the intro paragraph. The spec forbids one and it was right to — I
drafted "Four things that are true of shops here" and cutting it made the first
condition land harder. A preamble tells the reader what they are about to read
instead of letting them read it.

**Gate:** passed. No blockers, after the `--faint` fix above.

### A pattern worth naming across both sections

Three of the four blockers found in this session were the same shape: a section
spec naming a colour or an opacity that does not survive measurement — the
deck's `opacity: .55` falloff, `--signal` as text on paper, and `--on-ink-faint`
as the stamp. All three read fine as instructions and all three fail axe. The
design system's verified-pairs table covers seven combinations; it should be
extended to cover `--signal` on both grounds and to state plainly that
`--on-ink-faint` and dimmed surfaces are not text.

---

## Step 3, revision — Capabilities as a three-up stacked carousel

**Built:** the horizontally scrolling deck replaced by a stack. Active card
centred and full size, previous and next peeking from either side, scaled and
**behind** it. The other three sit at opacity 0. Six-segment scrub bar, arrows,
keyboard, live counter, real product fragments unchanged, card 06 still the dark
card and still last.

### Auto-advance: the exception, and how far it goes

`kit/skills/motion/SKILL.md` §2C says **"Never auto-advance — auto-advancing
carousels are a documented usability failure and steal control from a user
reading on a phone."** This component overrides that rule on the client's
explicit instruction. Recording it as an exception rather than quietly dropping
the rule, because the reasoning behind it does not stop being true.

The override is bounded so it takes as little control as it can:

| Condition | Behaviour |
|---|---|
| Cadence | 6s |
| Pointer over the deck or its controls | paused |
| Keyboard focus inside the deck | paused |
| Tab hidden (`visibilityState`) | paused |
| Any manual navigation (arrow, key, scrub) | suspended 15s, then resumes at the next tick |
| `prefers-reduced-motion` | never starts |

Verified, not assumed. Measured advance `01 → 02 → 03` on a 6s cadence; hover,
keyboard focus and hidden tab each hold it still for 7s+; after a manual click
the first auto-advance came at **17.1s**, which is the 15s cooldown plus the
next tick.

**A bug that only a timed test would find.** Pausing on any `focusin` meant a
single arrow *click* pinned the pause forever: Chrome focuses a clicked button,
so `focusWithin` stayed true long after the pointer had gone, and auto-advance
never resumed. It now pauses on `:focus-visible` only — someone tabbing through
is reading; someone who clicked is not necessarily still there. Confirmed with a
real Tab press (pauses, then resumes 3s after focus leaves) rather than a
programmatic `.focus()`, which does not set `:focus-visible` at all and quietly
made the first version of the test pass.

### The peek offsets are measured, not taken on trust

The revision names both a `translateX(±58%)` (±52% mobile) and a "roughly 40% of
each visible past the active card's edge" goal. Those two do not agree: at 58%
the sliver measured **59%** of the peeking card, which competes with the active
one instead of hinting at it. The prose goal is the real instruction, so the
values were tuned to hit it — **42%**, measured at 41% visible at 1440 and 40%
at 375. Peek scale is 0.88 desktop / 0.82 mobile as specified.

### Contrast, again, and how the stack sidesteps it

The peeking cards sit at `opacity: .45`, which is the same trap that took the
old scrolling falloff out at 96 on `color-contrast`. It is not a problem here
because the peeks are genuinely decorative now: `paint()` marks every non-active
card `aria-hidden` and `inert`, so they are out of the accessibility tree and
the tab order. That is also just correct — the reading order should be the
active card, not six cards deep, and focus should never land on something
off-stage. With JS off, none of it is applied and all six are exposed.

### Verification

| | |
|---|---|
| Lighthouse mobile | **100 / 100 / 100 / 100**, three consecutive runs |
| LCP / CLS / total | 1.7 s · 0 · 116 KB |
| z-order | prev/next at `z-index: 1`, active at `3` — behind, not beside |
| Transforms | `translateX` + `scale` only. No `rotateY`, no `perspective`, no coverflow |
| Reduced motion | no auto-advance; falloff dropped outright (prev at opacity **1**, `matrix(1,0,0,1,-151,0)` — offset kept, neither shrunk nor dimmed) |
| JS disabled | `data-stacked` never applied; plain snapping row, **6/6 cards at full opacity**, zero `aria-hidden` |
| Horizontal page scroll | none at 375 or 1440 (peeks clip at the stage edge) |

One CLS oddity worth recording: a single Lighthouse run out of four reported
**0.608**, attributed to `.cap__stage` with cause "Web font loaded". It did not
reproduce in three subsequent runs, nor under a throttled puppeteer session with
a `layout-shift` PerformanceObserver (total 0.0000). Rather than leave it to
chance, `.cap__stage` now carries an explicit `min-block-size` in **both**
states — in the pre-JS flex row its height was content-driven and therefore
exposed to a font-swap reflow. Three runs since: CLS 0.

### Self-critique

**Distinctive:** the stack still carries real product surfaces. What is behind
the active card is a receipt total in GMD, a low-stock alert, a queued sale
waiting for the network — so flipping through it is flipping through the
product, not through six illustrations. The dark card closing the sequence
means the deck ends on the offline claim, on the same night ground as the hero.

**Templated:** the stacked three-up carousel is itself the most template-shaped
thing on the page. It is a pattern the reader has seen on a hundred sites, and
unlike the receipt or the night/paper opposition it carries no argument about
this product. The fragments are doing the work of making it specific; the
container is not helping them.

**Removed:** pointer-drag on the track. The scrolling deck had a full
`pointerdown/move/up` drag implementation with `setPointerCapture` and a
`will-change` toggle. In a stack there is nothing to drag along — the cards do
not live on an axis any more — so keeping it would have meant inventing a
swipe-to-advance gesture the revision did not ask for. Arrows, keyboard and the
scrub bar cover navigation, so about 40 lines went.

**Gate:** passed. Auto-advance pauses on hover, focus and hidden tab and stays
suspended after manual navigation · prev/next are behind the active card · no
coverflow, 3D or perspective · reduced motion kills auto-advance and the falloff
· JS-off still shows all six.

---

## Step 4, revision — Built for here as scattered note cards

**Built:** the four ledger rows replaced by four paper notes pinned to the night
ground. Hand-authored scatter, one thumbtack each, still a `<dl>`, DOM order
01→04 regardless of where a note sits.

### Everything about the scatter is a constant

No `Math.random()` anywhere. Every position, width, rotation, z-index and
thumbtack offset is authored in the component's `notes` array and passed through
as custom properties. Verified across runs and breakpoints: the rotations read
back as exactly `-3.0°, 2.0°, -1.0°, 4.0°` every time. Widths deliberately vary
(300 / 280 / 320 / 260px) so no two notes share an edge or a baseline.

**The overlap had to be built, not assumed.** First pass positioned the four
notes without any of them actually touching — the z-indexes were decorative and
the "pinned over time" reading was absent. Measured and re-authored until the
corners overlap by roughly `--space-4`: **13px and 19px at 1440**, 15px and 16px
in the 900–1023 two-column arrangement. No note's *text* is covered at any
width, checked by intersecting each note's text rects against every
higher-z-index note rather than by looking.

### The shadow tilt did not work the first time

Each note is rotated, and `box-shadow` rotates with its element, so four notes
would read as lit from four different directions. The fix is to counter-rotate
each offset by `sin(rotation)`.

Writing that as a `--shadow-note` token in `tokens.css` silently did nothing:
**a `var()` nested inside a custom property declared on `:root` resolves against
`:root`**, where `--note-tilt` does not exist, so every note fell back to `0`
and all four shadows came out identical. The two shadow colours are now tokens
(`--shadow-ink-near` / `--shadow-ink-far`) and the offsets are composed on the
element, where `--note-tilt` is in scope. Measured second-layer x-offsets:
`-0.84px, +0.56px, -0.28px, +1.12px` — proportional to each rotation, one light
source.

### `--on-ink-faint` for the third time

The revision again asks for the footer stamp in `--on-ink-faint`. It measures
**4.06:1** at 12px and fails the 4.5:1 floor, which is a blocker on the gate the
client will run. Rather than fall back to `--muted` (~11:1) and lose the whisper
entirely, `tokens.css` now carries **`--on-ink-quiet`** at `.5` alpha — the
quietest text that still clears the floor, measured **4.9:1**. `--on-ink-faint`
is now commented in the token file as not a text colour at any size.

### Responsive and zoom

Below 900px the scatter is not attempted: notes centre in a single column with
alternating ±2° rotations and `--space-6` between them, thumbtacks intact.
900–1023 is the compressed two-column arrangement (01+03 left, 02+04 right).

200% browser zoom on a 1440 screen is a **720px layout viewport**, which lands
below 900 and collapses to the stack — so the scatter cannot overlap content at
zoom. Verified at 720 and 512 (≈280%): stack layout, no horizontal scroll, no
covered text. Worth noting because the first version of this check used
`body { zoom: 2 }`, which does *not* change the layout viewport, kept the
scatter active at an effective 720px, and reported three text collisions that
would never happen in a real browser.

### Verification

| | |
|---|---|
| Lighthouse mobile | **100 / 100 / 100 / 100** |
| Markup | `<dl>` with `<dt>`/`<dd>`, DOM order `01→02→03→04` at every width |
| Ground / cards | `--ink-900` section, notes `rgb(246,243,236)` = `--paper` |
| Ornament | 4 thumbtacks, 4 SVGs total in the section — no tape, staples, torn edges or texture |
| Rotations | hand-authored constants, identical every run |
| Hover | none. No lift, no wobble, no transition on hover at all |
| Reduced motion | notes at final position and rotation immediately |
| JS disabled | all four visible, rotations preserved |

### The substitution test, answered honestly

The revision asks directly: does the scattered-notes treatment fit *this*
product, or would it work for anything?

Straight answer: **the treatment is portable; what makes it Contekai's is the
content and the ground.** Any brand can pin notes to a board, and I am not going
to claim otherwise. What is not portable is that the notes are `--paper` on
`--ink-900` — the same night-and-paper opposition the hero and the receipt are
built on, which only means something because this product exists for the hours
when the lights are off. And the four things pinned up are not benefits; they
are a shopkeeper's own list of what goes wrong: the power, the staff, the stock,
the not-knowing.

What I changed to push it toward a shop counter and away from a moodboard:

- **Widths vary and no two notes share a baseline.** The first pass had them
  near-uniform and evenly spaced, which read as a gallery grid tilted a few
  degrees. Uneven widths and irregular vertical offsets read as things added one
  at a time.
- **The overlap is corner-only and small.** Notes layered like a collage read as
  curation; notes just catching each other's corners read as accumulation.
- **One ornament, and it is off-centre.** A tack centred by CSS is a graphic; a
  tack a few pixels off centre, differently on each note, is a person.
- **Nothing else was added.** The obvious next moves — paper texture, a torn
  edge, tape, a cork background — are exactly what would turn it into a Pinterest
  board. The restraint is what keeps it a wall behind a counter.

### Self-critique

**Distinctive:** four bright paper notes on the night ground is the page's
thesis stated a third way — the lights are out and the paper is still legible.
It only works because the rest of the page has already established that
opposition, and it would be meaningless on a site that had not.

**Templated:** the rotation itself. `transform: rotate(-3deg)` on a card is one
of the most common decorative moves there is, and nothing about the angle is
specific to Contekai. It survives because the content underneath is not
decorative, but it is the weakest idea in the section.

**Removed:** the second ornament. I had a hairline "tear" along each note's top
edge to sell the paper. It made the notes look like a scrapbook, it fought the
`--r-sm` radius, and it was the third graphic device in a section whose previous
version had zero. Cutting it left the thumbtack as the only ornament, which is
what the revision asks for and what the section can carry.

**Gate:** passed. Hand-authored rotations · `--paper` on `--ink-900` · one inline
SVG tack per note in `--laterite`, nothing else · DOM order 01→04 · stack below
900px · no hover animation · substitution test answered above.

---

## Tweaks — dark deck cards, squarer overlapping notes

**Deck (§02): every card is now `--ink-700`, not just card 06.** The fragments
drop to `--ink-900` so dark surfaces still separate by value rather than by
shadow, and the card republishes the ground tokens locally so everything inside
picks up ink values without any component branching on where it sits.

Three colours had to move, all measured rather than assumed:

| Was | On ink | Now |
|---|---|---|
| `--laterite` tag icon | **2.79:1** on `--ink-700` — under the 3:1 a graphic needs | `--kai-400` (6.2:1) |
| `--laterite` low-stock state | **3.48:1** on `--ink-900` at 12px | `--on-ink`; the words "3 left" / "Expiring" carry it |
| `--signal` + separate ink word | 5.5:1 on ink, so no longer needs splitting | `--signal` colours the whole state |

That last one is the mirror of the problem the paper version had: `--signal` is
3.05:1 on paper and 5.5:1 on ink, so the same component needed opposite
treatments on the two grounds.

**Worth flagging: card 06 has lost its accent.** It was the one dark card in a
paper deck — the thesis card, visually singled out, echoing the hero. Now that
every card is dark it is just the last card. It still closes the sequence and it
still holds the offline fragment, but the visual argument that it is *the*
important one is gone. If that mattered, the cheapest way back is to make 06 the
one card that stays `--paper-hi`, inverting the accent rather than removing it.

**Notes (§03): squarer and overlapping properly.** Widths came down from
300/280/320/260 to 252/236/264/228, which lets each note's text wrap onto more
lines and brings its height up toward its width: measured aspect ratios went
from ~1.4–1.5 to **1.24 / 1.17 / 1.32 / 1.03**. Positions were re-authored so the
corner overlap roughly doubled, to **22px and 21px** at 1440 and 18/20px in the
two-column range, which is as deep as it can go before a note's own bottom
padding stops protecting the text underneath. Verified no note's text is covered
at any width.

---

## Step 5 — Pricing (the signature)

**Built:** a calculator that prints a receipt. Locations stepper, term selector,
and a thermal docket that reprints — torn top and bottom edge, `--paper-hi`
face, DM Mono throughout, dotted leaders, `TOTAL DUE` under a double rule, the
CTA inside the paper.

Contekai's pricing has one genuinely unusual property: it is per location and
every plan has every feature. A three-column comparison table would have nothing
to compare, which is exactly why the standard SaaS pricing table would be both
ugly and dishonest here. The buyer's real question is *how many locations, how
long, what do I pay* — so the section answers that directly.

### The maths, hand-checked

Every combination was verified against figures worked out by hand, not spot
checked:

| Locations | Term | List | Discount | Total | Per location / month |
|---|---|---|---|---|---|
| 1 | 1 month | D 1,500 | — | **D 1,500** | D 1,500 |
| 3 | 1 month | D 4,500 | — | **D 4,500** | D 1,500 |
| 12 | 1 month | D 18,000 | — | **D 18,000** | D 1,500 |
| 1 | 12 months | D 18,000 | −D 1,800 | **D 16,200** | D 1,350 |
| 3 | 12 months | D 54,000 | −D 5,400 | **D 48,600** | D 1,350 |
| 12 | 12 months | D 216,000 | −D 21,600 | **D 194,400** | D 1,350 |

All six pass. `18,000 → 16,200` is exactly 10%, which is why the term chip can
say `−10%` — it is the only discount stated anywhere in `CONTEXT.md`.

### What is deliberately absent

- **The 6-month tier.** `CONTEXT.md` §4 marks its price `[VERIFY]`. Two terms
  ship rather than three. An invented number on a pricing page is the most
  damaging error this build could make.
- **The multi-location discount.** The current site promises one and never
  states it. There is no `MULTI-LOCATION DISCOUNT` line and the copy does not
  hint at one: the footnote says plainly that adding a location later is billed
  at the same rate from the day you add it. Either the client supplies the
  number or the promise stays gone.
- **No "Most popular" ribbon.** The maths is doing that job — the receipt opens
  on 12 months because that is the best value, which is more persuasive than a
  badge.

### Two bugs, one of them systemic

**The receipt could never reveal itself.** `[data-reveal="print"]` starts at
`clip-path: inset(0 0 100% 0)`, and Chrome's IntersectionObserver **applies the
target's own clip-path when computing intersection**. So the receipt reported an
intersection ratio of exactly **0**, never fired, never got `.is-in`, and
therefore never unclipped — a deadlock that rendered the entire section's
centrepiece invisible while every figure inside it computed correctly.

Measured, on the same element in the same scroll position: ratio **0** while
clipped, **0.67** with the clip removed.

The fix is the pattern §03 already stumbled into for its own reasons: the
observed element is never the clipped one. `[data-reveal]` goes on `.receipt`,
which stays unclipped; the clip animates on `.receipt__face` off `.is-in`.
`motion.css` now carries a loud warning on both directional variants, because
the next section that reaches for `write` or `print` will hit this otherwise.

**The total was stale.** The count-up was gated behind the same observer, so
`setTotal` only ran once `totalIsLive` flipped — and when the observer did not
fire, the receipt cheerfully displayed `D 16,200` for every combination while
the list, discount, per-unit figure and the `aria-live` sentence all updated
correctly. On a pricing page that is the worst possible failure, so correctness
no longer depends on anything asynchronous: the total is written on every
render, and the count-up is a separate one-shot flourish. It also now skips
entirely if the reader has already touched a control — scrolling the receipt
into view after someone has set their locations should not rewind their total to
zero and count it back up at them.

### Verification

| | |
|---|---|
| Lighthouse mobile | **100 / 100 / 100 / 100** (three consecutive runs) |
| LCP / CLS / TBT / total | 1.7 s · 0 · 0 ms · 120 KB |
| JS | 3 requests, 3.5 KB transferred |
| Controls | real `<input type="number">`, real `<input type="radio">` ×2 |
| Table | real `<table>` with a visually-hidden caption and 7 scoped `<th>` |
| Announcement | `aria-live="polite"`, one sentence: *"Total due, 194,400 dalasi for 12 locations over 12 months."* |
| Figures | `tabular-nums` throughout |
| Bounds | `aria-disabled` at 1 and 99; clicking past either does nothing |
| Keyboard only | ArrowUp on the input → 3 locations, D 48,600; Tab → radios; ArrowLeft → 1 month, D 4,500 |
| Receipt radius | `0px`, torn edges from a CSS mask, no image |
| Narrow widths | 420px max, 335 at 375, 280 at 320; tear 12px → 9px below 380 |
| Figure wrapping | none at 375, 420 or 1440 even at the widest total (D 216,000 / D 194,400) |
| Reduced motion / JS off | total renders, receipt visible, no clip stranding |
| "Most popular" / 6-month | neither appears anywhere in the section |

At 320px two item *labels* wrap to a second line ("Location × 12 months", "Per
location / month"). Figures never do, which is what the spec asks. A receipt
with a wrapped item description is what a real docket looks like; `TOTAL DUE`
breaking in two was not, and that is fixed by buying 16px of measure back from
the face padding and dropping the total a size step below 380px.

Also worth recording: one Lighthouse run reported **TBT 730 ms** and performance
81. It looked like the masked-and-drop-shadowed receipt being expensive to
raster on a throttled CPU, so I measured it — blocking beyond 50ms was **7ms as
built, 8ms without the drop-shadow, 7ms without the mask, 12ms without either**.
The receipt is not the cost; the run was contending with other Chrome instances
on this machine. Three clean runs since: TBT 0.

### Self-critique

**Distinctive:** the receipt computes. It is not a picture of a receipt — set
locations to 3 and the qty, the line, the discount, the total and the per-
location figure all reprint, and the number that comes out is the number the
client will actually charge. It is also the artifact this product physically
produces hundreds of times a day, which is why it can carry this much weight
without reading as decoration. Swap Contekai out and the whole section has to be
rebuilt as a table.

**Templated:** the segmented term control. Two bordered chips with the discount
in accent colour is the most conventional thing in the section, and it sits
right next to the least conventional. It survives because real radios in a
segmented control are genuinely the right affordance for three-or-fewer mutually
exclusive options, but it is the part I would redraw first.

**Removed:** the dotted leader from the table header row. I had leaders running
under `QTY / ITEM / AMOUNT` as well as under the line items, which made the head
read as another entry rather than as a column heading. A dashed rule under the
header and dotted leaders only on the lines that carry figures is what an actual
docket does.

**Gate:** passed. Totals correct for 1, 3 and 12 locations across both terms ·
no invented prices · real form controls · tabular figures, no jitter ·
`aria-live` announced · keyboard path complete · tear crisp at 320 and at 200%
zoom · no "Most Popular" ribbon · trial stated honestly including "first
location only".

### Needs from the client, still blocking

1. **The 6-month price.** The tier is absent until it is confirmed.
2. **The multi-location discount**, or confirmation that there isn't one so the
   promise can stay deleted from the copy.
3. Confirmation that `/signup` is the real route for the receipt's CTA.

---

## Step 6 — Proof

**Built:** the section, in its **reduced-and-awaiting** state, with the full tab
machinery behind it.

### What shipped, and what deliberately did not

The section spec makes one rule blocking: *a testimonial without a real name, a
real business and a real town does not ship.* Five gold stars over an anonymous
quote is the most recognisable fake-social-proof pattern there is, and in a
market this small the reader may well know the shop.

What the client has supplied is **one real person: Bubacarr Jaith, name and
photograph.** Not his words, not his business, not his town, and not written
permission. So:

- His name and photo render, because both are real.
- His quote renders as the marked placeholder the spec prescribes —
  `AWAITING REAL TESTIMONIAL — QUOTE, BUSINESS, TOWN, WRITTEN PERMISSION` — not
  as text I wrote. The spec is explicit: *do not write, generate, or "example" a
  testimonial.*
- The attribution line reads `BUSINESS AND TOWN TO CONFIRM` rather than being
  quietly omitted, so the gap is visible to whoever reviews the page.
- **No star ratings**, because there is no linkable review source to cite.

`CONTEXT.md` §4 records a fragment from the current site — *"I have two other
businesses aside of Kerr…"* — with no attribution. It is **not** used. An
unattributed quote is the exact pattern this section exists to avoid, and
attaching it to the one person whose photo we happen to have would be inventing
a link that may not exist. If that quote is Bubacarr's, say so and it goes in.

### The machinery is complete, not stubbed

`testimonials` is an array of typed records where `quote`, `business`, `town`
and `photo` are each independently nullable. Fill them in and the section
becomes its full form with no other change:

- With 2+ entries the thumbnail row appears as a real **tab pattern** — roving
  `tabindex`, `aria-selected`, `aria-controls`, panels labelled by their tab,
  arrow keys plus Home/End, and a crossfade that runs out at 70% of in.
- With one entry there is **no tablist at all**. A single tab is a dot, and dots
  are what this section is meant to avoid.
- A reviewer without a photo gets a **monogram avatar** from their initials
  rather than a grey silhouette or a stock face.

### Photo handling

`bubacarr Jaith.jpeg` was 316 KB at 1496×1552. Cropped square on the face and
encoded at 224px (2× for the 40px avatar and 2× for the 56px thumbnail):
**4.2 KB AVIF, 6.5 KB JPEG fallback**, against a 20 KB budget. `loading="lazy"`,
`decoding="async"`, explicit dimensions, `object-fit: cover`, and the alt text
is the person's name, not "customer photo".

The spec asks for WebP as the fallback. This machine's ffmpeg has no WebP
encoder and `cwebp` is not installed, so the fallback is JPEG. AVIF covers ~94%
of browsers and JPEG covers the rest, so the practical difference is a few KB
for a small minority. Worth switching if a WebP encoder is available on the
build machine.

### Verification

| | |
|---|---|
| Lighthouse mobile | **100 / 100 / 100 / 100** |
| LCP / CLS / TBT / total | 1.7 s · 0 · 0 ms · 123 KB |
| Markup | `<figure>` + `<figcaption>`; `<blockquote>` appears only when a quote exists |
| Photo | 40×40, `--r-full`, alt = "Bubacarr Jaith", loads |
| Stars | none anywhere in the section |
| Rhythm | 491px tall vs pricing's 963px at 1440 — visibly the shortest section, as the spec requires |
| JS off / reduced motion | fully visible, no stranding |
| Horizontal scroll | none |

### Self-critique

**Distinctive:** the section is honest about being incomplete, in public. It
shows a real man's face and his real name next to a box that says the words are
missing, rather than filling the gap with something plausible. That is a
strange-looking thing to ship and it is the correct thing to ship — the whole
argument of this section is credibility, and the fastest way to lose it is one
invented quote.

**Templated:** the attribution row — circular avatar, name, muted mono
sub-line — is the standard testimonial furniture. It is fine, but nothing about
it is Contekai's.

**Removed:** the fragment quote. I had *"I have two other businesses aside of
Kerr…"* set as the live quote with a marked ellipsis, and it looked considerably
better than the placeholder box does. It came out because it has no attribution,
and a large unattributed quote in the proof section is precisely the thing the
honesty rule exists to stop. The section looks worse and is worth more.

**Gate:** passed in its reduced/awaiting state. No invented quotes · no stars ·
no card, no giant quote-mark graphic, no auto-advance, no dots · proper `figure`
/ `figcaption` markup · section visibly shorter than pricing.

---

## Shell — the circular-reveal mobile menu

**Built:** the client's `menu_mobile/` component, ported from React to Astro
plus vanilla TS, and wired to the header button that has been sitting inert
since step 0.

### What changed in the port, and why

| Original | Here | Reason |
|---|---|---|
| `bubbleGradient` radial gradient | solid `--ink-900` | The design system permits **exactly one gradient in the whole build** (the hero video scrim). A full-screen radial gradient would be a second. The circular reveal is the idea; the gradient was decoration. One line to put back. |
| `filter: blur(5px)` on cascading items | dropped | Blur on a full-screen overlay is expensive on the low-end Android this audience is on, and the fade-plus-rise already carries the cascade. |
| Component's own timings | motion tokens | So the menu moves like the rest of the page rather than to its own clock. |
| Tailwind utility classes | tokens | Colours, type, spacing and radii all come from `tokens.css`. |
| `<button onClick>` items | real `<a href="#…">` | They are in-page anchors. A button with a handler is not a link, and does not work with middle-click, right-click or a screen reader's link list. |

Kept: the circular reveal, the burger→X morph, the cascade, Escape to close,
scroll lock, and the reduced-motion path.

Added, because a visual component and a navigation control are different things:
focus moves into the panel on open and back to the button on close; focus is
**trapped** while open; the panel is `inert` when closed so nothing inside is
tabbable or reachable by a screen reader; and clicking a link closes the panel,
since it would otherwise cover the section it just jumped to.

### The stacking-context trap

The burger disappeared under the panel on first run. The header is
`position: sticky; z-index: 50`, which makes it **a stacking context** — so a
`z-index: 61` on the button inside it can never lift the button above a
`z-index: 60` panel, no matter how large the number. The whole header has to
move. `body:has(.menu.is-open) .header` now goes to 61 and drops its own ground,
so the lockup and the X sit directly on the ink, and the header's own CTA and
"Log in" fade out because the panel carries its own copies.

Also refined after testing: closing via a **link** does not return focus to the
button. The browser is about to move focus to the anchor target, and yanking it
back would drop the reader at the top of the page they just navigated away from.
Escape and the button itself still restore focus, where that is the whole point.

### Verification

| | |
|---|---|
| Closed | `inert`, `aria-expanded="false"`, label "Open menu", bubble `scale(0)`, content opacity 0 |
| Open | `inert` removed, `aria-expanded="true"`, label "Close menu", burger morphed, scroll locked, focus on the first link |
| Focus trap | 8 tabs across 6 links, focus still inside the panel |
| Escape | closes and returns focus to the button |
| Link click | closes, unlocks scroll, does not steal focus back |
| Burger hit-test while open | the button is the topmost element at its own centre, at 375 and 1440 |
| Reduced motion | no reveal animation; the panel is simply there at 250ms |
| Lighthouse | 100 / 100 / 100 / 100 unchanged; JS now 5 requests, 5.2 KB |

### Self-critique

**Distinctive:** not much, and that is the right answer for furniture. The one
Contekai-specific decision is the solid ink bubble — the menu opens into the
same night the hero establishes, so the panel reads as the page's own ground
rather than as a coloured overlay dropped on top of it.

**Templated:** the numbered menu items (`01`–`04`). They repeat the rail and the
eyebrows, which is consistent, but a four-item menu does not need counting off.
It is the one thing here I would cut if the menu were the section under review.

**Removed:** the logo spin-and-bob animation the original offers for its
`children` slot. A mark that spins in and then bobs forever is a looping ambient
animation, which the motion grammar bans outright, and it would have been the
only continuously-moving thing on the page.

**Gate:** passed. No gradient · no blur · tokens throughout · real anchors ·
focus trapped and restored · `inert` when closed · reduced motion handled.

---

## Step 7 — Footer + closing action

**Built:** one dark block that opens with the closing action and settles into the
utility rows. No separate full-height CTA band above it — that is padding, and
it is a template shape.

### The contact channel is the point, and it is still missing

`sections/06-footer.md` opens by naming this "the single most important missing
element on the current site: **a way to talk to a human**", and in this market
WhatsApp is the conversion path — a shop owner who has read the whole page and
still has a question will message, not fill in a form.

The number is still `[VERIFY]`. There is no email either. So the slot renders a
marked awaiting state next to the CTA rather than a dead `wa.me/` link or a
quietly-dropped action:

> `AWAITING WHATSAPP NUMBER — THE HIGHEST-VALUE ELEMENT ON THIS PAGE FOR THIS MARKET`

It is deliberately visible on the page. `contact` in the component takes
`whatsapp` (digits, international, no `+`) or `email` as a fallback, and filling
either turns the note into a real action in both the closing block and the
Company column, with `rel="noopener"` and an aria-label that says it opens in a
new tab.

### Everything else marked [VERIFY] is absent, not guessed

- **Privacy and Terms**: no evidence either page exists. A dead legal link is
  worse than no link, so both are out.
- **"Built by Pilore Solutions"**: `CONTEXT.md` §1 sources it from the app's own
  footer but marks it `[VERIFY]`, and the step gate says it ships only once
  confirmed. The legal row is `© 2026 Contekai` alone.
- **No social icons.** The client's TikTok/Instagram are implied by the hero
  footage but no handles were supplied, and the gate forbids unconfirmed ones.

### The two-band footer and the one padding rule

The footer is two stacked grounds — the closing action on `--ink-800`, the rows
on `--ink-900` — each needing its own vertical rhythm and a full-bleed
background. Rather than break the "all section padding comes from one rule"
discipline, `data-section` moved onto the two inner bands
(`footer-close` / `footer-rows`), which the existing `[data-section]` rule
already matches. One rule still owns every padding value on the page.

### Two adjustments after looking at it

- The closing headline wrapped to three lines: `22ch` was narrower than the
  second sentence, so the authored `<br>` was not the only break. Widened to
  `34ch`, which is now two lines as specified.
- A 44px minimum on every footer link row is right for touch and loose on a
  desktop pointer, where it spread four links over 224px of nothing. Tightened
  to 34px **only under `(pointer: fine)`** — the touch floor is untouched on
  phones, tablets and hybrids, `target-size` passes, and 34px still clears
  WCAG 2.2's 24px comfortably.

### The CLS bug, finally pinned down

Worth recording in full, because it was misdiagnosed twice.

Roughly four Lighthouse runs in ten reported **CLS 0.608 and performance 77**,
always that exact value, always attributed to `.cap__stage`. Earlier passes
blamed a font swap and then a stray Chrome instance, hardened the stage's height
twice, and each time a few clean runs made it look solved. It was not.

`0.6075` is `500 / 823` — one card height over the mobile viewport, i.e.
everything below the deck jumping by exactly one card.

What finally isolated it: **disabling `deck.ts` entirely gave CLS 0 in 4/4
runs.** The cause was `deck.ts` setting `data-stacked` on the stage *after*
first paint, flipping the deck from a scrolling flex row to an
absolutely-positioned stack. A post-paint layout-mode change, and whether it
landed inside Lighthouse's CLS window was the coin-flip.

Things that did **not** reproduce it, and are therefore ruled out: a faithful
replication of Lighthouse's emulation (412×823, DPR 2.625, Slow 4G, 4× CPU,
cold cache, 20s window) with a `layout-shift` PerformanceObserver — 0.0000; the
6-second auto-advance; and the full-page-screenshot viewport resize, which grows
the `100svh` hero from 759px to 5623px but is correctly excluded from CLS.

**The fix removes the switch rather than timing it better.** The stacked layout
is now plain CSS keyed on `html[data-js]`, which a blocking inline script in
`<head>` sets before first paint. `deck.ts` no longer touches the layout mode at
all — it only assigns `data-pos` — so it cannot move anything after paint. With
JS off, `data-js` is never set and the stage stays the scrolling snap row, which
is the same fallback as before. A card with no `data-pos` yet shows alone rather
than six piling up, so a failed script degrades sanely too.

**6/6 Lighthouse runs at CLS 0** since, against 3/6 before.

### Verification

| | |
|---|---|
| Lighthouse mobile | **100 / 100 / 100 / 100** |
| LCP / CLS / TBT / total | 1.7 s · **0** (6 consecutive runs) · 0 ms · 124 KB |
| JS | 5 requests, 5.1 KB |
| CTA label | one label, `Start 7 days free`, in all six places it appears |
| Grounds | closing `rgb(15,31,43)` = `--ink-800`; rows `--ink-900` |
| Last element | the 2px `--laterite` rail, `footer.lastElementChild` |
| Touch targets at 375 | none under 44px |
| Legal links / newsletter / social / emoji | none |
| navs | `aria-label="Product"` and `"Company"` |
| Footer tab order | CTA → 4 product links → Log in → Start 7 days free |
| Focus ring | `2px solid rgb(78,155,220)` = `--kai-400` |
| JS off / reduced motion | closing block fully visible, no stranding |

### Self-critique

**Distinctive:** the rail closing the page. A 2px `--laterite` line across the
very bottom is the till roll running out — it answers the vertical rail that has
been feeding down the left gutter since the hero, and it is the only ornament in
the footer. Nothing else on the page would explain why that line is there.

**Templated:** the three-column identity/Product/Company block. It is the
default footer shape and nothing about it is Contekai's; it survives because a
footer that tries to be interesting is worse than one that is quick to scan.

**Removed:** the "Multi-branch" link. The spec lists four Product links and one
of them pointed at `#what-it-does`, the same destination as "What it does" — two
labels for one anchor, which makes a reader think they missed something.
Replaced with "Shops using it" pointing at `#shops`, so all four labels name
four different places and each one matches its section's eyebrow exactly.

**Gate:** passed. One CTA label everywhere · a contact channel is *slotted and
visibly pending* rather than faked · no invented links · no newsletter, social
icons or emoji · all footer targets ≥44px at 375 · the closing block is part of
the footer, not a separate band.

### What the client still owes, in priority order

1. **The WhatsApp number.** Highest-value item on the page for this market and
   the only thing standing between the footer and being finished.
2. **Do Privacy and Terms pages exist?** If yes, the links go back.
3. **Confirm "Built by Pilore Solutions"** for the legal row.
4. TikTok/Instagram handles, if those accounts should be linked.
5. Still outstanding from earlier steps: the 6-month price, the multi-location
   discount, Bubacarr Jaith's quote/business/town/permission, the logo SVG, and
   confirmation that `/signup` and `/login` are the real routes.

---

## Footer rebuild — against `footerGuide/`

**Superseded, not amended.** The client supplied a complete, separate brief —
`footerGuide/{CONTEXT,PLAN,SCAFFOLD-PROMPT,footer.SKILL}.md` plus a working
HTML reference — and asked for the footer to be redone against it. This
replaces the receipt-adjacent footer from step 7 entirely rather than
patching it. Implemented faithfully, adapted into this project's actual
tokens instead of the reference's standalone hex values, and reconciled
against a handful of this build's own hard rules where the two genuinely
collided. Every reconciliation is a measured fact or a standing rule, not a
style preference, and every one is called out in the component's own header
comment as well as here.

### The one deliberate rule change: a third receipt

`PLAN.md` §4 (the original kit) is explicit: the receipt motif appears in
exactly two places — pricing, and the rail's echo — "if a third receipt motif
appears, remove it." The new brief makes the whole footer a second full-form
receipt: torn top/bottom edges, a barcode, dotted-leader nav lines, a dashed
"total" rule with the CTA sitting on it. This is that third appearance, kept
on purpose because the brief is detailed and explicit about wanting exactly
this. The rule is revised, not silently broken — recorded here as the
record of that decision.

Mechanically it reuses the pricing receipt's own technique rather than
reinventing one: the same `--tear` radial-gradient mask, the same
`mask-composite: intersect`, copied verbatim from `Pricing.astro` and
confirmed to match before use.

### Reconciled against measured facts, not taste

1. **Panel gradient.** The reference's lighter stop (`#c85a35`) measures white
   text at **4.23:1** — fails the 4.5:1 floor. `--laterite -> --laterite-hover`
   keeps both ends of the gradient above 5.35:1, reusing tokens already
   verified elsewhere rather than inventing a new "clay" hex.
2. **Three text uses of `--faint` (`--on-ink-faint`) failed contrast on the
   receipt's `--ink-800` face** — the eyebrow labels, the "GET STARTED" label,
   and the copyright line. Computed precisely: `--on-ink-faint` is **3.96:1**
   on `--ink-800`, under the floor. This is the fourth time in this build a
   section spec has reached for `--on-ink-faint` as text and failed; the first
   three (the hero placeholder, the ledger stamp, the deck fragments) are
   already logged. Eyebrows and the total label moved to `--muted` (7.60:1);
   the copyright line moved to `--on-ink-quiet` (4.72:1) — the token this
   project added specifically for de-emphasised text that still has to clear
   4.5:1.
3. **The five-lobe panel genuinely clipped its own content at 375px** — not a
   theoretical risk, a real screenshot: "We're friendlier than most soft…"
   and the WhatsApp-awaiting box both cut off mid-word. Measured cause: at
   375px the panel box renders 271×338, taller than it is wide, and
   `objectBoundingBox` stretches the same five-lobe path non-uniformly onto
   that aspect ratio, pinching a valley in close to horizontal — exactly the
   failure the brief's own text anticipates ("test at 320px... if it eats the
   WhatsApp button, fall back to the rounded rectangle"). Fixed by doing
   exactly that: below 480px the panel drops `clip-path` for
   `border-radius: var(--r-md)`, the same fallback already written for
   `@supports not (clip-path: …)`, now triggered by geometry as well as by
   feature support. Reverified: zero overflow, zero clipped content, at 320
   and 375.
4. **Status pulse.** The reference's `animation: pulse 2.4s infinite` is a
   looping ambient animation, which this build treats as an absolute ban
   (enforced everywhere else, including the deck's auto-advance override,
   which still respects it). The dot reveals once with the section and holds
   still; colour plus the words "works offline" carry the reassurance, the
   same job `--signal` does everywhere else on the page.
5. **CTA hover lift.** Dropped, by reusing `Button.astro`'s primary variant
   rather than a bespoke `.cta` class — "no scale, no lift on primary CTAs"
   is a standing rule, and reuse means one button implementation for the
   whole page rather than two.
6. **Serif wordmark.** System stack only (`ui-serif, Georgia, "Times New
   Roman", serif`) — no third self-hosted family. The rest of the page is
   built around a carefully measured ~65 KB font budget; downloading a serif
   for one six-letter word would be a strange place to spend it.
7. **Legal line.** "Built in The Gambia" is a factual-sounding claim
   `CONTEXT.md` does not confirm, the same standard already applied to "Built
   by Pilore Solutions" in step 7 — dropped rather than shipped as fact.
   Terms/Privacy stay off for the same reason as before: no evidence either
   page exists, and a dead legal link is worse than none.
8. **Social icons.** Rendered as inert, focusable, labelled placeholder
   buttons — the same "correct and quiet until wired" pattern already used
   for the header's menu button before it had a real target — rather than
   the reference's bare `href="#"`, which is not a real link and is a
   keyboard-nav dead end. No accounts are confirmed (`CONTEXT.md` §5).
9. **Barcode.** A hand-authored 8-width unit repeated to fill the strip, not
   `Math.random()` per load — the same no-randomised-visuals rule already
   applied to the pinned notes in §03. The server-rendered markup is now
   identical on every request rather than differing on reload.

### Kept exactly as specified

The five-lobe silhouette itself (computed once — `r(θ) = 0.42 + 0.05·cos(5θ)`,
sampled every 5° and baked as a fixed path, not generated at runtime — kept
shallow because the brief's own warning is "if it starts looking like a
splat or a flower, pull the lobes in"), the receipt line-items with dotted
leaders, the dashed total rule, "Say hello 👋" with its one emoji — the sole
deliberate exception to this build's no-emoji rule, scoped to that one line
of copy and not used as an icon anywhere — and the WhatsApp-green glyph,
added as `--whatsapp-green`, documented as a third-party trademark colour
rather than a Contekai design choice.

### A bug an edit introduced and a screenshot caught

Midway through the contrast fixes, the `<Button>` call inside `.total`
disappeared from the file entirely — a casualty of one of the scripted
string replacements matching wider than intended. `astro check` and the
build both stayed green (a missing child element isn't a type error), and it
only surfaced as "Start 7 days free" appearing three times on the page
instead of four when grepping the built HTML, then confirmed visually: the
mobile screenshot showed "GET STARTED" with nothing next to it. Restored and
reverified against the built output, not just re-read in the editor.

### Verification

| | |
|---|---|
| Lighthouse mobile | **99 / 100 / 100 / 100** (three consecutive runs) |
| LCP / CLS / TBT | 1.7 s · **0** · 0 ms |
| Total page weight | 137 KB (+13 KB for the new footer's inline SVGs and CSS) |
| Touch targets | none under 44px at 320, 375, or 1440 |
| Contrast | `color-contrast` audit clean; every text use hand-computed, not eyeballed |
| Panel clip | five-lobe ≥480px, rounded rect below it; zero clipped content at 320/375 |
| Reduced motion | receipt visible immediately, no pulse, no lift |
| JS disabled | receipt fully visible, `clip-path: none` |
| Focus ring | `2px solid var(--kai-400)` on every link, button and social placeholder |
| Landmarks | `<footer role="contentinfo">`, `<nav aria-label="Product">` / `"Company"` |
| Emoji count | 1 (the deliberate exception) |
| `href="#"` count | 0 |
| Terms/Privacy/"Built in…" | absent, per the no-invented-facts rule |

The one point off performance (99, not 100) traces to `speed-index` and
`render-blocking-resources` softening slightly under the extra inline SVG and
CSS weight — CLS, TBT and LCP are all untouched. Not chased further; 99/100
with zero accessibility, best-practices or SEO loss is not a regression worth
trading the redesign for.

### What's still owed on this component

Unchanged from step 7, now scoped to the panel instead of the closing block:
the WhatsApp number (or an email fallback), and confirmed Instagram/TikTok/
Facebook handles if those accounts should be linked. If none of that
lands, the footer still ships correctly — the awaiting-state box and the
inert social placeholders are the honest version of "not yet," not a broken
one.
