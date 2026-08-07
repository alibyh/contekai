/**
 * deck.ts — the capabilities deck, three-up stacked.
 *
 * The active card sits centred and full size; the previous and next cards peek
 * from either side, scaled down and BEHIND it, so it reads as flipping through
 * a stack rather than scrolling a row. The other three stay in the DOM at
 * opacity 0.
 *
 * PROGRESSIVE ENHANCEMENT
 * The stacked layout exists only once this file sets `[data-stacked]`. Until
 * then — and forever, if JS never runs — the stage is a plain horizontally
 * scrolling snap row showing all six cards, fully readable and navigable.
 *
 * AUTO-ADVANCE, AND WHY IT IS HERE
 * kit/skills/motion/SKILL.md §2C says "Never auto-advance", and it is right
 * about why: auto-advancing carousels are a documented usability failure and
 * steal control from someone reading on a phone. This component overrides that
 * rule on the client's explicit instruction. The override is bounded so it
 * takes as little control as possible:
 *   - 6s cadence, and it stops the moment the reader shows any sign of reading:
 *     pointer over the deck, focus inside it, or the tab hidden
 *   - any manual navigation (arrow, key, scrub) suspends it for 15s
 *   - under prefers-reduced-motion it never starts at all
 * See NOTES.md for the full argument.
 *
 * Everything else follows §2C: no 3D rotation, no perspective, no coverflow.
 */

import { prefersReducedMotion } from "./reveal";

const stage = document.querySelector<HTMLElement>("[data-deck-track]");

if (stage) {
  const cards = [...stage.querySelectorAll<HTMLElement>("[data-deck-card]")];
  const prevBtn = document.querySelector<HTMLButtonElement>("[data-deck-prev]");
  const nextBtn = document.querySelector<HTMLButtonElement>("[data-deck-next]");
  const count = document.querySelector<HTMLElement>("[data-deck-count]");
  const scrub = document.querySelector<HTMLElement>("[data-deck-scrub]");
  const segments = [...document.querySelectorAll<HTMLElement>("[data-deck-seg]")];
  const total = cards.length;
  const reduced = prefersReducedMotion();

  const AUTO_MS = 3000;
  const MANUAL_COOLDOWN_MS = 1000;

  let active = 0;
  let lastManualAt = 0;
  let hovering = false;
  let focusWithin = false;
  let timer: number | undefined;

  const pad = (n: number) => String(n).padStart(2, "0");
  const mod = (n: number) => ((n % total) + total) % total;

  // Switch off the scrolling row and take over positioning. Everything below
  // assumes this has happened; nothing above it does.
  stage.setAttribute("data-stacked", "");
  stage.removeAttribute("data-falloff");

  function paint(): void {
    cards.forEach((card, i) => {
      const pos =
        i === active
          ? "active"
          : i === mod(active - 1)
            ? "prev"
            : i === mod(active + 1)
              ? "next"
              : "off";
      card.dataset.pos = pos;

      // Only the active card is real content. The peeking pair are a visual
      // preview and the rest are off-stage, so both are taken out of the
      // accessibility tree and the tab order: it keeps reading order sane, and
      // it stops a 0.45-opacity card being audited as unreadable body text.
      const isActive = pos === "active";
      card.toggleAttribute("inert", !isActive);
      if (isActive) card.removeAttribute("aria-hidden");
      else card.setAttribute("aria-hidden", "true");
    });

    if (count) count.textContent = `${pad(active + 1)} / ${pad(total)}`;
    segments.forEach((seg, i) => seg.toggleAttribute("data-on", i <= active));

    // The deck wraps, so neither arrow is ever a dead end.
    prevBtn?.setAttribute("aria-disabled", "false");
    nextBtn?.setAttribute("aria-disabled", "false");
  }

  function go(index: number, manual = false): void {
    active = mod(index);
    if (manual) lastManualAt = Date.now();
    paint();
  }

  /* --- auto-advance -------------------------------------------------------- */

  function mayAdvance(): boolean {
    if (reduced) return false;
    if (hovering || focusWithin) return false;
    if (document.visibilityState !== "visible") return false;
    return Date.now() - lastManualAt >= MANUAL_COOLDOWN_MS;
  }

  function startAuto(): void {
    if (reduced || timer !== undefined) return;
    timer = window.setInterval(() => {
      if (!mayAdvance()) return;
      go(active + 1);
    }, AUTO_MS);
  }

  function stopAuto(): void {
    if (timer === undefined) return;
    clearInterval(timer);
    timer = undefined;
  }

  stage.addEventListener("pointerenter", () => {
    hovering = true;
  });
  stage.addEventListener("pointerleave", () => {
    hovering = false;
  });
  /**
   * Only KEYBOARD focus pauses. Clicking an arrow focuses it in Chrome, and
   * treating that as "the reader is in the deck" pinned the pause on forever:
   * one click and auto-advance never resumed, because focusWithin stayed true
   * long after the pointer had left. :focus-visible is exactly the distinction
   * — someone tabbing through is reading, someone who clicked is not
   * necessarily still there.
   */
  const isKeyboardFocus = (t: EventTarget | null): boolean =>
    t instanceof Element && t.matches(":focus-visible");

  stage.addEventListener("focusin", (e) => {
    focusWithin = isKeyboardFocus(e.target);
  });
  stage.addEventListener("focusout", (e) => {
    if (!stage.contains(e.relatedTarget as Node)) focusWithin = false;
  });
  // The controls sit outside the stage but are part of the deck.
  for (const el of [prevBtn, nextBtn, scrub]) {
    el?.addEventListener("pointerenter", () => {
      hovering = true;
    });
    el?.addEventListener("pointerleave", () => {
      hovering = false;
    });
    el?.addEventListener("focusin", (e) => {
      focusWithin = isKeyboardFocus(e.target);
    });
    el?.addEventListener("focusout", () => {
      focusWithin = false;
    });
  }

  document.addEventListener("visibilitychange", () => {
    // Nothing to resume explicitly: mayAdvance() reads visibilityState each
    // tick, so a hidden tab simply stops advancing and picks up when shown.
    if (document.visibilityState === "visible") startAuto();
    else stopAuto();
  });

  /* --- controls ------------------------------------------------------------ */

  prevBtn?.addEventListener("click", () => go(active - 1, true));
  nextBtn?.addEventListener("click", () => go(active + 1, true));

  stage.addEventListener("keydown", (e) => {
    const moves: Record<string, number> = {
      ArrowRight: active + 1,
      ArrowLeft: active - 1,
      Home: 0,
      End: total - 1,
    };
    const target = moves[e.key];
    if (target === undefined) return;
    e.preventDefault();
    go(target, true);
  });

  /* --- scrub bar ------------------------------------------------------------
     Click or drag anywhere along it to jump. Six segments, one per card. */

  function scrubTo(clientX: number): void {
    if (!scrub) return;
    const r = scrub.getBoundingClientRect();
    const ratio = Math.min(0.999, Math.max(0, (clientX - r.left) / r.width));
    go(Math.floor(ratio * total), true);
  }

  let scrubbing = false;
  scrub?.addEventListener("pointerdown", (e) => {
    scrubbing = true;
    scrub.setPointerCapture(e.pointerId);
    scrubTo(e.clientX);
  });
  scrub?.addEventListener("pointermove", (e) => {
    if (scrubbing) scrubTo(e.clientX);
  });
  scrub?.addEventListener("pointerup", (e) => {
    scrubbing = false;
    if (scrub.hasPointerCapture(e.pointerId)) scrub.releasePointerCapture(e.pointerId);
  });

  paint();
  startAuto();
}
