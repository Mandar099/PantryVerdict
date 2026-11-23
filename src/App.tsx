import React, { useState, useEffect, useMemo, useRef } from 'react';
import { PantryProvider, usePantry } from './context/PantryContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider, useToast } from './context/ToastContext';
import { Ingredient } from './types/ingredient';
import { searchIngredients } from './services/ingredientService';
import { Header } from './components/layout/Header';
import { HeroSearch } from './components/layout/HeroSearch';
import { CategoryBar } from './components/layout/CategoryBar';
import { FilterSidebar, FilterState } from './components/ingredients/FilterSidebar';
import { IngredientGrid } from './components/ingredients/IngredientGrid';
import { ComparisonDock } from './components/comparison/ComparisonDock';
import { ComparisonMatrix } from './components/comparison/ComparisonMatrix';
import { QADrawer } from './components/qa/QADrawer';
import { MyPantryDrawer } from './components/pantry/MyPantryDrawer';
import { AuthModal } from './components/auth/AuthModal';
import { Footer } from './components/layout/Footer';
import { NotFoundView } from './components/common/NotFoundView';
import { AppPreloader } from './components/AppPreloader';
import { ErrorBoundary } from './components/common/ErrorBoundary';

const AppContent: React.FC = () => {
  const { customPrices, comparedItems } = usePantry();
  const { showToast } = useToast();

  // Search & Filtering State
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [show404, setShow404] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    coldPressedOnly: false,
    highSmokePoint: false,
    nutriScoreAB: false,
    novaGroup1: false,
    sortBy: 'health',
  });

  // Dynamic Page Title
  useEffect(() => {
    if (comparedItems.length > 0) {
      document.title = `PantryVerdict — Comparing (${comparedItems.length}/4) Staples`;
    } else if (debouncedQuery.trim()) {
      document.title = `PantryVerdict — "${debouncedQuery}" Results`;
    } else if (selectedCategory !== 'All') {
      document.title = `PantryVerdict — ${selectedCategory} Comparison`;
    } else {
      document.title = `PantryVerdict — Everyday Cooking Ingredient Comparison Platform`;
    }
  }, [comparedItems.length, debouncedQuery, selectedCategory]);

  // Data fetching state
  const [rawIngredients, setRawIngredients] = useState<Ingredient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiNotice, setApiNotice] = useState<string | null>(null);

  // 450ms Search Debouncing with AbortController
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 450);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Query Execution
  useEffect(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    searchIngredients(debouncedQuery, selectedCategory, controller.signal)
      .then(res => {
        setRawIngredients(res.items);
        setApiNotice(res.error || null);
        setIsLoading(false);
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error(err);
          setIsLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [debouncedQuery, selectedCategory]);

  // Client-Side Filtering & Sorting
  const filteredAndSortedIngredients = useMemo(() => {
    let list = [...rawIngredients];

    // Filter: Cold-Pressed Only
    if (filters.coldPressedOnly) {
      list = list.filter(
        i =>
          i.extractionMethod.includes('Cold') ||
          i.extractionMethod.includes('Wood') ||
          i.extractionMethod.includes('Virgin') ||
          i.extractionMethod.includes('Stone') ||
          i.extractionMethod.includes('Traditional')
      );
    }

    // Filter: High Smoke Point (>200°C)
    if (filters.highSmokePoint) {
      list = list.filter(i => i.smokePoint && i.smokePoint.celsius >= 200);
    }

    // Filter: Nutri-Score A/B
    if (filters.nutriScoreAB) {
      list = list.filter(i => i.nutriscore === 'A' || i.nutriscore === 'B');
    }

    // Filter: NOVA Group 1
    if (filters.novaGroup1) {
      list = list.filter(i => i.novaGroup === 1);
    }

    // Sorting
    list.sort((a, b) => {
      if (filters.sortBy === 'smokePoint') {
        return (b.smokePoint?.celsius || 0) - (a.smokePoint?.celsius || 0);
      }
      if (filters.sortBy === 'protein') {
        return b.nutriments.protein - a.nutriments.protein;
      }
      if (filters.sortBy === 'priceValue') {
        const priceA = customPrices[a.id] || a.basePrice;
        const priceB = customPrices[b.id] || b.basePrice;
        const costA = (priceA.amount / (priceA.unitQuantity || 1)) * 100;
        const costB = (priceB.amount / (priceB.unitQuantity || 1)) * 100;
        return costA - costB;
      }
      // 'health' default: clean label first, then lowest saturated fat
      if (a.cleanLabel !== b.cleanLabel) {
        return a.cleanLabel ? -1 : 1;
      }
      return a.nutriments.saturatedFat - b.nutriments.saturatedFat;
    });

    return list;
  }, [rawIngredients, filters, customPrices]);

  const activeFilterCount = [
    filters.coldPressedOnly,
    filters.highSmokePoint,
    filters.nutriScoreAB,
    filters.novaGroup1,
    filters.sortBy !== 'health',
  ].filter(Boolean).length;

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setFilters({
      coldPressedOnly: false,
      highSmokePoint: false,
      nutriScoreAB: false,
      novaGroup1: false,
      sortBy: 'health',
    });
    setShow404(false);
    showToast('Reset all filters to default', 'info');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#FAF8F5] overflow-x-hidden">
      {/* Editorial Preloader with Zero-FOUC Reveal */}
      <AppPreloader isDataReady={!isLoading} />
      
      {/* Top Fixed Header with Clickable Logo & Mobile Menu */}
      <div>
        <Header
          onResetAll={handleResetFilters}
          onSelectCategory={cat => setSelectedCategory(cat)}
        />

        {show404 ? (
          <NotFoundView onReturnHome={handleResetFilters} />
        ) : (
          <>
            {/* Hero Section & Search Bar */}
            <HeroSearch
              query={searchQuery}
              onQueryChange={setSearchQuery}
              onOpenMobileFilters={() => setIsMobileFilterOpen(true)}
              activeFilterCount={activeFilterCount}
            />

            {/* Category Filter Chips */}
            <CategoryBar
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />

            {/* Subtle API Notice if running offline */}
            {apiNotice && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2">
                <div className="px-3 py-1.5 rounded-lg bg-stone-100 text-stone-600 text-[11px] font-mono hairline-border flex items-center justify-between">
                  <span>{apiNotice}</span>
                  <span className="text-[#2D5A27] font-semibold">100% Offline Resilient</span>
                </div>
              </div>
            )}

            {/* Main Bento Layout: Sidebar + Grid */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20">
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                
                {/* Filter Sidebar */}
                <FilterSidebar
                  filters={filters}
                  onFilterChange={setFilters}
                  onResetFilters={handleResetFilters}
                  isOpenMobile={isMobileFilterOpen}
                  onCloseMobile={() => setIsMobileFilterOpen(false)}
                  totalResultsCount={filteredAndSortedIngredients.length}
                />

                {/* Ingredient Grid */}
                <IngredientGrid
                  ingredients={filteredAndSortedIngredients}
                  isLoading={isLoading}
                  onResetFilters={handleResetFilters}
                />

              </div>
            </main>
          </>
        )}
      </div>

      {/* Floating Bottom Comparison Dock */}
      <ComparisonDock />

      {/* Full Comparison Matrix Dialog */}
      <ComparisonMatrix />

      {/* Interactive Q&A Assistant Drawer */}
      <QADrawer />

      {/* Bookmarked Pantry Drawer */}
      <MyPantryDrawer />

      {/* Authentication & Kitchen Profile Modal */}
      <AuthModal />

      {/* Signature Oversized Architectural Footer */}
      <Footer onSelectCategory={setSelectedCategory} />

    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <PantryProvider>
            <AppContent />
          </PantryProvider>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
};

export default App;
