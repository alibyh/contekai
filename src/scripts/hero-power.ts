/**
 * hero-power.ts — the hero's one orchestrated beat, and the control that
 * replays it.
 *
 * This script writes no text and moves no element. Its entire job is the value
 * of one attribute:
 *
 *     <section class="hero" data-power="on" | "off">
 *
 * Every visual consequence — the room stepping down a value, the connection
 * chip hollowing out, the fourth line ringing up, the total climbing, both
 * captions, both button labels — is CSS in Hero.astro keyed off that attribute.
 * Keeping it that way is what lets the no-JS page be correct rather than
 * merely unbroken: with the script absent the attribute never appears, and the
 * CSS default is a complete, coherent online till.
 *
 * Contract with kit/skills/motion/SKILL.md:
 *  - §2A this is the hero load sequence's final beat, replacing the scrim move
 *    that left with the video. It fires ONCE, on load, on a timer, never on
 *    scroll and never again.
 *  - §1 nothing loops. After the beat the section rests in the offline state
 *    and only a deliberate press moves it.
 *  - §4 under prefers-reduced-motion the end state is set at init with no
 *    timer and no transition, so the reader gets the finished frame
 *    immediately. Reduced motion is not a reason to withhold the meaning.
 */

import { prefersReducedMotion } from "./reveal";

/**
 * Where the beat sits in the sequence. The last scripted element (the caption
 * and the control) lands at 840ms; this follows it, so the reader has finished
 * being introduced to the till before the lights go.
 */
const CUT_AT_MS = 900;

type Power = "on" | "off";

const hero = document.querySelector<HTMLElement>(".hero");
const toggle = document.querySelector<HTMLButtonElement>("[data-till-toggle]");
const live = document.querySelector<HTMLElement>("[data-till-live]");

function setPower(state: Power): void {
  if (hero) hero.dataset.power = state;
}

/** The one press that flips it, either direction. */
function flip(): void {
  setPower(hero?.dataset.power === "off" ? "on" : "off");
}

if (hero) {
  if (prefersReducedMotion()) {
    /* Straight to the frame that matters. No timer, and motion.css has already
       collapsed the transitions, so this is a state change, not an animation. */
    setPower("off");
    announceFromNowOn();
  } else {
    setPower("on");
    window.setTimeout(() => {
      setPower("off");
      /* Only now does the region become live. Marking it live before the
         scripted beat would make a screen reader announce a change the reader
         never asked for, while they are still on the headline. From here on
         the only changes are ones they caused themselves, which is exactly
         what a polite live region is for. */
      announceFromNowOn();
    }, CUT_AT_MS);
  }

  toggle?.addEventListener("click", flip);
}

function announceFromNowOn(): void {
  live?.setAttribute("aria-live", "polite");
}
