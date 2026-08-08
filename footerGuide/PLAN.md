# PLAN — Contekai Footer

## Layout (ASCII)

```
  ╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲   ← torn top edge (mask teeth)
 ┌──────────────────────┐
 │        (logo)        │
 │      Contekai        │  ← serif wordmark, centered
 │  POS & stock control │  ← tagline, muted
 │ ▏▎▏▍▏▎▏▍▏▎▏▍▏▎ (barcode, faint) │
 │ PRODUCT              │  ← mono eyebrow
 │ What it does ···· /features │
 │ Offline mode ···· /offline  │  ← receipt line-items, dotted leaders
 │ Pricing ········· GMD       │
 │ Shops using it ·· /shops    │
 │ COMPANY             │
 │ Log in ·········· /app      │
 │ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ (dashed) │
 │ GET STARTED   [Start 7 days free →] │  ← "total" row = CTA
 │ ● Works offline — syncs when back   │  ← status
 │   ╭───◟◞───◟◞───╮   │
 │  ◜  Say hello 👋   ◝ │
 │  │ friendlier...    │ │  ← LOGO-SHAPED panel (five lobes)
 │  ◟ ⓘ ⓣ ⓕ  [WhatsApp]◞│     socials + WhatsApp + hours
 │   ╰───◝◜───◝◜───╯   │
 │ © 2026 · Built in Gambia    │  ← mono meta, centered
 │ Terms · Privacy · GMD       │
 └──────────────────────┘
  ╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱   ← torn bottom edge
```

## Design tokens

| Token | Value | Use |
|---|---|---|
| `--footer-bg` | `#121a27` | receipt paper |
| `--ink` | `#f4f6f9` | primary text |
| `--muted` | `#8a94a3` | secondary text, routes |
| `--faint` | `#5a6472` | eyebrows, barcode, meta |
| `--line` | `#212b3b` | leaders, rules |
| `--clay` | `#c8613b` | CTA, hover accent |
| `--clay-2` | `#e07a4e` | hover-lighter |
| `--green` | `#4ea36b` | status dot |
| `--wa` | `#25d366` | WhatsApp glyph only |

Type roles: **serif display** = wordmark; **mono** = eyebrows/routes/status/meta; **sans** = links, buttons, blob copy.

## Key mechanics

**Torn edge**
```css
.foot::before{ content:""; position:absolute; top:-9px; left:0; right:0; height:10px;
  background:var(--footer-bg);
  -webkit-mask:radial-gradient(9px at 9px 100%,transparent 98%,#000) repeat-x 0 0/18px 10px;
          mask:radial-gradient(9px at 9px 100%,transparent 98%,#000) repeat-x 0 0/18px 10px; }
/* .foot::after mirrors it at the bottom with transform:scaleY(-1) */
```

**Receipt line-item**
```
[label] [flex dotted leader] [mono route]
```
```css
.li{display:flex;align-items:baseline;gap:8px;padding:9px 0}
.li .dots{flex:1;border-bottom:1.5px dotted var(--line);transform:translateY(-4px)}
.li:hover .lbl{color:var(--clay-2)} .li:hover .dots{border-color:var(--faint)}
@media(max-width:380px){.li .val{display:none}}
```

**Status pulse (reduced-motion aware)**
```css
.dot{animation:pulse 2.4s infinite}
@keyframes pulse{0%{box-shadow:0 0 0 0 rgba(78,163,107,.5)}70%{box-shadow:0 0 0 7px rgba(78,163,107,0)}100%{box-shadow:0 0 0 0 rgba(78,163,107,0)}}
@media(prefers-reduced-motion:reduce){.dot{animation:none} .cta:hover,.wa:hover,.socials a:hover{transform:none}}
```

## The logo-shaped panel — how to build the silhouette

The Contekai mark = central node + 5 spokes to 5 outer dots (a five-point burst). The panel
should read as a soft version of that burst: a rounded container with **five gentle lobes**.

Preferred approach — SVG `clip-path` with a hand-tuned five-lobe path:
```css
.blob{
  clip-path: url(#contekai-lobe);        /* inline <svg><clipPath> with a 5-lobe path */
  background:linear-gradient(160deg,#d9714a,#c8613b);
}
@supports not (clip-path: url(#x)){ .blob{ border-radius:32px; } }   /* fallback */
```
- Author the `<clipPath id="contekai-lobe" clipPathUnits="objectBoundingBox">` once, inline in
  the footer. Five shallow convex bulges spaced ~72° apart; keep the bulges shallow so it reads
  as "soft burst," not "flower" or "splat."
- Watermark the asterisk mark inside at 5–8% white, centered, `pointer-events:none`, behind content.
- Test at 320px: the clip must not eat the WhatsApp button or the hours line. If it does, reduce
  lobe depth on small screens or fall back to the rounded rectangle under a width media query.

## Reference implementation

A complete, working single-file reference of this footer (dark receipt + warmth panel) exists
as `footer-hybrid.html` in the design deliverables. Match its layout, spacing rhythm, hover
behaviour, barcode, torn edges, dashed total line, and copy. The ONE change from that reference:
swap the plain organic-blob `border-radius` shape for the five-lobe logo-echo clip-path above.

## Content (final copy)

- Wordmark: **Contekai**
- Tagline: "Point of sale and stock control for shops in The Gambia."
- PRODUCT: What it does · Offline mode · Pricing · Shops using it
- COMPANY: Log in
- CTA: **Start 7 days free →**  (eyebrow: GET STARTED)
- Status: "Works offline — syncs when you're back"
- Panel: "Say hello 👋" / "We're friendlier than most software." / "Chat on WhatsApp" / "Online now · 9am–7pm GMT"
- Meta: "© {year} Contekai · Built in The Gambia"  /  "Terms · Privacy · Prices in GMD"

## Placeholders to leave as TODO
- WhatsApp number + exact hours
- Social handles (Instagram / TikTok / Facebook — confirm which are real)
- Any route that doesn't exist yet
