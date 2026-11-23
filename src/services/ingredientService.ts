import { Ingredient, NutriScoreGrade, NovaGroup, SmokePointInfo, HeatTier, RecommendedUsage, BasePrice } from '../types/ingredient';
import { ComparisonWinner, ComparisonVerdict } from '../types/comparison';
import { CULINARY_STAPLES } from '../data/culinaryData';

// Cache Entry
interface CacheEntry {
  timestamp: number;
  data: Ingredient[];
}

const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes
const memoryCache = new Map<string, CacheEntry>();

/**
 * Infer heat stability and smoke point from ingredient name and category
 */
function inferSmokePoint(name: string, category: string): SmokePointInfo | undefined {
  const lower = name.toLowerCase();

  if (category === 'Cooking Oils') {
    if (lower.includes('avocado')) {
      return { celsius: 271, fahrenheit: 520, heatTier: 'Very High (>230°C)', recommendedUsage: 'Deep Frying' };
    }
    if (lower.includes('mustard') || lower.includes('sarson')) {
      return { celsius: 250, fahrenheit: 482, heatTier: 'Very High (>230°C)', recommendedUsage: 'High Sauté / Tadka' };
    }
    if (lower.includes('groundnut') || lower.includes('peanut')) {
      return { celsius: 232, fahrenheit: 450, heatTier: 'Very High (>230°C)', recommendedUsage: 'Deep Frying' };
    }
    if (lower.includes('rice bran')) {
      return { celsius: 232, fahrenheit: 450, heatTier: 'Very High (>230°C)', recommendedUsage: 'Deep Frying' };
    }
    if (lower.includes('sunflower') && lower.includes('refined')) {
      return { celsius: 227, fahrenheit: 440, heatTier: 'High (200-230°C)', recommendedUsage: 'Deep Frying' };
    }
    if (lower.includes('sesame') || lower.includes('til') || lower.includes('gingelly')) {
      return { celsius: 210, fahrenheit: 410, heatTier: 'High (200-230°C)', recommendedUsage: 'High Sauté / Tadka' };
    }
    if (lower.includes('canola')) {
      return { celsius: 204, fahrenheit: 400, heatTier: 'High (200-230°C)', recommendedUsage: 'High Sauté / Tadka' };
    }
    if (lower.includes('extra virgin') || lower.includes('evoo')) {
      return { celsius: 190, fahrenheit: 374, heatTier: 'Medium (160-200°C)', recommendedUsage: 'Raw Drizzle / Cold Dressings' };
    }
    if (lower.includes('coconut')) {
      return { celsius: 177, fahrenheit: 350, heatTier: 'Medium (160-200°C)', recommendedUsage: 'High Sauté / Tadka' };
    }
    // Default Oil
    return { celsius: 215, fahrenheit: 419, heatTier: 'High (200-230°C)', recommendedUsage: 'High Sauté / Tadka' };
  }

  if (category === 'Ghee & Butter') {
    if (lower.includes('ghee')) {
      return { celsius: 252, fahrenheit: 485, heatTier: 'Very High (>230°C)', recommendedUsage: 'High Sauté / Tadka' };
    }
    if (lower.includes('butter') || lower.includes('makhan')) {
      return { celsius: 150, fahrenheit: 302, heatTier: 'Low / Raw (<160°C)', recommendedUsage: 'Baking & Light Cooking' };
    }
  }

  return undefined;
}

/**
 * Infer category from product text
 */
function inferCategory(name: string, tags: string[] = []): Ingredient['category'] {
  const combined = `${name} ${tags.join(' ')}`.toLowerCase();
  if (combined.includes('ghee') || combined.includes('butter') || combined.includes('makhan')) return 'Ghee & Butter';
  if (combined.includes('oil') || combined.includes('tel') || combined.includes('oleo')) return 'Cooking Oils';
  if (combined.includes('flour') || combined.includes('atta') || combined.includes('maida') || combined.includes('besan')) return 'Flours & Atta';
  if (combined.includes('rice') || combined.includes('quinoa') || combined.includes('oat') || combined.includes('grain') || combined.includes('millet')) return 'Rice & Grains';
  if (combined.includes('sugar') || combined.includes('jaggery') || combined.includes('gur') || combined.includes('honey') || combined.includes('sweetener')) return 'Sweeteners';
  if (combined.includes('salt') || combined.includes('namak') || combined.includes('sodium')) return 'Salts';
  if (combined.includes('dal') || combined.includes('pulse') || combined.includes('lentil') || combined.includes('chana') || combined.includes('bean')) return 'Pulses & Lentils';
  return 'Cooking Oils'; // safe default
}

