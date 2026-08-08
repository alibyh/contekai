/**
 * menu.ts — opens and closes the circular-reveal menu.
 *
 * Ported from the client's React component. The behaviour it kept: toggle,
 * Escape to close, scroll lock, and doing nothing expensive while animating.
 *
 * The behaviour it gained, because the original was a visual component and this
 * has to be a navigation control:
 *  - focus moves to the first link on open and returns to the button on close,
 *    so a keyboard user is not left behind in the page underneath
 *  - focus is trapped while open: Tab cycles inside the panel
 *  - the panel is `inert` when closed, so nothing inside is tabbable or
 *    clickable and screen readers skip it entirely
 *  - clicking a link closes the menu, because every link is an in-page anchor
 *    and the panel would otherwise cover the section it just jumped to
 *
 * The button is inert-by-design no more: this is what wires it up.
 */

const button = document.querySelector<HTMLButtonElement>(".menu-btn");
const menu = document.querySelector<HTMLElement>("[data-menu]");

/**
 * The lockup flies out of the header and lands centred and larger above the nav
 * list. This measures that trip and hands CSS three numbers; the transition
 * itself is CSS, on transform, in Header.astro.
 *
 * Measured rather than computed, because where the landing slot sits depends on
 * how tall the panel's own content is — no CSS expression can know that. The
 * slot is an empty reserved box in the panel, so the mark that travels is the
 * REAL one out of the header rather than a second copy: one element, one
 * accessible name, nothing to keep in sync.
 *
 * Called before the open class goes on, so the properties are already in place
 * when the rule starts matching and the transition runs from the real starting
 * position. Closing needs no counterpart — the rule stops matching, the
 * transform reverts to none, and the same transition carries it home.
 *
 * The lockup's transform-origin is `0 50%`, so translate moves its left edge
 * and vertical centre and scale grows from that same point. That is what keeps
 * this to one subtraction per axis instead of a correction term.
 */
function measureBrandFlight(panel: HTMLElement, lockup: HTMLElement): void {
  const slot = panel.querySelector<HTMLElement>(".menu__brandslot");
  if (!slot) return;

  const scale =
    parseFloat(getComputedStyle(panel).getPropertyValue("--menu-brand-scale")) ||
    1;

  const from = lockup.getBoundingClientRect();
  const to = slot.getBoundingClientRect();
  if (from.width === 0 || to.width === 0) return;

  const style = document.documentElement.style;
  /* Centre the SCALED width on the slot, not the original width. */
  style.setProperty(
    "--brand-dx",
    `${to.left + to.width / 2 - (from.width * scale) / 2 - from.left}px`,
  );
  style.setProperty(
    "--brand-dy",
    `${to.top + to.height / 2 - (from.top + from.height / 2)}px`,
  );
  style.setProperty("--brand-scale", String(scale));
}

if (button && menu) {
  const lockup = document.querySelector<HTMLElement>(".lockup");

  const focusables = () =>
    [...menu.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")].filter(
      (el) => el.offsetParent !== null || el.getClientRects().length > 0,
    );

  let open = false;

  /**
   * `restoreFocus` is false when a link closed the menu: the browser is about
   * to move focus to the anchor target, and yanking it back to the button
   * would drop the reader at the top of the page they just navigated away
   * from. It is true for Escape and for the button itself, where returning
   * focus is the whole point.
   */
  function setOpen(next: boolean, restoreFocus = true): void {
    if (next === open) return;
    open = next;

    /* Before the class, so the distances exist by the time the rule matches.
       Re-measured on every open rather than cached: the panel's content height
       — and so the slot's position — moves with the viewport. */
    if (open && lockup) measureBrandFlight(menu!, lockup);

    /* While it is a brand mark it is not a link. Pointer events are already off
       in CSS; this is the keyboard half of the same statement. */
    if (lockup) {
      if (open) lockup.setAttribute("tabindex", "-1");
      else lockup.removeAttribute("tabindex");
    }

    menu!.classList.toggle("is-open", open);
    button!.classList.toggle("is-open", open);
    button!.setAttribute("aria-expanded", String(open));
    button!.setAttribute("aria-label", open ? "Close menu" : "Open menu");

    if (open) menu!.removeAttribute("inert");
    else menu!.setAttribute("inert", "");

    // Scroll lock. The page behind must not move while the panel is over it.
    document.documentElement.style.overflow = open ? "hidden" : "";

    if (open) focusables()[0]?.focus();
    else if (restoreFocus) button!.focus();
  }

  button.addEventListener("click", () => setOpen(!open));

  // Every link is an in-page anchor, so the panel has to get out of the way.
  for (const link of menu.querySelectorAll("[data-menu-link]")) {
    link.addEventListener("click", () => setOpen(false, false));
  }

  addEventListener("keydown", (e) => {
    if (!open) return;

    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      return;
    }

    if (e.key !== "Tab") return;

    // Trap. Without this, Tab walks out of the panel into the page beneath it,
    // which is still rendered and still focusable.
    const items = focusables();
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;

    if (e.shiftKey && active === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  });

  // A resize that changes layout while the panel is open leaves the bubble
  // anchored to the wrong corner; closing is the honest response.
  addEventListener("resize", () => {
    if (open) setOpen(false);
  });
}
