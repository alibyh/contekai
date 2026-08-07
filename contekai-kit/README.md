# Contekai Website Redesign — Build Kit

A build kit for **Claude Code**. Nothing in this repo is a finished design. Every file here is
instruction: constraints, tokens, section specs, and acceptance gates that Claude Code follows to
implement the marketing site for **contekai.com** — a point-of-sale and inventory system for
businesses in The Gambia.

**Target output:** one static marketing website (single scrolling page + anchored nav).
**Not in scope:** backend, auth, dashboard app. Login/signup screens ship as a separate kit later.

---

## Read order (mandatory)

| # | File | Why |
|---|------|-----|
| 1 | `CONTEXT.md` | Product, market, audience, real content inventory. Never invent facts not here. |
| 2 | `PLAN.md` | The design thesis, the two rejected directions, the chosen one. This is the spine. |
| 3 | `skills/design-system/SKILL.md` | Tokens: color, type, space, radius, surface. Nothing gets hardcoded outside this. |
| 4 | `skills/motion/SKILL.md` | Motion grammar. Durations, easings, reduced-motion contract. |
| 5 | `skills/quality-gate/SKILL.md` | The anti-vibecode gate + copy rules + a11y/perf floor. Run before every commit. |
| 6 | `SCAFFOLD-PROMPT.md` | Paste-ready prompt to bootstrap the repo. |
| 7 | `ORDER.md` | Build order, one section per step, with acceptance criteria per step. |
| 8 | `sections/*.md` | One spec per section. Read the section file immediately before building it. |

---

## Reference standards this kit encodes

The five standards named by the client are **Frontend Design**, **UI/UX Pro Max**, **Taste Skill**,
**Impeccable**, and **SkillUI**.

- If those skills are installed in the Claude Code environment, **invoke them by name** at the step
  where they apply (see `ORDER.md`), and let their output override this kit where they are more
  specific.
- If they are not installed, the rules in `skills/*/SKILL.md` are the standing substitute. They are
  written to be self-sufficient. Do not fabricate output from a skill you could not run — say which
  source a recommendation came from.

`ui-ux-pro-max` ships a search script. Run it before building; do not guess at its output:

```bash
python "${CLAUDE_PLUGIN_ROOT}/.claude/skills/ui-ux-pro-max/scripts/search.py" \
  "POS inventory SaaS west africa small business trust offline" --design-system -p "Contekai"
```

If it returns nothing, say so explicitly and fall back to `skills/design-system/SKILL.md`.

---

## Hard guardrails

1. **The design is the deliverable.** A section that works but looks generic is a failed section.
2. **No token drift.** Every color, size, radius, duration comes from a CSS custom property defined
   in `skills/design-system/SKILL.md`. Raw hex or magic numbers in a component = rejected.
3. **No stock filler.** No lorem ipsum, no invented statistics, no fake logos, no "trusted by 10,000+
   businesses". Copy comes from `CONTEXT.md` or is flagged `<!-- COPY: needs client input -->`.
4. **No emoji as icons.** SVG only, one icon family, consistent stroke weight.
5. **Reduced motion is a real state**, not a comment. Every animated section has a static composition
   that is still good.
6. **Every section ships with a self-critique.** Before marking a step done, write 3 bullets in
   `NOTES.md`: what is distinctive here, what reads templated, what you removed.
7. **Ask before assuming client assets.** Hero video, shop photography, and testimonial attribution
   are client-supplied. Placeholders must be obviously placeholders (see `sections/01-hero.md`).

---

## What "not vibe-coded" means in this project

Concretely, these are automatic rejections:

- A hero that is: centered headline + gradient text + two pill buttons + floating glass card mockup.
- Feature cards that are: rounded square pastel icon chip + bold title + two lines of grey text, ×6.
- A pricing table that is: three equal columns with a "Most Popular" ribbon on the middle one.
- Purple/indigo gradients, glassmorphism blur panels, blob shapes, `bg-gradient-to-r from-X to-Y` on
  headlines, or a dark hero with a single neon accent and nothing else.
- Section padding that is identical everywhere with no rhythm, and headings that all sit centered.
- Copy in the register of "Empower your business with cutting-edge solutions."

The full checklist is in `skills/quality-gate/SKILL.md`.
