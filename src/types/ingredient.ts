export type NovaGroup = 1 | 2 | 3 | 4;
export type NutriScoreGrade = 'A' | 'B' | 'C' | 'D' | 'E' | 'Unknown';

export type HeatTier = 
  | 'Very High (>230°C)' 
  | 'High (200-230°C)' 
  | 'Medium (160-200°C)' 
  | 'Low / Raw (<160°C)';

export type RecommendedUsage = 
  | 'Deep Frying' 
  | 'High Sauté / Tadka' 
  | 'Baking & Light Cooking' 
  | 'Raw Drizzle / Cold Dressings';

export interface SmokePointInfo {
  celsius: number;
  fahrenheit: number;
  heatTier: HeatTier;
  recommendedUsage: RecommendedUsage;
}

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

export type ExtractionMethod = 
  | 'Cold-Pressed / Wood-Pressed'
  | 'Expeller-Pressed'
  | 'Solvent-Extracted / Refined'
  | 'Traditional / Churned'
  | 'Stone-Ground / Whole'
  | 'Refined / Bleached'
  | 'Natural / Unrefined';

export interface BasePrice {
  amount: number;       // e.g. 240
  currency: '₹' | '$';
  unitQuantity: number; // e.g. 500
  unitType: 'ml' | 'g';
}

export interface Ingredient {
  id: string;
  name: string;
  brand?: string;
  category: 
    | 'Cooking Oils'
    | 'Ghee & Butter'
    | 'Flours & Atta'
    | 'Rice & Grains'
    | 'Sweeteners'
    | 'Salts'
    | 'Pulses & Lentils'
    | 'Spices';
  imageUrl?: string;
  nutriscore: NutriScoreGrade;
  novaGroup: NovaGroup;
  extractionMethod: ExtractionMethod;
  smokePoint?: SmokePointInfo;
  nutriments: Nutriments;
  ingredientsText: string;
  additives: string[];
  cleanLabel: boolean;
  basePrice: BasePrice;
  culinaryNotes: string;
  fattyAcidProfile?: {
    omega3?: number; // % or g
    omega6?: number;
    ratioOmega6To3?: string;
  };
  glycemicIndex?: number;
  source: 'open_food_facts' | 'usda' | 'curated_offline';
}

export interface NormalizedPrice {
  costPer100: number; // per 100g or 100ml
  costPerProtein10g?: number; // cost per 10g protein
  costPerHealthyFat10g?: number; // cost per 10g MUFA
  displayUnit: string;
  rawAmount: number;
  rawQuantity: number;
}