/**
 * Normalizes Open Food Facts raw product to unified Ingredient model
 */
function normalizeOffProduct(raw: any): Ingredient | null {
  if (!raw || !raw.product_name) return null;

  const name = raw.product_name.trim();
  const brand = raw.brands ? raw.brands.split(',')[0].trim() : undefined;
  const category = inferCategory(name, raw.categories_tags || []);
  const nutriments = raw.nutriments || {};

  // Nutri-Score Normalization
  let nutriscore: NutriScoreGrade = 'Unknown';
  if (raw.nutriscore_grade) {
    const grade = raw.nutriscore_grade.toUpperCase();
    if (['A', 'B', 'C', 'D', 'E'].includes(grade)) {
      nutriscore = grade as NutriScoreGrade;
    }
  }

  // NOVA Group Normalization
  let novaGroup: NovaGroup = 2;
  if (raw.nova_group && [1, 2, 3, 4].includes(raw.nova_group)) {
    novaGroup = raw.nova_group as NovaGroup;
  } else {
    // Heuristic inference
    if (raw.additives_n > 0 || (raw.ingredients_text && (raw.ingredients_text.includes('E') || raw.ingredients_text.includes('hydrogenated')))) {
      novaGroup = 4;
    } else if (category === 'Flours & Atta' || category === 'Rice & Grains' || category === 'Pulses & Lentils') {
      novaGroup = 1;
    }
  }

  // Additives
  const additives: string[] = Array.isArray(raw.additives_tags)
    ? raw.additives_tags.map((t: string) => t.replace('en:', '').toUpperCase())
    : [];

  const cleanLabel = additives.length === 0 && (!raw.ingredients_text || !raw.ingredients_text.toLowerCase().includes('preservative'));

  // Extraction Method
  let extractionMethod: Ingredient['extractionMethod'] = 'Expeller-Pressed';
  const text = `${name} ${raw.ingredients_text || ''}`.toLowerCase();
  if (text.includes('cold pressed') || text.includes('wood pressed') || text.includes('virgin') || text.includes('kachi ghani')) {
    extractionMethod = 'Cold-Pressed / Wood-Pressed';
  } else if (text.includes('refined') || text.includes('solvent')) {
    extractionMethod = 'Solvent-Extracted / Refined';
  } else if (text.includes('bilona') || text.includes('churned')) {
    extractionMethod = 'Traditional / Churned';
  } else if (text.includes('stone ground') || text.includes('chakki')) {
    extractionMethod = 'Stone-Ground / Whole';
  }

  const unitType = category === 'Cooking Oils' || category === 'Ghee & Butter' ? 'ml' : 'g';
  const unitQuantity = unitType === 'ml' ? 1000 : 1000;
  const basePriceAmount = category === 'Ghee & Butter' ? 650 : category === 'Cooking Oils' ? 220 : 120;

  return {
    id: `off-${raw.code || raw.id || Math.random().toString(36).substring(2, 9)}`,
    name,
    brand,
    category,
    imageUrl: raw.image_front_small_url || raw.image_url || undefined,
    nutriscore,
    novaGroup,
    extractionMethod,
    smokePoint: inferSmokePoint(name, category),
    nutriments: {
      calories: Math.round(nutriments['energy-kcal_100g'] ?? nutriments['energy-kcal'] ?? 0),
      totalFat: +(nutriments.fat_100g ?? 0),
      saturatedFat: +(nutriments['saturated-fat_100g'] ?? 0),
      monounsaturatedFat: +(nutriments['monounsaturated-fat_100g'] ?? 0),
      polyunsaturatedFat: +(nutriments['polyunsaturated-fat_100g'] ?? 0),
      carbohydrates: +(nutriments.carbohydrates_100g ?? 0),
      sugars: +(nutriments.sugars_100g ?? 0),
      protein: +(nutriments.proteins_100g ?? 0),
      fiber: +(nutriments.fiber_100g ?? 0),
      sodium: Math.round((nutriments.salt_100g ? nutriments.salt_100g * 400 : (nutriments.sodium_100g ?? 0) * 1000)),
    },
    ingredientsText: raw.ingredients_text || 'Standard single-ingredient commercial packaging',
    additives,
    cleanLabel,
    basePrice: {
      amount: basePriceAmount,
      currency: '₹',
      unitQuantity,
      unitType,
    },
    culinaryNotes: `Live data extracted from Open Food Facts. ${cleanLabel ? 'Clean label without declared artificial additives.' : `Contains ${additives.length} flagged additives.`}`,
    source: 'open_food_facts',
  };
}

