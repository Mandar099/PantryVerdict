import React from 'react';

interface NutrientBarProps {
  label: string;
  value: number;
  unit: string;
  maxBenchmark: number; // e.g. 100g for fat, 1000mg for sodium
  color?: string; // CSS color string or class
  note?: string;
}

export const NutrientBar: React.FC<NutrientBarProps> = ({
  label,
  value,
  unit,
  maxBenchmark,
  color = 'bg-[#2D5A27]',
  note,
}) => {
  const percentage = Math.min(Math.max((value / maxBenchmark) * 100, 0), 100);

  return (
    <div className="w-full py-1">
      <div className="flex justify-between items-baseline text-xs mb-1">
        <span className="font-medium text-stone-700">{label}</span>
        <div className="font-tabular font-semibold text-stone-900">
          <span>{value}</span>
          <span className="text-[10px] text-stone-500 ml-0.5">{unit}</span>
          {note && <span className="text-[10px] text-stone-400 ml-1">({note})</span>}
        </div>
      </div>
      <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden hairline-border">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
