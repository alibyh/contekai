# 00 — Shell: header, rail, ground

The page's coordinate system. Built before any section content.

---

## Job

Keep the trial action within reach at all times, keep the reader oriented in a long single page, and
never draw attention to itself. The header is furniture, not a feature.

## Layout

```
DESKTOP ≥ 1024
┌────────────────────────────────────────────────────────────────┐
│ [mark] Contekai              Log in   [ Start free trial ]  [≡]│  64px
└────────────────────────────────────────────────────────────────┘
 ├──┤
 rail (44px)
 │ 01 │  ← vertical, DM Mono 12px, uppercase, .12em
 │ HERO│    rotated 180deg writing-mode, bottom-aligned
 │ ▍   │  ← 2px progress fill in --laterite, height = scroll within section

MOBILE < 900
┌────────────────────────────────────────────────────────────────┐
│▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│ 2px progress
│ [mark] Contekai                        [ Start free ]      [≡] │  64px
└────────────────────────────────────────────────────────────────┘
```

## Header

**Contents, left to right:** logo lockup (links to `#top`) · spacer · `Log in` (quiet variant,
desktop only) · `Start free trial` (primary, compact 40px height in the header) · menu button.

**The menu button is a placeholder.** Client will wire it later.

```astro
<button
  type="button"
  class="menu-btn"
  aria-label="Open menu"
  aria-expanded="false"
  aria-controls="site-menu"
  data-todo="wiring deferred — client will configure">
  <Icon name="menu" size={24} />
</button>
<!-- TODO(client): menu panel not implemented. Button is inert by design. -->
```

Rules: it must be 44×44 minimum, must show the focus ring, must not be `disabled` (a disabled
control communicates something false), and must not fire a console error or a no-op alert. It sits
there, correct and quiet, until wired.

**Ground switching.** The header background matches the section behind it: `--ink-900` over dark
sections, `--paper` over paper sections, with `--hairline-ink` / `--hairline-paper` on the bottom
edge. Implement with an IntersectionObserver on `[data-ground]` section attributes toggling a class
on `<header>`; transition `background-color` and `color` at `--dur-fast`. **No `backdrop-filter`.**

**Scroll behaviour:** the header is sticky from `0`. It does not hide on scroll-down (hide-on-scroll
headers are a fidget on a page this length and cost a scroll listener). It does not shrink. The only
thing that changes is the ground.

**Anchors:** `scroll-margin-top: calc(var(--header-h) + var(--space-4))` on every section, plus
`scroll-behavior: smooth` gated behind `prefers-reduced-motion: no-preference`.

## The rail

The till roll. Desktop only (`≥ 900px`), a `44px` fixed left gutter, `position: fixed`, full height,
`border-right: var(--border-ink)` over dark grounds and `--border-paper` over paper.

Contents, bottom-aligned, `writing-mode: vertical-rl; transform: rotate(180deg)`:
- the section index — `01` … `06` in DM Mono
- the section label — `HERO`, `WHAT IT DOES`, `BUILT FOR HERE`, `PRICING`, `SHOPS`, `START`
- a 2px `--laterite` fill showing progress *within* the current section

Index and label crossfade at `--dur-base` when the active section changes. Below `900px` the rail
becomes a 2px progress bar under the header showing progress through the **whole page**.

`aria-hidden="true"` — it is a decorative echo of the nav. The real navigation is the header and the
in-page anchors. Do not make the rail the only route to anything.

**Why this earns its place:** it is the receipt tape running through the page, and it is doing real
work — telling you where you are in a page with no chrome. It is the *only* place the receipt motif
appears outside pricing.

## Skip link

First focusable element. Hidden until focused, then visible at top-left over everything, `--paper`
on `--ink-900`, `--r-sm`, `--space-3` padding: "Skip to content" → `#main`.

## Responsive

| Width | Header | Rail |
|---|---|---|
| < 480 | mark + `Start free` (compact) + menu. `Log in` moves into the deferred menu. | top progress line |
| 480–899 | full lockup + `Start free` + menu | top progress line |
| ≥ 900 | full lockup + `Log in` + `Start free trial` + menu | 44px vertical rail |

## Accessibility

- `<header role="banner">`, `<main id="main">`, `<footer role="contentinfo">`.
- Logo link: `aria-label="Contekai — back to top"`.
- Header CTA and hero CTA carry the **same label**; that repetition is correct, not a duplication bug.
- Focus order: skip link → logo → log in → CTA → menu → main content.
- The header must not overlap focused content — the `scroll-margin-top` above handles it.

## Gate additions

- [ ] Header does not use blur, does not hide on scroll, does not shrink.
- [ ] Ground switch is smooth with no flash at the boundary of two sections.
- [ ] Menu button: 44×44, labelled, focusable, inert, documented.
- [ ] Rail is `aria-hidden` and duplicates no unique navigation.
- [ ] Sticky header causes zero CLS.
