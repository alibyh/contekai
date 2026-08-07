/**
 * proof.ts — the testimonial tab pattern.
 *
 * Contract (kit/sections/05-proof.md §Interaction):
 *  - genuinely a tab pattern, so it uses the real one: roving tabindex,
 *    aria-selected, aria-controls, panels labelled by their tab
 *  - click or arrow keys move between shops; Home/End jump to the ends
 *  - the quote crossfades, the thumbnails do not move
 *  - NEVER auto-advance, and no swipe-only interaction
 *  - reduced motion swaps instantly, no crossfade
 *  - with JS off every testimonial is rendered stacked and readable; nothing
 *    here is load-bearing
 *
 * No-ops entirely when there is only one testimonial: the component renders no
 * tablist in that case, because a single tab is a dot.
 */

import { prefersReducedMotion } from "./reveal";

const tablist = document.querySelector<HTMLElement>('#shops [role="tablist"]');

if (tablist) {
  const tabs = [...tablist.querySelectorAll<HTMLButtonElement>("[data-tab]")];
  const panels = [...document.querySelectorAll<HTMLElement>("#shops [data-panel]")];

  function show(index: number, focusTab: boolean): void {
    const current = panels.find((p) => !p.hidden);
    const next = panels[index];

    tabs.forEach((tab, i) => {
      const selected = i === index;
      tab.setAttribute("aria-selected", String(selected));
      // Roving tabindex: exactly one tab is in the tab order at a time.
      tab.tabIndex = selected ? 0 : -1;
    });

    if (focusTab) tabs[index]?.focus();
    if (!next || next === current) return;

    const swap = () => {
      for (const p of panels) p.hidden = p !== next;
      next.classList.remove("is-leaving");
    };

    if (prefersReducedMotion() || !current) {
      swap();
      return;
    }

    // Out at --dur-base-exit, then in. The thumbnails never move.
    current.classList.add("is-leaving");
    current.addEventListener("transitionend", swap, { once: true });
    // Guard: if the transition never fires (element hidden, motion overridden)
    // the panel must still swap rather than stranding the section blank.
    setTimeout(swap, 300);
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => show(i, false));
  });

  tablist.addEventListener("keydown", (e) => {
    const currentIndex = tabs.findIndex((t) => t.getAttribute("aria-selected") === "true");
    const last = tabs.length - 1;
    const moves: Record<string, number> = {
      ArrowRight: currentIndex >= last ? 0 : currentIndex + 1,
      ArrowLeft: currentIndex <= 0 ? last : currentIndex - 1,
      Home: 0,
      End: last,
    };
    const target = moves[e.key];
    if (target === undefined) return;
    e.preventDefault();
    show(target, true);
  });
}
