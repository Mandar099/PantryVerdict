import React from 'react';
import { SmartIngredientImage } from './SmartIngredientImage';

interface FoodVisualProps {
  id: string;
  name: string;
  category: string;
  imageUrl?: string;
  className?: string;
  isLiveApi?: boolean;
  aspectRatio?: string;
}

/**
 * Editorial Food Visual Component
 * Integrates the Zero-Error HD Photography Pipeline powered by verified Wikimedia Commons CDN
 * and automated fallback to handcrafted SVG botanical specimens.
 */
export const FoodVisual: React.FC<FoodVisualProps> = ({
  id,
  name,
  category,
  imageUrl,
  className = '',
  aspectRatio = 'aspect-[16/10]',
}) => {
  return (
    <SmartIngredientImage
      ingredientId={id}
      name={name}
      category={category}
      imageUrl={imageUrl}
      className={className}
      aspectRatio={aspectRatio}
    />
  );
};

export default FoodVisual;
