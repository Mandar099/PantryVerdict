import React from 'react';

export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl hairline-border p-5 animate-pulse flex flex-col justify-between h-[420px]">
      <div>
        <div className="w-full h-36 bg-stone-100 rounded-lg mb-4" />
        <div className="flex gap-2 mb-3">
          <div className="w-16 h-5 bg-stone-200 rounded" />
          <div className="w-20 h-5 bg-stone-200 rounded" />
        </div>
        <div className="w-3/4 h-6 bg-stone-200 rounded mb-2" />
        <div className="w-1/2 h-4 bg-stone-100 rounded mb-4" />
        <div className="space-y-2">
          <div className="w-full h-3 bg-stone-100 rounded" />
          <div className="w-5/6 h-3 bg-stone-100 rounded" />
        </div>
      </div>
      <div className="pt-4 hairline-t flex justify-between items-center">
        <div className="w-24 h-6 bg-stone-200 rounded" />
        <div className="w-20 h-8 bg-stone-200 rounded" />
      </div>
    </div>
  );
};
