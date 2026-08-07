/**
 * pricing.ts — the locations stepper and the receipt tally.
 *
 * Contract (kit/skills/motion/SKILL.md §2B, kit/sections/04-pricing.md):
 *  - the stepper is +/- buttons AND a real <input type="number">; both work
 *  - totals use tabular-nums and never jitter
 *  - the changed LINE flashes once at 8% --laterite; the total never flashes,
 *    it just changes
 *  - on first scroll into view the total counts once from 0, then never again
 *  - the computed region is announced via aria-live as one sentence
 *  - under prefers-reduced-motion the final value renders immediately
 *
 * The maths is the whole justification for the receipt existing, so it is kept
 * in one place and expressed the way the price list states it:
 *
 *   monthly rate      D 1,500 per location per month   (CONTEXT.md §4)
 *   1 month           1,500 x L
 *   12 months         list 18,000 x L, less 10%, = 16,200 x L
 *   per location/mo   total / L / months
 *
 * The 6-month tier is deliberately absent: CONTEXT.md marks its price [VERIFY].
 */

import { prefersReducedMotion } from "./reveal";

const section = document.querySelector<HTMLElement>("#pricing");

if (section) {
  const input = section.querySelector<HTMLInputElement>("[data-locations]");
  const stepButtons = [...section.querySelectorAll<HTMLButtonElement>("[data-step]")];
  const termInputs = [...section.querySelectorAll<HTMLInputElement>("[data-term]")];
  const live = section.querySelector<HTMLElement>("[data-receipt-live]");
  const dateOut = section.querySelector<HTMLElement>("[data-receipt-date]");

  const out = (name: string) =>
    section.querySelector<HTMLElement>(`[data-out="${name}"]`);

  const MIN = 1;
  const MAX = 99;

  if (input) {
    /* --- money -------------------------------------------------------------
       Always "D" plus a thousands separator, never a bare number. Rounded to
       whole dalasi: the price list has no minor units. */
    const money = (n: number) => `D ${Math.round(n).toLocaleString("en-GB")}`;

    interface Term {
      months: number;
      rate: number;
      discount: number;
      label: string;
    }

    function currentTerm(): Term {
      const el = termInputs.find((t) => t.checked) ?? termInputs[0];
      return {
        months: Number(el.dataset.months),
        rate: Number(el.dataset.rate),
        discount: Number(el.dataset.discount),
        label:
          el.closest("label")?.querySelector(".segmented__label")?.textContent?.trim() ??
          "",
      };
    }

    function locations(): number {
      const n = Number.parseInt(input!.value, 10);
      if (Number.isNaN(n)) return MIN;
      return Math.min(MAX, Math.max(MIN, n));
    }

    /** Every figure on the receipt, derived in one place. */
    function compute() {
      const L = locations();
      const { months, rate, discount, label } = currentTerm();
      const list = rate * months * L;
      const off = list * discount;
      const total = list - off;
      return { L, months, label, list, off, total, unit: total / L / months };
    }

    /* --- the count-up ------------------------------------------------------
       The total is written on EVERY render. The count-up is a separate,
       one-shot flourish on first view, not a gate on the value being correct —
       an earlier version only wrote the total once an IntersectionObserver had
       fired, and when that observer did not fire the receipt happily showed
       D 16,200 for every combination while every other figure updated. A
       pricing page that displays a stale total is the worst bug this section
       could have, so correctness no longer depends on anything asynchronous.

       `run` cancels an in-flight animation, so a tap during the count-up wins
       instead of being overwritten a frame later. */
    let run = 0;
    /** Set by any control interaction. The one-shot count-up checks it: if the
        reader has already touched the stepper or the term, the receipt is not
        going to rewind to zero and count up at them. */
    let touched = false;

    function setTotal(value: number, animate: boolean): void {
      const el = out("total");
      if (!el) return;
      const mine = ++run;
      if (!animate || prefersReducedMotion()) {
        el.textContent = money(value);
        return;
      }
      const start = performance.now();
      const dur = 420; // --dur-slow
      const tick = (now: number) => {
        if (mine !== run) return; // superseded by a newer value
        const t = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - t, 3); // ease-out
        el.textContent = money(value * eased);
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }

    /** Flash a line once. Never the total. */
    function flash(row: Element | null): void {
      if (!row || prefersReducedMotion()) return;
      row.classList.remove("is-changed");
      void (row as HTMLElement).offsetWidth; // restart the animation
      row.classList.add("is-changed");
    }

    let previous = "";

    function render(changed: "qty" | "term" | null): void {
      const { L, months, label, list, off, total, unit } = compute();

      const qty = out("qty");
      if (qty) qty.textContent = String(L);
      const termLabel = out("term-label");
      if (termLabel) termLabel.textContent = label;
      const listOut = out("list");
      if (listOut) listOut.textContent = money(list);

      // The discount line exists only when there is a discount to show.
      const discountRow = out("discount-row");
      const discountOut = out("discount");
      if (discountRow) discountRow.hidden = off <= 0;
      if (discountOut) discountOut.textContent = `−${money(off)}`;

      const unitOut = out("unit");
      if (unitOut) unitOut.textContent = money(unit);

      setTotal(total, false);

      if (changed === "qty") flash(section!.querySelector('[data-line="base"]'));
      if (changed === "term") {
        flash(section!.querySelector('[data-line="base"]'));
        flash(discountRow);
      }

      // One sentence, not five cell changes.
      const sentence = `Total due, ${Math.round(total).toLocaleString("en-GB")} dalasi for ${L} ${
        L === 1 ? "location" : "locations"
      } over ${months} ${months === 1 ? "month" : "months"}.`;
      if (live && sentence !== previous) {
        live.textContent = sentence;
        previous = sentence;
      }

      // Bounds. aria-disabled rather than disabled, so the control keeps its
      // label and stays focusable.
      for (const btn of stepButtons) {
        const dir = Number(btn.dataset.step);
        const atBound = dir < 0 ? L <= MIN : L >= MAX;
        btn.setAttribute("aria-disabled", String(atBound));
      }
    }

    /* --- controls ---------------------------------------------------------- */

    for (const btn of stepButtons) {
      btn.addEventListener("click", () => {
        touched = true;
        const next = locations() + Number(btn.dataset.step);
        if (next < MIN || next > MAX) return;
        input.value = String(next);
        render("qty");
      });
    }

    input.addEventListener("input", () => {
      touched = true;
      render("qty");
    });
    input.addEventListener("blur", () => {
      // Clamp only on blur, so typing "12" does not fight the user at "1".
      input.value = String(locations());
      render("qty");
    });

    for (const t of termInputs) {
      t.addEventListener("change", () => {
        touched = true;
        render("term");
      });
    }

    /* --- the date ----------------------------------------------------------
       Generated client-side so it is today's date, not the build's. */
    if (dateOut) {
      const d = new Date();
      const p = (n: number) => String(n).padStart(2, "0");
      dateOut.textContent = `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()}`;
    }

    /* --- first view --------------------------------------------------------
       The total counts once from zero when the receipt first arrives, then
       behaves like a plain figure for the rest of the page's life. */
    const receipt = section.querySelector(".receipt");
    if (receipt) {
      const io = new IntersectionObserver(
        (entries, obs) => {
          for (const e of entries) {
            if (!e.isIntersecting) continue;
            obs.disconnect();
            // Fires once, then never again: a total that re-counts every time
            // you tap "+" is a toy. And not at all if the reader got here
            // first — scrolling the receipt into view after someone has
            // already set their locations should not rewind their total to
            // zero and count it back up.
            setTotal(compute().total, !touched);
          }
        },
        { threshold: 0.3 },
      );
      io.observe(receipt);
    }

    render(null);
  }
}
