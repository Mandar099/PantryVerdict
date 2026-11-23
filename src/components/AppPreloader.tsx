import React, { useState, useEffect } from 'react';
import { VERIFIED_INGREDIENT_IMAGES } from '../services/imageResolver';
import { DeliveryTruckLoader } from './common/DeliveryTruckLoader';
import { Mail, Phone } from 'lucide-react';

interface AppPreloaderProps {
  onReady?: () => void;
  isDataReady: boolean;
}

export const AppPreloader: React.FC<AppPreloaderProps> = ({ onReady, isDataReady }) => {
  const [progress, setProgress] = useState(15);
  const [statusMessage, setStatusMessage] = useState('Initializing food chemistry index...');
  const [isDismissing, setIsDismissing] = useState(false);
  const [isMounted, setIsMounted] = useState(true);

  const handleDismiss = () => {
    setIsDismissing(true);
    document.body.classList.remove('overflow-hidden');
    onReady?.();
    setTimeout(() => setIsMounted(false), 450);
  };

  useEffect(() => {
    // 1. Lock body scrolling while preloader is active
    document.body.classList.add('overflow-hidden');

    let isCancelled = false;
    const startTime = performance.now();

    // Check prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Preload top initial above-the-fold images
    const topStapleKeys = [
      'oil-evoo-cold-pressed',
      'oil-mustard-kachi-ghani',
      'ghee-a2-desi-cow-bilona',
      'grain-basmati-aged-royal',
      'sweet-jaggery-organic-gur',
      'salt-himalayan-pink-rock',
    ];

    const preloadImage = (url: string): Promise<boolean> =>
      new Promise(resolve => {
        const img = new Image();
        img.src = url;
        img.decoding = 'async';
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
      });

    async function runReadinessGate() {
      // Step A: Wait for typography to be ready
      try {
        if ('fonts' in document) {
          setStatusMessage('Checking editorial font rendering...');
          setProgress(35);
          await (document as any).fonts.ready;
        }
      } catch (e) {
        // Fallback silently if font API unavailable
      }

      if (isCancelled) return;

      // Step B: Hydrate core above-the-fold specimens
      setStatusMessage('Preloading verified above-the-fold specimens...');
      setProgress(60);

      const urlsToPreload = topStapleKeys
        .map(key => VERIFIED_INGREDIENT_IMAGES[key]?.[0])
        .filter(Boolean) as string[];

      // Run image preloading with a 1s threshold so slow network doesn't delay
      await Promise.race([
        Promise.all(urlsToPreload.map(preloadImage)),
        new Promise(resolve => setTimeout(resolve, 900)),
      ]);

      if (isCancelled) return;

      // Step C: Ensure data has hydrated or reached 90%
      setStatusMessage('Finalizing culinary index...');
      setProgress(90);

      // Wait a minimum frame so progress bar and truck animation are visible and smooth
      const elapsed = performance.now() - startTime;
      const minDisplayTime = prefersReducedMotion ? 200 : 1800;
      if (elapsed < minDisplayTime) {
        await new Promise(r => setTimeout(r, minDisplayTime - elapsed));
      }

      if (isCancelled) return;

      setProgress(100);
      setStatusMessage('Pantry index ready');

      // Step D: Trigger dismissal choreography
      setTimeout(() => {
        if (isCancelled) return;
        setIsDismissing(true);
        onReady?.();

        // Restore body scroll
        document.body.classList.remove('overflow-hidden');

        // Unmount cleanly after transition
        setTimeout(() => {
          if (!isCancelled) {
            setIsMounted(false);
          }
        }, 500);
      }, prefersReducedMotion ? 50 : 350);
    }

    // Safety timeout: Maximum 3.5s safeguard
    const safetyTimer = setTimeout(() => {
      if (!isCancelled && isMounted) {
        setProgress(100);
        setIsDismissing(true);
        document.body.classList.remove('overflow-hidden');
        onReady?.();
        setTimeout(() => setIsMounted(false), 500);
      }
    }, 3500);

    runReadinessGate();

    return () => {
      isCancelled = true;
      clearTimeout(safetyTimer);
      document.body.classList.remove('overflow-hidden');
    };
  }, [onReady]);

  if (!isMounted) return null;

  return (
    <div
      aria-label="Loading PantryVerdict"
      aria-live="polite"
      className={`fixed inset-0 z-50 flex flex-col justify-between bg-[#FAF8F5] text-stone-900 transition-all duration-500 ease-out select-none overflow-y-auto ${isDismissing
        ? 'opacity-0 -translate-y-4 pointer-events-none'
        : 'opacity-100 translate-y-0'
        }`}
      style={{
        transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      {/* Top Hairline & Registry Header */}
      <div className="p-4 sm:p-6 flex items-center justify-between border-b border-[#E5E0D8] shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#2D5A27] animate-pulse" />
          <span className="font-mono text-[10px] tracking-widest uppercase text-stone-500 font-semibold">
            PANTRYVERDICT • VERIFIED CULINARY INDEX
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:block font-mono text-[10px] text-stone-400">
            ED. 2026 // EST. PV
          </div>
          <button
            onClick={handleDismiss}
            className="px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider text-stone-600 hover:text-stone-900 bg-white hover:bg-stone-100 border border-[#E5E0D8] transition-colors"
            title="Skip loading and enter platform"
          >
            Enter Pantry →
          </button>
        </div>
      </div>

      {/* Center Editorial Monogram, Animated Loader & Developers */}
      <div className="max-w-xl w-full mx-auto px-4 sm:px-6 text-center space-y-3.5 my-auto py-6">
        {/* Animated Delivery Truck Loader from Uiverse.io */}
        <div className="flex justify-center -mb-2">
          <DeliveryTruckLoader scale={0.72} />
        </div>

        <div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#2D5A27] font-bold block mb-1">
            Independent Food Chemistry & Quality Platform
          </span>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight text-stone-900">
            PantryVerdict
          </h1>
          <p className="font-sans text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            Pure ingredient transparency • Smoke point stability • NOVA processing grades
          </p>
        </div>

        {/* Ultra-thin 2px progress bar */}
        <div className="w-full bg-[#E5E0D8] h-[2px] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#2D5A27] transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Monospaced micro-label */}
        <div className="flex items-center justify-between text-[11px] font-mono text-stone-500">
          <span className="truncate">{statusMessage}</span>
          <span className="font-bold text-stone-800 ml-2">{progress}%</span>
        </div>

        {/* Engineering & Culinary Research Developers Info */}
        <div className="pt-3 border-t border-[#E5E0D8] mt-3">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[9px] uppercase tracking-wider text-stone-400 font-semibold">
              Project Developers & Direction
            </span>
            <span className="font-mono text-[9px] text-[#2D5A27] font-semibold">
              Direct Contact
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-left">
            {/* Developer 1: Mandar Shetty */}
            <div className="p-3 rounded-xl bg-white hairline-border border-[#E5E0D8] shadow-xs hover:border-[#2D5A27]/40 transition-colors">
              <div className="flex items-center justify-between mb-1">
                <span className="font-editorial text-sm font-bold text-stone-900">
                  Mandar Shetty
                </span>

              </div>
              <div className="space-y-1 text-[11px] font-mono">
                <a
                  href="mailto:mandarshetty@999gmail.com"
                  className="text-stone-600 hover:text-[#2D5A27] flex items-center gap-1.5 transition-colors group"
                >
                  <Mail className="w-3 h-3 text-stone-400 group-hover:text-[#2D5A27] shrink-0" />
                  <span className="truncate">mandarshetty@999gmail.com</span>
                </a>
                <a
                  href="tel:9945728099"
                  className="text-stone-600 hover:text-[#2D5A27] flex items-center gap-1.5 transition-colors group"
                >
                  <Phone className="w-3 h-3 text-stone-400 group-hover:text-[#2D5A27] shrink-0" />
                  <span>9945728099</span>
                </a>
              </div>
            </div>

            {/* Developer 2: Divya  */}
            <div className="p-3 rounded-xl bg-white hairline-border border-[#E5E0D8] shadow-xs hover:border-[#2D5A27]/40 transition-colors">
              <div className="flex items-center justify-between mb-1">
                <span className="font-editorial text-sm font-bold text-stone-900">
                  Divya
                </span>
              </div>
              <div className="space-y-1 text-[11px] font-mono">
                <a
                  href="mailto:gaonkardivya409@gmail.com"
                  className="text-stone-600 hover:text-[#2D5A27] flex items-center gap-1.5 transition-colors group"
                >
                  <Mail className="w-3 h-3 text-stone-400 group-hover:text-[#2D5A27] shrink-0" />
                  <span className="truncate">gaonkardivya409@gmail.com</span>
                </a>
                <a
                  href="tel:+917019297205"
                  className="text-stone-600 hover:text-[#2D5A27] flex items-center gap-1.5 transition-colors group"
                >
                  <Phone className="w-3 h-3 text-stone-400 group-hover:text-[#2D5A27] shrink-0" />
                  <span>+91 70192 97205</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Editorial Hairline & Metadata */}
      <div className="p-4 sm:p-6 flex items-center justify-between border-t border-[#E5E0D8] text-[10px] font-mono text-stone-400 shrink-0">
        <span>Zero Third-Party Tracking</span>
        <span>Open Food Facts + Wikimedia Commons Public Domain</span>
      </div>
    </div>
  );
};
