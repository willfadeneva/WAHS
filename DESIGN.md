---
version: alpha
name: WAHS (World Association for Hallyu Studies)
description: Scholarly gravitas meets Korean cultural identity — a design system rooted in the Taegukgi flag palette, serif-display typography, and dark dramatic atmospherics for academia.
colors:
  white: "#FFFFFF"
  kr-red: "#CD2E3A"
  kr-blue: "#0047A0"
  kr-black: "#000000"
  navy: "#000000"
  deep-ocean: "#0047A0"
  teal: "#0047A0"
  coral: "#CD2E3A"
  warm-coral: "#e04450"
  sand: "#f0f0f0"
  cream: "#FFFFFF"
  pearl: "#e5e5e5"
  ink: "#000000"
  slate: "#333333"
  mist: "#666666"
  gold: "#CD2E3A"
typography:
  h1-display:
    fontFamily: DM Serif Display
    fontSize: clamp(3rem, 7vw, 6.5rem)
    fontWeight: 400
    lineHeight: 1.05
    fontStyle: normal
  h2-section-title:
    fontFamily: DM Serif Display
    fontSize: clamp(2rem, 4vw, 3rem)
    fontWeight: 400
    lineHeight: 1.15
  h3-card-title:
    fontFamily: DM Serif Display
    fontSize: 1.1rem
    fontWeight: 400
    lineHeight: 1.2
  body:
    fontFamily: Instrument Sans
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.6
  body-small:
    fontFamily: Instrument Sans
    fontSize: 0.88rem
    fontWeight: 400
  label:
    fontFamily: Instrument Sans
    fontSize: 12px
    fontWeight: 700
    letterSpacing: 3px
    textTransform: uppercase
  kr-text:
    fontFamily: Noto Sans KR
    fontWeight: 400
    lineHeight: 1.2
rounded:
  none: 0px
  sm: 6px
  md: 8px
  lg: 12px
  xl: 16px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 40px
  section-y: 100px
  section-y-mobile: 72px
