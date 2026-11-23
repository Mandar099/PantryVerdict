import React from 'react';
import { NutriScoreGrade, NovaGroup, SmokePointInfo } from '../../types/ingredient';
import { Flame, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

interface NutriScoreBadgeProps {
  grade: NutriScoreGrade;
  size?: 'sm' | 'md';
}

export const NutriScoreBadge: React.FC<NutriScoreBadgeProps> = ({ grade, size = 'md' }) => {
  const colors: Record<NutriScoreGrade, { bg: string; text: string; border: string }> = {
    A: { bg: 'bg-[#2D5A27] text-white', text: 'text-white', border: 'border-[#2D5A27]' },
    B: { bg: 'bg-[#65A30D] text-white', text: 'text-white', border: 'border-[#65A30D]' },
    C: { bg: 'bg-[#EAB308] text-white', text: 'text-white', border: 'border-[#EAB308]' },
    D: { bg: 'bg-[#EA580C] text-white', text: 'text-white', border: 'border-[#EA580C]' },
    E: { bg: 'bg-[#DC2626] text-white', text: 'text-white', border: 'border-[#DC2626]' },
    Unknown: { bg: 'bg-stone-200 text-stone-700', text: 'text-stone-700', border: 'border-stone-300' },
  };

  const current = colors[grade] || colors.Unknown;
  const isSm = size === 'sm';

  return (
    <div
      className={`inline-flex items-center gap-1 font-bold rounded-md font-tabular border ${current.border} ${current.bg} ${
        isSm ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs'
      }`}
      title={`Nutri-Score Grade: ${grade}`}
    >
      <span className="opacity-80 text-[9px] uppercase tracking-wider">Score</span>
      <span className="font-extrabold">{grade}</span>
    </div>
  );
};

interface NovaBadgeProps {
  group: NovaGroup;
  size?: 'sm' | 'md';
}

export const NovaBadge: React.FC<NovaBadgeProps> = ({ group, size = 'md' }) => {
  const configs: Record<NovaGroup, { label: string; bg: string; text: string; border: string }> = {
    1: { label: 'NOVA 1: Unprocessed', bg: 'bg-[#F2F7F1]', text: 'text-[#2D5A27]', border: 'border-[#2D5A27]/30' },
    2: { label: 'NOVA 2: Culinary Staple', bg: 'bg-[#FFFBEB]', text: 'text-[#B45309]', border: 'border-[#D97706]/30' },
    3: { label: 'NOVA 3: Processed', bg: 'bg-[#FFF7ED]', text: 'text-[#C2410C]', border: 'border-[#C2410C]/30' },
    4: { label: 'NOVA 4: Ultra-Processed', bg: 'bg-[#FEF2F2]', text: 'text-[#DC2626]', border: 'border-[#DC2626]/30' },
  };

  const cfg = configs[group] || configs[2];
  const isSm = size === 'sm';

  return (
    <div
      className={`inline-flex items-center gap-1 font-mono font-medium rounded-md border ${cfg.border} ${cfg.bg} ${cfg.text} ${
        isSm ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs'
      }`}
      title={cfg.label}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      <span>NOVA {group}</span>
    </div>
  );
};

interface SmokePointBadgeProps {
  smokePoint: SmokePointInfo;
  size?: 'sm' | 'md';
}

export const SmokePointBadge: React.FC<SmokePointBadgeProps> = ({ smokePoint, size = 'md' }) => {
  const isHigh = smokePoint.celsius >= 220;
  const isMedium = smokePoint.celsius >= 180 && smokePoint.celsius < 220;
  const isSm = size === 'sm';

  const badgeStyle = isHigh
    ? 'bg-amber-50 text-amber-900 border-amber-300'
    : isMedium
    ? 'bg-stone-100 text-stone-800 border-stone-300'
    : 'bg-blue-50 text-blue-900 border-blue-200';

  return (
    <div
      className={`inline-flex items-center gap-1 font-tabular font-semibold rounded-md border ${badgeStyle} ${
        isSm ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs'
      }`}
      title={`Smoke Point: ${smokePoint.celsius}°C (${smokePoint.fahrenheit}°F). Usage: ${smokePoint.recommendedUsage}`}
    >
      <Flame className={`w-3 h-3 ${isHigh ? 'text-amber-600' : 'text-stone-500'}`} />
      <span>{smokePoint.celsius}°C</span>
      <span className="text-[10px] font-normal opacity-75">({smokePoint.fahrenheit}°F)</span>
    </div>
  );
};

export const CleanLabelBadge: React.FC<{ clean: boolean }> = ({ clean }) => {
  if (clean) {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#2D5A27] bg-[#F2F7F1] border border-[#2D5A27]/20 px-2 py-0.5 rounded-full">
        <CheckCircle2 className="w-3 h-3 text-[#2D5A27]" />
        Clean Label
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#C2410C] bg-[#FFF7ED] border border-[#C2410C]/20 px-2 py-0.5 rounded-full">
      <AlertTriangle className="w-3 h-3 text-[#C2410C]" />
      Additives Flagged
    </span>
  );
};
