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

/**
 * Header ground switching — the thing Header.astro's docblock has promised
 * since step 1 and nothing ever built.
 *
 * The header follows whatever section is passing underneath it, so a solid
 * paper bar sits over the paper hero and a solid ink bar sits over the dark
 * sections. Solid either way: no backdrop-filter, per the design system and
 * per the hero brief's own "avoid glassmorphism".
 *
 * It lives HERE, not in Header.astro, because the motion skill §5 says there is
 * one place observers are allowed to be registered and this is it. It is a
 * second IntersectionObserver instance but not a second home for them, which is
 * what that rule is actually protecting.
 */
function initHeaderGround(): void {
  const header = document.querySelector<HTMLElement>(".header");
  if (!header) return;

  const sections = [
    ...document.querySelectorAll<HTMLElement>("[data-ground]"),
  ].filter((el) => el !== header);
  if (sections.length === 0) return;

  let io: IntersectionObserver | null = null;

  /* A 1px-tall band pinned just under the header. Whichever section is
     crossing that line owns the header's ground. Rebuilt on resize because the
     band is expressed in pixels against the viewport, and a rotated phone
     would otherwise leave it measuring the wrong line. */
  const build = (): void => {
    io?.disconnect();
    const h = Math.round(header.getBoundingClientRect().height) || 72;
    const below = Math.max(0, window.innerHeight - h - 1);
    io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const ground = (entry.target as HTMLElement).dataset.ground;
          if (ground) header.dataset.ground = ground;
        }
      },
      { rootMargin: `-${h}px 0px -${below}px 0px`, threshold: 0 },
    );
    for (const section of sections) io.observe(section);
  };

  build();

  let resizeTimer = 0;
  window.addEventListener(
    "resize",
    () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(build, 150);
    },
    { passive: true },
  );
}

initReveal();
initHeaderGround();
