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
