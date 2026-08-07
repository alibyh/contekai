/**
 * deck.ts — capabilities card deck.
 *
 * NOT BUILT YET — this is ORDER.md step 3.
 *
 * When it is built, the contract from kit/skills/motion/SKILL.md §2C applies:
 *  - snapping is CSS (`scroll-snap-type: x mandatory`), never JS
 *  - JS wires only the arrow buttons and the active-index state
 *  - adjacent cards sit at opacity .55 / scale(.97); the active card at 1
 *  - never auto-advance, no 3D rotation, no coverflow
 *  - with JS disabled the deck degrades to a plain horizontally scrollable row
 *  - `will-change: transform` goes on the track only while dragging, then off
 */
export {};
