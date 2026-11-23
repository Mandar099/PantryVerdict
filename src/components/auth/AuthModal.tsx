import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { usePantry } from '../../context/PantryContext';
import { useToast } from '../../context/ToastContext';
import { KitchenDietaryGoal } from '../../types/user';
import { KitchenCardPreview } from './KitchenCardPreview';
import { evaluatePasswordStrength } from '../../services/cryptoService';
import {
  X,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  Sparkles,
  Lock,
  LogOut,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  UserCheck,
  Compass,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen } = usePantry();
  const { user, login, register, loginCurator, continueAsGuest, logout } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'signin' | 'register' | 'instant'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [goals, setGoals] = useState<KitchenDietaryGoal[]>([
    'heart_health',
    'unrefined_only',
  ]);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAuthModalOpen) {
        setIsAuthModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthModalOpen, setIsAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const passwordStrength = evaluatePasswordStrength(password);
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  const toggleGoal = (g: KitchenDietaryGoal) => {
    setGoals(prev => (prev.includes(g) ? prev.filter(item => item !== g) : [...prev, g]));
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter both your email address and password.');
      triggerShake();
      return;
    }

    if (!isValidEmail) {
      setErrorMsg('Please enter a valid email address (e.g., arjun.nair@kitchen.org).');
      triggerShake();
      return;
    }

    setIsLoading(true);
    const res = await login(email, password);
    setIsLoading(false);

    if (res.success) {
      showToast('Welcome back to your PantryVerdict workspace', 'success');
      setIsAuthModalOpen(false);
    } else {
      setErrorMsg(res.error || 'Authentication failed. Please verify your credentials.');
      triggerShake();
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!displayName.trim()) {
      setErrorMsg('Please provide your name or culinary pseudonym.');
      triggerShake();
      return;
    }

    if (!email.trim() || !isValidEmail) {
      setErrorMsg('Please provide a valid email address.');
      triggerShake();
      return;
    }

    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters with a mix of letters and numbers.');
      triggerShake();
      return;
    }

    setIsLoading(true);
    const res = await register(email, password, displayName, goals);
    setIsLoading(false);

    if (res.success) {
      showToast('Kitchen account established with local Web Crypto credentials', 'success');
      setIsAuthModalOpen(false);
    } else {
      setErrorMsg(res.error || 'Registration could not be completed.');
      triggerShake();
    }
  };

  const handleLoadCuratorWorkspace = () => {
    loginCurator();
    showToast('Loaded Editorial Research Workspace (Priya Sharma)', 'info');
    setIsAuthModalOpen(false);
  };

  const handleContinueAsGuest = () => {
    continueAsGuest();
    showToast('Continuing in Guest Reader mode', 'info');
    setIsAuthModalOpen(false);
  };

  const tabIndex = activeTab === 'signin' ? 0 : activeTab === 'register' ? 1 : 2;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
    >
      {/* Backdrop tap to close */}
      <div
        className="fixed inset-0"
        onClick={() => setIsAuthModalOpen(false)}
        aria-hidden="true"
      />

      <div
        className={`relative z-10 bg-[#FAF8F5] w-full max-w-4xl rounded-2xl hairline-border border-[#E5E0D8] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[92vh] ${
          isShaking ? 'animate-shake' : ''
        }`}
      >
        {/* ========================================================= */}
        {/* LEFT / PRIMARY AUTH COLUMN (EDITORIAL FORM CANVAS)        */}
        {/* ========================================================= */}
        <div className="w-full md:w-7/12 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto bg-[#FAF8F5]">
          <div>
            {/* Top Bar with Brand Badge & Dismiss Button */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E0D8] mb-6">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#2D5A27]" />
                <span className="font-mono text-[10px] tracking-widest uppercase text-stone-500 font-semibold">
                  PANTRYVERDICT • ACCOUNT ACCESS
                </span>
              </div>
              <button
                onClick={() => setIsAuthModalOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-stone-200/60 transition-colors focus-visible:ring-2 focus-visible:ring-[#2D5A27] outline-none"
                aria-label="Close authentication dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Active User Session Management (If already authenticated) */}
            {user ? (
              <div className="space-y-6">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-stone-500 font-bold block mb-1">
                    Authenticated Workspace
                  </span>
                  <h3
                    id="auth-modal-title"
                    className="font-editorial text-2xl font-bold text-stone-900 tracking-tight"
                  >
                    {user.displayName}
                  </h3>
                  <p className="font-mono text-xs text-stone-600 mt-0.5">
                    {user.email}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white hairline-border border-[#E5E0D8] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] text-stone-500 font-semibold uppercase">
                      Configured Nutritional Priorities:
                    </span>
                    <span className="font-mono text-[10px] text-emerald-800 font-bold">
                      {user.kitchenGoals.length} Active
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {user.kitchenGoals.map(g => (
                      <span
                        key={g}
                        className="px-2.5 py-1 rounded-lg bg-[#2D5A27]/10 border border-[#2D5A27]/20 text-[#2D5A27] text-[11px] font-medium"
                      >
                        {g.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>

                  {user.savedBoards && user.savedBoards.length > 0 && (
                    <div className="pt-2 border-t border-stone-100">
                      <span className="font-mono text-[10px] text-stone-400 block mb-1">
                        Linked Comparison Boards ({user.savedBoards.length}):
                      </span>
                      <div className="space-y-1">
                        {user.savedBoards.map(b => (
                          <div
                            key={b.id}
                            className="text-xs text-stone-700 flex items-center justify-between"
                          >
                            <span className="font-medium truncate">{b.title}</span>
                            <span className="font-mono text-[10px] text-stone-400 shrink-0 ml-2">
                              {b.ingredientIds.length} items
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#E5E0D8]">
                  <button
                    onClick={logout}
                    className="px-4 py-2.5 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 text-xs font-semibold flex items-center gap-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-red-400 outline-none"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>

                  <button
                    onClick={() => setIsAuthModalOpen(false)}
                    className="px-6 py-2.5 rounded-xl bg-[#18181B] text-white text-xs font-semibold hover:bg-stone-800 transition-colors shadow-sm focus-visible:ring-2 focus-visible:ring-stone-400 outline-none"
                  >
                    Return to Pantry
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Heading & Subtitle */}
                <div className="mb-6">
                  <h3
                    id="auth-modal-title"
                    className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight"
                  >
                    {activeTab === 'signin' && 'Sign in to your kitchen workspace'}
                    {activeTab === 'register' && 'Establish your pantry profile'}
                    {activeTab === 'instant' && 'Explore without an account'}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 font-sans mt-1 leading-relaxed">
                    {activeTab === 'signin' &&
                      'Access your saved ingredient comparisons, custom store prices, and personalized nutritional indices.'}
                    {activeTab === 'register' &&
                      'Create a client-side account secured with salted SHA-256 cryptographic hashing.'}
                    {activeTab === 'instant' &&
                      'Jump directly into ingredient comparisons or load pre-curated research data with zero friction.'}
                  </p>
                </div>

                {/* GPU-Accelerated Sliding Tab Switcher */}
                <div className="relative bg-[#ECE7DF] p-1 rounded-xl mb-6 hairline-border border-[#E0D9CE]">
                  {/* Sliding pill indicator */}
                  <div
                    className="absolute top-1 bottom-1 w-[calc(33.333%-2px)] bg-white rounded-lg shadow-sm border border-stone-200/80 transition-transform duration-300"
                    style={{
                      transform: `translateX(calc(${tabIndex * 100}% + ${tabIndex * 2}px))`,
                      transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
                    }}
                  />

                  <div className="relative grid grid-cols-3 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('signin');
                        setErrorMsg('');
                      }}
                      className={`py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 focus-visible:ring-2 focus-visible:ring-[#2D5A27] outline-none z-10 ${
                        activeTab === 'signin'
                          ? 'text-stone-900 font-bold'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      <span>Sign In</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('register');
                        setErrorMsg('');
                      }}
                      className={`py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 focus-visible:ring-2 focus-visible:ring-[#2D5A27] outline-none z-10 ${
                        activeTab === 'register'
                          ? 'text-stone-900 font-bold'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      <span>Create Account</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('instant');
                        setErrorMsg('');
                      }}
                      className={`py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 focus-visible:ring-2 focus-visible:ring-[#2D5A27] outline-none z-10 ${
                        activeTab === 'instant'
                          ? 'text-stone-900 font-bold'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      <span>Explore</span>
                    </button>
                  </div>
                </div>

                {/* Mobile Preview Accordion Toggle (Visible on <md screens) */}
                <div className="block md:hidden mb-5">
                  <button
                    type="button"
                    onClick={() => setShowMobilePreview(!showMobilePreview)}
                    className="w-full py-2 px-3 rounded-xl bg-stone-900 text-white text-xs font-semibold flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Preview Kitchen Dossier ({goals.length} Directives)</span>
                    </div>
                    {showMobilePreview ? (
                      <ChevronUp className="w-4 h-4 text-stone-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-stone-400" />
                    )}
                  </button>

                  {showMobilePreview && (
                    <div className="mt-3 rounded-2xl overflow-hidden shadow-lg animate-fadeIn">
                      <KitchenCardPreview
                        displayName={displayName}
                        email={email}
                        goals={goals}
                        mode={activeTab}
                      />
                    </div>
                  )}
                </div>

                {/* Inline Error Notice */}
                {errorMsg && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200/90 rounded-xl flex items-start gap-2.5 text-xs text-red-800 animate-fadeIn">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                    <span className="leading-relaxed">{errorMsg}</span>
                  </div>
                )}

                {/* ---------------------------------------------------- */}
                {/* TAB 1: SIGN IN                                       */}
                {/* ---------------------------------------------------- */}
                {activeTab === 'signin' && (
                  <form onSubmit={handleLoginSubmit} className="space-y-4" noValidate>
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label
                          htmlFor="signin-email"
                          className="text-[11px] font-mono uppercase tracking-wider text-stone-600 font-semibold"
                        >
                          Email Address
                        </label>
                        {email && isValidEmail && (
                          <span className="text-[10px] font-mono text-[#2D5A27] flex items-center gap-1">
                            <Check className="w-3 h-3" /> Valid format
                          </span>
                        )}
                      </div>
                      <input
                        id="signin-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="arjun.nair@kitchen.org"
                        className="w-full px-3.5 py-2.5 text-xs bg-white hairline-border border-[#E5E0D8] rounded-xl outline-none focus:ring-2 focus:ring-[#2D5A27] focus:border-[#2D5A27] text-stone-900 transition-all"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label
                          htmlFor="signin-password"
                          className="text-[11px] font-mono uppercase tracking-wider text-stone-600 font-semibold"
                        >
                          Password
                        </label>
                      </div>
                      <div className="relative">
                        <input
                          id="signin-password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          autoComplete="current-password"
                          required
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full px-3.5 py-2.5 text-xs bg-white hairline-border border-[#E5E0D8] rounded-xl outline-none focus:ring-2 focus:ring-[#2D5A27] focus:border-[#2D5A27] pr-10 text-stone-900 transition-all font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-700 focus:outline-none"
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 bg-[#18181B] text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition-all shadow-sm flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-[#2D5A27] outline-none mt-2"
                    >
                      {isLoading ? (
                        <span>Verifying Credentials...</span>
                      ) : (
                        <>
                          <span>Sign In to Workspace</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* ---------------------------------------------------- */}
                {/* TAB 2: CREATE ACCOUNT                                */}
                {/* ---------------------------------------------------- */}
                {activeTab === 'register' && (
                  <form onSubmit={handleRegisterSubmit} className="space-y-3.5" noValidate>
                    <div>
                      <label
                        htmlFor="reg-name"
                        className="text-[11px] font-mono uppercase tracking-wider text-stone-600 font-semibold block mb-1"
                      >
                        Name or Culinary Alias
                      </label>
                      <input
                        id="reg-name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        required
                        value={displayName}
                        onChange={e => setDisplayName(e.target.value)}
                        placeholder="Arjun Nair"
                        className="w-full px-3.5 py-2 text-xs bg-white hairline-border border-[#E5E0D8] rounded-xl outline-none focus:ring-2 focus:ring-[#2D5A27] focus:border-[#2D5A27] text-stone-900 transition-all"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label
                          htmlFor="reg-email"
                          className="text-[11px] font-mono uppercase tracking-wider text-stone-600 font-semibold"
                        >
                          Email Address
                        </label>
                        {email && isValidEmail && (
                          <span className="text-[10px] font-mono text-[#2D5A27] flex items-center gap-1">
                            <Check className="w-3 h-3" /> Valid
                          </span>
                        )}
                      </div>
                      <input
                        id="reg-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="arjun.nair@kitchen.org"
                        className="w-full px-3.5 py-2 text-xs bg-white hairline-border border-[#E5E0D8] rounded-xl outline-none focus:ring-2 focus:ring-[#2D5A27] focus:border-[#2D5A27] text-stone-900 transition-all"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="reg-password"
                        className="text-[11px] font-mono uppercase tracking-wider text-stone-600 font-semibold block mb-1"
                      >
                        Password (Salted Web Crypto SHA-256)
                      </label>
                      <div className="relative">
                        <input
                          id="reg-password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          autoComplete="new-password"
                          required
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          placeholder="Minimum 8 characters"
                          className="w-full px-3.5 py-2 text-xs bg-white hairline-border border-[#E5E0D8] rounded-xl outline-none focus:ring-2 focus:ring-[#2D5A27] focus:border-[#2D5A27] pr-10 text-stone-900 font-mono transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-2 text-stone-400 hover:text-stone-700 focus:outline-none"
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? (
                            <EyeOff className="w-3.5 h-3.5" />
                          ) : (
                            <Eye className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      {/* Real-Time Password Strength Meter */}
                      {password && (
                        <div className="mt-2 space-y-1.5 p-2.5 rounded-lg bg-stone-100/70 border border-stone-200">
                          <div className="flex items-center justify-between text-[10px] font-mono">
                            <span className="text-stone-500">Security Strength:</span>
                            <span
                              style={{ color: passwordStrength.color }}
                              className="font-bold uppercase tracking-wider"
                            >
                              {passwordStrength.level}
                            </span>
                          </div>

                          <div className="w-full h-1 bg-stone-200 rounded-full overflow-hidden">
                            <div
                              className="h-full transition-all duration-300 rounded-full"
                              style={{
                                width: `${(passwordStrength.score / 4) * 100}%`,
                                backgroundColor: passwordStrength.color,
                              }}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-1 text-[10px] text-stone-500 pt-1">
                            {passwordStrength.checks.map((c, i) => (
                              <span
                                key={i}
                                className={`flex items-center gap-1 ${
                                  c.passed ? 'text-[#2D5A27] font-semibold' : 'text-stone-400'
                                }`}
                              >
                                <Check
                                  className={`w-3 h-3 ${
                                    c.passed ? 'opacity-100 text-[#2D5A27]' : 'opacity-30'
                                  }`}
                                />
                                {c.label}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Kitchen Dietary Goals Toggle Chips */}
                    <div>
                      <label className="text-[11px] font-mono uppercase tracking-wider text-stone-600 font-semibold block mb-1.5">
                        Select Culinary Priorities
                      </label>
                      <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                        {[
                          { id: 'heart_health', label: 'Heart Health (Low Sat Fat)' },
                          { id: 'unrefined_only', label: 'Cold-Pressed Only (NOVA 1)' },
                          { id: 'high_protein', label: 'High Protein Staples' },
                          { id: 'budget_conscious', label: 'Optimal Unit Value' },
                          { id: 'high_heat_cooking', label: 'High Heat (>220°C)' },
                          { id: 'low_glycemic', label: 'Low Glycemic Index' },
                        ].map(item => (
                          <button
                            type="button"
                            key={item.id}
                            onClick={() => toggleGoal(item.id as KitchenDietaryGoal)}
                            className={`p-2 rounded-xl border text-left truncate transition-all text-xs focus-visible:ring-2 focus-visible:ring-[#2D5A27] outline-none ${
                              goals.includes(item.id as KitchenDietaryGoal)
                                ? 'bg-[#F2F7F1] border-[#2D5A27] text-[#2D5A27] font-semibold shadow-xs'
                                : 'bg-white border-[#E5E0D8] text-stone-600 hover:bg-stone-50'
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 bg-[#2D5A27] text-white rounded-xl text-xs font-semibold hover:bg-emerald-800 transition-all shadow-sm flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-[#2D5A27] outline-none mt-2"
                    >
                      {isLoading ? (
                        <span>Hashing & Creating Account...</span>
                      ) : (
                        <>
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Establish Kitchen Account</span>
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* ---------------------------------------------------- */}
                {/* TAB 3: INSTANT ACCESS / EXPLORE                      */}
                {/* ---------------------------------------------------- */}
                {activeTab === 'instant' && (
                  <div className="space-y-4">
                    {/* Option A: Load Verified Editorial Curator Account */}
                    <div className="p-4 rounded-xl bg-white hairline-border border-[#E5E0D8] shadow-xs space-y-3">
                      <div className="flex items-center gap-2 text-[#2D5A27]">
                        <Sparkles className="w-4 h-4 shrink-0" />
                        <span className="font-editorial text-sm font-bold text-stone-900">
                          Curatorial Research Workspace
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        Pre-loaded with verified benchmark boards (*Cooking Oils Audit*, *Sweetener Glycemic Index*), personalized cold-pressed directives, and sensory tasting notes by research lead Priya Sharma.
                      </p>
                      <button
                        type="button"
                        onClick={handleLoadCuratorWorkspace}
                        className="w-full py-2.5 px-4 bg-[#2D5A27] text-white rounded-xl text-xs font-semibold hover:bg-emerald-800 transition-all shadow-sm flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-[#2D5A27] outline-none"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Launch Research Curator Profile</span>
                      </button>
                    </div>

                    {/* Option B: Direct Guest Entry */}
                    <div className="p-4 rounded-xl bg-[#F4F1EA] border border-[#E5E0D8] space-y-2.5">
                      <div className="flex items-center gap-2 text-stone-800">
                        <Compass className="w-4 h-4 text-stone-600 shrink-0" />
                        <span className="font-editorial text-sm font-bold text-stone-900">
                          Direct Guest Access
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        Compare ingredients immediately without setting up an email or password. You can save items to local memory throughout your session.
                      </p>
                      <button
                        type="button"
                        onClick={handleContinueAsGuest}
                        className="w-full py-2.5 px-4 bg-[#18181B] text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition-all shadow-sm flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-stone-400 outline-none"
                      >
                        <span>Continue Without an Account</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer Security Micro-Copy */}
          <div className="pt-4 border-t border-[#E5E0D8] mt-6 flex items-center justify-between text-[10px] text-stone-400 font-mono">
            <div className="flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-[#2D5A27]" />
              <span>Zero external trackers</span>
            </div>
            <span>Client-side salted SHA-256</span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT / LIVE SPECIMEN PREVIEW COLUMN                      */}
        {/* ========================================================= */}
        <div className="hidden md:block w-5/12 p-6 bg-stone-950 border-l border-stone-800">
          <KitchenCardPreview
            displayName={displayName}
            email={email}
            goals={goals}
            mode={activeTab}
          />
        </div>
      </div>
    </div>
  );
};
