import React, { useState } from 'react';
import { Ingredient } from '../../types/ingredient';
import { usePantry } from '../../context/PantryContext';
import { useToast } from '../../context/ToastContext';
import { NutriScoreBadge, NovaBadge, SmokePointBadge, CleanLabelBadge } from '../common/Badge';
import { FoodVisual } from '../common/FoodVisual';
import { Heart, Plus, Check, RefreshCw, Sparkles, Scale } from 'lucide-react';
import { clampPriceInput, clampVolumeInput } from '../../services/storageService';

interface IngredientCardProps {
  ingredient: Ingredient;
}

export const IngredientCard: React.FC<IngredientCardProps> = ({ ingredient }) => {
  const {
    addToComparison,
    removeFromComparison,
    isComparing,
    isComparisonFull,
    isFavorite,
    toggleFavorite,
    customPrices,
    updateCustomPrice,
    resetCustomPrice,
    getNormalizedPrice,
    openQAWithQuery,
  } = usePantry();

  const { showToast } = useToast();

  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [localPrice, setLocalPrice] = useState<string>('');
  const [localVolume, setLocalVolume] = useState<string>('');

  const comparing = isComparing(ingredient.id);
  const favorited = isFavorite(ingredient.id);
  const custom = customPrices[ingredient.id];
  const activePrice = custom || ingredient.basePrice;
  const normalized = getNormalizedPrice(ingredient);

  const handleToggleCompare = () => {
    if (comparing) {
      removeFromComparison(ingredient.id);
      showToast(`Removed ${ingredient.name} from comparison dock`, 'info');
    } else {
      const added = addToComparison(ingredient);
      if (added) {
        showToast(`Added ${ingredient.name} to comparison dock`, 'success');
      } else {
        showToast('Comparison dock is full (maximum 4 staples)', 'error', 'Open comparison to review or remove an item.');
      }
    }
  };

  const handleToggleFavorite = () => {
    toggleFavorite(ingredient.id);
    if (!favorited) {
      showToast(`Saved ${ingredient.name} to My Pantry`, 'success');
    } else {
      showToast(`Removed ${ingredient.name} from My Pantry`, 'info');
    }
  };

  const handleSavePrice = () => {
    const validPrice = clampPriceInput(localPrice);
    const validVol = clampVolumeInput(localVolume);
    if (validPrice > 0 && validVol > 0) {
      updateCustomPrice(ingredient.id, validPrice, validVol);
      showToast(
        `Updated local price for ${ingredient.name}`,
        'success',
        `Recalculated unit cost: ${activePrice.currency}${((validPrice / validVol) * 100).toFixed(1)}/100${activePrice.unitType}`
      );
    } else {
      showToast('Please enter a valid price and quantity', 'error');
    }
    setIsEditingPrice(false);
  };

  const handleStartEdit = () => {
    setLocalPrice(activePrice.amount.toString());
    setLocalVolume(activePrice.unitQuantity.toString());
    setIsEditingPrice(true);
  };

  return (
    <article className="bg-white rounded-2xl hairline-border shadow-sm hover:shadow-editorial transition-all duration-300 flex flex-col justify-between overflow-hidden group">
      
      {/* Top Media & Badge Bar */}
      <div>
        <div className="relative h-48 w-full bg-stone-100 overflow-hidden">
          <FoodVisual
            id={ingredient.id}
            name={ingredient.name}
            category={ingredient.category}
            imageUrl={ingredient.imageUrl}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

          {/* Category Chip */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1">
            <span className="px-2.5 py-0.5 rounded-md bg-stone-900/85 backdrop-blur-md text-white text-[10px] font-mono tracking-wider uppercase font-semibold border border-white/10">
              {ingredient.category}
            </span>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={handleToggleFavorite}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-md text-stone-700 hover:text-red-600 hover:bg-white transition-colors shadow-sm"
            title={favorited ? 'Remove from My Pantry' : 'Save to My Pantry'}
            aria-label={favorited ? 'Remove from My Pantry' : 'Save to My Pantry'}
          >
            <Heart className={`w-4 h-4 ${favorited ? 'fill-red-500 text-red-500' : ''}`} />
          </button>

          {/* Extraction Pill & Smoke Point (Overlaid at bottom of image) */}
          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs gap-2">
            <span className="font-semibold text-[11px] drop-shadow-md bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded border border-white/20 truncate">
              {ingredient.extractionMethod}
            </span>
            {ingredient.smokePoint && (
              <span className="bg-amber-600 text-white px-2 py-0.5 rounded font-tabular text-[10px] font-bold shadow-sm shrink-0">
                {ingredient.smokePoint.celsius}°C ({ingredient.smokePoint.fahrenheit}°F)
              </span>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5">
          {/* Quality & Processing Badges */}
          <div className="flex items-center gap-1.5 flex-wrap mb-3">
            <NutriScoreBadge grade={ingredient.nutriscore} size="sm" />
            <NovaBadge group={ingredient.novaGroup} size="sm" />
            {ingredient.smokePoint && (
              <SmokePointBadge smokePoint={ingredient.smokePoint} size="sm" />
            )}
            <CleanLabelBadge clean={ingredient.cleanLabel} />
          </div>

          {/* Title & Brand (Fully displayed, zero cutting off) */}
          <h3 className="font-editorial text-lg sm:text-xl font-bold text-stone-900 leading-snug break-words mb-1 group-hover:text-[#2D5A27] transition-colors">
            {ingredient.name}
          </h3>
          <p className="text-xs text-stone-500 mb-3 font-medium">
            {ingredient.brand || 'Artisanal / Pure Staple'}
          </p>

          {/* Full Culinary Notes Paragraph (Every complete sentence shown properly) */}
          <div className="text-xs text-stone-700 leading-relaxed mb-4 bg-stone-50/80 p-3 rounded-xl hairline-border">
            <p className="space-y-1">
              {ingredient.culinaryNotes}
            </p>
          </div>

          {/* Key Nutritional Metrics Grid */}
          <div className="grid grid-cols-4 gap-1 py-2 px-2.5 bg-stone-50 rounded-xl hairline-border text-center mb-4 font-tabular text-xs">
            <div>
              <span className="text-[10px] text-stone-400 block uppercase">Calories</span>
              <span className="font-bold text-stone-800">{ingredient.nutriments.calories}</span>
              <span className="text-[9px] text-stone-400 block">kcal</span>
            </div>
            <div>
              <span className="text-[10px] text-stone-400 block uppercase">Total Fat</span>
              <span className="font-bold text-stone-800">{ingredient.nutriments.totalFat}</span>
              <span className="text-[9px] text-stone-400 block">g</span>
            </div>
            <div>
              <span className="text-[10px] text-stone-400 block uppercase">Sat. Fat</span>
              <span className={`font-bold ${ingredient.nutriments.saturatedFat > 20 ? 'text-amber-700' : 'text-stone-800'}`}>
                {ingredient.nutriments.saturatedFat}
              </span>
              <span className="text-[9px] text-stone-400 block">g</span>
            </div>
            <div>
              <span className="text-[10px] text-stone-400 block uppercase">Protein</span>
              <span className={`font-bold ${ingredient.nutriments.protein > 10 ? 'text-[#2D5A27]' : 'text-stone-800'}`}>
                {ingredient.nutriments.protein}
              </span>
              <span className="text-[9px] text-stone-400 block">g</span>
            </div>
          </div>

          {/* Dynamic True Price Calculator */}
          <div className="p-3 bg-stone-100/70 rounded-xl hairline-border text-xs mb-3">
            {!isEditingPrice ? (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-stone-500 text-[11px] font-medium flex items-center gap-1">
                    <Scale className="w-3 h-3 text-stone-400" />
                    Market Store Price:
                  </span>
                  <button
                    onClick={handleStartEdit}
                    className="text-[11px] text-[#2D5A27] hover:underline font-semibold"
                  >
                    {custom ? 'Customized' : 'Edit Local Price'}
                  </button>
                </div>
                <div className="flex items-baseline justify-between">
                  <div className="font-tabular">
                    <span className="font-bold text-stone-900 text-sm">
                      {activePrice.currency}{activePrice.amount}
                    </span>
                    <span className="text-stone-500 text-xs ml-1">
                      for {activePrice.unitQuantity}{activePrice.unitType}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-stone-400 block uppercase font-mono">True Unit Cost</span>
                    <span className="font-tabular font-bold text-stone-900 text-xs bg-white px-2 py-0.5 rounded border border-stone-200">
                      {activePrice.currency}{normalized.costPer100.toFixed(1)} / {normalized.displayUnit}
                    </span>
                  </div>
                </div>

                {/* Additional Nutrient Cost Metrics */}
                {normalized.costPerProtein10g && (
                  <div className="mt-1.5 pt-1.5 hairline-t flex justify-between text-[10px] font-mono text-stone-500">
                    <span>Cost / 10g Protein:</span>
                    <span className="font-bold text-[#2D5A27]">
                      {activePrice.currency}{normalized.costPerProtein10g.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[11px] font-semibold text-stone-700">
                  <span>Enter Local Grocery Price</span>
                  {custom && (
                    <button
                      onClick={() => {
                        resetCustomPrice(ingredient.id);
                        setIsEditingPrice(false);
                        showToast(`Reset price for ${ingredient.name} to benchmark`, 'info');
                      }}
                      className="text-stone-400 hover:text-stone-600 flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" /> Reset
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-stone-500 block mb-0.5">Price ({activePrice.currency})</label>
                    <input
                      type="number"
                      step="0.1"
                      value={localPrice}
                      onChange={e => setLocalPrice(e.target.value)}
                      className="w-full px-2 py-1 text-xs bg-white hairline-border rounded font-tabular focus:ring-1 focus:ring-[#2D5A27] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-stone-500 block mb-0.5">Quantity ({activePrice.unitType})</label>
                    <input
                      type="number"
                      value={localVolume}
                      onChange={e => setLocalVolume(e.target.value)}
                      className="w-full px-2 py-1 text-xs bg-white hairline-border rounded font-tabular focus:ring-1 focus:ring-[#2D5A27] outline-none"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-1.5 pt-1">
                  <button
                    onClick={() => setIsEditingPrice(false)}
                    className="px-2 py-1 text-[11px] text-stone-600 hover:bg-stone-200 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSavePrice}
                    className="px-3 py-1 text-[11px] font-semibold bg-[#2D5A27] text-white rounded hover:bg-emerald-900"
                  >
                    Calculate
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="p-4 pt-0 flex items-center gap-2">
        <button
          onClick={handleToggleCompare}
          disabled={!comparing && isComparisonFull}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            comparing
              ? 'bg-[#2D5A27] text-white shadow-sm'
              : isComparisonFull
              ? 'bg-stone-100 text-stone-400 cursor-not-allowed hairline-border'
              : 'bg-white hairline-border text-stone-800 hover:bg-stone-50 hover:border-stone-400'
          }`}
          title={isComparisonFull && !comparing ? 'Comparison dock is full (4/4 max)' : 'Compare with other staples'}
        >
          {comparing ? (
            <>
              <Check className="w-3.5 h-3.5 text-white" />
              <span>In Comparison</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              <span>+ Compare</span>
            </>
          )}
        </button>

        <button
          onClick={() => openQAWithQuery(`Scientific culinary research on ${ingredient.name}`)}
          className="p-2.5 rounded-xl hairline-border bg-white text-stone-600 hover:text-[#2D5A27] hover:bg-stone-50 transition-colors"
          title="Ask Gemini AI about this staple"
          aria-label="Ask Gemini AI about this staple"
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
        </button>
      </div>

    </article>
  );
};
