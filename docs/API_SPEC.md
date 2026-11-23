# PantryVerdict — API Specification & Normalization Contract

---

## 1. Overview & Free API Strategy

PantryVerdict relies entirely on **zero-cost, non-gated public food and nutrition APIs**, paired with a resilient client-side caching and local enrichment engine:
1. **Open Food Facts API (v2/v3)**: Primary real-world commercial product database.
2. **USDA FoodData Central API**: Baseline unbranded culinary and agricultural staple reference.
3. **Curated Culinary Knowledge Base**: High-fidelity local database providing heat stability, extraction type, NOVA processing grade, and local price estimators.

---

## 2. API Endpoints & Request Protocols

### 2.1 Open Food Facts API

- **Protocol**: HTTP/1.1 or HTTP/2 GET over HTTPS.
- **Search Endpoint**:
  ```http
  GET https://world.openfoodfacts.org/cgi/search.pl?search_terms={query}&search_simple=1&action=process&json=1&page_size=12
  ```
- **Product by Barcode Endpoint**:
  ```http
  GET https://world.openfoodfacts.org/api/v0/product/{barcode}.json
  ```
- **Mandatory Headers**:
  ```http
  User-Agent: PantryVerdict/1.0 (https://pantryverdict.local; contact@pantryverdict.org)
  Accept: application/json
  ```
- **Debounce Protocol**: All search keystrokes must pass through a `450ms` debounce timer. An `AbortController` signal must cancel in-flight HTTP requests if a new keystroke occurs before completion.

### 2.2 USDA FoodData Central API

- **Protocol**: GET over HTTPS.
- **Search Endpoint**:
  ```http
  GET https://api.nal.usda.gov/fdc/v1/foods/search?api_key=DEMO_KEY&query={query}&pageSize=8
  ```
- **Usage**: Used to enrich unbranded baseline staples (e.g. *Cold-Pressed Mustard Oil*, *Extra Virgin Olive Oil*, *A2 Cow Ghee*, *Whole Wheat Atta*) with USDA standard micronutrient values.

---

## 3. Response Normalization Contract

External API payloads vary widely in structure, naming conventions, and data completeness. The data service maps every incoming response to the strict TypeScript `Ingredient` contract below:

```typescript
export interface Nutriments {
  calories: number;             // kcal per 100g/100ml
  totalFat: number;            // g per 100g/100ml
  saturatedFat: number;        // g per 100g/100ml
  monounsaturatedFat?: number; // g per 100g/100ml
  polyunsaturatedFat?: number; // g per 100g/100ml
  carbohydrates: number;       // g per 100g/100ml
  sugars: number;              // g per 100g/100ml
  protein: number;             // g per 100g/100ml
  fiber: number;               // g per 100g/100ml
  sodium: number;              // mg per 100g/100ml
}

export interface SmokePointInfo {
  celsius: number;
  fahrenheit: number;
  heatTier: 'Very High (>230°C)' | 'High (200-230°C)' | 'Medium (160-200°C)' | 'Low / Raw (<160°C)';
  recommendedUsage: 'Deep Frying' | 'High Sauté / Tadka' | 'Baking & Light Cooking' | 'Raw Drizzle / Cold Dressings';
}

export type NovaGroup = 1 | 2 | 3 | 4;
export type NutriScoreGrade = 'A' | 'B' | 'C' | 'D' | 'E' | 'Unknown';

export interface Ingredient {
  id: string;
  name: string;
  brand?: string;
  category: string;
  imageUrl?: string;
  nutriscore: NutriScoreGrade;
  novaGroup: NovaGroup;
  extractionMethod: 'Cold-Pressed / Wood-Pressed' | 'Expeller-Pressed' | 'Solvent-Extracted / Refined' | 'Traditional / Churned' | 'Stone-Ground / Whole' | 'Refined / Bleached';
  smokePoint?: SmokePointInfo;
  nutriments: Nutriments;
  ingredientsText: string;
  additives: string[];
  cleanLabel: boolean;
  basePrice: {
    amount: number;       // e.g. 180 (INR) or 4.5 (USD)
    currency: '₹' | '$';
    unitQuantity: number; // e.g. 500 (ml or g)
    unitType: 'ml' | 'g';
  };
  culinaryNotes: string;
  source: 'open_food_facts' | 'usda' | 'curated_offline';
}
```

---

## 4. Normalization Rules & Field Extraction Logic

| Normalized Target Field | Open Food Facts Raw Path | Fallback Strategy |
|:---|:---|:---|
| `name` | `product.product_name` \|\| `product.generic_name` | Curated staple name |
| `brand` | `product.brands` | `"Artisanal / Generic Staple"` |
| `imageUrl` | `product.image_front_small_url` | High-quality culinary fallback asset |
| `nutriscore` | `product.nutriscore_grade?.toUpperCase()` | Derived from fat/sugar/sodium algorithm |
| `novaGroup` | `product.nova_group` | Inferred from ingredient text & processing tag |
| `calories` | `nutriments['energy-kcal_100g']` | USDA reference standard |
| `saturatedFat` | `nutriments['saturated-fat_100g']` | Local fatty acid profile table |
| `smokePoint` | Local Culinary Knowledge Base Enrichment | Matched via category & oil extraction type |
| `basePrice` | Pre-calibrated regional grocery benchmark | Default ₹200 / $4.50 per 500g/ml |

---

## 5. Rate-Limit & Error Handling Policy

1. **Client Rate Limiting**: Max 1 outbound request per 450ms.
2. **HTTP 429 / 503 / Network Failure**:
   - The query silently falls back to matching against the local `CULINARY_STAPLES` dataset.
   - A non-intrusive status pill in the UI notes: *"Showing verified offline culinary records"*.
3. **Missing Value Sanitization**:
   - `undefined` or `null` nutrient values are strictly coerced to `0` or labeled `"Not Listed"`.
   - Division-by-zero during dynamic price calculations is guarded: `costPer100 = unitQuantity > 0 ? (price / unitQuantity) * 100 : 0`.
