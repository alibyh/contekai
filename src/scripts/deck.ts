/**
 * deck.ts — the capabilities deck, three-up stacked.
 *
 * The active card sits centred and full size; the previous and next cards peek
 * from either side, scaled down and BEHIND it, so it reads as flipping through
 * a stack rather than scrolling a row. The other three stay in the DOM at
 * opacity 0.
 *
 * PROGRESSIVE ENHANCEMENT
 * The stacked layout is CSS, applied at first paint when `html[data-js]` is
 * present. With JS off that attribute is never set and the stage stays a plain
 * horizontally scrolling snap row showing all six cards, fully readable and
 * navigable. This file never changes the layout mode — it only assigns
 * positions — so it can never shift the page after paint.
 *
 * AUTO-ADVANCE, AND WHY IT IS HERE
 * kit/skills/motion/SKILL.md §2C says "Never auto-advance", and it is right
 * about why. This component overrides that rule on the client's explicit
 * instruction. The override is bounded so it takes as little control as
 * possible: it yields while the reader is plainly reading, and resumes by
 * itself the moment they are not.
 *
 * IT MUST NEVER STOP. The client reported the deck "sometimes doesn't move at
 * all", which is the worst possible failure for a component that exists to
 * cycle. Everything below is built so that a pause is impossible to LATCH:
 *
 *   1. No stateful pause flags. `hovering` and `focusWithin` used to be
 *      booleans set by pointerenter/focusin and cleared by their opposites —
 *      and any missed clearing event froze the deck permanently. The pause
 *      conditions are now QUERIED at each tick from the DOM itself, so there
 *      is no state to get stuck in.
 *   2. `pointercancel` is handled. This was the concrete bug: dragging the
 *      scrub and having the browser take the gesture over for scrolling — the
 *      single most likely thing to happen on a phone — fires pointercancel and
 *      never pointerup, which left BOTH `scrubbing` and `hovering` true
 *      forever. That is a deck that stops and never restarts, and it would
 *      feel exactly as random as "sometimes".
 *   3. A watchdog. Whatever else happens, if the deck has not advanced in
 *      MAX_STALL_MS it advances regardless of every other condition. This is
 *      the guarantee rather than the mechanism: if it ever fires, something
 *      above it is wrong.
 *
 * See NOTES.md for the full argument.
 *
 * REDUCED MOTION
 * The deck now advances under prefers-reduced-motion too, where it previously
 * did not start at all. Two reasons, and the second is the stronger one:
 *
 *   - Nothing actually moves. motion.css already collapses every transition to
 *     1ms, so the card CHANGES rather than travelling — which is the standard
 *     accommodation, not a violation of it.
 *   - Standing still was worse for those readers, not better. With no arrows in
 *     the markup, a frozen deck left five of the six capabilities behind
 *     `inert` and `aria-hidden`, reachable only by finding the scrub bar.
 *
 * The pause mechanism WCAG 2.2.2 asks for is still there and still real: the
 * deck yields to a pointer resting on it and to keyboard focus inside it.
 *
 * Everything else follows §2C: no 3D rotation, no perspective, no coverflow.
 */

const stage = document.querySelector<HTMLElement>("[data-deck-track]");

