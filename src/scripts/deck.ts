/**
 * deck.ts — the capabilities card deck.
 *
 * Contract (kit/skills/motion/SKILL.md §2C, kit/sections/02-capabilities.md):
 *  - snapping is CSS (`scroll-snap-type: x mandatory`). JS never scroll-jacks.
 *  - JS wires only the arrows, the counter, the scrub bar and the active index
 *  - adjacent cards sit at opacity .55 / scale(.97); the active card at 1.
 *    That is the entire effect: no 3D, no perspective, no coverflow.
 *  - NEVER auto-advance
 *  - with JS off the track is a plain horizontally scrollable snapping row and
 *    every card is fully readable, so nothing here is load-bearing
 *  - `will-change: transform` goes on the track only while dragging, then off
 */

import { prefersReducedMotion } from "./reveal";

const track = document.querySelector<HTMLElement>("[data-deck-track]");

if (track) {
  const cards = [...track.querySelectorAll<HTMLElement>("[data-deck-card]")];
  const prev = document.querySelector<HTMLButtonElement>("[data-deck-prev]");
  const next = document.querySelector<HTMLButtonElement>("[data-deck-next]");
  const count = document.querySelector<HTMLElement>("[data-deck-count]");
  const scrub = document.querySelector<HTMLElement>("[data-deck-scrub]");
  const scrubFill = document.querySelector<HTMLElement>("[data-deck-scrub-fill]");
  const total = cards.length;

  const pad = (n: number) => String(n).padStart(2, "0");
  const maxScroll = () => Math.max(1, track.scrollWidth - track.clientWidth);
  const step = () =>
    cards.length > 1
      ? cards[1].offsetLeft - cards[0].offsetLeft
      : track.clientWidth;

  // -1 rather than 0, so the first render actually applies [data-active].
  // Starting at 0 made render() early-return on its own first call, which left
  // every card without the attribute and therefore dimmed by the falloff rule.
  let active = -1;

  /** Index of the card nearest the track's left edge, measured visually. */
  function nearestIndex(): number {
    const left = track!.getBoundingClientRect().left;
    let best = 0;
    let bestDist = Infinity;
    cards.forEach((card, i) => {
      const d = Math.abs(card.getBoundingClientRect().left - left);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    return best;
  }

  function render(): void {
    const max = maxScroll();

    // Ends are measured from the cards, not from scrollLeft. With
    // `scroll-snap-type: mandatory` the browser settles on the last card's
    // snap point, which sits short of true max scroll by the track's trailing
    // padding — so `scrollLeft >= max` is never reached and the Next arrow
    // would never disable. "The last card is fully in view" is both robust and
    // what the control actually means.
    const trackRect = track!.getBoundingClientRect();
    const atStart = cards[0].getBoundingClientRect().left >= trackRect.left - 2;
    const atEnd =
      cards[total - 1].getBoundingClientRect().right <= trackRect.right + 2;

    const progress = atEnd ? 1 : Math.min(1, Math.max(0, track!.scrollLeft / max));
    if (scrubFill) scrubFill.style.inlineSize = `${progress * 100}%`;

    prev?.setAttribute("aria-disabled", String(atStart));
    next?.setAttribute("aria-disabled", String(atEnd));

    // The counter names the card at the left edge. At the extremes that is
    // clamped to the first and last card: with 3.2 cards visible the leftmost
    // at max scroll is card 3, and reporting "03 / 06" when you have reached
    // the end reads as broken even though it is literally true.
    const i = atEnd ? total - 1 : atStart ? 0 : nearestIndex();
    if (i === active) return;
    active = i;
    if (count) count.textContent = `${pad(i + 1)} / ${pad(total)}`;
    cards.forEach((c, n) => c.toggleAttribute("data-active", n === i));
  }

  // The falloff is opt-in via an attribute so the CSS cannot dim cards before
  // JS has decided which one is active, and stays off entirely for reduced
  // motion (where the deck still snaps and still scrolls — only the falloff
  // goes).
  if (!prefersReducedMotion()) track.setAttribute("data-falloff", "");

  track.addEventListener("scroll", () => requestAnimationFrame(render), {
    passive: true,
  });
  addEventListener("resize", render, { passive: true });

  function scrollByCards(dir: 1 | -1): void {
    track!.scrollBy({
      left: dir * step(),
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }

  prev?.addEventListener("click", () => scrollByCards(-1));
  next?.addEventListener("click", () => scrollByCards(1));

  // Keyboard. Left/Right move one card, Home/End jump to the ends.
  track.addEventListener("keydown", (e) => {
    const keys: Record<string, () => void> = {
      ArrowRight: () => scrollByCards(1),
      ArrowLeft: () => scrollByCards(-1),
      Home: () => track!.scrollTo({ left: 0, behavior: "smooth" }),
      End: () => track!.scrollTo({ left: maxScroll(), behavior: "smooth" }),
    };
    const fn = keys[e.key];
    if (!fn) return;
    e.preventDefault();
    fn();
  });

  // Focusing anything inside an off-screen card must bring it into view.
  track.addEventListener("focusin", (e) => {
    const card = (e.target as HTMLElement).closest<HTMLElement>("[data-deck-card]");
    card?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
  });

  /* --- pointer drag ---------------------------------------------------------
     Desktop affordance only. Touch keeps native scrolling: intercepting it is
     how carousels end up trapping vertical scroll on a phone. */
  let dragging = false;
  let startX = 0;
  let startScroll = 0;

  track.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "touch") return;
    dragging = true;
    startX = e.clientX;
    startScroll = track.scrollLeft;
    track.setPointerCapture(e.pointerId);
    track.style.willChange = "scroll-position";
    track.style.cursor = "grabbing";
    track.style.scrollSnapType = "none";
  });

  track.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    track.scrollLeft = startScroll - (e.clientX - startX);
  });

  function endDrag(e: PointerEvent): void {
    if (!dragging) return;
    dragging = false;
    if (track!.hasPointerCapture(e.pointerId)) track!.releasePointerCapture(e.pointerId);
    track!.style.willChange = "";
    track!.style.cursor = "";
    // Restoring snap lets the browser settle on the nearest card itself.
    track!.style.scrollSnapType = "";
  }

  track.addEventListener("pointerup", endDrag);
  track.addEventListener("pointercancel", endDrag);

  /* --- scrub bar ------------------------------------------------------------
     Also a drag target, per the section spec. */
  function scrubTo(clientX: number): void {
    if (!scrub) return;
    const r = scrub.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    track!.scrollTo({ left: ratio * maxScroll(), behavior: "auto" });
  }

  let scrubbing = false;
  scrub?.addEventListener("pointerdown", (e) => {
    scrubbing = true;
    scrub.setPointerCapture(e.pointerId);
    track.style.scrollSnapType = "none";
    scrubTo(e.clientX);
  });
  scrub?.addEventListener("pointermove", (e) => scrubbing && scrubTo(e.clientX));
  scrub?.addEventListener("pointerup", (e) => {
    scrubbing = false;
    if (scrub.hasPointerCapture(e.pointerId)) scrub.releasePointerCapture(e.pointerId);
    track.style.scrollSnapType = "";
  });

  render();
}
