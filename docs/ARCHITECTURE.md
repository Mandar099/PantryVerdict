# PantryVerdict — Architecture & Engineering Blueprint

---

## 1. High-Level Architecture Overview

PantryVerdict is structured as an offline-first, client-driven React/TypeScript single-page application built on top of a resilient **Tri-Layer Data Architecture**:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                              │
│  [Hero Search] [Category Chips] [Bento Grid Cards] [Comparison Dock]   │
│  [Comparison Matrix] [Q&A Assistant Drawer] [Auth & Kitchen Profile]   │
└────────────────────────────────────▲───────────────────────────────────┘
                                     │ State & Actions
┌────────────────────────────────────┴───────────────────────────────────┐
│                      APPLICATION STATE ENGINE                          │
│   • PantryContext: Saved Items, Active Comparisons (1-4), Boards       │
│   • AuthContext: Active User, Web Crypto Auth, Kitchen Goals           │
│   • FilterContext: Query, Category, Smoke Point, NOVA, Dietary Goals   │
└────────────────────────────────────▲───────────────────────────────────┘
                                     │ Service Calls
┌────────────────────────────────────┴───────────────────────────────────┐
│                     UNIFIED DATA SERVICE LAYER                         │
│                    `services/ingredientService.ts`                     │
│                                                                        │
│   ┌──────────────────────────────────────────────────────────────┐    │
│   │ 1. Memory Cache Layer (Key-Value TTL Map & In-flight Abort)  │    │
│   └───────────────┬──────────────────────────────┬───────────────┘    │
│                   │                              │                     │
│   ┌───────────────▼──────────────┐ ┌─────────────▼───────────────┐    │
│   │ Open Food Facts API (v2/v3)  │ │ USDA FoodData Central API   │    │
│   │ - Debounced (450ms)          │ │ - Demo Key                  │    │
│   │ - User-Agent Header          │ │ - Baseline staples          │    │
│   └───────────────┬──────────────┘ └─────────────┬───────────────┘    │
│                   │                              │                     │
│                   └───────────────┬──────────────┘                     │
│                                   │ (Fallback / Enrichment)            │
│   ┌───────────────────────────────▼──────────────────────────────┐    │
│   │ 2. Curated Culinary Knowledge Base (`data/culinaryData.ts`)  │    │
│   │ - 40+ staples (Oils, Ghee, Flours, Grains, Salts, Sugars)    │    │
│   │ - Smoke Points (°C/°F), Extraction Types, Fatty Acid Ratios  │    │
│   │ - Base Market Pricing & Rule-Based Culinary Verdicts         │    │
│   └──────────────────────────────────────────────────────────────┘    │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Directory & File Organization

```
pantryverdict/
├── index.html                   # HTML5 Entry, Google Fonts, Meta tags
├── package.json                 # Dependencies & build scripts
├── tsconfig.json                # Strict TypeScript configuration
├── vite.config.ts               # Vite bundler configuration
├── tailwind.config.js           # Editorial design system token mapping
├── postcss.config.js            # PostCSS plugins
├── docs/                        # Engineering documentation
│   ├── PRD.md
│   ├── ARCHITECTURE.md
│   ├── DESIGN_SYSTEM.md
│   ├── API_SPEC.md
│   ├── SECURITY.md
│   └── TASKS.md
├── src/
│   ├── main.tsx                 # Root bootstrapping
│   ├── App.tsx                  # Main layout & composition
│   ├── index.css                # Tailwind directives & editorial typography
│   ├── types/
│   │   ├── ingredient.ts        # Ingredient, Nutriments, SmokePoint, NOVA schemas
│   │   ├── comparison.ts        # Comparison state & winner computation types
│   │   └── user.ts              # User profile, goals, auth types
│   ├── data/
│   │   ├── culinaryData.ts      # 40+ Curated staple ingredients & metadata
│   │   └── culinaryQAEngine.ts  # Deterministic Q&A rules & search index
│   ├── services/
│   │   ├── ingredientService.ts # Unified API fetching & normalization
│   │   ├── cryptoService.ts     # Web Crypto SHA-256 salted hashing
│   │   └── storageService.ts    # localStorage & IndexedDB synchronization
│   ├── context/
│   │   ├── PantryContext.tsx    # Comparison dock, favorites, custom prices
│   │   └── AuthContext.tsx      # Authentication, sessions, kitchen profile goals
│   └── components/
│       ├── common/
│       │   ├── Badge.tsx        # Nutri-score, NOVA, Smoke point pill badges
│       │   ├── Modal.tsx        # Accessible backdrop & dialog container
│       │   ├── NutrientBar.tsx  # Proportional animated macro bar
│       │   └── Skeleton.tsx     # Tactile shimmer loading states
│       ├── layout/
│       │   ├── Header.tsx       # Top navigation, status indicator, auth trigger
│       │   ├── CategoryBar.tsx  # Horizontal quick-jump category chips
│       │   ├── HeroSearch.tsx   # Search input, keyboard shortcuts, stats
│       │   └── Footer.tsx       # Oversized architectural editorial footer
│       ├── ingredients/
│       │   ├── IngredientCard.tsx # Bento grid card with dynamic price math
│       │   ├── IngredientGrid.tsx # 12-column responsive grid layout
│       │   └── FilterSidebar.tsx  # Desktop sidebar & mobile filter sheet
│       ├── comparison/
│       │   ├── ComparisonDock.tsx   # Floating glassmorphic bottom bar
│       │   ├── ComparisonMatrix.tsx # Full side-by-side modal & drawer
│       │   └── VerdictBanner.tsx    # Rule-based winners & culinary verdict
│       ├── qa/
│       │   └── QADrawer.tsx     # "Ask PantryVerdict" interactive drawer
│       └── auth/
│           ├── AuthModal.tsx    # Tabbed modal: Sign In / Create / 1-Click Demo
│           └── KitchenCardPreview.tsx # Reactive preview of user kitchen goals
```

