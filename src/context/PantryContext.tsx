import React, { createContext, useContext, useState, useEffect } from 'react';
import { Ingredient, BasePrice, NormalizedPrice } from '../types/ingredient';
import { loadFavorites, saveFavorites, loadCustomPrices, saveCustomPrices } from '../services/storageService';

interface PantryContextType {
  comparedItems: Ingredient[];
  addToComparison: (item: Ingredient) => boolean;
  removeFromComparison: (id: string) => void;
  clearComparison: () => void;
  isComparing: (id: string) => boolean;
  isComparisonFull: boolean;
  
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;

  customPrices: Record<string, BasePrice>;
  updateCustomPrice: (id: string, amount: number, unitQuantity: number) => void;
  resetCustomPrice: (id: string) => void;
  getNormalizedPrice: (item: Ingredient) => NormalizedPrice;

  // Global Dialog & Drawer States
  isComparisonMatrixOpen: boolean;
  setIsComparisonMatrixOpen: (open: boolean) => void;
  isQADrawerOpen: boolean;
  setIsQADrawerOpen: (open: boolean) => void;
  isMyPantryOpen: boolean;
  setIsMyPantryOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;

  // QA Query pass-through
  activeQAQuery: string;
  openQAWithQuery: (query: string) => void;
}

const PantryContext = createContext<PantryContextType | undefined>(undefined);

export const PantryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [comparedItems, setComparedItems] = useState<Ingredient[]>([]);
  const [favorites, setFavorites] = useState<string[]>(() => loadFavorites());
  const [customPrices, setCustomPrices] = useState<Record<string, BasePrice>>(() => loadCustomPrices());

  const [isComparisonMatrixOpen, setIsComparisonMatrixOpen] = useState(false);
  const [isQADrawerOpen, setIsQADrawerOpen] = useState(false);
  const [isMyPantryOpen, setIsMyPantryOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activeQAQuery, setActiveQAQuery] = useState('');

  // Persist Favorites
  useEffect(() => {
    saveFavorites(favorites);
  }, [favorites]);

  // Persist Custom Prices
  useEffect(() => {
    saveCustomPrices(customPrices);
  }, [customPrices]);

  const addToComparison = (item: Ingredient): boolean => {
    if (comparedItems.some(i => i.id === item.id)) {
      return false;
    }
    if (comparedItems.length >= 4) {
      return false;
    }
    setComparedItems(prev => [...prev, item]);
    return true;
  };

  const removeFromComparison = (id: string) => {
    setComparedItems(prev => prev.filter(i => i.id !== id));
  };

  const clearComparison = () => {
    setComparedItems([]);
    setIsComparisonMatrixOpen(false);
  };

  const isComparing = (id: string) => {
    return comparedItems.some(i => i.id === id);
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const isFavorite = (id: string) => favorites.includes(id);

  const updateCustomPrice = (id: string, amount: number, unitQuantity: number) => {
    setCustomPrices(prev => ({
      ...prev,
      [id]: {
        amount,
        currency: prev[id]?.currency || '₹',
        unitQuantity: unitQuantity || 1,
        unitType: prev[id]?.unitType || 'ml',
      },
    }));
  };

  const resetCustomPrice = (id: string) => {
    setCustomPrices(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const getNormalizedPrice = (item: Ingredient): NormalizedPrice => {
    const defaultPrice: BasePrice = {
      amount: 100,
      currency: '₹',
      unitQuantity: 1000,
      unitType: 'g',
    };
    const price = customPrices?.[item.id] || item.basePrice || defaultPrice;
    const qty = (price.unitQuantity && price.unitQuantity > 0) ? price.unitQuantity : 1;
    const costPer100 = ((price.amount ?? 0) / qty) * 100;

    let costPerProtein10g: number | undefined;
    if (item.nutriments?.protein && item.nutriments.protein > 0) {
      // Grams of protein per unit
      const totalProtein = (qty / 100) * item.nutriments.protein;
      if (totalProtein > 0) {
        costPerProtein10g = ((price.amount ?? 0) / totalProtein) * 10;
      }
    }

    let costPerHealthyFat10g: number | undefined;
    if (item.nutriments?.monounsaturatedFat && item.nutriments.monounsaturatedFat > 0) {
      const totalMufa = (qty / 100) * item.nutriments.monounsaturatedFat;
      if (totalMufa > 0) {
        costPerHealthyFat10g = ((price.amount ?? 0) / totalMufa) * 10;
      }
    }

    return {
      costPer100: isNaN(costPer100) ? 0 : costPer100,
      costPerProtein10g,
      costPerHealthyFat10g,
      displayUnit: `100${price.unitType || 'g'}`,
      rawAmount: price.amount ?? 0,
      rawQuantity: price.unitQuantity ?? 1,
    };
  };

  const openQAWithQuery = (query: string) => {
    setActiveQAQuery(query);
    setIsQADrawerOpen(true);
  };

  return (
    <PantryContext.Provider
      value={{
        comparedItems,
        addToComparison,
        removeFromComparison,
        clearComparison,
        isComparing,
        isComparisonFull: comparedItems.length >= 4,
        favorites,
        toggleFavorite,
        isFavorite,
        customPrices,
        updateCustomPrice,
        resetCustomPrice,
        getNormalizedPrice,
        isComparisonMatrixOpen,
        setIsComparisonMatrixOpen,
        isQADrawerOpen,
        setIsQADrawerOpen,
        isMyPantryOpen,
        setIsMyPantryOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        activeQAQuery,
        openQAWithQuery,
      }}
    >
      {children}
    </PantryContext.Provider>
  );
};

export const usePantry = (): PantryContextType => {
  const context = useContext(PantryContext);
  if (!context) {
    throw new Error('usePantry must be used within a PantryProvider');
  }
  return context;
};
