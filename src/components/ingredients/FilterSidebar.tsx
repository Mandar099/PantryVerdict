import React from 'react';
import { SlidersHorizontal, RotateCcw, X, Check, Flame, ShieldCheck, Heart } from 'lucide-react';

export interface FilterState {
  coldPressedOnly: boolean;
  highSmokePoint: boolean;
  nutriScoreAB: boolean;
  novaGroup1: boolean;
  sortBy: 'health' | 'smokePoint' | 'priceValue' | 'protein';
}

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onResetFilters: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  totalResultsCount: number;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  isOpenMobile,
  onCloseMobile,
  totalResultsCount,
}) => {
  const toggleKey = (key: keyof Omit<FilterState, 'sortBy'>) => {
    onFilterChange({
      ...filters,
      [key]: !filters[key],
    });
  };

  const setSort = (sortBy: FilterState['sortBy']) => {
    onFilterChange({
      ...filters,
      sortBy,
    });
  };

  const hasActiveFilters =
    filters.coldPressedOnly ||
    filters.highSmokePoint ||
    filters.nutriScoreAB ||
    filters.novaGroup1 ||
    filters.sortBy !== 'health';

  const filterContent = (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 hairline-b">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-stone-700" />
          <h2 className="font-editorial text-base font-bold text-stone-900">
            Refine & Sort
          </h2>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="text-xs text-[#2D5A27] hover:underline flex items-center gap-1 font-semibold"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        )}
      </div>

      {/* Sort Section */}
      <div>
        <label className="text-[11px] font-mono uppercase tracking-wider text-stone-500 font-semibold block mb-2">
          Sort Order
        </label>
        <div className="space-y-1.5">
          {[
            { id: 'health', label: 'Best Health Profile' },
            { id: 'smokePoint', label: 'Highest Smoke Point' },
            { id: 'priceValue', label: 'Best Unit Value (Price/100g)' },
            { id: 'protein', label: 'Highest Protein Density' },
          ].map(opt => (
            <button
              key={opt.id}
              onClick={() => setSort(opt.id as FilterState['sortBy'])}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-all ${
                filters.sortBy === opt.id
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'bg-stone-50 text-stone-700 hover:bg-stone-100 hairline-border'
              }`}
            >
              <span>{opt.label}</span>
              {filters.sortBy === opt.id && <Check className="w-3.5 h-3.5 text-white" />}
            </button>
          ))}
        </div>
      </div>

      {/* Dietary & Processing Filter Toggles */}
      <div>
        <label className="text-[11px] font-mono uppercase tracking-wider text-stone-500 font-semibold block mb-2">
          Processing & Quality Criteria
        </label>
        <div className="space-y-2">
          
          {/* Cold-Pressed / Unrefined */}
          <button
            onClick={() => toggleKey('coldPressedOnly')}
            className={`w-full p-3 rounded-xl hairline-border text-left text-xs transition-all flex items-start gap-3 ${
              filters.coldPressedOnly
                ? 'bg-[#F2F7F1] border-[#2D5A27]/40 text-[#2D5A27]'
                : 'bg-white hover:bg-stone-50 text-stone-700'
            }`}
          >
            <div className={`mt-0.5 p-1 rounded ${filters.coldPressedOnly ? 'bg-[#2D5A27] text-white' : 'bg-stone-100 text-stone-500'}`}>
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-semibold block">Cold-Pressed / Unrefined Only</span>
              <span className="text-[11px] text-stone-500 block leading-tight mt-0.5">
                Exclude solvent hexane extraction and chemical bleaching
              </span>
            </div>
          </button>

          {/* High Smoke Point */}
          <button
            onClick={() => toggleKey('highSmokePoint')}
            className={`w-full p-3 rounded-xl hairline-border text-left text-xs transition-all flex items-start gap-3 ${
              filters.highSmokePoint
                ? 'bg-amber-50 border-amber-300 text-amber-900'
                : 'bg-white hover:bg-stone-50 text-stone-700'
            }`}
          >
            <div className={`mt-0.5 p-1 rounded ${filters.highSmokePoint ? 'bg-amber-600 text-white' : 'bg-stone-100 text-stone-500'}`}>
              <Flame className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-semibold block">High Smoke Point (&gt;200°C)</span>
              <span className="text-[11px] text-stone-500 block leading-tight mt-0.5">
                Verified safe for deep frying, searing, and vigorous tadka
              </span>
            </div>
          </button>

          {/* Nutri-Score A/B */}
          <button
            onClick={() => toggleKey('nutriScoreAB')}
            className={`w-full p-3 rounded-xl hairline-border text-left text-xs transition-all flex items-start gap-3 ${
              filters.nutriScoreAB
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-white hover:bg-stone-50 text-stone-700'
            }`}
          >
            <div className={`mt-0.5 p-1 rounded ${filters.nutriScoreAB ? 'bg-emerald-700 text-white' : 'bg-stone-100 text-stone-500'}`}>
              <Heart className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-semibold block">Nutri-Score A or B</span>
              <span className="text-[11px] text-stone-500 block leading-tight mt-0.5">
                Low saturated fats, low sodium, and whole nutrient profiles
              </span>
            </div>
          </button>

          {/* NOVA Group 1 */}
          <button
            onClick={() => toggleKey('novaGroup1')}
            className={`w-full p-3 rounded-xl hairline-border text-left text-xs transition-all flex items-start gap-3 ${
              filters.novaGroup1
                ? 'bg-stone-100 border-stone-400 text-stone-900'
                : 'bg-white hover:bg-stone-50 text-stone-700'
            }`}
          >
            <div className={`mt-0.5 p-1 rounded ${filters.novaGroup1 ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-500'}`}>
              <Check className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-semibold block">NOVA 1 (Unprocessed Only)</span>
              <span className="text-[11px] text-stone-500 block leading-tight mt-0.5">
                Single whole grains, raw seeds, and unprocessed pulses
              </span>
            </div>
          </button>

        </div>
      </div>

      {/* Database Results Counter */}
      <div className="pt-3 hairline-t text-xs text-stone-500 font-mono flex justify-between items-center">
        <span>Active Matches:</span>
        <span className="font-bold text-stone-900">{totalResultsCount} items</span>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:block w-72 shrink-0">
        <div className="sticky top-24 bg-white p-5 rounded-2xl hairline-border shadow-sm">
          {filterContent}
        </div>
      </aside>

      {/* Mobile Slide-Over Sheet */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="font-editorial text-lg font-bold text-stone-900">Filters</span>
                <button
                  onClick={onCloseMobile}
                  className="p-1 rounded-md text-stone-500 hover:bg-stone-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {filterContent}
            </div>
            <div className="pt-6 hairline-t mt-6">
              <button
                onClick={onCloseMobile}
                className="w-full py-3 bg-[#18181B] text-white rounded-xl text-xs font-semibold shadow"
              >
                Show {totalResultsCount} Results
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
