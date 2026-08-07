/**
 * reveal.ts — the ONE IntersectionObserver for the whole page.
 *
 * Contract (kit/skills/motion/SKILL.md §3 and §4):
 *  - one observer, shared by every [data-reveal] element
 *  - rootMargin "0px 0px -12% 0px", threshold 0.15
 *  - each element is unobserved the moment it fires; reveals happen once and
 *    nothing re-animates on scroll-back
 *  - under prefers-reduced-motion every element is marked in before paint and
 *    the observer is never created
 *
 * Do not add a second observer anywhere in this build. If a section needs to
 * know it is on screen, register it here.
 */

const REVEAL_SELECTOR = "[data-reveal]";
const IN_CLASS = "is-in";

export const prefersReducedMotion = (): boolean =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let observer: IntersectionObserver | null = null;

/** Reveal immediately, without transition. Used for the reduced-motion path. */
function revealAll(elements: Iterable<Element>): void {
  for (const el of elements) el.classList.add(IN_CLASS);
}

function getObserver(): IntersectionObserver {
  observer ??= new IntersectionObserver(
    (entries, obs) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add(IN_CLASS);
        obs.unobserve(entry.target); // fires once, never again
      }
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.15 },
  );
  return observer;
}

/**
 * Observe a set of elements. Safe to call more than once; elements already
 * marked `.is-in` are skipped.
 */
export function observe(elements: Iterable<Element>): void {
  if (prefersReducedMotion()) {
    revealAll(elements);
    return;
  }
  const io = getObserver();
  for (const el of elements) {
    if (el.classList.contains(IN_CLASS)) continue;
    io.observe(el);
  }
}

export function initReveal(root: ParentNode = document): void {
  observe(root.querySelectorAll(REVEAL_SELECTOR));
}

initReveal();