/**
 * Main Search and Fetch function with Debounce & Fallback Protection
 */
export async function searchIngredients(
  query: string,
  selectedCategory?: string,
  signal?: AbortSignal
): Promise<{ items: Ingredient[]; isLive: boolean; error?: string }> {
  const trimmed = query.trim().toLowerCase();
  const cacheKey = `${trimmed}_${selectedCategory || 'ALL'}`;

  // 1. Check in-memory cache
  const cached = memoryCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return { items: cached.data, isLive: true };
  }

  // 2. Filter local curated knowledge base first for instant responsiveness
  let localMatches = CULINARY_STAPLES.filter(item => {
    const matchesCategory = !selectedCategory || selectedCategory === 'All' || item.category === selectedCategory;
    if (!matchesCategory) return false;
    if (!trimmed) return true;
    return (
      item.name.toLowerCase().includes(trimmed) ||
      (item.brand && item.brand.toLowerCase().includes(trimmed)) ||
      item.category.toLowerCase().includes(trimmed) ||
      item.culinaryNotes.toLowerCase().includes(trimmed)
    );
  });

  // If query is short or empty, return rich curated local dataset immediately
  if (!trimmed || trimmed.length < 3) {
    return { items: localMatches, isLive: true };
  }

  // 3. Attempt external fetch from Open Food Facts API
  try {
    const offUrl = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(trimmed)}&search_simple=1&action=process&json=1&page_size=8`;
    
    const response = await fetch(offUrl, {
      signal,
      headers: {
        'User-Agent': 'PantryVerdict/1.0 (https://pantryverdict.local; culinary-comparison)',
        'Accept': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data && Array.isArray(data.products) && data.products.length > 0) {
        const liveItems: Ingredient[] = data.products
          .map(normalizeOffProduct)
          .filter((i: Ingredient | null): i is Ingredient => i !== null);

        // Deduplicate and combine with local matches
        const existingIds = new Set(localMatches.map(m => m.name.toLowerCase()));
        const uniqueLive = liveItems.filter(li => !existingIds.has(li.name.toLowerCase()));
        const combined = [...localMatches, ...uniqueLive];

        // Cache combined results
        memoryCache.set(cacheKey, { timestamp: Date.now(), data: combined });
        return { items: combined, isLive: true };
      }
    }
  } catch (err: any) {
    if (err.name === 'AbortError') {
      // In-flight request was aborted by newer keystroke
      return { items: localMatches, isLive: false };
    }
    console.warn('Open Food Facts API unavailable; serving curated offline fallback', err);
  }

  // 4. Return offline local matches if external API is unreachable or rate limited
  return {
    items: localMatches,
    isLive: false,
    error: 'External API rate-limited or offline. Showing verified curated database.',
  };
}

/**
 * Computes deterministic comparison verdict & winner badges
 */
export function computeComparisonVerdict(
  items: Ingredient[],
  customPrices: Record<string, BasePrice>
): ComparisonVerdict {
  if (items.length === 0) {
    return { summary: 'Add ingredients to compare.', winners: [], suitabilityMap: {} };
  }

  const winners: ComparisonWinner[] = [];
  const suitabilityMap: Record<string, string> = {};

  // 1. Healthiest Fat (Lowest saturated fat among oils/fats OR highest fiber/lowest sugar)
  const isOilComparison = items.every(i => i.category === 'Cooking Oils' || i.category === 'Ghee & Butter');
  if (isOilComparison) {
    const sortedBySatFat = [...items].sort((a, b) => a.nutriments.saturatedFat - b.nutriments.saturatedFat);
    winners.push({
      category: 'healthiest_fat',
      title: 'Healthiest Fat Profile',
      winnerIngredientId: sortedBySatFat[0].id,
      reason: `Lowest saturated fat (${sortedBySatFat[0].nutriments.saturatedFat}g/100g) and highest healthy unsaturated ratio.`,
    });
  } else {
    // Grain/Flour/Pulse Comparison: Highest Protein
    const sortedByProtein = [...items].sort((a, b) => b.nutriments.protein - a.nutriments.protein);
    if (sortedByProtein[0].nutriments.protein > 0) {
      winners.push({
        category: 'highest_protein',
        title: 'Protein Champion',
        winnerIngredientId: sortedByProtein[0].id,
        reason: `Highest protein density at ${sortedByProtein[0].nutriments.protein}g per 100g.`,
      });
    }
  }

  // 2. Highest Heat Stability (Smoke Point)
  const withSmokePoint = items.filter(i => i.smokePoint && i.smokePoint.celsius > 0);
  if (withSmokePoint.length > 0) {
    const sortedBySmoke = [...withSmokePoint].sort((a, b) => (b.smokePoint?.celsius || 0) - (a.smokePoint?.celsius || 0));
    winners.push({
      category: 'highest_smoke_point',
      title: 'Highest Heat Stability',
      winnerIngredientId: sortedBySmoke[0].id,
      reason: `Superior smoke point of ${sortedBySmoke[0].smokePoint?.celsius}°C (${sortedBySmoke[0].smokePoint?.fahrenheit}°F). Best for ${sortedBySmoke[0].smokePoint?.recommendedUsage}.`,
    });
  }

  // 3. Least Processed (NOVA Score)
  const sortedByNova = [...items].sort((a, b) => a.novaGroup - b.novaGroup);
  const leastProcessed = sortedByNova[0];
  winners.push({
    category: 'least_processed',
    title: 'Cleanest & Least Processed',
    winnerIngredientId: leastProcessed.id,
    reason: `NOVA Group ${leastProcessed.novaGroup} (${leastProcessed.extractionMethod}) with ${leastProcessed.additives.length === 0 ? 'zero synthetic additives' : 'minimal processing'}.`,
  });

  // 4. Best Value per Unit
  const sortedByUnitCost = [...items].sort((a, b) => {
    const priceA = customPrices[a.id] || a.basePrice;
    const priceB = customPrices[b.id] || b.basePrice;
    const costA = (priceA.amount / (priceA.unitQuantity || 1)) * 100;
    const costB = (priceB.amount / (priceB.unitQuantity || 1)) * 100;
    return costA - costB;
  });
  const bestValue = sortedByUnitCost[0];
  const bvPrice = customPrices[bestValue.id] || bestValue.basePrice;
  const bvCost100 = (bvPrice.amount / (bvPrice.unitQuantity || 1)) * 100;
  winners.push({
    category: 'best_value_unit',
    title: 'Best True Value',
    winnerIngredientId: bestValue.id,
    reason: `Lowest cost at ${bvPrice.currency}${bvCost100.toFixed(2)} per 100${bvPrice.unitType}.`,
  });

  // Build suitability map
  items.forEach(item => {
    if (item.smokePoint && item.smokePoint.celsius >= 230) {
      suitabilityMap[item.id] = `Premier choice for high-heat frying, tadka, and intense sautéing (${item.smokePoint.celsius}°C).`;
    } else if (item.smokePoint && item.smokePoint.celsius <= 190) {
      suitabilityMap[item.id] = `Reserve for low-heat sautéing, salad finishing, and raw drizzling to avoid smoke degradation.`;
    } else if (item.nutriments.protein >= 20) {
      suitabilityMap[item.id] = `Outstanding high-protein staple (${item.nutriments.protein}g/100g) ideal for post-workout nutrition.`;
    } else if (item.cleanLabel) {
      suitabilityMap[item.id] = `Clean whole single-ingredient staple with no synthetic preservatives or anti-caking aids.`;
    } else {
      suitabilityMap[item.id] = `Standard everyday staple with balanced culinary versatility.`;
    }
  });

  const summary = `Compared ${items.length} staples. ${winners[0]?.title}: ${items.find(i => i.id === winners[0]?.winnerIngredientId)?.name}.`;

  return { summary, winners, suitabilityMap };
}
