import React, { useState, useEffect } from 'react';
import { usePantry } from '../../context/PantryContext';
import { useToast } from '../../context/ToastContext';
import { computeComparisonVerdict } from '../../services/ingredientService';
import { exportComparisonToCSV } from '../../services/storageService';
import { getGeminiComparisonVerdict } from '../../services/geminiService';
import { NutriScoreBadge, NovaBadge, SmokePointBadge, CleanLabelBadge } from '../common/Badge';
import { NutrientBar } from '../common/NutrientBar';
import { FoodVisual } from '../common/FoodVisual';
import {
  X,
  Crown,
  Download,
  Printer,
  Sparkles,
  Flame,
  ShieldCheck,
  Scale,
  CheckCircle2,
  AlertTriangle,
  ArrowRightLeft,
  Bot,
  Cpu,
} from 'lucide-react';

export const ComparisonMatrix: React.FC = () => {
  const {
    comparedItems,
    removeFromComparison,
    clearComparison,
    isComparisonMatrixOpen,
    setIsComparisonMatrixOpen,
    customPrices,
    getNormalizedPrice,
  } = usePantry();

  const { showToast } = useToast();

  // Mobile 2-column switcher state
  const [mobileSlotA, setMobileSlotA] = useState<number>(0);
  const [mobileSlotB, setMobileSlotB] = useState<number>(1);

  // Gemini AI Comparative Verdict state
  const [aiVerdict, setAiVerdict] = useState<string | null>(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);

  // Print Mode State & Body Class Management
  const [isPrintMode, setIsPrintMode] = useState(false);

  useEffect(() => {
    if (isComparisonMatrixOpen && comparedItems.length > 0) {
      document.body.classList.add('comparison-matrix-open');
    } else {
      document.body.classList.remove('comparison-matrix-open');
    }
    return () => {
      document.body.classList.remove('comparison-matrix-open');
    };
  }, [isComparisonMatrixOpen, comparedItems.length]);

  useEffect(() => {
    const handleBeforePrint = () => setIsPrintMode(true);
    const handleAfterPrint = () => setIsPrintMode(false);
    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);
    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, []);

  if (!isComparisonMatrixOpen) return null;

  if (comparedItems.length === 0) {
    return (
      <div className="comparison-matrix-overlay fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
        <div className="bg-[#FAF8F5] max-w-md w-full p-6 rounded-2xl hairline-border shadow-2xl text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-stone-100 flex items-center justify-center text-stone-500">
            <Scale className="w-6 h-6" />
          </div>
          <h3 className="font-editorial text-xl font-bold text-stone-900">Comparison Dock is Empty</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Please add at least 2 ingredients from the pantry grid to compare nutrition, smoke points, and lab transparency side-by-side.
          </p>
          <button
            onClick={() => setIsComparisonMatrixOpen(false)}
            className="w-full py-2.5 px-4 rounded-xl bg-[#2D5A27] text-white text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
          >
            Browse Ingredients
          </button>
        </div>
      </div>
    );
  }

  const verdict = computeComparisonVerdict(comparedItems, customPrices);

  const handleGenerateAiVerdict = async () => {
    setIsGeneratingAi(true);
    try {
      const names = comparedItems.map(i => i.name);
      const text = await getGeminiComparisonVerdict(names);
      setAiVerdict(text);
      showToast('Gemini Flash AI Comparison generated', 'success');
    } catch (e: any) {
      showToast('Could not complete AI verdict', 'error', e.message);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleExportCSV = () => {
    try {
      exportComparisonToCSV(comparedItems, customPrices);
      showToast('Comparison Matrix exported as CSV', 'success');
    } catch (e) {
      showToast('Failed to export CSV', 'error');
    }
  };

  // Safe indexes for mobile 2-column view
  const safeSlotA = Math.min(mobileSlotA, Math.max(0, comparedItems.length - 1));
  const safeSlotB = Math.min(Math.max(mobileSlotB, 0), Math.max(0, comparedItems.length - 1));
  const effectiveSlotB =
    safeSlotB === safeSlotA && comparedItems.length > 1
      ? safeSlotA === 0
        ? 1
        : 0
      : safeSlotB;

  const mobileItems =
    comparedItems.length <= 2
      ? comparedItems
      : [comparedItems[safeSlotA], comparedItems[effectiveSlotB]];

  const handlePrint = () => {
    setIsPrintMode(true);
    document.body.classList.add('comparison-matrix-open');
    setTimeout(() => {
      window.print();
    }, 60);
  };

  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024;
  const tableItems = (isPrintMode || isDesktop ? comparedItems : mobileItems).filter(Boolean);

  return (
    <div className="comparison-matrix-overlay fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 lg:p-6 animate-fadeIn">
      <div className="comparison-matrix-modal bg-[#FAF8F5] w-full max-w-6xl rounded-2xl hairline-border shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Top Header Bar */}
        <div className="p-4 sm:p-6 bg-white hairline-b flex items-center justify-between shrink-0 print:p-3 print:border-b print:border-stone-300">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#2D5A27] print:hidden" />
              <span className="text-[11px] font-mono uppercase tracking-wider text-stone-500 font-semibold">
                Side-by-Side Matrix ({comparedItems.length} Staples) • Verified Food Science
              </span>
            </div>
            <h2 className="font-editorial text-xl sm:text-2xl font-bold text-stone-900 print:text-lg">
              Pantry Verdict & Lab Breakdown
            </h2>
          </div>

          <div className="flex items-center gap-2 print-hide">
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 rounded-lg hairline-border bg-white hover:bg-stone-50 text-xs font-semibold text-stone-700 flex items-center gap-1.5 transition-colors shadow-sm"
              title="Download comparison matrix as CSV file"
            >
              <Download className="w-3.5 h-3.5 text-stone-600" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg hairline-border bg-white hover:bg-stone-50 text-xs font-semibold text-stone-700 flex items-center gap-1.5 transition-colors shadow-sm"
              title="Print Clean Comparison Sheet (1 Page)"
            >
              <Printer className="w-3.5 h-3.5 text-stone-600" />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              onClick={() => setIsComparisonMatrixOpen(false)}
              className="p-2 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors ml-2"
              title="Close Matrix (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body Container */}
        <div className="comparison-matrix-scroll-body overflow-y-auto p-4 sm:p-6 space-y-6 print:p-3 print:space-y-3 print:overflow-visible">

          {/* Smart Verdict & Winners Banner */}
          <div className="bg-white p-5 rounded-2xl hairline-border shadow-sm print:p-3 print:border print:border-stone-300 print:shadow-none">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 print:mb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-sm print:hidden">
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-editorial text-lg sm:text-xl font-bold text-stone-900 leading-tight print:text-base">
                    Culinary Science Verdict
                  </h3>
                  <p className="text-xs text-stone-500 font-mono">
                    Deterministic lipid chemistry & heat degradation thresholds
                  </p>
                </div>
              </div>

              {/* Gemini AI Comparative Verdict Trigger */}
              <button
                onClick={handleGenerateAiVerdict}
                disabled={isGeneratingAi}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-800 to-[#2D5A27] text-white text-xs font-semibold hover:opacity-95 transition-all flex items-center gap-1.5 shadow-sm self-start sm:self-auto print-hide"
              >
                {isGeneratingAi ? (
                  <>
                    <Cpu className="w-3.5 h-3.5 animate-spin" />
                    <span>Gemini Reasoning...</span>
                  </>
                ) : (
                  <>
                    <Bot className="w-3.5 h-3.5 text-amber-300" />
                    <span>Generate Gemini AI Verdict</span>
                  </>
                )}
              </button>
            </div>

            {/* AI Generated Comparative Verdict Box (if requested) */}
            {aiVerdict && (
              <div className="mb-4 p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-xs text-emerald-950 space-y-2 animate-fadeIn print:p-2 print:border-emerald-300">
                <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-emerald-800">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Gemini Flash Comparative Food Science Assessment:</span>
                </div>
                <p className="leading-relaxed text-stone-800 whitespace-pre-line text-xs sm:text-sm">
                  {aiVerdict}
                </p>
              </div>
            )}

            {/* Winner Crown Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 print:grid-cols-4 gap-3 print:gap-2 mb-4 print:mb-2">
              {verdict.winners.map((winner, idx) => {
                const item = comparedItems.find(i => i.id === winner.winnerIngredientId);
                return (
                  <div key={idx} className="p-3.5 print:p-2 rounded-xl bg-stone-50 hairline-border print:border-stone-200">
                    <div className="flex items-center gap-1.5 text-amber-600 text-xs print:text-[10px] font-semibold mb-1">
                      <Crown className="w-3.5 h-3.5" />
                      <span>{winner.title}</span>
                    </div>
                    <span className="font-editorial font-bold text-stone-900 text-sm print:text-xs block mb-1">
                      {item?.name}
                    </span>
                    <p className="text-[11px] print:text-[9.5px] text-stone-600 leading-relaxed">
                      {winner.reason}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Suitability Mapping Box (Full, Complete Sentences Displayed) */}
            <div className="p-4 print:p-2.5 rounded-xl bg-[#FAF8F5] hairline-border space-y-2.5 text-xs text-stone-700">
              <span className="font-mono text-[10px] uppercase font-bold text-stone-500 block">
                Target Kitchen Applications & Recommendations:
              </span>
              <div className="space-y-2 print:space-y-1">
                {comparedItems.map(item => (
                  <div key={item.id} className="leading-relaxed border-l-2 border-[#2D5A27] pl-3 py-0.5 print:py-0 print:text-[10px]">
                    <span className="font-bold text-stone-900 block sm:inline mr-1">
                      {item.name}:
                    </span>
                    <span className="text-stone-700">
                      {verdict.suitabilityMap[item.id]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile 2-Column Switcher Bar */}
          <div className="lg:hidden bg-stone-100 p-3 rounded-xl hairline-border print-hide">
            <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-stone-700">
              <ArrowRightLeft className="w-3.5 h-3.5 text-[#2D5A27]" />
              <span>Mobile 2-Column Switcher: Select items to view side-by-side</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-stone-500 block mb-1 font-mono">Column 1</label>
                <select
                  value={safeSlotA}
                  onChange={e => setMobileSlotA(Number(e.target.value))}
                  className="w-full text-xs p-2 bg-white hairline-border rounded-lg font-medium text-stone-900 outline-none"
                >
                  {comparedItems.map((item, idx) => (
                    <option key={item.id} value={idx}>
                      {idx + 1}. {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] text-stone-500 block mb-1 font-mono">Column 2</label>
                <select
                  value={effectiveSlotB}
                  onChange={e => setMobileSlotB(Number(e.target.value))}
                  className="w-full text-xs p-2 bg-white hairline-border rounded-lg font-medium text-stone-900 outline-none"
                >
                  {comparedItems.map((item, idx) => (
                    <option key={item.id} value={idx}>
                      {idx + 1}. {item.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Comparison Matrix Table */}
          <div className="bg-white rounded-xl hairline-border overflow-x-auto shadow-sm print:border print:border-stone-300 print:shadow-none print:overflow-visible">
            <table className="w-full border-collapse text-left text-xs min-w-[650px] lg:min-w-0 print:min-w-0">
              
              {/* Header / Product Cards Row */}
              <thead>
                <tr className="hairline-b bg-stone-50/50 print:bg-white">
                  <th scope="col" className="p-4 print:p-2 w-44 print:w-32 font-mono uppercase text-[11px] print:text-[9.5px] text-stone-500 font-semibold align-top">
                    Culinary Metric
                  </th>
                  {tableItems.map(item => {
                    const price = customPrices?.[item.id] || item.basePrice;
                    const norm = getNormalizedPrice(item);
                    return (
                      <th key={item.id} scope="col" className="p-4 print:p-2 align-top hairline-l">
                        <div className="space-y-2 print:space-y-1">
                          <div className="relative h-28 print:h-14 w-full bg-stone-100 rounded-lg overflow-hidden">
                            <FoodVisual
                              id={item.id}
                              name={item.name}
                              category={item.category}
                              imageUrl={item.imageUrl}
                              className="w-full h-full object-cover"
                            />
                            <button
                              onClick={() => {
                                removeFromComparison(item.id);
                                showToast(`Removed ${item.name} from comparison`, 'info');
                              }}
                              className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/60 text-white hover:bg-black transition-colors print-hide"
                              title="Remove from comparison"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                          <div>
                            <span className="text-[10px] print:text-[8.5px] font-mono text-stone-400 block uppercase">
                              {item.category}
                            </span>
                            <h4 className="font-editorial text-sm print:text-xs font-bold text-stone-900 leading-tight break-words">
                              {item.name}
                            </h4>
                            <span className="text-[11px] print:text-[9px] text-stone-500 block">
                              {item.brand || 'Artisanal / Generic'}
                            </span>
                          </div>
                          <div className="p-2 print:p-1 bg-stone-100 rounded text-center font-tabular">
                            <span className="text-[10px] print:text-[8.5px] text-stone-500 block">True Unit Cost</span>
                            <span className="font-bold text-stone-900 text-xs print:text-[10px]">
                              {price?.currency || '₹'}{(norm?.costPer100 ?? 0).toFixed(1)} / {norm?.displayUnit || '100g'}
                            </span>
                          </div>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody className="divide-y divide-[#E2DDD5]">

                {/* Extraction Method */}
                <tr>
                  <td className="p-4 font-semibold text-stone-800 bg-stone-50/30">
                    Extraction Method
                  </td>
                  {tableItems.map(item => (
                    <td key={item.id} className="p-4 hairline-l">
                      <span className="font-medium text-stone-900 block mb-0.5">
                        {item.extractionMethod || 'Traditional'}
                      </span>
                      <span className="text-[11px] text-stone-500 block leading-relaxed">
                        {item.extractionMethod?.includes('Cold')
                          ? 'Zero hexane, mechanical extraction under 50°C'
                          : item.extractionMethod?.includes('Solvent')
                          ? 'Chemical solvent extracted & deodorized'
                          : 'Traditional processing'}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Heat Stability & Smoke Point */}
                <tr>
                  <td className="p-4 font-semibold text-stone-800 bg-stone-50/30">
                    Smoke Point & Usage
                  </td>
                  {tableItems.map(item => (
                    <td key={item.id} className="p-4 hairline-l">
                      {item.smokePoint ? (
                        <div className="space-y-1">
                          <SmokePointBadge smokePoint={item.smokePoint} />
                          <span className="text-[11px] text-stone-700 block mt-1 font-medium leading-relaxed">
                            Recommended: {item.smokePoint.recommendedUsage}
                          </span>
                        </div>
                      ) : (
                        <span className="text-stone-400 font-mono">Not an oil/fat</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Quality Grades: Nutri-Score & NOVA */}
                <tr>
                  <td className="p-4 font-semibold text-stone-800 bg-stone-50/30">
                    Transparency Scores
                  </td>
                  {tableItems.map(item => (
                    <td key={item.id} className="p-4 hairline-l space-y-1.5">
                      <div className="flex items-center gap-1.5">
                        <NutriScoreBadge grade={item.nutriscore} size="sm" />
                        <NovaBadge group={item.novaGroup} size="sm" />
                      </div>
                      <CleanLabelBadge clean={item.cleanLabel} />
                    </td>
                  ))}
                </tr>

                {/* Calories */}
                <tr>
                  <td className="p-4 font-semibold text-stone-800 bg-stone-50/30">
                    Calories
                  </td>
                  {tableItems.map(item => (
                    <td key={item.id} className="p-4 hairline-l">
                      <NutrientBar
                        label="Energy"
                        value={item.nutriments?.calories ?? 0}
                        unit="kcal"
                        maxBenchmark={900}
                        color="bg-amber-600"
                      />
                    </td>
                  ))}
                </tr>

                {/* Total Fat & Saturated Fat */}
                <tr>
                  <td className="p-4 font-semibold text-stone-800 bg-stone-50/30">
                    Fat Profile (per 100g)
                  </td>
                  {tableItems.map(item => (
                    <td key={item.id} className="p-4 hairline-l space-y-2">
                      <NutrientBar
                        label="Total Fat"
                        value={item.nutriments?.totalFat ?? 0}
                        unit="g"
                        maxBenchmark={100}
                        color="bg-stone-700"
                      />
                      <NutrientBar
                        label="Saturated Fat"
                        value={item.nutriments?.saturatedFat ?? 0}
                        unit="g"
                        maxBenchmark={100}
                        color={(item.nutriments?.saturatedFat ?? 0) > 25 ? 'bg-terracotta' : 'bg-emerald-700'}
                        note={(item.nutriments?.saturatedFat ?? 0) > 25 ? 'High' : 'Healthy'}
                      />
                    </td>
                  ))}
                </tr>

                {/* Protein */}
                <tr>
                  <td className="p-4 font-semibold text-stone-800 bg-stone-50/30">
                    Protein (per 100g)
                  </td>
                  {tableItems.map(item => (
                    <td key={item.id} className="p-4 hairline-l">
                      <NutrientBar
                        label="Protein"
                        value={item.nutriments?.protein ?? 0}
                        unit="g"
                        maxBenchmark={30}
                        color="bg-[#2D5A27]"
                      />
                    </td>
                  ))}
                </tr>

                {/* Fiber & Sugars */}
                <tr>
                  <td className="p-4 font-semibold text-stone-800 bg-stone-50/30">
                    Carbs & Sugars
                  </td>
                  {tableItems.map(item => (
                    <td key={item.id} className="p-4 hairline-l space-y-1">
                      <div className="flex justify-between font-tabular text-[11px]">
                        <span className="text-stone-500">Fiber:</span>
                        <span className="font-semibold">{item.nutriments?.fiber ?? 0}g</span>
                      </div>
                      <div className="flex justify-between font-tabular text-[11px]">
                        <span className="text-stone-500">Sugars:</span>
                        <span className={`font-semibold ${(item.nutriments?.sugars ?? 0) > 20 ? 'text-amber-700' : ''}`}>
                          {item.nutriments?.sugars ?? 0}g
                        </span>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Ingredients & Additives Inspector */}
                <tr>
                  <td className="p-4 font-semibold text-stone-800 bg-stone-50/30">
                    Ingredients & Additives
                  </td>
                  {tableItems.map(item => (
                    <td key={item.id} className="p-4 hairline-l">
                      <p className="text-[11px] text-stone-700 leading-relaxed mb-2">
                        {item.ingredientsText || 'Single ingredient staple'}
                      </p>
                      {(item.additives || []).length > 0 ? (
                        <div className="space-y-1">
                          <span className="text-[10px] text-terracotta font-mono uppercase font-bold block">
                            Flagged Additives:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {item.additives.map((add, i) => (
                              <span
                                key={i}
                                className="px-1.5 py-0.5 rounded bg-terracotta/10 text-terracotta border border-terracotta/20 text-[10px] font-mono font-medium"
                              >
                                {add}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <span className="text-[11px] text-[#2D5A27] flex items-center gap-1 font-medium">
                          <CheckCircle2 className="w-3 h-3 text-[#2D5A27]" />
                          100% Single Whole Ingredient
                        </span>
                      )}
                    </td>
                  ))}
                </tr>

              </tbody>
            </table>
          </div>

        </div>

        {/* Footer Bar */}
        <div className="p-4 bg-white hairline-t flex items-center justify-between shrink-0 print-hide">
          <button
            onClick={() => {
              clearComparison();
              showToast('Comparison dock cleared', 'info');
            }}
            className="text-xs text-stone-500 hover:text-stone-800 font-semibold"
          >
            Clear Entire Dock
          </button>
          <button
            onClick={() => setIsComparisonMatrixOpen(false)}
            className="px-5 py-2 rounded-xl bg-[#18181B] text-white text-xs font-semibold hover:bg-stone-800 transition-colors shadow-sm"
          >
            Done Comparing
          </button>
        </div>

        {/* Print-Only Document Footer */}
        <div className="hidden print:flex items-center justify-between p-3 border-t border-stone-300 text-[8pt] font-mono text-stone-500 bg-stone-50">
          <span>PANTRYVERDICT // INDEPENDENT FOOD SCIENCE & INGREDIENT MATRIX</span>
          <span>DATE: {new Date().toLocaleDateString()}</span>
          <span>DOCUMENT PAGE: 1 OF 1</span>
        </div>

      </div>
    </div>
  );
};
