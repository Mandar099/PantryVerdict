import { Ingredient } from './ingredient';

export type ComparisonWinnerCategory = 
  | 'healthiest_fat'
  | 'highest_smoke_point'
  | 'least_processed'
  | 'best_value_unit'
  | 'highest_protein';

export interface ComparisonWinner {
  category: ComparisonWinnerCategory;
  title: string;
  winnerIngredientId: string;
  reason: string;
}

export interface ComparisonVerdict {
  summary: string;
  winners: ComparisonWinner[];
  suitabilityMap: Record<string, string>; // ingredientId -> recommendation sentence
}

export interface ComparisonBoard {
  id: string;
  title: string;
  createdAt: string;
  ingredientIds: string[];
}
