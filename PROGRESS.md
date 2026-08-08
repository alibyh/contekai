# PROGRESS — Contekai marketing site

A running to-do list. Full reasoning, measurements and self-critique for
everything below live in `NOTES.md`; this file is the checklist version.
Last updated after the footer rebuild against `footerGuide/`.

---

## Done

- [x] **Step 0 — Scaffold.** Astro 5, plain CSS tokens, self-hosted fonts
      (65 KB, under the 80 KB budget), `tokens.css` transcribed with the
      tripwire removed, single `[data-section]` padding rule, shell
      components stubbed.
- [x] **Step 1 — Shell.** Header, till-rail, skip link, ground-switching
      attributes wired.
- [x] **Step 2 — Hero. Redesigned as a horizon** (third pass; the second kept
      the old left/right layout and only swapped its contents, which the client
      correctly rejected as a substitution rather than a redesign). No
      left/right split at any width: night above, a lit counter band below,
      full bleed, square corners, anchored to the bottom of the screen. The
      power cut darkens the room and leaves the counter lit — enforced by the
      DOM, since the darkening layer is the band's sibling. Built mobile-first:
      the total sits above the items because the band runs past a phone's fold
      and the total is what the cut moves. Headline break also fixed on phones
      (it had been orphaning "lights" since the first build).
- [x] **Step 3 — Capabilities deck.** Rebuilt as a three-up stacked carousel
      per client revision (auto-advance, pause-on-interaction, reduced-motion
      falloff). Every card now dark (`--ink-700`) per the latest tweak.
- [x] **Step 4 — Built for here.** Rebuilt as scattered pinned notes per
      client revision (hand-authored scatter, five-lobe-echo thumbtack,
      squared-off + overlapping per the latest tweak).
- [x] **Step 5 — Pricing.** The receipt: hand-checked maths across every
      location/term combination, real form controls, `aria-live` announcement.
- [x] **Step 6 — Proof.** Real testimonial, supplied by the client: quote,
      name, role and business from Bubacarr Jaiteh, Founder of Kerr Finder.
      No stars. Tablet/desktop composition added.
- [x] **Mobile menu.** Circular-reveal panel ported from `menu_mobile/`,
      wired to the header's menu button, focus-trapped, `inert` when closed.
- [x] **Step 7 — Footer.** Rebuilt end to end against `footerGuide/`: a
      second full-form receipt (torn edges, barcode, dotted-leader nav,
      dashed total row) plus the five-lobe warmth panel.
- [x] **Footer — real contact and socials.** WhatsApp +220 3256493 live;
      Instagram and TikTok wired to the supplied links with the real
      `iconsSvg/` badges; LinkedIn an inert placeholder until a handle exists;
      full-width desktop grid so the receipt expands instead of sitting at a
      fixed 460px.
- [x] **Hero video — retired.** Three grade passes (sigma 18 → none → sigma 8)
      were all tuning the wrong axis; the client disliking it twice was the
      signal to stop grading and start over. Derived assets and the scrim
      tokens are deleted; `hero_vid.MOV` and `scripts/build-hero-video.sh`
      stay, so footage is one command away if a purpose-shot clip lands.
      See `public/media/README.md`.

Every step above is Lighthouse mobile ≥ 99 / 100 / 100 / 100 — see `NOTES.md`
for the run-by-run numbers. Whole page is now 99 KB with CLS 0.

---

## To do

- [ ] **Step 8 — Whole-page pass.** Not started. Per `ORDER.md`:
  - [ ] Read the assembled page top to bottom at 375px as a first-time
        visitor; note where attention drops.
  - [ ] Run the full `quality-gate` audit against the *assembled* page, not
        section by section.
  - [ ] Rhythm check: confirm no two adjacent sections share the same shape
        and padding (spot-check against `PLAN.md` §5).
  - [ ] Remove one thing from the page — "there is always one."
  - [ ] Lighthouse on the throttled profile, axe-clean, full keyboard path
        end to end, on the final assembled build (not per-section builds).
  - [ ] Verify with JS disabled *and* reduced motion together, not just
        separately, across the whole page.
- [ ] **Step 9 — Handover.** Not started. `HANDOVER.md`: token map, asset
      inventory (what's still placeholder), the full open `[VERIFY]` list,
      known trade-offs, and how to add a section without breaking rhythm.
- [ ] **Real product screenshots.** Now blocking two places, not one: the
      capability-deck fragments *and* the hero till's line items are both
      built in markup (real product vocabulary, not invented numbers) rather
      than imaged, because 2× screenshots were never supplied. Swap in when
      available.
- [ ] **Logo SVG.** The header/footer mark is still the placeholder five-node
      cluster drawn from the written brand description, not the real asset.
      One note worth keeping: `hero_vid.MOV` has the real ConteKai lockup
      burned into every frame at full quality, so it is traceable from there
      in the meantime even though the video no longer ships.
- [ ] **OG card.** 1200×630, built from the mark and the night/paper palette
      — omitted rather than pointed at a URL that 404s.
- [ ] **`LocalBusiness` structured data.** Withheld until a real address and
      phone number exist; `SoftwareApplication` ships in the meantime.

---

## Blocked on the client

Nothing invented in place of these — every one ships as a visible awaiting
state or is simply absent, never guessed.

- [ ] **The 6-month pricing tier's price.** The receipt ships with two terms
      (1 month, 12 months) until this is confirmed.
- [ ] **The multi-location discount rate.** The current site promises one
      and never states it; nothing on the new page claims one either, until
      there's a number to show.
- [ ] **Bubacarr Jaiteh's town, and written permission** to use the quote and
      photo. Quote, name, role and business are all supplied and live; town is
      the one field the section spec names that is still missing, and it is not
      treated as a blocker (see `NOTES.md`). Also open: any additional
      reviewers.
- [ ] **Confirm `/signup` and `/login`** are the real app routes — every CTA
      on the page assumes they are.
- [ ] **Do Privacy and Terms pages exist?** If yes, the footer's legal links
      go back in; if no, they stay absent.
- [ ] **"Built by Pilore Solutions"** — sourced from the current site's own
      footer but unconfirmed, so absent from the new one.
- [ ] **LinkedIn handle.** Instagram and TikTok are live with the client's own
      links and badges; Facebook was dropped (never in the supplied list).
      LinkedIn is an inert labelled placeholder, not `href="#"`, until there is
      a URL for it.
- [ ] **A purpose-shot hero video**, if the client still wants footage on the
      page. 9:16, a real counter at dusk, no watermark, no burned-in captions,
      no audio. Not blocking anything — the hero is finished without it — and
      putting one back is a design pass, not a config flip.
- [ ] **Real product screenshots** (see above) and the **logo SVG** (see
      above) — repeated here because both also block client-side asset swaps,
      not just polish.
