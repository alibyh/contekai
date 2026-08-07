# CONTEXT — Contekai

Everything factual known about the product. If a claim is not in this file, it does not go on the
page. Where a fact is uncertain it is marked `[VERIFY]`.

---

## 1. The product

**Contekai** is a point-of-sale and inventory management system for businesses in **The Gambia**.
Built by **Pilore Solutions** `[VERIFY — appears in the app footer of the current dashboard]`.

It sells against three real, local problems:

1. **Power cuts and patchy internet.** Shops lose selling hours when connectivity drops. Contekai
   runs offline and syncs when it reconnects. *This is the product's actual differentiator and the
   thesis of the redesign.*
2. **Stock managed on paper.** No visibility on what's running out, what's expiring, what's walking
   out the door.
3. **No numbers.** Owners cannot see profit per day, per branch, per product.

Currency is the **Gambian dalasi**, written `D` before the figure (`D 1,500`) or `GMD 1,580.00` in
the app. Payment is collected by **Wave** (mobile money) — automated, no card required.

## 2. Audience

Shop and business owners in The Gambia — Serekunda, Banjul, Brikama, Bakau, Kanifing, Farafenni.
Typically:

- On **Android, on mobile data**, often on a slow connection. Mobile-first is not a nicety.
- Multi-business owners are common (one testimonial mentions owning several businesses).
- Some run several branches; multi-location and per-location billing matter commercially.
- Staff turnover is real — "minimal training" is a genuine buying criterion, not filler.
- English is the official language; Wolof and Mandinka are widely spoken. Site is English-only for
  now, but keep sentences short and plain — no idiom, no wordplay that depends on native English.

**Design consequence:** the page must feel *trustworthy and legible on a cheap Android phone in
daylight*, not clever on a 27" display. Contrast and touch targets are load-bearing.

## 3. Brand equity to keep

| Asset | Keep? | Note |
|---|---|---|
| Name "ConteKai" | Yes | Set as **Contekai** in body copy; keep the camel-case `ConteKai` only in the lockup as drawn. Be consistent — the current site mixes both. |
| Molecule/cluster mark (rust) | Yes | Five nodes radiating from a hub. Reads as *branches connected to one system*. Genuinely on-message; do not redraw. Needs a clean SVG, single-colour and inverted variants, and a 24px favicon crop. |
| Rust / terracotta | Yes | The mark's colour. Becomes the primary action colour. |
| Navy wordmark | Yes, reframed | Navy becomes ground, not just wordmark colour. |
| Everything else on the current site | No | Generic SaaS template shell. |

## 4. Content inventory (from the current site)

Copy below is the **source of truth for facts**, not for wording. Rewriting is expected and required
— see `skills/quality-gate/SKILL.md` §Copy.

### Hero (current)
- Eyebrow: "Trusted by businesses across The Gambia"
- H1: "Complete POS & Inventory Management System" / "Built for your business."
- Sub: streamline sales, manage stock in real time, track profits, grow with analytics. Works
  offline — no internet needed.
- Buttons: "Get Started Free", "View Pricing"
- Micro: No credit card required · Automated WAVE payment · Start in minutes
- Trial banner: "Try it FREE for 7 days — no payment required"

### Capabilities — six, all real
| # | Name | Substance |
|---|---|---|
| 1 | Fast Point of Sale | Barcode scanning, multiple payment methods, instant receipt printing |
| 2 | Smart Inventory Control | Real-time stock, low-stock alerts, expiry-date monitoring, automated reorder suggestions |
| 3 | Financial Insights | Daily profit, expenses, sales performance, detailed reports in dalasis |
| 4 | Multi-User & Locations | Multiple branches, user accounts with role-based permissions, employee performance |
| 5 | Business Analytics | Sales trends, top-selling products, customer insights, profit margins |
| 6 | Offline Capability | Keep selling through power cuts and outages; syncs automatically when back online |

### Why Contekai — four claims
1. **Reliable offline mode** — process sales, update inventory, serve customers with no connectivity; syncs on reconnect.
2. **Easy to use & secure** — minimal training, staff productive within minutes; data encrypted and backed up.
3. **Prevent stock loss** — alerts for low stock, expiring products, reorder points.
4. **Grow your revenue** — best sellers, peak hours, margins.

### Pricing — per location, all features on every plan
| Plan | Price | Notes |
|---|---|---|
| Free trial | Free, 7 days | Full access, no payment, **first location only**, upgrade anytime |
| 1 month | **D 1,500** / location | No setup, start immediately, add locations anytime |
| 6 months | `[VERIFY — a mid tier appears to exist between monthly and yearly; confirm price and savings]` |
| 12 months | **D 16,200** / location, was D 18,000 | Saves D 1,800 vs monthly |

Standing line: *Per-location billing — pay only for what you use. Add locations anytime at a
discounted rate.* `[VERIFY — what the multi-location discount actually is; the page promises one but
never states it. Either state the number or drop the promise.]`

### Reviews
Heading: "Loved by Business Owners" · "See why businesses across The Gambia trust Contekai".
Five-star cards. One visible testimonial begins: *"I have two other businesses aside of Kerr…"*
`[VERIFY — full testimonial text, reviewer names, business names, towns, and permission to use
photos. Reviews must be real and attributed; unattributed five-star cards read as fake.]`

### Product imagery
One existing asset: an iMac mockup of the Transactions screen (sale numbers, date/time, user,
channel, status, item counts, payment methods — Cash / Mobile Money / Bank Transfer — totals in
GMD, a Refresh action, "Total Sales GMD 1,580.00", sidebar: Dashboard, POS, Transactions, Products,
Categories, Expenses, Credit/Loans, Staff, Locations, Reports, Subscription, Profile, Sign Out).

**Use the real screens.** The sidebar list above is a truthful map of the product and is far more
persuasive than a generic dashboard illustration. Retake screenshots at 2× on a light background;
retire the floating-iMac-on-blue-square mockup.

## 5. Client-supplied assets needed

Track these in `NOTES.md` and build against clearly-marked placeholders until they land:

- [ ] **Hero video** — client will supply footage from their TikTok/Instagram. Needs: a landscape
      crop, a portrait crop, MP4 (H.264) + WebM (VP9/AV1), and a poster frame. See `sections/01-hero.md`.
- [ ] Real testimonials with names, businesses, towns, and photo permission.
- [ ] Fresh 2× product screenshots (POS, Transactions, Dashboard, Low-stock alert).
- [ ] The logo as clean SVG (mark, horizontal lockup, inverted, favicon).
- [ ] Confirmed 6-month price and the multi-location discount.
- [ ] Contact channel — WhatsApp number and/or phone `[VERIFY — none on the current site, which is a
      conversion problem in this market]`.

## 6. Constraints

- **Bandwidth is the hard constraint.** Budget: ≤ 90 KB JS gzipped, ≤ 80 KB fonts total, LCP < 2.5 s
  on a throttled Fast 3G profile. The hero video never blocks LCP.
- **English only**, single page, no CMS.
- Backend/auth out of scope. All CTAs point to the existing app routes (`/signup`, `/login`) —
  confirm the real paths before wiring.
- Legal/footer: privacy and terms pages `[VERIFY — do they exist?]`.
