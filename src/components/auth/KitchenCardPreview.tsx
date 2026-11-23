import React, { useMemo } from 'react';
import { KitchenDietaryGoal } from '../../types/user';
import {
  Heart,
  ShieldCheck,
  Sparkles,
  Flame,
  Activity,
  CheckCircle2,
  Lock,
} from 'lucide-react';

interface KitchenCardPreviewProps {
  displayName: string;
  email: string;
  goals: KitchenDietaryGoal[];
  mode?: 'signin' | 'register' | 'instant';
}

interface AdaptationSpecimen {
  id: string;
  name: string;
  subTitle: string;
  score: number;
  reason: string;
  tag: string;
}

export const KitchenCardPreview: React.FC<KitchenCardPreviewProps> = ({
  displayName,
  email,
  goals,
  mode = 'register',
}) => {
  // Goal metadata with understated editorial color accents
  const goalConfig: Record<KitchenDietaryGoal, { label: string; icon: React.ComponentType<{ className?: string }>; accent: string }> = {
    heart_health: {
      label: 'Heart Health (Low Sat Fat, High MUFA)',
      icon: Heart,
      accent: 'border-red-900/60 text-red-300 bg-red-950/40',
    },
    unrefined_only: {
      label: 'Cold-Pressed & Unrefined (NOVA 1)',
      icon: ShieldCheck,
      accent: 'border-emerald-900/60 text-emerald-300 bg-emerald-950/40',
    },
    high_protein: {
      label: 'Protein Density Focus (>20g/100g)',
      icon: Sparkles,
      accent: 'border-sky-900/60 text-sky-300 bg-sky-950/40',
    },
    budget_conscious: {
      label: 'Unit Value Optimization (₹/100g)',
      icon: CheckCircle2,
      accent: 'border-amber-900/60 text-amber-300 bg-amber-950/40',
    },
    high_heat_cooking: {
      label: 'High Heat Stability (>220°C)',
      icon: Flame,
      accent: 'border-orange-900/60 text-orange-300 bg-orange-950/40',
    },
    low_glycemic: {
      label: 'Low Glycemic Carbohydrates',
      icon: Activity,
      accent: 'border-purple-900/60 text-purple-300 bg-purple-950/40',
    },
  };

  // Dynamically recompute ingredient match ranking based on selected culinary goals
  const dynamicSpecimens = useMemo<AdaptationSpecimen[]>(() => {
    const list: AdaptationSpecimen[] = [
      {
        id: 'oil-evoo',
        name: 'Extra Virgin Olive Oil',
        subTitle: 'First Cold Extraction',
        score: 82,
        reason: 'Polyphenol & oleic acid index',
        tag: 'NOVA 1',
      },
      {
        id: 'oil-mustard',
        name: 'Kachi Ghani Mustard Oil',
        subTitle: 'Cold-Pressed Brassica',
        score: 85,
        reason: '250°C smoke point & erucic balance',
        tag: 'High Heat',
      },
      {
        id: 'ghee-bilona',
        name: 'A2 Gir Cow Bilona Ghee',
        subTitle: 'Cultured Curd Churned',
        score: 80,
        reason: 'Butyric acid & lactose-free lipid',
        tag: 'Traditional',
      },
      {
        id: 'sweet-jaggery',
        name: 'Organic Desi Jaggery',
        subTitle: 'Unclarified Cane Juice',
        score: 76,
        reason: 'Natural mineral matrix & unbleached',
        tag: 'Unrefined',
      },
    ];

    // Recalculate weights dynamically as user types or picks goals
    return list.map(item => {
      let boost = 0;
      let matchedReason = item.reason;

      if (goals.includes('unrefined_only') && (item.id === 'oil-evoo' || item.id === 'sweet-jaggery' || item.id === 'oil-mustard')) {
        boost += 12;
        matchedReason = 'Matches strict unrefined / cold-pressed criteria';
      }
      if (goals.includes('heart_health') && item.id === 'oil-evoo') {
        boost += 14;
        matchedReason = 'Optimal 73% oleic acid / monounsaturated fat';
      }
      if (goals.includes('high_heat_cooking') && (item.id === 'oil-mustard' || item.id === 'ghee-bilona')) {
        boost += 13;
        matchedReason = 'Stable at 250°C; zero thermal breakdown';
      }
      if (goals.includes('budget_conscious') && (item.id === 'oil-mustard' || item.id === 'sweet-jaggery')) {
        boost += 9;
        matchedReason = 'Top-tier cost-to-nutrient ratio';
      }
      if (goals.includes('low_glycemic') && item.id === 'sweet-jaggery') {
        boost += 6;
        matchedReason = 'Retains trace magnesium & potassium buffers';
      }

      const finalScore = Math.min(99, item.score + boost);
      return {
        ...item,
        score: finalScore,
        reason: matchedReason,
      };
    }).sort((a, b) => b.score - a.score).slice(0, 3);
  }, [goals]);

  // Clean fallback names
  const displayedName = displayName.trim() || (mode === 'signin' ? 'Returning Member' : 'Arjun Nair');
  const displayedEmail = email.trim() || (mode === 'signin' ? 'member@pantryverdict.org' : 'arjun.nair@kitchen.org');

  return (
    <div className="bg-[#18181B] text-[#FAF8F5] p-6 sm:p-7 rounded-2xl hairline-border border-[#27272A] shadow-2xl flex flex-col justify-between h-full relative overflow-hidden select-none">
      
      {/* Background Subtle Watermark & Grain Overlay */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#2D5A27]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-[#D97706]/10 rounded-full blur-2xl pointer-events-none" />

      {/* Top Ledger Seal & Classification */}
      <div className="relative z-10">
        <div className="flex items-center justify-between pb-4 border-b border-[#27272A] mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#27272A] border border-[#3F3F46] flex items-center justify-center text-emerald-400 font-mono text-xs font-bold shadow-inner">
              PV
            </div>
            <div>
              <span className="font-mono text-[10px] tracking-widest uppercase text-stone-400 block leading-tight">
                Kitchen Registry Dossier
              </span>
              <span className="font-mono text-[11px] text-stone-200 font-bold">
                PV-KL-2026 // ED. 04
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800/80 text-[10px] font-mono font-medium text-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Workspace
            </span>
          </div>
        </div>

        {/* Member Nameplate */}
        <div className="mb-5">
          <span className="font-mono text-[9px] uppercase tracking-wider text-stone-500 block mb-0.5">
            Pantry Member Alias
          </span>
          <h4 className="font-editorial text-2xl font-bold tracking-tight text-white transition-all">
            {displayedName}
          </h4>
          <p className="font-mono text-xs text-stone-400 truncate mt-0.5">
            {displayedEmail}
          </p>
        </div>

        {/* Dynamic Culinary Goals / Directives */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[9px] uppercase tracking-wider text-stone-400 font-semibold block">
              Active Nutritional Directives ({goals.length}):
            </span>
            <span className="text-[10px] font-mono text-stone-500">
              Adapts rankings
            </span>
          </div>

          {goals.length === 0 ? (
            <div className="p-3 rounded-xl bg-stone-900/60 border border-stone-800 text-[11px] text-stone-400 font-sans italic leading-relaxed">
              No directives selected. Tap priorities on the left to adapt catalog weighting to your culinary standards.
            </div>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {goals.map(g => {
                const cfg = goalConfig[g];
                if (!cfg) return null;
                const IconComponent = cfg.icon;
                return (
                  <span
                    key={g}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-all ${cfg.accent}`}
                  >
                    <IconComponent className="w-3 h-3 shrink-0" />
                    <span>{cfg.label.split('(')[0].trim()}</span>
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {/* Live Workspace Adaptation Preview */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[9px] uppercase tracking-wider text-stone-400 font-semibold block">
              Live Workspace Adaptation:
            </span>
            <span className="font-mono text-[10px] text-emerald-400 font-semibold">
              Personalized Match %
            </span>
          </div>

          <div className="space-y-2">
            {dynamicSpecimens.map(specimen => (
              <div
                key={specimen.id}
                className="p-2.5 rounded-xl bg-[#202024] border border-[#2E2E33] hover:border-stone-700 transition-all"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="font-medium text-white truncate">{specimen.name}</span>
                    <span className="px-1.5 py-0.2 rounded bg-stone-800 text-[9px] font-mono text-stone-300">
                      {specimen.tag}
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold text-emerald-400 ml-2">
                    {specimen.score}%
                  </span>
                </div>

                {/* Score bar */}
                <div className="w-full h-1 bg-stone-800 rounded-full overflow-hidden mb-1.5">
                  <div
                    className="h-full bg-gradient-to-r from-[#2D5A27] to-emerald-400 transition-all duration-500 rounded-full"
                    style={{ width: `${specimen.score}%` }}
                  />
                </div>

                <div className="text-[10px] text-stone-400 font-mono truncate">
                  {specimen.reason}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Security & Ledger Metadata Footer */}
      <div className="pt-4 border-t border-[#27272A] mt-5 relative z-10">
        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-stone-400">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
            <span>SHA-256 Web Crypto</span>
          </div>
          <div className="text-right text-stone-300">
            <span>Client-Side Local Storage</span>
          </div>
        </div>
        <div className="flex items-center justify-between text-[9px] font-mono text-stone-500 mt-1">
          <span>VERIFIED EDITORIAL STANDARD</span>
          <span>EST. 2026 • PANTRYVERDICT</span>
        </div>
      </div>

    </div>
  );
};