components:
  btn-primary:
    backgroundColor: "{colors.coral}"
    textColor: "{colors.white}"
    rounded: "{rounded.none}"
    padding: 16px 36px
    typography: "{typography.label}"
  btn-primary-hover:
    backgroundColor: "{colors.warm-coral}"
    transform: translateY(-2px)
    boxShadow: 0 8px 30px rgba(205,46,58,0.3)
  btn-outline:
    backgroundColor: transparent
    textColor: "{colors.white}"
    border: 1.5px solid rgba(255,255,255,0.25)
    rounded: "{rounded.none}"
    padding: 16px 36px
    typography: "{typography.label}"
  btn-outline-hover:
    borderColor: rgba(255,255,255,0.6)
    backgroundColor: rgba(255,255,255,0.05)
  btn-paypal:
    backgroundColor: "#0070ba"
    textColor: "{colors.white}"
    rounded: "{rounded.sm}"
    padding: 14px 24px
    typography: "{typography.body}"
  framework-card:
    backgroundColor: "{colors.white}"
    border: 1px solid var(--pearl)
    padding: 32px
    rounded: "{rounded.none}"
  framework-card-hover:
    transform: translateY(-3px)
    boxShadow: 0 12px 40px rgba(10,22,40,0.06)
    borderColor: "{colors.teal}"
  speaker-card:
    backgroundColor: rgba(255,255,255,0.04)
    border: 1px solid rgba(255,255,255,0.08)
    rounded: "{rounded.none}"
  speaker-card-hover:
    backgroundColor: rgba(255,255,255,0.07)
    borderColor: rgba(205,46,58,0.3)
    transform: translateY(-4px)
  committee-card:
    backgroundColor: rgba(255,255,255,0.08)
    border: 1px solid rgba(255,255,255,0.15)
    rounded: "{rounded.lg}"
    padding: 28px 16px 24px
  committee-card-hover:
    backgroundColor: rgba(255,255,255,0.14)
    borderColor: rgba(205,46,58,0.5)
    transform: translateY(-4px)
  pricing-card:
    backgroundColor: "{colors.white}"
    border: 1px solid var(--pearl)
    padding: 40px 28px
    rounded: "{rounded.none}"
  pricing-card-featured:
    borderColor: "{colors.coral}"
    backgroundColor: linear-gradient(180deg, rgba(232,101,74,0.03) 0%, #fff 100%)
  pricing-card-hover:
    transform: translateY(-4px)
    boxShadow: 0 16px 48px rgba(10,22,40,0.08)
  submission-card:
    backgroundColor: "{colors.white}"
    border: 1px solid var(--pearl)
    padding: 32px 28px
    rounded: "{rounded.none}"
  submission-card-hover:
    transform: translateY(-3px)
    boxShadow: 0 12px 40px rgba(10,22,40,0.06)
  form-input:
    backgroundColor: var(--cream)
    border: 1px solid var(--pearl)
    padding: 12px 16px
    rounded: "{rounded.none}"
    typography: "{typography.body}"
  form-input-focus:
    borderColor: "{colors.teal}"
  plenary-card:
    backgroundColor: linear-gradient(170deg, rgba(205,46,58,0.06) 0%, rgba(20,20,30,0.95) 40%, rgba(5,5,10,0.98) 100%)
    border: 1px solid rgba(205,46,58,0.12)
    rounded: 28px
    padding: 56px 40px 48px
  plenary-card-hover:
    transform: translateY(-12px) scale(1.02)
    borderColor: rgba(205,46,58,0.35)
    boxShadow: 0 40px 100px rgba(0,0,0,0.6), 0 0 60px rgba(205,46,58,0.1)
  admin-stat-card:
    backgroundColor: "{colors.white}"
    border: 1px solid #e2e8f0
    rounded: "{rounded.md}"
    padding: 24px
  admin-table:
    backgroundColor: "{colors.white}"
    border: 1px solid #e2e8f0
    rounded: "{rounded.md}"
---

## Overview

WAHS (World Association for Hallyu Studies) is an academic organization focused on the scholarly study of the Korean Wave (Hallyu). The design system balances **scholarly gravitas** (serif display typography, dark backgrounds, restrained layouts) with **Korean cultural identity** (Taegukgi flag colors, Hangul typography, subtle references like watermark "한류").

Two distinct visual tracks exist:
1. **Congress Site** (`/congress/[year]/`) — Dark, dramatic, event-focused. Black/blue hero with animated particles, shimmer effects, plenary awards-night section. Designed to evoke a conference experience.
2. **Main Organization Site** (`/`) — Navy-to-deep-ocean gradient hero, cleaner white sections, content-page layout grid with sidebar. Designed for institutional credibility and membership/registration flows.

### Core Design Principles

- **Academic authority**: DM Serif Display provides the scholarly voice for all headings and titles. Instrument Sans handles body content with clean readability.
- **Korean identity**: The flag's red (태극기) and blue (태극기) anchor the palette across both tracks. Hangul text uses Noto Sans KR for contemporary Korean type.
- **Dramatic contrast**: Dark backgrounds dominate — pure black (#000) and navy (#000) with subtle gradients create depth. White section alternation provides breathing room.
- **Motion with purpose**: fadeUp entrance animations (staggered at 0.2s intervals), plenary shimmer sweeps, and committee card hover translates add dynamism without being playful.
- **Sparse, intentional**: No decorative illustrations or heavy iconography. Visual interest comes from lighting effects (gradients, spotlights, film grain), typographic hierarchy, and member photography.

## Colors

The palette is directly derived from the **South Korean Taegukgi flag**.

### Primary Flag Colors

| Token | Hex | Role | Usage |
|-------|-----|------|-------|
| `--white` / `--cream` | `#FFFFFF` | Background | Default page bg, card backgrounds |
| `--kr-red` / `--coral` / `--gold` | `#CD2E3A` | Accent | Primary buttons, section labels, hover highlights, dividers |
| `--kr-blue` / `--deep-ocean` / `--teal` | `#0047A0` | Secondary | Hero gradients, accent borders, secondary buttons, info highlights |
| `--kr-black` / `--navy` / `--ink` | `#000000` | Base | Dark sections, main nav background, headings color |

### Extended Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--warm-coral` | `#e04450` | Primary button hover, CTA accent |
| `--sand` | `#f0f0f0` | Section backgrounds (tracks, venue, CTA) |
| `--pearl` | `#e5e5e5` | Card borders, dividers |
| `--slate` | `#333333` | Body text paragraphs |
| `--mist` | `#666666` | Secondary text, labels, muted elements |

### Admin Color Tokens

| Token | Hex | Usage |
|-------|-----|-------|
| Pending badge | `#fef3c7` / `#92400e` | Status indicator |
| Accepted badge | `#d1fae5` / `#065f46` | Status indicator |
| Rejected badge | `#fee2e2` / `#991b1b` | Status indicator |
| Revision badge | `#dbeafe` / `#1e40af` | Status indicator |
| PayPal button | `#0070ba` / `#005ea6` (hover) | Payment CTA |

### Background Alternation Pattern

Sections follow a predictable rhythm: **White/Cream → Sand → Navy → White** to create visual separation without explicit dividers (except the animated gradient wave divider).

## Typography

### Font Stack

| Usage | Font | Fallback | Source |
|-------|------|----------|--------|
| Headings & display | DM Serif Display | serif | Google Fonts |
| Body text | Instrument Sans | sans-serif | Google Fonts |
| Korean text (organization name, watermarks) | Noto Sans KR | sans-serif | Google Fonts |
| Korean text (legacy/alt) | Noto Serif KR | serif | Google Fonts |

### Type Scale

| Token | Element | Size | Weight | Leading | Other |
|-------|---------|------|--------|---------|-------|
| Hero title | `.hero-title` | `clamp(3rem, 7vw, 6.5rem)` | 400 | 1.05 | DM Serif Display |
| Section title | `.section-title` | `clamp(2rem, 4vw, 3rem)` | 400 | 1.15 | DM Serif Display |
| Main hero title | `.main-hero-title` | `3.5rem` | 400 | 1.1 | DM Serif Display |
| Subtitle | `.hero-subtitle` | `clamp(1.1rem, 2.2vw, 1.65rem)` | 400 | 1.5 | DM Serif Display |
| Plenary subtitle | `.plenary-subtitle` | `clamp(2.6rem, 5vw, 4rem)` | 400 | 1.1 | DM Serif Display |
| Section lead | `.section-lead` | `1.1rem` | 400 | 1.7 | Instrument Sans |
| Label | `.section-label` | `12px` | 700 | — | `3px` letter-spacing, uppercase |
| Eyebrow | `.hero-eyebrow` | `13px` | 600 | — | `3px` letter-spacing, uppercase |
| Card title | `.framework-card h3` | `1.1rem` | 400 | — | DM Serif Display |
| Body | plain p, `.speaker-affil` | `0.88rem`–`1rem` | 400 | 1.5–1.7 | Instrument Sans |
| Small | `.committee-affil` | `0.78rem` | 400 | 1.4 | Instrument Sans |
| Tiny | `.committee-dept` | `0.72rem` | 400 | 1.4 | italic |

### Typographic Voice

- **DM Serif Display** carries the academic, literary weight — used for all major headings, speaker names, pricing amounts, and the plenary card names. Its serif form conveys tradition and research.
- **Instrument Sans** is the workhorse for readability — used for body copy, labels, subtitles, form fields, and admin UI. Clean, neutral, modern.
- **Noto Sans KR** is reserved for Korean-language brand text (`세계한류학회`, `한류` watermarks) — matching the logo's sans-serif Hangul.
- **Italic** (`<em>`) within DM Serif Display headings adds emphasis — used for "Hallyu Studies" and "Awards Night" subtitles.

## Layout & Spacing

### Grid System

- **Content max-width**: `1200px` (hero content: `800px`, section inner: `1100px`)
- **Content page grid**: `1fr 300px` (main + sidebar)
- **Padding**: `40px` left/right (all sections), reduced to `24px` at 900px, `20px` at 768px
- **Section Y-padding**: `100px` top/bottom (`72px` at 900px, `60px` at 768px)

### Component Grid Patterns

| Component | Grid Template | Min Column | Gap |
|-----------|---------------|------------|-----|
| Framework cards | `repeat(auto-fit, minmax(300px, 1fr))` | 300px | 20px |
| Speaker cards | `repeat(auto-fit, minmax(240px, 1fr))` | 240px | 24px |
| Committee cards | flex row, card width 220px | — | 24px |
| Track blocks | `1fr 1fr` → `1fr` (900px) | — | 32px |
| Timeline | `repeat(auto-fit, minmax(180px, 1fr))` | 180px | 0 |
| Pricing | `repeat(auto-fit, minmax(220px, 1fr))` | 220px | 20px |
| Publication cards | `repeat(auto-fit, minmax(240px, 1fr))` | 240px | 20px |
| Venue | `1.2fr 1fr` → `1fr` (900px) | — | 60px |
| Leadership (main) | `repeat(auto-fit, minmax(300px, 1fr))` | 300px | 40px |
| International board | `repeat(auto-fit, minmax(250px, 1fr))` | 250px | 16px |
| Admin stats | `repeat(auto-fit, minmax(200px, 1fr))` | 200px | 20px |

### Navigation Layout

- **Sticky nav** (congress): Height `68px`, max-width `1200px`, backdrop-filter blur
- **Main nav** (organization): Height `80px`, fixed position, glassmorphism (rgba white 0.95 + blur)
- **Mobile**: Hamburger toggle at 768px (main) / 900px (congress), dropdown menu

## Elevation & Depth

The design leans on **directional lighting** and **spatial depth** rather than strict shadow systems.

### Shadow Tokens

| Token | Value | Used On |
|-------|-------|---------|
| Card hover | `0 12px 40px rgba(10,22,40,0.06)` | Framework, submission, pricing cards |
| Committee card | `0 4px 20px rgba(0,0,0,0.4)` | Committee cards on dark bg |
| Committee hover | `0 8px 32px rgba(0,0,0,0.5)` | Committee card hover |
| Plenary card | `0 40px 100px rgba(0,0,0,0.6)` + glow | Plenary/Awards Night cards |
| Primary btn | `0 8px 30px rgba(205,46,58,0.3)` | Button hover |
| Photo glow | `0 8px 32px rgba(0,0,0,0.5), inset glow` | Plenary speaker photos |
| Video frame | `0 24px 80px rgba(0,0,0,0.4)` | Hero video wrapper |

### Background Depth Techniques

- **Radial gradient spotlights**: Hero uses layered radial gradients (`rgba(0,71,160,0.30)`, `rgba(205,46,58,0.20)`) to simulate stage lighting on dark backgrounds.
- **Film grain overlay**: Plenary section uses SVG fractal noise at 3% opacity for textural depth.
- **Animated particles**: 8 floating dot elements (3px, `var(--gold)`) with `plenary-float` keyframes in the plenary section.
- **Shimmer sweep**: `plenary-shimmer` animation on card hover — diagonal gradient sweep.
- **Pulse ring**: `plenary-pulse-ring` animates a `box-shadow` ring around plenary card photos.

## Shapes

### Border Radius System

| Level | Value | Usage |
|-------|-------|-------|
| None | `0` | Primary buttons, framework cards, submission cards, form inputs, pricing cards |
| Small (sm) | `6px` | PayPal button, venue button, admin buttons and filters |
| Medium (md) | `8px` | Admin stat cards, admin tables, membership cards, CTA button |
| Large (lg) | `12px` | Committee cards, leadership category boxes, content sidebar boxes |
| Extra large (xl) | `16px` | Congress CTA border, membership tier cards, membership login section |
| 28px | `28px` | Plenary cards (awards night) |
| Full (50%) | `50%` | Speaker/committee/plenary photo wraps, main nav logo |

### Borders & Accents

- **Card borders**: `1px solid var(--pearl)` (#e5e5e5) everywhere
- **Teal left accent**: `3px` left border on framework cards (appears on hover, `opacity: 0 → 1`)
- **Red/gold left accent**: `2px` left border on history events (appears on hover)
- **Gold bottom accent**: `40px` `2px` gold line under committee group titles
- **Animated wave divider**: `4px` gradient bar (`kr-blue → kr-red → kr-blue → kr-red`) with `gradientSlide` animation

## Components

### Navigation
**Sticky Nav (Congress)**: White background, border-bottom, 68px height, `backdrop-filter: blur(12px)`. Dropdown menus for "About" and "Congress" with `nav-dropdown` pattern. Hamburger at 900px.

**Main Nav (Organization)**: Fixed position, rgba white 0.95 + blur, 80px height. Logo as image (rounded full). Dropdown menus. Hamburger at 768px.

**Dropdown Pattern**: Position absolute `top: 100%`, white background, `box-shadow: 0 8px 24px rgba(0,0,0,0.1)`, 180px min-width. Pseudo-element `::before` creates invisible hover bridge from trigger to menu.

### Hero
Two distinct hero styles:
1. **Congress hero** (`.hero`): Full viewport height (`min-height: 100vh`), black background with radial gradient stage lighting. Animated entrance (`.fadeUp` keyframes at 0.2s staggered intervals). Watermark Korean text on right side.
2. **Main hero** (`.main-hero`): Shorter (`120px` padding), navy-to-deep-ocean gradient, centered content. "한류" watermark pseudo-element behind text.

### Buttons
- **`.btn-primary`**: Red (#CD2E3A), 16px 36px padding, square (0 radius), uppercase label, lift + shadow on hover
- **`.btn-outline`**: Transparent with white border (1.5px), same sizing, hover brightens border
- **`.btn-paypal`**: PayPal blue (#0070ba), 6px rounded, flex with icon support
- **`.admin-btn-*`**: Coral/teal/secondary variants, 6px radius, smaller padding

### Card Components
Cards share a consistent pattern: white background, pearl border, hover lift (`translateY(-3px)`), subtle shadow. Three categories:

1. **Light cards** (framework, submission, pricing): White bg, pearl border, cream/sand section backgrounds.
2. **Dark cards** (speaker, committee, publication): Translucent white bg (`rgba(255,255,255,0.04-0.08)`), white border, navy/black section backgrounds.
3. **Plenary cards**: Glassmorphism (gradient + blur), 28px radius, photo ring animation, shimmer overlay.

### Form Elements
- Input/select/textarea: Instrument Sans, cream background, pearl border, teal focus state
- Labels: Small (0.88rem), semibold, navy, required fields marked with red asterisk
- Grid: `1fr 1fr` for paired fields (collapses at 900px)
- Success state: Centered icon + heading + message

### Status Badges
Pill-shaped (`border-radius: 12px`), uppercase, letter-spaced. Five variants: pending (amber), accepted (green), rejected (red), revision (blue).

### Section Labels
Every section begins with an optional `.section-label`: 12px, bold, 3px letter-spacing, uppercase, always in `var(--coral)` or `var(--gold)`.

## Animations & Motion

| Animation | Elements | Duration | Timing |
|-----------|----------|----------|--------|
| `fadeUp` | Hero content items | 0.8s | cubic-bezier ease, staggered 0.2s |
| `reveal` → `visible` | Scroll-triggered sections | 0.7s | cubic-bezier(0.22, 1, 0.36, 1) |
| `waveShift` | Wave background SVG | 20s | ease-in-out infinite |
| `gradientSlide` | Wave divider | 6s | ease infinite |
| `plenary-shimmer` | Card shimmer overlay | 0.8s | ease forwards (on hover) |
| `plenary-float` | Floating particles | 4–5.8s | ease-in-out infinite |
| `plenary-pulse-ring` | Photo ring | 3s | ease-in-out infinite |
| `plenary-glow-rotate` | Glow ring | — | linear infinite |

### Hover States
All interactive card components share a `0.3s` transition duration. Common transformations:
- `translateY(-3px)` for card lift
- `scale(1.03–1.06)` for photo zoom
- Border color shift to teal or red
- Box shadow intensification

## Do's and Don'ts

### Do
- Use `.btn-primary` (coral) for the primary action on any page; use `.btn-outline` (white border) for secondary on dark backgrounds
- Alternate section backgrounds: white → sand → navy → white (colors flow naturally)
- Keep hero content centered with wide margins — this is an academic organization, not a product launch
- Use DM Serif Display for **all** heading elements — it's the single source of typographic authority
- Repeat the Korean identity: flag colors in dividers, Korean watermarks, Noto Sans KR for Hangul text

### Don't
- Don't use rounded corners on primary buttons — the square shape signals formality
- Don't add decorative illustrations beyond the logo — visual interest comes from lighting and typography
- Don't use Instrument Sans for headings — it erodes the scholarly character
- Don't place light cards on light backgrounds or dark cards on dark backgrounds — always alternate
- Don't mix the two nav systems (`.sticky-nav` vs `.main-nav`) on the same page — they're for different site tracks
- Don't forget the animated wave divider between major sections — it's a signature element

## Admin Dashboard

The admin area is visually distinct: clean, utilitarian, with a separate design language.

- **Background**: Slate-50 (`#f8fafc`)
- **Header**: Navy (`#000`), DM Serif Display title, logout link
- **Content**: 1200px max, 32px padding
- **Stat cards**: White, `#e2e8f0` border, 8px radius — label up top (0.85rem, uppercase), value below (2.5rem DM Serif Display)
- **Tables**: White, `#e2e8f0` border, collapsed. Styled headers (background `#f8fafc`, uppercase). Hover row highlight.
- **Tabs**: Underline-style (`border-bottom: 2px`), coral active state
- **Modals**: Fixed overlay (rgba black 0.5), centered white card, 8px radius, max 600px width

### Admin-specific Components

- `.admin-btn-primary`: Coral background, white text
- `.admin-btn-teal`: Teal background (for member-related actions)
- `.admin-btn-secondary`: Slate-200 background
- `.admin-filter-select`: Form selects with `#e2e8f0` borders
- `.admin-detail-grid`: `160px 1fr` label-value grid for detailed views
