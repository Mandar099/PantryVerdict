# PantryVerdict — Engineering Task & Execution Matrix

---

## Phase 1: Pre-Build Engineering Documentation (Mandatory)
- [x] **Task 1.1**: Author `README.md` with system overview, architecture, attributions, and setup instructions.
- [x] **Task 1.2**: Author `docs/PRD.md` with problem statement, personas, user stories, acceptance criteria, and edge cases.
- [x] **Task 1.3**: Author `docs/ARCHITECTURE.md` with component hierarchy, state flow, caching, and fallback tree.
- [x] **Task 1.4**: Author `docs/DESIGN_SYSTEM.md` mapping tokens, typography, and motion to the 6 benchmark inspirations.
- [x] **Task 1.5**: Author `docs/API_SPEC.md` covering Open Food Facts, USDA, debounce rules, and normalization contracts.
- [x] **Task 1.6**: Author `docs/SECURITY.md` covering XSS prevention, Web Crypto SHA-256 spec, clamping, and WCAG AA checklist.
- [x] **Task 1.7**: Author `docs/TASKS.md` tracking execution through every phase.

---

## Phase 2: Project Scaffolding & Design Foundation
- [x] **Task 2.1**: Initialize React 18+ TypeScript application with Vite and Tailwind CSS.
- [x] **Task 2.2**: Configure Google Fonts (`Fraunces`, `Plus Jakarta Sans`, `JetBrains Mono`) and Tailwind theme tokens.
- [x] **Task 2.3**: Install Lucide React icons and build CSS spring physics and editorial styling utilities.
- [x] **Task 2.4**: Define core TypeScript interfaces (`Ingredient`, `Nutriments`, `SmokePointInfo`, `Comparison`, `User`).

---

## Phase 3: Data Layer & Culinary Intelligence Engine
- [x] **Task 3.1**: Build rich curated culinary database (`data/culinaryData.ts`) covering 40+ staples (Oils, Ghee, Flours, Grains, Salts, Sweeteners, Pulses, Spices) with accurate smoke points, NOVA groups, fatty acid profiles, and base pricing.
- [x] **Task 3.2**: Implement deterministic culinary Q&A engine (`data/culinaryQAEngine.ts`) with smart search parsing and cooking recommendations.
- [x] **Task 3.3**: Implement unified data service (`services/ingredientService.ts`) with Open Food Facts API v2/v3 fetching, USDA enrichment, 450ms debouncing, in-memory caching, and instant fallback guarantees.
- [x] **Task 3.4**: Implement Web Crypto API hashing (`services/cryptoService.ts`) for salted SHA-256 client authentication.
- [x] **Task 3.5**: Implement persistent storage sync (`services/storageService.ts`) for favorites, custom prices, and comparison boards.

---

## Phase 4: State Management & Core Application Contexts
- [x] **Task 4.1**: Build `PantryContext` managing comparison dock items (1–4), favorites, custom local store prices, and dynamic cost calculations.
- [x] **Task 4.2**: Build `AuthContext` supporting 1-click instant demo login, salted account creation, guest access, and kitchen dietary goals.
- [x] **Task 4.3**: Build `ToastContext` providing accessible success, error, and informational toast notifications.

---

