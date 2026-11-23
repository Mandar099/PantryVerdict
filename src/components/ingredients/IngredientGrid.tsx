import React from 'react';
import { Ingredient } from '../../types/ingredient';
import { IngredientCard } from './IngredientCard';
import { CardSkeleton } from '../common/Skeleton';
import { SearchX, RotateCcw } from 'lucide-react';

interface IngredientGridProps {
  ingredients: Ingredient[];
  isLoading: boolean;
  onResetFilters: () => void;
}

export const IngredientGrid: React.FC<IngredientGridProps> = ({
  ingredients,
  isLoading,
  onResetFilters,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 flex-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (ingredients.length === 0) {
    return (
      <div className="flex-1 bg-white rounded-2xl hairline-border p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-14 h-14 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-4">
          <SearchX className="w-7 h-7" />
        </div>
        <h3 className="font-editorial text-2xl font-bold text-stone-900 mb-2">
          No matching ingredients found
        </h3>
        <p className="text-stone-500 text-sm max-w-md mx-auto mb-6">
          We couldn't find any staples matching your current query and filters. Try clearing your filters or searching for terms like "oil", "ghee", "atta", or "rice".
        </p>
        <button
          onClick={onResetFilters}
          className="px-4 py-2 rounded-xl bg-[#2D5A27] text-white text-xs font-semibold hover:bg-emerald-900 transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Filters</span>
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 flex-1">
      {ingredients.map(ingredient => (
        <IngredientCard key={ingredient.id} ingredient={ingredient} />
      ))}
    </div>
  );
};
