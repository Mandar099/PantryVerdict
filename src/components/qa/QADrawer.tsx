import React, { useState, useEffect } from 'react';
import { usePantry } from '../../context/PantryContext';
import { useToast } from '../../context/ToastContext';
import { answerCulinaryQuery, QAResult } from '../../data/culinaryQAEngine';
import { getPreciseGeminiResearch, DetailedAIResearch } from '../../services/geminiService';
import { CULINARY_STAPLES } from '../../data/culinaryData';
import { FoodVisual } from '../common/FoodVisual';
import {
  X,
  Sparkles,
  ArrowRight,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Check,
  Search,
  Bot,
  Cpu,
} from 'lucide-react';

export const QADrawer: React.FC = () => {
  const {
    isQADrawerOpen,
    setIsQADrawerOpen,
    activeQAQuery,
    addToComparison,
    isComparing,
  } = usePantry();
  const { showToast } = useToast();

  const [inputQuery, setInputQuery] = useState(activeQAQuery || 'best oil for deep frying');
  const [useAI, setUseAI] = useState<boolean>(true);
  const [qaResult, setQaResult] = useState<QAResult | null>(null);
  const [aiResearch, setAiResearch] = useState<DetailedAIResearch | null>(null);
  const [isResearching, setIsResearching] = useState<boolean>(false);

  const executeResearch = async (queryText: string, runAI: boolean) => {
    const q = queryText.trim();
    if (!q) return;

    // Fast instant baseline results
    const baseResult = answerCulinaryQuery(q);
    setQaResult(baseResult);

    if (runAI) {
      setIsResearching(true);
      try {
        const research = await getPreciseGeminiResearch(q);
        setAiResearch(research);
        showToast('Gemini Flash culinary research complete', 'success', research.verdictTitle);
      } catch (e: any) {
        showToast('Using verified local culinary engine', 'info', e.message);
      } finally {
        setIsResearching(false);
      }
    } else {
      setAiResearch(null);
    }
  };

  useEffect(() => {
    if (activeQAQuery) {
      setInputQuery(activeQAQuery);
      executeResearch(activeQAQuery, useAI);
    } else if (isQADrawerOpen && !qaResult && !aiResearch) {
      executeResearch('best oil for deep frying', useAI);
    }
  }, [activeQAQuery, isQADrawerOpen]);

  const handleAsk = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    executeResearch(inputQuery, useAI);
  };

  if (!isQADrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/60 backdrop-blur-sm flex justify-end animate-fadeIn">
      <div className="bg-[#FAF8F5] w-full max-w-xl h-full shadow-2xl flex flex-col justify-between overflow-y-auto hairline-l border-stone-300">
        
        {/* Header */}
        <div className="p-5 bg-white hairline-b flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#2D5A27] to-emerald-700 flex items-center justify-center text-white shadow-sm">
              <Bot className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="font-editorial text-xl font-bold text-stone-900 leading-tight">
                  Ask PantryVerdict AI
                </h2>
                <span className="bg-amber-100 text-amber-900 text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border border-amber-300">
                  Gemini Flash
                </span>
              </div>
              <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider block">
                Biochemical Food Science & Culinary Intelligence
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsQADrawerOpen(false)}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Query Input Box */}
          <form onSubmit={handleAsk} className="space-y-2">
            <div className="relative flex items-center bg-white rounded-xl hairline-border shadow-sm focus-within:ring-2 focus-within:ring-[#2D5A27]">
              <div className="pl-3 text-stone-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={inputQuery}
                onChange={e => setInputQuery(e.target.value)}
                placeholder="Ask e.g. 'best oil for deep frying', 'ghee vs butter'..."
                className="w-full py-3 pl-2.5 pr-20 bg-transparent text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none"
              />
              <button
                type="submit"
                disabled={isResearching}
                className="absolute right-2 px-3.5 py-1.5 bg-[#2D5A27] text-white text-xs font-semibold rounded-lg hover:bg-emerald-800 transition-colors flex items-center gap-1 shadow-sm"
              >
                {isResearching ? (
                  <>
                    <Cpu className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Research</span>
                  </>
                )}
              </button>
            </div>

            {/* AI Research Toggle */}
            <div className="flex items-center justify-between text-[11px] px-1 text-stone-600">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={useAI}
                  onChange={e => setUseAI(e.target.checked)}
                  className="rounded text-[#2D5A27] focus:ring-[#2D5A27]"
                />
                <span className="font-medium">Deep Gemini Flash AI Chemical Analysis</span>
              </label>

              <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Live Key Active
              </span>
            </div>

            {/* Quick Prompts */}
            <div className="mt-2.5 flex items-center gap-1.5 flex-wrap text-xs">
              <span className="text-[11px] text-stone-400 font-mono">Suggested:</span>
              {[
                'Best oil for deep frying',
                'Refined vs cold pressed',
                'Is ghee healthier than butter',
                'Lowest glycemic sweetener',
              ].map((suggestion, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => {
                    setInputQuery(suggestion);
                    executeResearch(suggestion, useAI);
                  }}
                  className="px-2 py-0.5 rounded-md bg-white hairline-border text-[11px] text-stone-600 hover:text-[#2D5A27] hover:border-[#2D5A27]/40 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </form>

          {/* AI In-Progress Loader */}
          {isResearching && (
            <div className="p-6 bg-white rounded-2xl hairline-border shadow-sm flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#2D5A27]">
                <Cpu className="w-5 h-5 animate-spin" />
              </div>
              <div>
                <span className="font-editorial text-base font-bold text-stone-900 block">
                  Synthesizing Food Chemistry
                </span>
                <span className="text-xs text-stone-500 font-mono">
                  Calculating smoke point thresholds, lipid degradation & NOVA processing...
                </span>
              </div>
            </div>
          )}

          {/* Deep Gemini AI Research Results */}
          {aiResearch && !isResearching && (
            <div className="bg-white p-5 rounded-2xl hairline-border shadow-sm space-y-4 animate-fadeIn border-emerald-900/10">
              <div className="flex items-center justify-between pb-2 hairline-b">
                <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[#2D5A27]">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Gemini Food Science Report</span>
                </div>
                <span className="text-[10px] font-mono text-stone-400">
                  {aiResearch.isAiGenerated ? 'Gemini Flash AI Engine' : 'Culinary Science Fallback'}
                </span>
              </div>

              <div>
                <h3 className="font-editorial text-lg font-bold text-stone-900 leading-snug mb-1">
                  {aiResearch.verdictTitle}
                </h3>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed bg-stone-50/80 p-3 rounded-xl hairline-border">
                  {aiResearch.summary}
                </p>
              </div>

              {/* Biochemical Factors */}
              {aiResearch.biochemicalBreakdown && aiResearch.biochemicalBreakdown.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase font-bold text-stone-500 block">
                    Biochemical Factors:
                  </span>
                  <div className="grid grid-cols-1 gap-2">
                    {aiResearch.biochemicalBreakdown.map((item, i) => (
                      <div key={i} className="p-3 bg-stone-50 rounded-xl hairline-border text-xs">
                        <span className="font-semibold text-stone-900 block mb-0.5">
                          {item.title}
                        </span>
                        <span className="text-stone-600 leading-relaxed block text-[11px]">
                          {item.detail}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Thermal Stability & Kitchen Application */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-3 bg-amber-50/70 border border-amber-200/70 rounded-xl space-y-1">
                  <span className="font-semibold text-amber-900 flex items-center gap-1 text-[11px]">
                    <Flame className="w-3.5 h-3.5 text-amber-600" />
                    Thermal Stability
                  </span>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    {aiResearch.thermalStabilityNotes}
                  </p>
                </div>

                <div className="p-3 bg-emerald-50/70 border border-emerald-200/70 rounded-xl space-y-1">
                  <span className="font-semibold text-emerald-900 flex items-center gap-1 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Kitchen Application
                  </span>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    {aiResearch.recommendedKitchenApplication}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Recommended Staples for 1-Click Comparison */}
          {qaResult && qaResult.suggestedIngredientIds && qaResult.suggestedIngredientIds.length > 0 && (
            <div className="bg-white p-5 rounded-2xl hairline-border shadow-sm space-y-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-stone-500 font-semibold block">
                Recommended Staples to Cross-Examine:
              </span>

              <div className="space-y-2.5">
                {qaResult.suggestedIngredientIds.map(id => {
                  const staple = CULINARY_STAPLES.find(s => s.id === id);
                  if (!staple) return null;
                  const comparing = isComparing(staple.id);

                  return (
                    <div
                      key={staple.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-stone-50 hairline-border text-xs gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-white hairline-border">
                          <FoodVisual
                            id={staple.id}
                            name={staple.name}
                            category={staple.category}
                            imageUrl={staple.imageUrl}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <span className="font-bold text-stone-900 block text-xs leading-snug">
                            {staple.name}
                          </span>
                          <span className="text-[10px] text-stone-500 font-mono block mt-0.5">
                            {staple.extractionMethod} • {staple.smokePoint ? `${staple.smokePoint.celsius}°C` : `NOVA ${staple.novaGroup}`}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          const added = addToComparison(staple);
                          if (added) {
                            showToast(`Added ${staple.name} to comparison dock`, 'success');
                          } else {
                            showToast('Comparison dock is full (4 max)', 'error');
                          }
                        }}
                        disabled={comparing}
                        className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1 shrink-0 transition-colors ${
                          comparing
                            ? 'bg-[#2D5A27] text-white'
                            : 'bg-white hairline-border text-stone-800 hover:bg-stone-100'
                        }`}
                      >
                        {comparing ? (
                          <>
                            <Check className="w-3 h-3 text-white" />
                            <span>In Dock</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3 h-3" />
                            <span>Compare</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-white hairline-t flex justify-end shrink-0">
          <button
            onClick={() => setIsQADrawerOpen(false)}
            className="px-4 py-2 bg-[#18181B] text-white text-xs font-semibold rounded-xl hover:bg-stone-800"
          >
            Close Assistant
          </button>
        </div>

      </div>
    </div>
  );
};
