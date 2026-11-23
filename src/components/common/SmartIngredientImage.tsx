import React, { useState, useEffect, useRef } from 'react';
import { getVerifiedStapleImages, resolveIngredientImages } from '../../services/imageResolver';
import { IngredientIllustration } from './IngredientIllustration';

interface SmartIngredientImageProps {
  ingredientId: string;
  name: string;
  category: string;
  imageUrl?: string;
  alt?: string;
  className?: string;
  aspectRatio?: string;
}

export const SmartIngredientImage: React.FC<SmartIngredientImageProps> = ({
  ingredientId,
  name,
  category,
  imageUrl,
  alt,
  className = '',
  aspectRatio = 'aspect-[16/10]',
}) => {
  const [candidates, setCandidates] = useState<string[]>(() => {
    const verified = getVerifiedStapleImages(ingredientId);
    if (verified && verified.length > 0) return verified;
    if (imageUrl) return [imageUrl];
    return [];
  });

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [status, setStatus] = useState<'loading' | 'loaded' | 'fallback'>('loading');
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Fetch candidates if none available synchronously
  useEffect(() => {
    let isCancelled = false;

    async function loadCandidates() {
      const verified = getVerifiedStapleImages(ingredientId);
      if (verified && verified.length > 0) {
        if (!isCancelled) {
          setCandidates(verified);
          setCurrentIndex(0);
        }
        return;
      }

      const resolved = await resolveIngredientImages({
        id: ingredientId,
        name,
        category,
        fallbackUrl: imageUrl,
      });

      if (!isCancelled) {
        if (resolved.length > 0) {
          setCandidates(resolved);
          setCurrentIndex(0);
        } else {
          setStatus('fallback');
        }
      }
    }

    loadCandidates();

    return () => {
      isCancelled = true;
    };
  }, [ingredientId, name, category, imageUrl]);

  // Preload current candidate image in background
  useEffect(() => {
    if (candidates.length === 0 || currentIndex >= candidates.length) {
      setStatus('fallback');
      return;
    }

    const currentUrl = candidates[currentIndex];
    setStatus('loading');

    const img = new Image();
    img.src = currentUrl;
    img.decoding = 'async';

    img.onload = () => {
      if (mountedRef.current) {
        setStatus('loaded');
      }
    };

    img.onerror = () => {
      if (mountedRef.current) {
        // Automatically attempt next candidate
        if (currentIndex + 1 < candidates.length) {
          setCurrentIndex(prev => prev + 1);
        } else {
          // All candidates exhausted, switch to high-craft SVG fallback
          setStatus('fallback');
        }
      }
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [candidates, currentIndex]);

  // Handle direct <img> error in case browser blocks after preload
  const handleImgError = () => {
    if (currentIndex + 1 < candidates.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setStatus('fallback');
    }
  };

  const currentUrl = candidates[currentIndex];

  return (
    <div
      className={`relative w-full ${aspectRatio} overflow-hidden bg-[#F3EFEA] select-none ${className}`}
    >
      {/* Warm Stone Shimmer Skeleton while loading */}
      {status === 'loading' && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#F3EFEA]">
          <div className="w-full h-full animate-pulse bg-gradient-to-r from-[#F3EFEA] via-[#E8E2D9] to-[#F3EFEA]" />
          <span className="absolute text-[10px] font-mono uppercase tracking-wider text-stone-400">
            Resolving Specimen...
          </span>
        </div>
      )}

      {/* Primary Genuine Photograph */}
      {status !== 'fallback' && currentUrl && (
        <img
          src={currentUrl}
          alt={alt || name}
          loading="lazy"
          decoding="async"
          onError={handleImgError}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            status === 'loaded' ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      {/* Editorial Botanical Specimen / Typographic Emblem Fallback */}
      {status === 'fallback' && (
        <div className="absolute inset-0 z-10 flex items-center justify-center p-4 bg-[#F3EFEA]">
          <IngredientIllustration
            ingredientId={ingredientId}
            category={category}
            name={name}
            className="w-full h-full max-h-[140px]"
          />
        </div>
      )}

      {/* Subtle Hairline Vignette Overlay for High-Craft Editorial Finish */}
      <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-black/5" />
    </div>
  );
};
