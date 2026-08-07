# 06 — Closing action + footer

The last thing on the page carries the last chance to act, and the single most important missing
element on the current site: **a way to talk to a human.**

---

## Job

Two jobs, one block: repeat the action for anyone who scrolled the whole page, and give the reader a
real contact channel. In this market **WhatsApp is the conversion path** — a shop owner who has read
the whole page and still has a question will message, not fill in a form.

## Layout

The footer is a single dark block that opens with the closing action and settles into the utility
rows. No separate "CTA band" section above it — an extra full-height CTA band before the footer is
padding, and it is a template shape.

```
┌──┬──────────────────────────────────────────────────────────────┐
│  │                                                    ← --ink-800│
│  │  Try it for seven days.                                       │
│  │  Nothing to pay until you decide.                             │
│  │                                                               │
│  │  [ Start 7 days free ]     Ask a question on WhatsApp →       │
│  │                                                               │
│  ├───────────────────────────────────────────────────────────── │  hairline
│  │                                                    ← --ink-900│
│  │  [mark] Contekai          Product        Company              │
│  │                           What it does   Pricing              │
│  │  Point of sale and        Offline mode   Log in               │
│  │  stock for shops in       Multi-branch   WhatsApp             │
│  │  The Gambia.                                                  │
│  │                                                               │
│  │  ──────────────────────────────────────────────────────────  │
│  │  © 2026 Contekai        Built by Pilore Solutions   Privacy · Terms
│  │  ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁  │
└──┴──────────────────────────────────────────────────────────────┘
```

## Closing action block

- Ground `--ink-800`, one value step off the page ground — enough separation without a border.
- Headline: Archivo `wdth 108 / wght 700`, `clamp(1.75rem, 3.2vw, 2.5rem)`, two lines, left-aligned.
  > Try it for seven days.
  > Nothing to pay until you decide.
- Primary button: `Start 7 days free` — **the same label as the header and hero.** Three instances of
  one action with one name. Never "Get started", "Try now", and "Sign up free" on the same page.
- Beside it, quiet variant: `Ask a question on WhatsApp →` with the Lucide `message-circle` icon,
  linking to `https://wa.me/<number>` `[VERIFY — client must supply the number]`.
  If no number is supplied, use `mailto:` and flag it — but push for WhatsApp; it is worth more than
  anything else in this footer.

## Footer rows

**Column 1 — identity.** Mark + wordmark (inverted variant), then one sentence:
> Point of sale and stock control for shops in The Gambia.

**Column 2 — Product.** `What it does` `#what-it-does` · `Offline mode` `#built-for-here` ·
`Multi-branch` `#what-it-does` · `Pricing` `#pricing`

**Column 3 — Company.** `Log in` · `Ask on WhatsApp` · `Privacy` `[VERIFY exists]` ·
`Terms` `[VERIFY exists]`

Do not invent footer links. If Privacy and Terms pages don't exist, the links come out and go on the
`[VERIFY]` list — a dead legal link is worse than no link. Do not add social icons unless the client
confirms live accounts; if the hero video comes from their TikTok/Instagram, those accounts exist, so
ask for the handles and link them properly.

**Bottom rule.** `© 2026 Contekai` · `Built by Pilore Solutions` `[VERIFY]` · legal links.
DM Mono `0.75rem`, `--on-ink-faint`.

**The last element on the page:** the rail's fill, completed — a full-width 2px `--laterite` line
across the bottom. The till roll ends. That is the only ornament in the footer and it closes the
motif the rail opened.

## Copy rules

Footer link labels match their destination headings exactly. `What it does` in the footer →
`From the counter to the books` under the eyebrow `WHAT IT DOES`. The eyebrow is the label; that's
why the eyebrows exist.

No newsletter signup. No "Made with ❤️". No emoji. No "All rights reserved" boilerplate stacked on
top of the copyright line.

## Responsive

- < 768: columns stack; closing action headline drops to `1.5rem`; both actions become full-width
  buttons, WhatsApp second. Link lists get `--space-3` vertical spacing so every target clears 44px.
- The footer is where mis-sized touch targets usually hide. Check every link at 375px.

## Motion

Reveal only — the closing headline and actions fade + 16px up, `60ms` stagger, once. The footer link
columns do not animate; they are furniture.

## Accessibility

- `<footer role="contentinfo">`. Link columns are `<nav aria-label="Product">` / `"Company"`.
- Every link has visible focus and a hover state that isn't colour-only (add an underline).
- WhatsApp link: `aria-label="Ask a question on WhatsApp"`, opens in a new tab with
  `rel="noopener"`, and says so — an icon indicating "opens in a new tab" or the label carrying it.
- Contrast: `--on-ink-faint` (.44) is **only** for the copyright row, which is not essential content.
  Every functional link uses `--on-ink-muted` or brighter.

## Gate additions

- [ ] One CTA label used consistently in all three places on the page.
- [ ] A real contact channel exists, ideally WhatsApp.
- [ ] No invented links. Legal links resolve or are absent.
- [ ] No newsletter form, no social icons without confirmed accounts, no emoji.
- [ ] All footer touch targets ≥ 44px at 375px width.
- [ ] The closing block is part of the footer, not a separate full-height band.
