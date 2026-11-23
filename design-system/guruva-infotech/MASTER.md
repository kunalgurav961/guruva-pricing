# Guruva Infotech — Design System (Master)

> Generated with the ui-ux-pro-max skill, then **overridden by hand**: the auto-picked
> "Marketing Agency / Brutalism / pink" result did not fit a B2B web-services firm.
> This file records what is actually implemented in `src/`.

**Product:** Interactive pricing pitch for a web development agency (B2B service).
**Pattern:** Pricing Page + CTA — hero → proof → price cards → feature comparison → quote builder → FAQ → final CTA. Sticky CTA in nav.
**Style:** Aurora glass hero (dark navy, blurred gradient light) + clean surface cards, bento grids, generous whitespace. Light and dark themes.
**Dials:** Variance 6 · Motion 7 · Density 4.

## Color tokens (CSS variables, see `src/index.css`)

| Role | Light | Dark |
|---|---|---|
| Background `--bg` | `#f5f7fb` | `#060a16` |
| Surface `--surface` | `#ffffff` | `#0e1530` |
| Surface 2 `--surface-2` | `#eef1f8` | `#151e3d` |
| Ink `--ink` | `#0b1226` | `#eef1ff` |
| Ink 2 `--ink-2` (body text) | `#475169` | `#a4adcc` |
| Line `--line` | `#dde2ef` | `#243055` |
| Brand `--brand` | `#4f46e5` | `#8b8cff` |
| Brand 2 `--brand-2` | `#7c3aed` | `#b69cff` |
| Accent `--accent` | `#0369a1` | `#38bdf8` |
| Success `--ok` | `#047857` | `#34d399` |
| Highlight (popular badge) | `#f59e0b` | `#fbbf24` |

Gradient buttons are fixed `indigo-600 → violet-600` with white text (contrast ≥ 6:1) in both themes.

## Typography
- **Plus Jakarta Sans** (400/500/600/700/800) for headings and body — self-hosted via `@fontsource` so the single-file build works offline.
- **JetBrains Mono** (500) for eyebrows, prices' small labels and numeric readouts.
- Body 16px / line-height 1.6. Headings tight (-0.02em tracking).

## Motion (Framer Motion)
- Scroll reveals: `whileInView`, 550–600ms, ease `[0.22, 1, 0.36, 1]`, once.
- Stagger lists: 80ms per child.
- Shared-layout pills (`layoutId`) for segmented controls and nav indicator.
- Animated numbers for prices/totals; SVG path draws for rings.
- Respect `prefers-reduced-motion` via `<MotionConfig reducedMotion="user">`.
- Never animate width/height of large layout blocks except accordion/list reveals.

## Rules
- Icons: Lucide SVG only. No emoji as icons.
- Every clickable element: `cursor-pointer`, visible focus ring, ≥ 40px touch target.
- Text contrast ≥ 4.5:1; no colour-only meaning.
- Responsive checks: 375 / 768 / 1024 / 1440. No horizontal scroll.
- No fabricated clients, testimonials or numbers. Cited statistics link to their source.
