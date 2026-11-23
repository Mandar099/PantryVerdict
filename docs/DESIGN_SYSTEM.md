# PantryVerdict — Design System & Editorial Aesthetics

---

## 1. Aesthetic Thesis: Kitchen-Laboratory Meets Swiss Editorial

PantryVerdict deliberately rejects generic AI templates (purple-blue floating neon gradients, soulless generic cards, uninspired stock vectors). Instead, it adopts a **tactile, culinary-laboratory editorial visual language** calibrated against six world-class benchmark design systems.

---

## 2. Benchmark Design Inspirations

### 1. Modulify (`modulify.ai/templates`) — Bento Grid & Hairline Structure
- **Bento Hierarchy**: Clean rectangular modular modules delineated by `1px solid` hairline borders.
- **Micro-Gaps**: 16px to 24px spatial separation between editorial blocks with high-contrast surfaces.
- **Asymmetric Balance**: Data density is countered with breathable white space, mirroring modern editorial recipe books and culinary journals.

### 2. Landdding (`landdding.com`) — Editorial Typography & Color Tokens
- **Display Serif**: `Fraunces` / `Instrument Serif` for commanding hero titles, editorial verdicts, and brand identity.
- **UI Geometric Sans**: `Plus Jakarta Sans` for responsive interactive controls, labels, and table cells.
- **Tabular Monospace**: `JetBrains Mono` for all nutritional figures, smoke points, prices, and NOVA scores to ensure zero-jitter numeric alignment.
- **Color Palette**:
  - **Canvas Background**: Warm Alabaster (`#FAF8F5`)
  - **Card Surface**: Pure Snow / Milk Glass (`#FFFFFF` with subtle `#F5F2EB` accents)
  - **Primary Ink**: Deep Cast-Iron Charcoal (`#18181B`)
  - **Secondary Ink**: Kitchen Graphite (`#52525B`)
  - **Muted Stone Hairlines**: `#E5E0D8` (hairline `1px`)
  - **Cold-Pressed Olive (Accent)**: `#2D5A27` (Clean labels, healthy ratios, primary CTA)
  - **Turmeric Amber (Highlight)**: `#D97706` (Moderate processing, heat alerts)
  - **Terracotta Saffron (Warning)**: `#C2410C` (Ultra-processed, chemical refining, high saturated fat)

### 3. Motionin (`motionin.design`) — Natural Spring Physics & Micro-Interactions
- **Spring Transition Curve**: `cubic-bezier(0.22, 1, 0.36, 1)` for snappy, organic mechanical easing.
- **Magnetic Feedback**: Subtle button elevation (`translateY(-2px)`) on hover.
- **Spotlight Cards**: Cursor-aware spotlight border glow on ingredient cards (disabled when `prefers-reduced-motion` is detected).
- **Sticky Header Transitions**: Comparison matrix column headers slide and pin smoothly on vertical scroll.

### 4. 60fps (`60fps.design`) — App-Grade Framer-Rate Performance
- **GPU-Accelerated Compositing**: All animations restricted strictly to `transform` and `opacity` properties to prevent CPU layout thrashing.
- **Sliding Pill Indicators**: Category filter tabs slide smoothly behind active options with spring damping.
- **Animated Nutrient Bars**: Nutrient meters animate smoothly from `0%` to their proportional width on mount.
- **Skeleton Shimmer**: High-fidelity pulse animation reflecting actual card typography and badge positions.

### 5. Recent (`recent.design`) — Tactile Badges & Metadata Precision
- **Nutri-Score Badges**: Crisp 5-tier pill system (`A` Deep Green, `B` Light Olive, `C` Yellow, `D` Amber, `E` Terracotta).
- **NOVA Group Badges**:
  - `NOVA 1`: Unprocessed or Minimally Processed (Cold-pressed, whole grains)
  - `NOVA 2`: Processed Culinary Ingredients (Ghee, butter, cane sugar, salt)
  - `NOVA 3`: Processed Foods
  - `NOVA 4`: Ultra-Processed (Solvent-extracted oils with antifoam E900, emulsified syrups)
- **Smoke Point Badges**: Exact temperature indicator with flame icon and heat tier categorization.

### 6. Footer (`footer.design`) — Signature Oversized Architectural Footer
- **Edge-to-Edge Wordmark**: Bold display headline `PANTRYVERDICT` spanning the bottom container.
- **Live System Indicator**: Pulsing green dot with active data source status.
- **Keyboard Shortcut Pill**: Displays `/` for Search and `C` for Comparison Dock.
- **Data Attribution Links**: Direct links to Open Food Facts and USDA FoodData Central with open licensing notices.

---

## 3. Typography Scale & Hierarchy

| Token | Family | Size | Weight | Line Height | Usage |
|:---|:---|:---|:---|:---|:---|
| `font-display` | Fraunces, serif | 2.5rem – 4rem (40–64px) | 600 / SemiBold | 1.1 | Hero headlines, oversized footer |
| `font-serif-sub`| Fraunces, serif | 1.5rem – 2rem (24–32px) | 500 / Medium | 1.25 | Comparison winners, section titles |
| `font-sans-body`| Plus Jakarta Sans, sans-serif | 1rem (16px) | 400 / Normal | 1.5 | Card body, descriptions, notes |
| `font-sans-ui`  | Plus Jakarta Sans, sans-serif | 0.875rem (14px) | 500 / 600 | 1.4 | Buttons, category tabs, filter labels |
| `font-mono-num` | JetBrains Mono, monospace | 0.875rem – 1.25rem | 500 / 700 | 1.0 | Nutrients, prices, smoke points |

---

## 4. Spacing, Grid & Elevation Scale

- **Grid System**: 12-column responsive grid on desktop (`gap-6`), 2-column bento on tablets, 1-column responsive cards on mobile.
- **Hairlines**: `1px solid var(--border-stone)`.
- **Corner Radii**:
  - Modals & Drawers: `16px` (`rounded-2xl`)
  - Bento Cards: `12px` (`rounded-xl`)
  - Pills & Chips: `9999px` (`rounded-full`)
- **Shadow Scale**:
  - `shadow-sm`: `0 1px 2px rgba(24, 24, 27, 0.04)`
  - `shadow-editorial`: `0 8px 30px rgba(24, 24, 27, 0.06), 0 1px 3px rgba(24, 24, 27, 0.04)`
  - `shadow-dock`: `0 20px 40px -10px rgba(24, 24, 27, 0.16)`

---

## 5. Accessibility & Motion Rules (WCAG AA)

- All text meets or exceeds a **4.5:1** contrast ratio against backgrounds.
- High-contrast interactive states with visible focus rings (`focus-visible:ring-2 focus-visible:ring-[#2D5A27] focus-visible:outline-none`).
- Strict support for `@media (prefers-reduced-motion: reduce)`: All spring transitions, card glows, and progress bar animations collapse to instantaneous transitions.
