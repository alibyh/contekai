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
- [x] **Step 2 — Hero.** Not-centred composition, mask-reveal load sequence,
      full-bleed video ground (built from the client's raw clip — see
      "Hero video" below), poster-first loading, save-data gating,
      reduced-motion play control.
- [x] **Step 3 — Capabilities deck.** Rebuilt as a three-up stacked carousel
      per client revision (auto-advance, pause-on-interaction, reduced-motion
      falloff). Every card now dark (`--ink-700`) per the latest tweak.
- [x] **Step 4 — Built for here.** Rebuilt as scattered pinned notes per
      client revision (hand-authored scatter, five-lobe-echo thumbtack,
      squared-off + overlapping per the latest tweak).
- [x] **Step 5 — Pricing.** The receipt: hand-checked maths across every
      location/term combination, real form controls, `aria-live` announcement.
- [x] **Step 6 — Proof.** Reduced/awaiting state — one real name and photo
      (Bubacarr Jaith), no invented quote, no stars.
- [x] **Mobile menu.** Circular-reveal panel ported from `menu_mobile/`,
      wired to the header's menu button, focus-trapped, `inert` when closed.
- [x] **Step 7 — Footer.** Rebuilt end to end against `footerGuide/`: a
      second full-form receipt (torn edges, barcode, dotted-leader nav,
      dashed total row) plus the five-lobe warmth panel.
- [x] **Hero video grade — revisited.** Compared no-blur / light-blur
      (sigma 8) / original heavy-blur (sigma 18). Full removal made faces and
      on-screen text legible and undermined the "shop at dusk" thesis;
      sigma 8 keeps everything abstract while reading with more depth than
      the original. Shipped as the new default; sigma 18 backed up at
      `public/media/_blurred-backup/`.

Every step above is Lighthouse mobile 100/100/100/100 (footer: 99 on
performance only, traced to `speed-index`, not a CLS/TBT/LCP regression) —
see `NOTES.md` for the run-by-run numbers.

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
- [ ] **Real product screenshots.** The capability-deck fragments are still
      built in markup (real product vocabulary, not invented numbers) rather
      than imaged, because 2× screenshots were never supplied. Swap in when
      available.
- [ ] **Logo SVG.** The header/footer mark is still the placeholder five-node
      cluster drawn from the written brand description, not the real asset.
      One note from this session: the hero footage (before blurring)
      contains the real ConteKai lockup at full quality if tracing it is
      useful in the meantime.
- [ ] **OG card.** 1200×630, built from the mark and the night/paper palette
      — omitted rather than pointed at a URL that 404s.
- [ ] **`LocalBusiness` structured data.** Withheld until a real address and
      phone number exist; `SoftwareApplication` ships in the meantime.

---

## Blocked on the client

Nothing invented in place of these — every one ships as a visible awaiting
state or is simply absent, never guessed.

- [ ] **WhatsApp number** (or an email fallback). Highest-priority item —
      flagged repeatedly as the single most valuable missing element on the
      current site. Blocks the footer's contact panel and the closing CTA row.
- [ ] **The 6-month pricing tier's price.** The receipt ships with two terms
      (1 month, 12 months) until this is confirmed.
- [ ] **The multi-location discount rate.** The current site promises one
      and never states it; nothing on the new page claims one either, until
      there's a number to show.
- [ ] **Bubacarr Jaith's quote, business, town, and written permission** —
      his name and photo are real and live; the rest of his testimonial is a
      marked placeholder. Also open: any additional reviewers.
- [ ] **Confirm `/signup` and `/login`** are the real app routes — every CTA
      on the page assumes they are.
- [ ] **Do Privacy and Terms pages exist?** If yes, the footer's legal links
      go back in; if no, they stay absent.
- [ ] **"Built by Pilore Solutions"** — sourced from the current site's own
      footer but unconfirmed, so absent from the new one.
- [ ] **Instagram / TikTok / Facebook handles**, if those accounts should be
      linked from the footer's warmth panel (currently inert, labelled
      placeholders, not `href="#"`).
- [ ] **Real product screenshots** (see above) and the **logo SVG** (see
      above) — repeated here because both also block client-side asset swaps,
      not just polish.
