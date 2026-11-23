# PantryVerdict 🍳

> **Everyday Cooking Ingredient Comparison Platform**  
> Centralizing verified nutrition, processing transparency (NOVA scores), heat stability (smoke points), and true cost-per-unit metrics into one editorial, tactile, high-performance interface.

---

## 📖 Overview

Shoppers and home cooks encounter scattered, misleading claims on pantry essentials: cooking oils, ghee, flours, grains, salts, and sweeteners. A single grocery shelf displays labels touting "heart-healthy," "organic," "wood-pressed," or "light," but hides high omega-6 ratios, unstable smoke points for deep frying, or high solvent processing.

**PantryVerdict** solves this by unifying verified public food datasets (**Open Food Facts**, **USDA FoodData Central**) with an expert culinary intelligence engine. It empowers consumers to:
- Instantly cross-examine up to **4 ingredients side-by-side** in a tactile comparison dock.
- Inspect **smoke points (°C / °F)** and ideal cooking tolerances (deep frying, high-heat tadka, baking, salad dressing).
- Analyze **NOVA processing groups (1–4)** and clean vs. additive-laden label transparency.
- Calculate **true normalized cost per 100g/100ml** and cost per 10g of protein/healthy fats using dynamic local store pricing inputs.
- Query the interactive **"Ask PantryVerdict"** rule-based culinary intelligence assistant for instant answers (e.g., *"Best oil for deep frying"* or *"Lowest glycemic sweetener"*).
- Save personalized kitchen boards, bookmark staples to **"My Pantry"**, and customize health goals with zero-friction client-side persistence and Web Crypto SHA-256 account security.

---

## ⚡ Quick Start & Development Setup

### Prerequisites
- **Node.js**: v18.0.0 or later (Tested on Node v24+)
- **Package Manager**: `npm` (v9+) or `pnpm`

### Installation & Launch

```bash
# Navigate to the project root
cd "C:\Users\Mandar Shetty\.gemini\antigravity\scratch\pantryverdict"

# Install dependencies
npm install

# Start the Vite development server
npm run dev

# Build for production and run type checks
npm run build
npm run preview
```

The application will be live at `http://localhost:5173/`.

---

## 🏛️ System Architecture Summary

- **Frontend Core**: React 18+ / TypeScript / Vite / Tailwind CSS with Lucide Icons.
- **Design Philosophy**: High-contrast Swiss editorial aesthetic inspired by Modulify, Landdding, Motionin, 60fps, Recent, and Footer.design (Warm Alabaster `#FAF8F5`, Deep Charcoal `#18181B`, Cold-Pressed Olive `#2D5A27`, Turmeric Amber `#D97706`).
- **Resilient Data Layer**: Unified `ingredientService` combining:
  1. **Open Food Facts API v2/v3** (search and barcoded packaged products with customized User-Agent header, debounced at 450ms).
  2. **USDA FoodData Central API** (baseline agricultural micronutrient reference).
  3. **Curated Culinary Intelligence Engine** (40+ staple ingredients with smoke points, culinary applications, NOVA classification, fatty acid profiles, and baseline prices).
- **Zero-Barrier Client Auth & Storage**:
  - Web Crypto API (`SHA-256` hashing with per-user salt).
  - Multi-tenant offline storage in `localStorage` + IndexedDB fallback.
  - Zero required passwords or third-party OAuth barriers for full app functionality.

---

## 🌐 Free Data & API Attributions

1. **Open Food Facts**:
   - Database of food products from around the world.
   - Licensed under Open Database License (ODbL).
   - Endpoints queried via rate-friendly, client-debounced search with `User-Agent: PantryVerdict/1.0 (culinary-comparison)`.
2. **USDA FoodData Central**:
   - Food and nutrient data provided by the U.S. Department of Agriculture, Agricultural Research Service.
   - Public domain reference data accessed via open demo endpoint.
3. **Culinary Kitchen Reference Data**:
   - Curated smoke point research compiled from peer-reviewed food chemistry standards and edible oil processing literature.

---

## 📂 Documentation Directory

Explore the complete engineering blueprints located in `/docs`:
- [`PRD.md`](file:///C:/Users/Mandar%20Shetty/.gemini/antigravity/scratch/pantryverdict/docs/PRD.md) — Product requirements, user personas, acceptance criteria, and edge cases.
- [`ARCHITECTURE.md`](file:///C:/Users/Mandar%20Shetty/.gemini/antigravity/scratch/pantryverdict/docs/ARCHITECTURE.md) — Architectural patterns, state flow, caching, and fallback trees.
- [`DESIGN_SYSTEM.md`](file:///C:/Users/Mandar%20Shetty/.gemini/antigravity/scratch/pantryverdict/docs/DESIGN_SYSTEM.md) — Editorial typography, color tokens, bento grid layout, and spring physics.
- [`API_SPEC.md`](file:///C:/Users/Mandar%20Shetty/.gemini/antigravity/scratch/pantryverdict/docs/API_SPEC.md) — Network endpoints, payload normalization schemas, and rate-limiting specs.
- [`SECURITY.md`](file:///C:/Users/Mandar%20Shetty/.gemini/antigravity/scratch/pantryverdict/docs/SECURITY.md) — XSS prevention, Web Crypto auth specification, and WCAG AA guidelines.
- [`TASKS.md`](file:///C:/Users/Mandar%20Shetty/.gemini/antigravity/scratch/pantryverdict/docs/TASKS.md) — Execution roadmap and build tracking checklist.

---

## 📜 License & Compliance

MIT License. Developed with pride for home chefs, health-conscious shoppers, and kitchen tinkerers.
