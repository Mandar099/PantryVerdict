# PantryVerdict — Product Requirements Document (PRD)

---

## 1. Problem Statement & Mission

Every day, grocery shoppers and home cooks purchase pantry fundamentals: cooking oils, ghee, flours, grains, salts, sweeteners, pulses, and spices. However, packaged food marketing obscures critical culinary and health realities:
- **Refined vs. Cold-Pressed Oils**: Labels boast "light" or "zero cholesterol" while masking chemical solvent extraction (hexane) and high polyunsaturated fatty acid (PUFA) degradation under heat.
- **Unclear Smoke Points**: Cooking with Extra Virgin Olive Oil at frying temperatures generates acrolein and oxidized lipids, while Refined Groundnut or Ghee handles high-heat tadka effortlessly.
- **Hidden Processing (NOVA Grades)**: Flours and grains are often stripped of germ and bran or fortified with undisclosed processing aids.
- **Deceptive Packaging Sizes**: Unequal container volumes make real cost comparisons difficult (e.g., ₹180 for 400ml vs. ₹240 for 500ml vs. $4.99 for 16.9 fl oz).

**PantryVerdict's Mission**: Provide a single, editorial, tactile kitchen platform that computes objective health scores, verifies heat stability (smoke point), demystifies processing grades (NOVA 1–4), and normalizes unit pricing into true actionable clarity.

---

## 2. Target Personas

### Persona A: Chef Siddharth (The Discerning Home Cook)
- **Goal**: Needs exact smoke points and culinary applications for regional and international recipes (stir-fry vs. deep fry vs. finishing drizzle).
- **Pain Point**: Generic nutrition labels don't state heat breakdown thresholds or flavour extraction compatibility.
- **Need**: Direct smoke point comparison, oil extraction methodology (cold-pressed / expeller / refined), and culinary recommendation tags.

### Persona B: Priya (The Health-Minded Family Shopper)
- **Goal**: Choosing wholesome cooking mediums for family meals, minimizing ultra-processed oils and high saturated fats without spending excessively.
- **Pain Point**: Confusing health claims on branded sunflower and canola oils; conflicting advice regarding Ghee vs. Butter vs. Mustard Oil.
- **Need**: Clear Nutri-Score, NOVA Group classification, clear saturated vs. monounsaturated fat breakdowns, and clean single-ingredient verification.

### Persona C: Kevin (The Fitness & Nutrition Enthusiast)
- **Goal**: Maximize protein per calorie and healthy monounsaturated fats while monitoring sodium and refined carbohydrates.
- **Pain Point**: Comparing different brands of whole wheat atta vs. almond flour vs. quinoa, and calculating cost per 10g protein.
- **Need**: Dynamic price calculator providing "Cost per 10g Protein / Healthy Fat" and side-by-side macro bar charts.

### Persona D: Maya (The Budget-Conscious Student Cook)
- **Goal**: Get the highest quality pantry staples within a strict weekly budget.
- **Pain Point**: Store brands vs. premium brands appear identical, but volumes and quality vary wildly.
- **Need**: Interactive local price input that instantly reveals true cost per 100g/100ml.

---

## 3. Core User Stories

| ID | As a... | I want to... | So that I can... |
|:---|:---|:---|:---|
| **US-01** | Shopper | Search or select an ingredient category (e.g., Oils, Ghee, Flours) | View curated staple varieties and real branded products instantly. |
| **US-02** | Home Cook | Add 2 to 4 ingredients into a persistent comparison dock | Review their attributes side-by-side in a synchronized matrix. |
| **US-03** | Cook | View the smoke point and recommended cooking technique | Avoid burning oils or creating carcinogens during high-heat frying. |
| **US-04** | Parent | Inspect the NOVA processing group and ingredient list | Avoid emulsifiers, antifoaming agents, and chemical refining additives. |
| **US-05** | Budgeter | Input the price I see at my local grocery store | Instantly see true normalized cost per 100g/100ml and cost per nutrient. |
| **US-06** | Curious User | Ask natural culinary queries in "Ask PantryVerdict" | Get instant deterministic culinary recommendations without relying on slow or hallucinating AI models. |
| **US-07** | Returning User| Create an account or sign in with 1-click demo access | Save custom comparison boards, favorite staples, and custom store pricing. |
| **US-08** | Mobile User | Compare ingredients on my smartphone | Easily switch between compared items using a 2-column sticky selector without horizontal table breaking. |

