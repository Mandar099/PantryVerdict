import React, { useRef, useEffect } from 'react';
import { Search, X, Sparkles, SlidersHorizontal, ArrowRight } from 'lucide-react';
import { usePantry } from '../../context/PantryContext';

interface HeroSearchProps {
  query: string;
  onQueryChange: (q: string) => void;
  onOpenMobileFilters: () => void;
  activeFilterCount: number;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({
  query,
  onQueryChange,
  onOpenMobileFilters,
  activeFilterCount,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { openQAWithQuery } = usePantry();

  // Keyboard shortcut '/' to focus search, and 'Escape' to blur
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === 'Escape' && document.activeElement === searchInputRef.current) {
        searchInputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const curatedQueries = [
    { text: 'Best oil for deep frying?', q: 'best oil for deep frying' },
    { text: 'Refined vs Cold-Pressed?', q: 'refined vs cold pressed' },
    { text: 'Is Ghee healthier than butter?', q: 'is ghee healthier than butter' },
    { text: 'Lowest glycemic sweetener?', q: 'lowest glycemic sweetener' },
    { text: 'High protein flours?', q: 'high protein flour' },
  ];

  return (
    <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
      <div className="text-center max-w-3xl mx-auto mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-mono font-medium mb-3 hairline-border">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2D5A27]" />
          <span>Zero-Cost Open Food Chemistry Engine</span>
        </div>
        <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-900 leading-[1.08] mb-3">
          The truth on the label. <br className="hidden sm:inline" />
          <span className="italic font-normal text-[#2D5A27]">The science in the pan.</span>
        </h1>
        <p className="text-stone-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Unmask processing grades, smoke points, nutrient density, and true unit cost across everyday cooking oils, ghee, flours, and grains.
        </p>
      </div>

      {/* Main Search Input Box */}
      <div className="max-w-2xl mx-auto relative">
        <div className="relative flex items-center bg-white rounded-2xl hairline-border shadow-editorial focus-within:ring-2 focus-within:ring-[#2D5A27] transition-all">
          <div className="pl-4 text-stone-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            value={query}
            onChange={e => onQueryChange(e.target.value)}
            placeholder="Search oils, ghee, atta, basmati, salt... (Press '/' to focus)"
            className="w-full py-4 pl-3 pr-24 bg-transparent text-stone-900 placeholder-stone-400 text-sm sm:text-base focus:outline-none"
          />

          <div className="absolute right-3 flex items-center gap-2">
            {query && (
              <button
                onClick={() => onQueryChange('')}
                className="p-1 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                title="Clear Search"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Mobile Filter Button */}
            <button
              onClick={onOpenMobileFilters}
              className="lg:hidden p-2 rounded-lg hairline-border bg-stone-50 text-stone-700 hover:bg-stone-100 relative"
              title="Filter Results"
            >
              <SlidersHorizontal className="w-4 h-4" />
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#2D5A27] text-white text-[10px] font-mono flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Shortcut Badge */}
            <kbd className="hidden sm:inline-flex items-center justify-center px-2 py-1 text-xs font-mono font-medium text-stone-500 bg-stone-100 rounded border border-stone-200">
              /
            </kbd>
          </div>
        </div>
      </div>

      {/* Quick Discovery Pills */}
      <div className="mt-4 flex items-center justify-center gap-2 flex-wrap text-xs">
        <span className="text-stone-400 flex items-center gap-1 font-mono text-[11px]">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          Popular queries:
        </span>
        {curatedQueries.map((sq, i) => (
          <button
            key={i}
            onClick={() => openQAWithQuery(sq.q)}
            className="px-2.5 py-1 rounded-full bg-white hairline-border text-stone-600 hover:text-[#2D5A27] hover:border-[#2D5A27]/40 transition-colors font-medium flex items-center gap-1 group"
          >
            <span>{sq.text}</span>
            <ArrowRight className="w-3 h-3 text-stone-400 group-hover:text-[#2D5A27] transition-transform group-hover:translate-x-0.5" />
          </button>
        ))}
      </div>
    </section>
  );
};
