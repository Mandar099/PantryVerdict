import React, { useState } from 'react';
import { usePantry } from '../../context/PantryContext';
import { useAuth } from '../../context/AuthContext';
import {
  CookingPot,
  Sparkles,
  Bookmark,
  User,
  Menu,
  X,
  Scale,
  Flame,
  ShieldCheck,
  Phone,
  Mail,
  RotateCcw,
} from 'lucide-react';

interface HeaderProps {
  onResetAll?: () => void;
  onSelectCategory?: (cat: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onResetAll, onSelectCategory }) => {
  const {
    favorites,
    comparedItems,
    setIsMyPantryOpen,
    setIsQADrawerOpen,
    setIsAuthModalOpen,
    setIsComparisonMatrixOpen,
  } = usePantry();
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onResetAll) onResetAll();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  const handleCategoryClick = (cat: string) => {
    if (onSelectCategory) onSelectCategory(cat);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-30 bg-[#FAF8F5]/95 backdrop-blur-md hairline-b transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Clickable Brand / Logo */}
        <div className="flex items-center gap-3">
          <a
            href="/"
            onClick={handleLogoClick}
            className="flex items-center gap-2.5 group cursor-pointer"
            title="PantryVerdict Home — Click to Reset & Scroll to Top"
          >
            <div className="w-10 h-10 rounded-xl bg-[#2D5A27] text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <CookingPot className="w-5 h-5" />
            </div>
            <div>
              <span className="font-editorial text-2xl font-bold tracking-tight text-[#18181B] block leading-none">
                PantryVerdict
              </span>
              <span className="text-[10px] tracking-wider font-mono uppercase text-stone-500 font-semibold block mt-0.5">
                Culinary Intelligence Lab
              </span>
            </div>
          </a>

          {/* Live Data Badge */}
          <div className="hidden lg:flex items-center gap-1.5 ml-4 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-[11px] font-mono text-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Gemini AI + OFF + USDA Live</span>
          </div>
        </div>

        {/* Desktop Global Controls */}
        <div className="hidden md:flex items-center gap-2 sm:gap-3">
          
          {/* Ask AI PantryVerdict Q&A Trigger */}
          <button
            onClick={() => setIsQADrawerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hairline-border bg-white hover:bg-stone-50 text-xs font-semibold text-stone-800 shadow-sm transition-all"
            title="Ask Culinary Assistant (AI-Powered)"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Ask AI Assistant</span>
          </button>

          {/* Comparison Dock Trigger */}
          {comparedItems.length > 0 && (
            <button
              onClick={() => setIsComparisonMatrixOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 text-white text-xs font-semibold shadow-sm transition-all"
              title="Open Comparison Matrix"
            >
              <Scale className="w-3.5 h-3.5 text-emerald-400" />
              <span>Compare ({comparedItems.length}/4)</span>
            </button>
          )}

          {/* My Pantry Bookmarks */}
          <button
            onClick={() => setIsMyPantryOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hairline-border bg-white hover:bg-stone-50 text-xs font-semibold text-stone-800 shadow-sm transition-all relative"
            title="View Saved Pantry Items"
          >
            <Bookmark className="w-3.5 h-3.5 text-[#2D5A27]" />
            <span>My Pantry</span>
            {favorites.length > 0 && (
              <span className="bg-[#2D5A27] text-white text-[10px] font-mono font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {favorites.length}
              </span>
            )}
          </button>

          {/* User Account / Kitchen Profile */}
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#18181B] text-white text-xs font-semibold hover:bg-stone-800 shadow-sm transition-all"
          >
            <User className="w-3.5 h-3.5 text-emerald-400" />
            <span>{user ? user.displayName.split(' ')[0] : 'Kitchen Profile'}</span>
          </button>

        </div>

        {/* Mobile Hamburger Menu Toggle */}
        <div className="flex md:hidden items-center gap-2">
          {comparedItems.length > 0 && (
            <button
              onClick={() => setIsComparisonMatrixOpen(true)}
              className="p-2 rounded-lg bg-stone-900 text-white text-xs font-semibold"
            >
              <Scale className="w-4 h-4 text-emerald-400" />
            </button>
          )}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl bg-white hairline-border text-stone-800 hover:bg-stone-100 transition-colors"
            title="Toggle Mobile Navigation Menu"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Slide-down Navigation Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white hairline-b px-4 py-5 shadow-xl animate-fadeIn space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setIsQADrawerOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="p-3 bg-stone-50 rounded-xl hairline-border text-left flex items-center gap-2 text-xs font-semibold text-stone-800"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Ask AI Assistant</span>
            </button>

            <button
              onClick={() => {
                setIsMyPantryOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="p-3 bg-stone-50 rounded-xl hairline-border text-left flex items-center justify-between text-xs font-semibold text-stone-800"
            >
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-[#2D5A27]" />
                <span>My Pantry</span>
              </div>
              {favorites.length > 0 && (
                <span className="bg-[#2D5A27] text-white text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold">
                  {favorites.length}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setIsAuthModalOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="col-span-2 p-3 bg-stone-900 text-white rounded-xl text-left flex items-center justify-between text-xs font-semibold"
            >
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-400" />
                <span>{user ? `Account: ${user.displayName}` : 'Sign In / Account'}</span>
              </div>
              <span className="text-[10px] text-stone-400 uppercase font-mono">Open</span>
            </button>
          </div>

          {/* Quick Category Jumps */}
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-bold block mb-2">
              Browse Categories
            </span>
            <div className="flex flex-wrap gap-1.5 text-xs">
              {['Cooking Oils', 'Ghee & Butter', 'Flours & Atta', 'Rice & Grains', 'Sweeteners', 'Salts'].map(cat => (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 hover:bg-[#2D5A27] hover:text-white transition-colors"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Contact Support & Clickable Direct Links */}
          <div className="pt-3 hairline-t text-xs text-stone-600 space-y-2 font-mono text-[11px]">
            <span className="text-[10px] text-stone-400 uppercase tracking-wider block font-bold">
              Developers & Direction
            </span>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-stone-800">Mandar Shetty</span>
                <span className="text-[9px] text-[#2D5A27]">Lead Eng</span>
              </div>
              <div className="flex items-center gap-3 text-stone-500">
                <a href="mailto:mandarshetty@999gmail.com" className="hover:text-[#2D5A27] flex items-center gap-1">
                  <Mail className="w-3 h-3 text-[#2D5A27]" />
                  <span>Email</span>
                </a>
                <span>•</span>
                <a href="tel:9945728099" className="hover:text-[#2D5A27] flex items-center gap-1">
                  <Phone className="w-3 h-3 text-[#2D5A27]" />
                  <span>9945728099</span>
                </a>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-stone-100">
                <span className="font-semibold text-stone-800">Divya</span>
                <span className="text-[9px] text-amber-700">Food Science</span>
              </div>
              <div className="flex items-center gap-3 text-stone-500">
                <a href="mailto:gaonkardivya409@gmail.com" className="hover:text-[#2D5A27] flex items-center gap-1">
                  <Mail className="w-3 h-3 text-[#2D5A27]" />
                  <span>Email</span>
                </a>
                <span>•</span>
                <a href="tel:+917019297205" className="hover:text-[#2D5A27] flex items-center gap-1">
                  <Phone className="w-3 h-3 text-[#2D5A27]" />
                  <span>+91 70192 97205</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
