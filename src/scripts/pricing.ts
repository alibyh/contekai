/**
 * pricing.ts — locations stepper and the receipt tally.
 *
 * NOT BUILT YET — this is ORDER.md step 5.
 *
 * When it is built, the contract from kit/skills/motion/SKILL.md §2B applies:
 *  - the stepper is +/- buttons AND a real <input type="number">
 *  - totals use tabular-nums and never jitter
 *  - digits roll with --ease-snap at --dur-base
 *  - the changed receipt LINE flashes once at 8% --laterite; the total does not
 *  - on first scroll into view the total counts once from 0, then never again
 *  - term changes are announced via aria-live="polite"
 *  - under prefers-reduced-motion the final value renders immediately
 *
 * The receipt must compute something real (locations x term). If it stops being
 * functional it gets cut rather than shipped as a gimmick.
 */
export {};
