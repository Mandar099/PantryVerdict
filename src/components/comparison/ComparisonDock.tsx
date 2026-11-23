import React, { useEffect } from 'react';
import { usePantry } from '../../context/PantryContext';
import { useToast } from '../../context/ToastContext';
import { FoodVisual } from '../common/FoodVisual';
import { X, ArrowRight, Trash2, Scale } from 'lucide-react';

export const ComparisonDock: React.FC = () => {
  const {
    comparedItems,
    removeFromComparison,
    clearComparison,
    isComparisonMatrixOpen,
    setIsComparisonMatrixOpen,
  } = usePantry();

  const { showToast } = useToast();

  // Keyboard shortcut 'C' to open comparison matrix
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      if ((e.key === 'c' || e.key === 'C') && comparedItems.length > 0) {
        e.preventDefault();
        setIsComparisonMatrixOpen(!isComparisonMatrixOpen);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [comparedItems, isComparisonMatrixOpen, setIsComparisonMatrixOpen]);

  if (comparedItems.length === 0) return null;

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-full max-w-3xl px-4 pointer-events-none">
      <div className="bg-[#18181B]/95 text-white backdrop-blur-xl p-3 sm:p-4 rounded-2xl shadow-dock hairline-border border-stone-800 pointer-events-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 transition-all duration-300">
        
        {/* Slot Badges & Thumbnails */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <div className="flex items-center gap-1.5 mr-2 shrink-0">
            <Scale className="w-4 h-4 text-emerald-400" />
            <span className="font-editorial text-sm font-semibold tracking-wide">
              Dock ({comparedItems.length}/4)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {comparedItems.map(item => (
              <div
                key={item.id}
                className="group relative flex items-center gap-2 bg-stone-800/90 pl-1.5 pr-2 py-1 rounded-xl hairline-border border-stone-700 text-xs shrink-0"
              >
                <div className="w-7 h-7 rounded-lg overflow-hidden shrink-0">
                  <FoodVisual
                    id={item.id}
                    name={item.name}
                    category={item.category}
                    imageUrl={item.imageUrl}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="max-w-[100px] sm:max-w-[130px] truncate font-medium text-stone-200">
                  {item.name}
                </span>
                <button
                  onClick={() => {
                    removeFromComparison(item.id);
                    showToast(`Removed ${item.name} from dock`, 'info');
                  }}
                  className="text-stone-400 hover:text-white p-0.5 rounded-full hover:bg-stone-700 transition-colors"
                  title="Remove from comparison"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {/* Empty Slots */}
            {Array.from({ length: 4 - comparedItems.length }).map((_, idx) => (
              <div
                key={idx}
                className="hidden sm:flex w-24 h-9 border border-dashed border-stone-700 rounded-xl items-center justify-center text-[11px] text-stone-500 font-mono"
              >
                + Empty
              </div>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
          <button
            onClick={() => {
              clearComparison();
              showToast('Comparison dock cleared', 'info');
            }}
            className="p-2 text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded-lg transition-colors text-xs flex items-center gap-1"
            title="Clear all compared items"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>

          <button
            onClick={() => setIsComparisonMatrixOpen(true)}
            className="flex-1 sm:flex-initial py-2 px-4 rounded-xl bg-[#2D5A27] text-white text-xs font-semibold hover:bg-emerald-700 shadow-md flex items-center justify-center gap-1.5 group transition-all"
          >
            <span>Compare Now</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            <kbd className="hidden md:inline-block ml-1 px-1.5 py-0.2 text-[10px] font-mono bg-emerald-900 text-emerald-200 rounded">
              C
            </kbd>
          </button>
        </div>

      </div>
    </div>
  );
};
