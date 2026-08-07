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