## Phase 5: UI Components & Editorial Design Assembly
- [x] **Task 5.1**: Build `Header` component with live API status indicator, search shortcut indicator, "My Pantry" saved staple counter, clickable logo, and responsive mobile hamburger menu.
- [x] **Task 5.2**: Build `HeroSearch` with 450ms debounced search input, keyboard shortcut (`/`), clear button, and live database stats.
- [x] **Task 5.3**: Build `CategoryBar` with horizontal quick-jump chips for culinary staple categories.
- [x] **Task 5.4**: Build `FilterSidebar` (desktop sticky sidebar and mobile slide-over sheet) with smoke point, NOVA, and Nutri-Score toggles.
- [x] **Task 5.5**: Build `IngredientCard` with interactive custom store price input, dynamic cost per 100g/100ml recalculation, Nutri-Score/NOVA/Smoke Point badges, and "+ Compare" action.
- [x] **Task 5.6**: Build `ComparisonDock` floating glassmorphic bottom bar with slot indicator (X/4), thumbnail pills, and "Compare Now" trigger.
- [x] **Task 5.7**: Build `ComparisonMatrix` modal and drawer featuring winner crown badges, proportional animated macro bars, heat stability inspector, additive transparency, deterministic verdict summary, CSV/Print export, and mobile 2-column switcher.
- [x] **Task 5.8**: Integrate Google Gemini Flash API (`services/geminiService.ts`) with model fallback cascade for precise culinary and food-science research.
- [x] **Task 5.9**: Build `QADrawer` ("Ask PantryVerdict AI") with live Gemini Flash AI deep research and instant culinary science verdicts.
- [x] **Task 5.10**: Build `AuthModal` with interactive split-screen reactive kitchen card preview, animated tabs, password strength meter, and 1-click demo login.
- [x] **Task 5.11**: Build `MyPantryDrawer` for viewing bookmarked staple ingredients and personal notes.
- [x] **Task 5.12**: Build signature oversized architectural `Footer` with edge-to-edge `PANTRYVERDICT` wordmark, live status indicator, clickable telephone (`tel:`), clickable email (`mailto:`), and dynamic copyright year.

---

## Phase 6: Verification, Testing & Polish
- [x] **Task 6.1**: Run TypeScript type-check and Vite build to guarantee zero errors and zero warnings.
- [x] **Task 6.2**: Verify desktop and mobile responsiveness, keyboard shortcuts (`/`, `C`, `Esc`), and accessibility compliance.
- [x] **Task 6.3**: Verify offline resilience by simulating network disconnect and validating instant fallback to the curated 40+ staple database.
- [x] **Task 6.4**: Start local development server, conduct live testing, update all task checkboxes, and deliver completion summary.
- [x] **Task 6.5**: Curate exact, verified, high-definition food images for all staple items with automatic fallback protection.
- [x] **Task 6.6**: Add SVG favicon, OpenGraph meta tags, Twitter card, dynamic page title, and custom 404 view.
- [x] **Task 6.7**: Resolve image mismatch issues by creating bespoke Food Visual engine (`src/components/common/FoodVisual.tsx`) with 34 unique graphic configurations.
- [x] **Task 6.8**: Resolve sentence display clipping: removed arbitrary `line-clamp` and `truncate` across cards, comparison matrix suitability maps, and Q&A drawers.
- [x] **Task 6.9**: Studio-grade editorial auth redesign: asymmetric split-screen layout, reactive kitchen ledger dossier with live ingredient score adaptation, GPU-accelerated sliding tab switcher, real-time password strength meter, shake error feedback, and complete purge of prototype/demo copy.
- [x] **Task 6.10**: Zero-Error HD Photography Pipeline (`services/imageResolver.ts`): Wikimedia Commons MediaWiki API resolution, strict resolution/aspect filtering (>=600px, no icons/maps), localStorage caching (`pv_img_cache_v2`), and curated `VERIFIED_INGREDIENT_IMAGES` dictionary for all 34 staples.
- [x] **Task 6.11**: Zero-FOUC Editorial AppPreloader (`components/AppPreloader.tsx`): 60fps curtain reveal with Fraunces serif wordmark, 2px olive progress bar, font readiness check, above-the-fold image preloading, scroll lock, and reduced-motion support.
- [x] **Task 6.12**: Integrated Delivery Truck loader from Uiverse.io by yeisonordonez (`components/common/DeliveryTruckLoader.tsx`) with scoped CSS classes, scaled container, and credit attribution into the AppPreloader and export index.
- [x] **Task 6.13**: Fixed 25-page PDF duplicate printing bug: added isolated `@media print` rules, `@page { size: A4 landscape; margin: 8mm 10mm; }`, hidden background catalog chrome (`display: none !important`), static inline unrolling of fixed overlay/modals, and compact table layout ensuring exact 1-page output.
