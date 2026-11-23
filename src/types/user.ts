export type KitchenDietaryGoal = 
  | 'heart_health'      // Minimize saturated fats, high MUFA/PUFA ratio
  | 'unrefined_only'    // NOVA 1 or traditional cold/wood-pressed only
  | 'high_protein'      // Focus on protein-dense grains, pulses, flours
  | 'budget_conscious'  // Focus on low cost-per-unit and versatile staples
  | 'high_heat_cooking' // High smoke point focus (>200°C) for frying/tadka
  | 'low_glycemic';     // Low GI sweeteners, complex unrefined carbs

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  avatarSeed?: string;
  memberTier?: 'curator' | 'member' | 'guest';
  createdAt: string;
  kitchenGoals: KitchenDietaryGoal[];
  savedBoards: {
    id: string;
    title: string;
    date: string;
    ingredientIds: string[];
  }[];
  customNotes: Record<string, string>; // ingredientId -> personal notes
}

export interface StoredUserAccount {
  email: string;
  displayName: string;
  salt: string;
  passwordHash: string;
  kitchenGoals: KitchenDietaryGoal[];
  createdAt: string;
}