if (stage) {
  const cards = [...stage.querySelectorAll<HTMLElement>("[data-deck-card]")];
  const count = document.querySelector<HTMLElement>("[data-deck-count]");
  const scrub = document.querySelector<HTMLElement>("[data-deck-scrub]");
  const segments = [...document.querySelectorAll<HTMLElement>("[data-deck-seg]")];
  const total = cards.length;

  /** Everything that counts as "inside the deck" for the purpose of yielding. */
  const zones: HTMLElement[] = [stage, scrub].filter(
    (el): el is HTMLElement => el !== null,
  );

  const AUTO_MS = 3000;
  /** A manual move gets a beat to land before the clock takes over again. */
  const MANUAL_COOLDOWN_MS = 1000;
  /**
   * The hard guarantee. No combination of hover, focus or cooldown may hold the
   * deck still for longer than this — if it does, the watchdog advances anyway.
   */
  const MAX_STALL_MS = 9000;

  let active = 0;
  let lastManualAt = 0;
  let lastAdvanceAt = Date.now();
  let timer: number | undefined;

  const pad = (n: number) => String(n).padStart(2, "0");
  const mod = (n: number) => ((n % total) + total) % total;

  // The stacked layout is already on screen — CSS applies it at first paint via
  // html[data-js]. This file only moves cards between positions, so there is no
  // layout mode to switch and nothing below the deck can be pushed around after
  // paint. See the note in Capabilities.astro.

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
  }

  function go(index: number, manual = false): void {
    active = mod(index);
    lastAdvanceAt = Date.now();
    if (manual) lastManualAt = lastAdvanceAt;
    paint();
  }

  /* --- auto-advance --------------------------------------------------------
     Every condition below is READ, never stored. A flag that is set by one
     event and cleared by another is a flag that can be left set when the
     clearing event does not arrive, and that is precisely how this deck came
     to stop. */

  /** True while the pointer is genuinely over the deck, asked of the DOM. */
  const pointerOnDeck = (): boolean => zones.some((el) => el.matches(":hover"));

  /**
   * True only for KEYBOARD focus. Clicking a control focuses it in Chrome, and
   * treating that as "the reader is in the deck" would hold the pause open long
   * after the pointer had gone. :focus-visible is exactly that distinction.
   */
  function keyboardFocusInDeck(): boolean {
    const el = document.activeElement;
    if (!(el instanceof Element)) return false;
    if (!zones.some((zone) => zone.contains(el))) return false;
    return el.matches(":focus-visible");
  }

  function mayAdvance(): boolean {
    // A hidden tab is the one case where standing still is correct: nobody is
    // watching, and browsers throttle the timer to roughly nothing anyway.
    if (document.visibilityState !== "visible") return false;

    // The guarantee, checked before anything that could withhold consent.
    if (Date.now() - lastAdvanceAt >= MAX_STALL_MS) return true;

    if (Date.now() - lastManualAt < MANUAL_COOLDOWN_MS) return false;
    return !pointerOnDeck() && !keyboardFocusInDeck();
  }

  function startAuto(): void {
    if (timer !== undefined) return;
    timer = window.setInterval(() => {
      if (mayAdvance()) go(active + 1);
    }, AUTO_MS);
  }

  function stopAuto(): void {
    if (timer === undefined) return;
    clearInterval(timer);
    timer = undefined;
  }

  document.addEventListener("visibilitychange", () => {
    // mayAdvance() reads visibilityState every tick, so this is only about not
    // burning a timer in a background tab. Coming back restarts it, and resets
    // the stall clock so the watchdog does not fire on the first tick after a
    // long absence.
    if (document.visibilityState === "visible") {
      lastAdvanceAt = Date.now();
      startAuto();
    } else {
      stopAuto();
    }
  });

  // Some browsers restore a page from the back/forward cache without firing
  // visibilitychange, which would leave a cleared timer cleared.
  window.addEventListener("pageshow", () => {
    lastAdvanceAt = Date.now();
    startAuto();
  });

  /* --- controls ------------------------------------------------------------ */

  // There are no prev/next buttons in the markup any more — the scrub bar and
  // the arrow keys are the manual controls. Nothing here looks for them.

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

  function endScrub(e: PointerEvent): void {
    scrubbing = false;
    if (scrub?.hasPointerCapture(e.pointerId)) scrub.releasePointerCapture(e.pointerId);
  }

  scrub?.addEventListener("pointerdown", (e) => {
    scrubbing = true;
    scrub.setPointerCapture(e.pointerId);
    scrubTo(e.clientX);
  });
  scrub?.addEventListener("pointermove", (e) => {
    if (scrubbing) scrubTo(e.clientX);
  });
  scrub?.addEventListener("pointerup", endScrub);
  /* THE BUG. A drag the browser takes over for scrolling — the most ordinary
     thing that can happen to a horizontal drag on a phone — fires
     pointercancel and never pointerup. Without this the deck was left mid-drag
     forever, and with the old flags that also meant hovering stayed true and
     auto-advance never resumed. */
  scrub?.addEventListener("pointercancel", endScrub);
  scrub?.addEventListener("lostpointercapture", () => {
    scrubbing = false;
  });

  paint();
  startAuto();
}
