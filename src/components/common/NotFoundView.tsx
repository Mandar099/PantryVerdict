import React from 'react';
import { CookingPot, RotateCcw, ArrowRight } from 'lucide-react';

interface NotFoundViewProps {
  onReturnHome: () => void;
}

export const NotFoundView: React.FC<NotFoundViewProps> = ({ onReturnHome }) => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center max-w-lg mx-auto">
      <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 mb-6">
        <CookingPot className="w-8 h-8" />
      </div>
      <span className="text-xs font-mono font-bold text-amber-800 bg-amber-100/60 px-3 py-1 rounded-full border border-amber-300 mb-3">
        Error 404 • Missing Culinary Ledger
      </span>
      <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-stone-900 mb-3">
        Recipe or Ingredient Not Found
      </h2>
      <p className="text-stone-600 text-sm leading-relaxed mb-6">
        The pantry shelf or comparative ledger you requested is not listed in our food chemistry catalog. Return home to cross-examine cooking oils, ghee, flours, and grains.
      </p>
      <button
        onClick={onReturnHome}
        className="px-5 py-2.5 rounded-xl bg-[#2D5A27] text-white text-xs font-semibold hover:bg-emerald-900 transition-colors flex items-center gap-2 shadow-sm"
      >
        <RotateCcw className="w-4 h-4" />
        <span>Return to Pantry Verdict Catalog</span>
      </button>
    </div>
  );
};
