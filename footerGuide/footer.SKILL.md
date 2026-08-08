---
name: contekai-footer
description: How the Contekai footer is built — the receipt structure, the logo-shaped warmth panel, tokens, and the quality floor. Read when creating or editing the site footer.
---

# Contekai Footer — construction standard

The footer is a **digital receipt** with a **logo-shaped warmth panel**. This encodes the
non-obvious rules so future edits don't erode the design.

## Invariants (don't break these when editing)

1. **Receipt metaphor is structural, not decorative.** Nav = line-items with dotted leaders.
   The primary CTA sits on a dashed "total" rule. Don't convert links back into buttons/pills.
2. **One bold element only.** The logo-shaped panel is the signature. Everything else stays
   quiet: mono eyebrows, thin rules, muted greys. Don't add a second loud element.
3. **Clay is an accent.** Dark footer, clay for CTA + hover only. Never a clay/cream field.
4. **Mono vs serif vs sans have fixed jobs.** Serif = wordmark only. Mono = eyebrows, routes,
   status, meta. Sans = links, buttons, panel copy. Don't blur these.
5. **The warmth panel echoes the logo mark** (five-point burst → five soft lobes via clip-path).
   Not a random blob, not a rectangle. If you touch the shape, keep it a felt five-lobe silhouette
   and keep the rounded-rectangle fallback.

## Quality floor (from Frontend Design + UI/UX Pro Max + Taste/Impeccable/SkillUI)

- Text contrast ≥ 4.5:1 on `--footer-bg`. Verify muted/faint greys, don't eyeball.
- Visible keyboard focus on every link/button; touch targets ≥ 44×44px.
- `aria-label` on icon-only (social) buttons; barcode `aria-hidden`.
- `prefers-reduced-motion:reduce` kills the status pulse and hover transforms.
- Responsive 320px+; panel clip must never crop its own content — degrade to rounded rect if needed.
- Runtime year in copyright; no hardcoded date.
- No fabricated contact data — placeholders carry `TODO`.
- Copy: sentence case, plain, active voice. Buttons name the action.

## Tokens

`--footer-bg #121a27` · `--ink #f4f6f9` · `--muted #8a94a3` · `--faint #5a6472`
`--line #212b3b` · `--clay #c8613b` · `--clay-2 #e07a4e` · `--green #4ea36b` · `--wa #25d366`

## Mechanics reference
Torn edges = radial-gradient mask teeth (top + mirrored bottom). Dotted leader = flex `.dots`
with dotted bottom-border. Status dot = box-shadow pulse. Panel shape = inline SVG
`clipPath` (objectBoundingBox, five shallow convex lobes ~72° apart) with faint asterisk watermark.
See PLAN.md for exact snippets and `footer-hybrid.html` for the working reference.

## When extending
Adding a link → new receipt line-item under the right eyebrow, with a mono route value.
Adding social → white circle in the panel with an `aria-label`; keep the row balanced (3–4 max).
Adding a trust signal → prefer a mono status line over another loud block.