---

## 3. State Management Flow

1. **Comparison State (`PantryContext`)**:
   - `comparedItems: Ingredient[]`: Array with length bounded between `0` and `4`.
   - `addToComparison(item: Ingredient)`: Pushes item to dock if length < 4; triggers tactile feedback or alert if full.
   - `removeFromComparison(id: string)`: Removes item by ID.
   - `clearComparison()`: Clears the dock.
   - `userPrices: Record<string, { price: number; unitVolume: number }>`: Stores user-adjusted local store prices, persisting to `localStorage`.
   - `favorites: string[]`: IDs of bookmarked ingredients in "My Pantry".
2. **Filter & Search State**:
   - `query`: String with 450ms debounce.
   - `category`: Selected category (`All`, `Cooking Oils`, `Ghee & Butter`, `Flours & Atta`, `Rice & Grains`, `Sweeteners`, `Salts`, `Pulses & Lentils`, `Spices`).
   - `filters`:
     - `coldPressedOnly`: boolean
     - `highSmokePoint`: boolean (> 200°C)
     - `nutriScoreAB`: boolean
     - `novaGroup1`: boolean (unprocessed)
   - `sortBy`: `'health'` | `'smokePoint'` | `'priceValue'` | `'protein'`.
3. **Authentication State (`AuthContext`)**:
   - `user: UserProfile | null`: Current active profile.
   - `kitchenGoals`: Array of user dietary priorities (`heartHealth`, `highProtein`, `cleanLabels`, `budgetFriendly`).
   - `login(email, password)`: Computes `SHA-256(password + salt)` and matches saved user records in local storage.
   - `loginDemo()`: Instant 1-click active session with pre-configured culinary preferences.
   - `logout()`: Clears active session token.

---

## 4. Caching & Fallback Cascade

To guarantee **zero downtime**, the unified service executes the following fallback chain:

```
[ Request: searchIngredients("groundnut oil") ]
                    │
                    ▼
          [ In-Memory Cache Hit? ]
          ├── YES ──► Return cached result immediately (TTL: 10 mins)
          └── NO  ──┐
                    ▼
          [ Fetch Open Food Facts API ]
          ├── SUCCESS (200 OK)
          │     │
          │     ├── Normalize JSON payload into strict Ingredient schema
          │     ├── Enrich with Culinary Knowledge Base (Smoke Point, Fatty Acid breakdown)
          │     └── Store in Memory Cache & Return
          │
          └── TIMEOUT / ERROR (429, 503, Network Offline)
                │
                ▼
          [ Local Culinary Knowledge Base Fallback ]
                │
                ├── Filter 40+ curated records using fuzzy search
                ├── Mark items with `source: 'curated_offline'`
                └── Return rich offline records with zero user interruption
```

---

## 5. Component Hierarchy & Render Trees

```
<App>
  ├── <Header />
  │     ├── BrandLogo
  │     ├── LiveStatusIndicator
  │     ├── SearchShortcutIndicator ("/")
  │     ├── SavedPantryTrigger ("My Pantry (X)")
  │     └── AuthProfileTrigger
  ├── <main>
  │     ├── <HeroSearch />
  │     │     ├── SearchInputBox (with clear & icon)
  │     │     └── LiveDatabaseStats (40+ Staples, 2 API Sources)
  │     ├── <CategoryBar /> (Horizontal scrollable chips)
  │     └── <div className="bento-container">
  │           ├── <FilterSidebar /> (Desktop sticky / Mobile bottom drawer)
  │           └── <IngredientGrid>
  │                 ├── <IngredientCard /> (Dynamic price calc, badges, +Compare)
  │                 └── ...
  ├── <ComparisonDock /> (Floating bottom bar, rendered when comparedItems.length > 0)
  ├── <ComparisonMatrix /> (Modal triggered by "Compare Now", 1-4 items)
  │     ├── StickyHeaderRow
  │     ├── WinnerBadgesRow
  │     ├── MacroNutrientBars
  │     ├── SmokePointHeatStability
  │     ├── AdditivesAndNOVAInspector
  │     └── ExportOptions (CSV / Print)
  ├── <QADrawer /> ("Ask PantryVerdict" culinary rule engine)
  ├── <AuthModal /> (Split-screen with interactive live Kitchen Card)
  └── <Footer /> (Oversized architectural footer with shortcuts & attributions)
```
