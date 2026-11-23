import React from 'react';

const CATEGORIES = [
  { id: 'All', label: 'All Varieties', count: '40+' },
  { id: 'Cooking Oils', label: 'Cooking Oils', icon: '🫒' },
  { id: 'Ghee & Butter', label: 'Ghee & Butter', icon: '🧈' },
  { id: 'Flours & Atta', label: 'Flours & Atta', icon: '🌾' },
  { id: 'Rice & Grains', label: 'Rice & Grains', icon: '🍚' },
  { id: 'Sweeteners', label: 'Sweeteners', icon: '🍯' },
  { id: 'Salts', label: 'Salts & Minerals', icon: '🧂' },
  { id: 'Pulses & Lentils', label: 'Pulses & Lentils', icon: '🫘' },
  { id: 'Spices', label: 'Spices & Herbs', icon: '🌿' },
];

interface CategoryBarProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 pt-1">
        {CATEGORIES.map(cat => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 spring-hover ${
                isActive
                  ? 'bg-[#18181B] text-white shadow-sm'
                  : 'bg-white hairline-border text-stone-700 hover:bg-stone-50 hover:text-stone-900'
              }`}
            >
              {cat.icon && <span className="text-sm">{cat.icon}</span>}
              <span>{cat.label}</span>
              {cat.count && (
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${isActive ? 'bg-stone-800 text-stone-300' : 'bg-stone-100 text-stone-500'}`}>
                  {cat.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