---

## 4. Key Workflows & User Journey

```
[ Landing Page ]
     │
     ├── 1. Browse Category Chips or Type in Search Bar (e.g. "mustard oil", "atta")
     │        │
     │        ▼
     │   [ Filterable Ingredient Bento Grid ]
     │        │
     │        ├── Inspect cards (Smoke point, Nutri-score, NOVA, Fatty acid gauge)
     │        ├── Enter custom store price (Recalculates True Cost per 100g)
     │        └── Click "+ Compare" (Adds up to 4 items into floating Comparison Dock)
     │
     ├── 2. Open [ Comparison Matrix Modal / Drawer ]
     │        │
     │        ├── Side-by-Side Macro & Micronutrient Proportional Bars
     │        ├── Heat Stability & Culinary Application Badges
     │        ├── Processing & Additive Inspector (Flagged vs Clean)
     │        ├── Deterministic "Verdict Summary" (Crown Badges for best in class)
     │        └── Export to CSV / Print-Ready Sheet / Save to Kitchen Board
     │
     ├── 3. Open [ "Ask PantryVerdict" Q&A Drawer ]
     │        │
     │        └── Type question -> Instant culinary rule-engine matches & suggests best picks
     │
     └── 4. [ Kitchen Profile / Authentication ]
              │
              ├── 1-Click Demo Login, Guest Access, or Salted SHA-256 Account Creation
              └── Real-time interactive profile card reflecting chosen kitchen dietary goals
```

---

## 5. Acceptance Criteria

### Functional
1. **Search & Debouncing**: Live search triggers 450ms after typing stops, issuing non-blocking queries to Open Food Facts with graceful fallback to curated culinary knowledgebase.
2. **Comparison Dock**: Supports 1 to 4 items simultaneously with badges indicating slot counts (`1/4`, `2/4`, `3/4`, `4/4`); dock remains sticky across scrolling.
3. **Smoke Point Verification**: Every oil, ghee, and fat must display accurate Celsius and Fahrenheit smoke points and a culinary tag (`Deep Frying`, `High Sauté / Tadka`, `Medium Sauté / Baking`, `Raw / Salad Finishing`).
4. **Processing Transparency**: Clear NOVA grouping (1 = Unprocessed, 2 = Processed Culinary, 3 = Processed, 4 = Ultra-Processed) and additive highlighting (green for single clean ingredients, amber for additives).
5. **Interactive Unit Math**: Changing the local price immediately updates cost per 100g / 100ml across both cards and comparison table.
6. **Persistence**: Saved items, local price edits, and user profiles persist across browser reloads via `localStorage`.

### Performance & Non-Functional
- **First Contentful Paint (FCP)**: < 1.0s.
- **60fps Micro-interactions**: Animations powered by CSS GPU transforms and spring easing curves (`cubic-bezier(0.22, 1, 0.36, 1)`).
- **Responsive**: Full adaptation from 375px mobile screens to 2560px ultra-wide monitors.
- **Zero API Lockouts**: Application operates 100% reliably even if internet connectivity drops or public API endpoints rate-limit.

---

## 6. Edge Cases & Resilience Strategy

| Edge Case | Failure Mode Prevented | Mitigation Strategy |
|:---|:---|:---|
| **OFF API Down or Rate-Limited (429/503)** | Blank screens or hanging loaders | Fallback dataset with 40+ rich staple profiles activates instantly. User is alerted with a discrete status badge. |
| **Missing Nutrient Data in API (e.g. Sugar is null)** | `NaN` or broken UI bars | Normalized schema defaults missing values to `0` or `"N/A"`, explicitly labeled as unlisted on product label. |
| **Extreme/Negative Price Input** | Corrupted cost metrics | Clamped positive numeric input validator (`0.01 <= price <= 100,000`). |
| **Comparing 4 items on Mobile (375px)** | Horizontal table overflow and unreadable text | Mobile view automatically triggers a 2-column sticky selector allowing users to toggle any 2 items side-by-side. |
| **XSS in Product Title / Description** | Malicious script execution | Zero use of `dangerouslySetInnerHTML`. All external text nodes sanitized and rendered as React safe text children. |
