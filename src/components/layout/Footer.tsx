import React from 'react';
import { CookingPot, ExternalLink, Sparkles, Scale, Heart, Phone, Mail, ArrowUp } from 'lucide-react';
import { usePantry } from '../../context/PantryContext';

interface FooterProps {
  onSelectCategory: (category: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory }) => {
  const { setIsQADrawerOpen, setIsComparisonMatrixOpen, setIsAuthModalOpen, setIsMyPantryOpen } = usePantry();
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#18181B] text-stone-300 hairline-t border-stone-800 mt-20 pt-16 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 hairline-b border-stone-800">
          
          {/* Col 1 & 2: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <button
                onClick={scrollToTop}
                className="flex items-center gap-2 text-left group"
                title="Back to Top"
              >
                <div className="w-8 h-8 rounded-lg bg-[#2D5A27] text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                  <CookingPot className="w-4 h-4" />
                </div>
                <span className="font-editorial text-2xl font-bold text-white tracking-tight">
                  PantryVerdict
                </span>
              </button>
            </div>
            <p className="text-stone-400 text-xs sm:text-sm max-w-sm leading-relaxed">
              Everyday cooking ingredient comparison platform. Demystifying smoke points, chemical solvent refining, NOVA processing groups, and normalized unit costs into clean culinary science.
            </p>

            {/* Live Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-900 border border-stone-800 text-[11px] font-mono text-stone-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Gemini Flash AI • OFF v2 • USDA Synced</span>
            </div>

            {/* Project Developers & Scientific Direction */}
            <div className="pt-3 border-t border-stone-800/80 space-y-2.5">
              <span className="font-mono text-[10px] uppercase tracking-wider text-stone-400 font-semibold block">
                Project Developers & Direction
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                {/* Mandar Shetty */}
                <div className="bg-stone-900/90 p-2.5 rounded-lg border border-stone-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-editorial text-stone-200 font-bold text-xs">Mandar Shetty</span>
                    <span className="text-[9px] text-emerald-400 bg-emerald-950/70 px-1.5 py-0.5 rounded border border-emerald-800/60">
                      Lead Engineering
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 text-[11px] text-stone-400">
                    <a
                      href="mailto:mandarshetty@999gmail.com"
                      className="hover:text-emerald-400 flex items-center gap-1.5 transition-colors truncate"
                      title="Email Mandar Shetty"
                    >
                      <Mail className="w-3 h-3 text-stone-500 shrink-0" />
                      <span className="truncate">mandarshetty@999gmail.com</span>
                    </a>
                    <a
                      href="tel:9945728099"
                      className="hover:text-emerald-400 flex items-center gap-1.5 transition-colors"
                      title="Call Mandar Shetty"
                    >
                      <Phone className="w-3 h-3 text-stone-500 shrink-0" />
                      <span>9945728099</span>
                    </a>
                  </div>
                </div>

                {/* Divya */}
                <div className="bg-stone-900/90 p-2.5 rounded-lg border border-stone-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-editorial text-stone-200 font-bold text-xs">Divya</span>
                    <span className="text-[9px] text-amber-400 bg-amber-950/70 px-1.5 py-0.5 rounded border border-amber-800/60">
                      Food Science Lead
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 text-[11px] text-stone-400">
                    <a
                      href="mailto:gaonkardivya409@gmail.com"
                      className="hover:text-emerald-400 flex items-center gap-1.5 transition-colors truncate"
                      title="Email Divya"
                    >
                      <Mail className="w-3 h-3 text-stone-500 shrink-0" />
                      <span className="truncate">gaonkardivya409@gmail.com</span>
                    </a>
                    <a
                      href="tel:+917019297205"
                      className="hover:text-emerald-400 flex items-center gap-1.5 transition-colors"
                      title="Call Divya"
                    >
                      <Phone className="w-3 h-3 text-stone-500 shrink-0" />
                      <span>+91 70192 97205</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Col 3: Quick Navigation Categories */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-wider text-stone-200 font-bold mb-3">
              Staple Categories
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              {['Cooking Oils', 'Ghee & Butter', 'Flours & Atta', 'Rice & Grains', 'Sweeteners', 'Salts'].map(cat => (
                <li key={cat}>
                  <button
                    onClick={() => {
                      onSelectCategory(cat);
                      window.scrollTo({ top: 380, behavior: 'smooth' });
                    }}
                    className="hover:text-white transition-colors"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Platform Features */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-wider text-stone-200 font-bold mb-3">
              Culinary Tools
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button onClick={() => setIsQADrawerOpen(true)} className="hover:text-white transition-colors">
                  Ask Gemini AI Assistant
                </button>
              </li>
              <li>
                <button onClick={() => setIsComparisonMatrixOpen(true)} className="hover:text-white transition-colors">
                  Side-by-Side Comparison Dock
                </button>
              </li>
              <li>
                <button onClick={() => setIsMyPantryOpen(true)} className="hover:text-white transition-colors">
                  My Pantry Saved Staples
                </button>
              </li>
              <li>
                <button onClick={() => setIsAuthModalOpen(true)} className="hover:text-white transition-colors">
                  Kitchen ID Profile & Pass
                </button>
              </li>
              <li>
                <button onClick={scrollToTop} className="hover:text-white transition-colors flex items-center gap-1">
                  <ArrowUp className="w-3 h-3 text-stone-500" />
                  <span>Back to Top</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Free Data Attributions & Keyboard Shortcuts */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-wider text-stone-200 font-bold mb-3">
              Attributions & Shortcuts
            </h4>
            <div className="space-y-3 text-xs text-stone-400">
              <div>
                <a
                  href="https://world.openfoodfacts.org"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white flex items-center gap-1"
                >
                  <span>Open Food Facts (ODbL)</span>
                  <ExternalLink className="w-3 h-3 text-stone-500" />
                </a>
              </div>
              <div>
                <a
                  href="https://fdc.nal.usda.gov"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white flex items-center gap-1"
                >
                  <span>USDA FoodData Central</span>
                  <ExternalLink className="w-3 h-3 text-stone-500" />
                </a>
              </div>
              <div className="pt-2 hairline-t border-stone-800 space-y-1 text-[11px] font-mono text-stone-500">
                <div className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 bg-stone-800 text-stone-300 rounded border border-stone-700 text-[10px]">
                    /
                  </kbd>
                  <span>Focus search input</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 bg-stone-800 text-stone-300 rounded border border-stone-700 text-[10px]">
                    C
                  </kbd>
                  <span>Toggle comparison matrix</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Signature Oversized Architectural Wordmark */}
        <div className="pt-10 pb-4 text-center select-none overflow-hidden">
          <span className="font-editorial font-extrabold text-[12vw] tracking-tighter text-stone-800/80 leading-none block whitespace-nowrap">
            PANTRYVERDICT
          </span>
        </div>

        {/* Bottom Micro-Bar */}
        <div className="pt-6 hairline-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 font-mono gap-2">
          <span>
            © {currentYear} PantryVerdict. Open food chemistry research for wholesome kitchens.
          </span>
          <span className="text-stone-400">
            Powered by Google Gemini Flash • Swiss Bento Architecture
          </span>
        </div>

      </div>
    </footer>
  );
};
