/*
From Uiverse.io by micaelgomestavares - https://uiverse.io/micaelgomestavares/dull-walrus-66
MIT License, Copyright (c) JohnnyCSilva, JohnnyCSilva (João Silva), micaelgomestavares (Micael G. Tavares)
*/

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
  User as UserIcon,
  Compass,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen } = usePantry();
  const {
    user,
    login,
    register,
    loginWithGoogle,
    loginWithApple,
    continueAsGuest,
    logout,
  } = useAuth();
  const { showToast } = useToast();

  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
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
        handleDismiss();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthModalOpen]);

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

  const handleDismiss = () => {
    // If a brand new user closes the dialog, let them continue as guest reader
    if (!user) {
      continueAsGuest();
      showToast('Continuing as Guest Reader — welcome to PantryVerdict', 'info');
    }
    setIsAuthModalOpen(false);
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
      setErrorMsg('Password must be at least 8 characters with letters & numbers.');
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

  const handleGoogleAuth = () => {
    loginWithGoogle();
    showToast('Signed in with Google (Alex Chen)', 'success');
    setIsAuthModalOpen(false);
  };

  const handleAppleAuth = () => {
    loginWithApple();
    showToast('Signed in with Apple ID (Sam Taylor)', 'success');
    setIsAuthModalOpen(false);
  };

  const handleForgotPassword = () => {
    if (email && isValidEmail) {
      showToast(`Password recovery link dispatched to ${email}`, 'info');
    } else {
      showToast('Please type your email in the box to receive recovery instructions', 'info');
    }
  };

  const handleGuestEntry = () => {
    continueAsGuest();
    showToast('Continuing in Guest Reader mode', 'info');
    setIsAuthModalOpen(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
    >
      {/* Backdrop tap to close */}
      <div
        className="fixed inset-0"
        onClick={handleDismiss}
        aria-hidden="true"
      />

      <div
        className={`relative z-10 bg-[#FAF8F5] w-full max-w-4xl rounded-2xl hairline-border border-[#E5E0D8] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[92vh] ${
          isShaking ? 'animate-shake' : ''
        }`}
      >
        {/* ========================================================= */}
        {/* LEFT / PRIMARY AUTH COLUMN (UIVERSE ADAPTED FORM THEME)   */}
        {/* ========================================================= */}
        <div className="w-full md:w-7/12 p-5 sm:p-7 flex flex-col justify-between overflow-y-auto bg-[#FAF8F5]">
          <div>
            {/* Top Bar with Brand Badge & Dismiss Button */}
            <div className="flex items-center justify-between pb-3.5 border-b border-[#E5E0D8] mb-5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#2D5A27]" />
                <span className="font-mono text-[10px] tracking-widest uppercase text-stone-500 font-semibold">
                  PANTRYVERDICT • ACCOUNT ACCESS
                </span>
              </div>
              <button
                onClick={handleDismiss}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-stone-200/60 transition-colors focus-visible:ring-2 focus-visible:ring-[#2D5A27] outline-none"
                aria-label="Close authentication dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Authenticated Workspace View (if already signed in) */}
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
              <div>
                {/* Onboarding Welcome Notice for New Users */}
                <div className="mb-4">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-[10px] font-mono text-emerald-800 font-semibold mb-2">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    <span>Welcome to PantryVerdict</span>
                  </div>
                  <h3
                    id="auth-modal-title"
                    className="font-editorial text-2xl font-bold text-stone-900 tracking-tight"
                  >
                    {mode === 'signin' ? 'Sign in to your kitchen' : 'Establish your pantry profile'}
                  </h3>
                  <p className="text-xs text-stone-600 mt-1">
                    {mode === 'signin'
                      ? 'Access verified food science, personalized benchmarks, and your saved comparison dock.'
                      : 'Personalize smoke point stability thresholds and lipid chemistry recommendations.'}
                  </p>
                </div>

                {/* Mobile Preview Accordion Toggle (Visible on <md screens) */}
                <div className="block md:hidden mb-4">
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
                        mode={mode}
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

                {/* ========================================================= */}
                {/* UIVERSE.IO ADAPTED AUTHENTICATION FORM                    */}
                {/* ========================================================= */}
                <form
                  onSubmit={mode === 'signin' ? handleLoginSubmit : handleRegisterSubmit}
                  className="uiv-form"
                  noValidate
                >
                  {/* Name Field (Only in Register Mode) */}
                  {mode === 'register' && (
                    <div>
                      <div className="uiv-flex-column">
                        <label htmlFor="uiv-reg-name">Name or Culinary Alias</label>
                      </div>
                      <div className="uiv-inputForm">
                        <UserIcon className="w-5 h-5 text-stone-500 shrink-0" />
                        <input
                          id="uiv-reg-name"
                          type="text"
                          className="uiv-input"
                          placeholder="Arjun Nair"
                          value={displayName}
                          onChange={e => setDisplayName(e.target.value)}
                          autoComplete="name"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* Email Field with Uiverse SVG */}
                  <div>
                    <div className="uiv-flex-column">
                      <label htmlFor="uiv-email">Email</label>
                    </div>
                    <div className="uiv-inputForm">
                      {/* Uiverse Email Icon */}
                      <svg
                        height="20"
                        viewBox="0 0 32 32"
                        width="20"
                        xmlns="http://www.w3.org/2000/svg"
                        className="shrink-0 fill-current text-stone-600"
                        aria-hidden="true"
                      >
                        <g id="Layer_3" data-name="Layer 3">
                          <path d="m30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z" />
                        </g>
                      </svg>
                      <input
                        id="uiv-email"
                        type="email"
                        className="uiv-input"
                        placeholder="Enter your Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        autoComplete="email"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Field with Uiverse Padlock & Eye Toggle SVGs */}
                  <div>
                    <div className="uiv-flex-column">
                      <label htmlFor="uiv-password">Password</label>
                    </div>
                    <div className="uiv-inputForm">
                      {/* Uiverse Padlock Icon */}
                      <svg
                        height="20"
                        viewBox="-64 0 512 512"
                        width="20"
                        xmlns="http://www.w3.org/2000/svg"
                        className="shrink-0 fill-current text-stone-600"
                        aria-hidden="true"
                      >
                        <path d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0" />
                        <path d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0" />
                      </svg>
                      <input
                        id="uiv-password"
                        type={showPassword ? 'text' : 'password'}
                        className="uiv-input font-mono"
                        placeholder="Enter your Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                        required
                      />
                      {/* Password Toggle Eye SVG */}
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="focus:outline-none p-1 text-stone-400 hover:text-stone-700"
                        title={showPassword ? 'Hide password' : 'Show password'}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4 text-stone-500" />
                        ) : (
                          <svg
                            viewBox="0 0 576 512"
                            height="16"
                            width="16"
                            xmlns="http://www.w3.org/2000/svg"
                            className="fill-current text-stone-500 hover:text-stone-800"
                            aria-hidden="true"
                          >
                            <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Password Strength Meter in Register Mode */}
                  {mode === 'register' && password && (
                    <div className="space-y-1.5 p-2 rounded-lg bg-stone-100/70 border border-stone-200">
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
                    </div>
                  )}

                  {/* Dietary Priorities in Register Mode */}
                  {mode === 'register' && (
                    <div>
                      <label className="text-[11px] font-mono uppercase tracking-wider text-stone-600 font-semibold block mb-1">
                        Select Culinary Priorities
                      </label>
                      <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                        {[
                          { id: 'heart_health', label: 'Heart Health (Low Sat Fat)' },
                          { id: 'unrefined_only', label: 'Cold-Pressed (NOVA 1)' },
                          { id: 'high_protein', label: 'High Protein' },
                          { id: 'budget_conscious', label: 'Budget Value' },
                        ].map(item => (
                          <button
                            type="button"
                            key={item.id}
                            onClick={() => toggleGoal(item.id as KitchenDietaryGoal)}
                            className={`p-1.5 rounded-lg border text-left truncate transition-all text-[11px] outline-none ${
                              goals.includes(item.id as KitchenDietaryGoal)
                                ? 'bg-[#F2F7F1] border-[#2D5A27] text-[#2D5A27] font-semibold'
                                : 'bg-white border-[#E5E0D8] text-stone-600 hover:bg-stone-50'
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Remember Me & Forgot Password Row */}
                  <div className="uiv-flex-row">
                    <div>
                      <input
                        type="checkbox"
                        id="uiv-remember"
                        checked={rememberMe}
                        onChange={e => setRememberMe(e.target.checked)}
                        className="rounded accent-[#151717] cursor-pointer"
                      />
                      <label htmlFor="uiv-remember">Remember me</label>
                    </div>
                    <span onClick={handleForgotPassword} className="uiv-span" role="button">
                      Forgot password?
                    </span>
                  </div>

                  {/* Main Action Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="uiv-button-submit"
                  >
                    {isLoading
                      ? 'Processing...'
                      : mode === 'signin'
                      ? 'Sign In'
                      : 'Create Account'}
                  </button>

                  {/* Switch between Sign In and Sign Up */}
                  <p className="uiv-p">
                    {mode === 'signin' ? (
                      <>
                        Don't have an account?{' '}
                        <span
                          className="uiv-span"
                          onClick={() => {
                            setMode('register');
                            setErrorMsg('');
                          }}
                          role="button"
                        >
                          Sign Up
                        </span>
                      </>
                    ) : (
                      <>
                        Already have an account?{' '}
                        <span
                          className="uiv-span"
                          onClick={() => {
                            setMode('signin');
                            setErrorMsg('');
                          }}
                          role="button"
                        >
                          Sign In
                        </span>
                      </>
                    )}
                  </p>

                  {/* Divider line */}
                  <p className="uiv-p line">Or With</p>

                  {/* Social Buttons Row (Google & Apple) */}
                  <div className="uiv-flex-row">
                    {/* Google Button */}
                    <button
                      type="button"
                      onClick={handleGoogleAuth}
                      className="uiv-btn google"
                      title="Continue with Google"
                    >
                      <svg
                        version="1.1"
                        width="20"
                        height="20"
                        id="Layer_1"
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px"
                        y="0px"
                        viewBox="0 0 512 512"
                        className="shrink-0"
                        aria-hidden="true"
                      >
                        <path
                          style={{ fill: '#FBBB00' }}
                          d="M113.47,309.408L95.648,375.94l-65.139,1.378C11.042,341.211,0,299.9,0,256 c0-42.451,10.324-82.483,28.624-117.732h0.014l57.992,10.632l25.404,57.644c-5.317,15.501-8.215,32.141-8.215,49.456 C103.821,274.792,107.225,292.797,113.47,309.408z"
                        />
                        <path
                          style={{ fill: '#518EF8' }}
                          d="M507.527,208.176C510.467,223.662,512,239.655,512,256c0,18.328-1.927,36.206-5.598,53.451 c-12.462,58.683-45.025,109.925-90.134,146.187l-0.014-0.014l-73.044-3.727l-10.338-64.535 c29.932-17.554,53.324-45.025,65.646-77.911h-136.89V208.176h138.887L507.527,208.176L507.527,208.176z"
                        />
                        <path
                          style={{ fill: '#28B446' }}
                          d="M416.253,455.624l0.014,0.014C372.396,490.901,316.666,512,256,512 c-97.491,0-182.252-54.491-225.491-134.681l82.961-67.91c21.619,57.698,77.278,98.771,142.53,98.771 c28.047,0,54.323-7.582,76.87-20.818L416.253,455.624z"
                        />
                        <path
                          style={{ fill: '#F14336' }}
                          d="M419.404,58.936l-82.933,67.896c-23.335-14.586-50.919-23.012-80.471-23.012 c-66.729,0-123.429,42.957-143.965,102.724l-83.397-68.276h-0.014C71.23,56.123,157.06,0,256,0 C318.115,0,375.068,22.126,419.404,58.936z"
                        />
                      </svg>
                      Google
                    </button>

                    {/* Apple Button */}
                    <button
                      type="button"
                      onClick={handleAppleAuth}
                      className="uiv-btn apple"
                      title="Continue with Apple"
                    >
                      <svg
                        version="1.1"
                        height="20"
                        width="20"
                        id="Capa_1"
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px"
                        y="0px"
                        viewBox="0 0 22.773 22.773"
                        className="shrink-0 fill-current text-stone-900"
                        aria-hidden="true"
                      >
                        <g>
                          <g>
                            <path d="M15.769,0c0.053,0,0.106,0,0.162,0c0.13,1.606-0.483,2.806-1.228,3.675c-0.731,0.863-1.732,1.7-3.351,1.573 c-0.108-1.583,0.506-2.694,1.25-3.561C13.292,0.879,14.557,0.16,15.769,0z" />
                            <path d="M20.67,16.716c0,0.016,0,0.03,0,0.045c-0.455,1.378-1.104,2.559-1.896,3.655c-0.723,0.995-1.609,2.334-3.191,2.334 c-1.367,0-2.275-0.879-3.676-0.903c-1.482-0.024-2.297,0.735-3.652,0.926c-0.155,0-0.31,0-0.462,0 c-0.995-0.144-1.798-0.932-2.383-1.642c-1.725-2.098-3.058-4.808-3.306-8.276c0-0.34,0-0.679,0-1.019 c0.105-2.482,1.311-4.5,2.914-5.478c0.846-0.52,2.009-0.963,3.304-0.765c0.555,0.086,1.122,0.276,1.619,0.464 c0.471,0.181,1.06,0.502,1.618,0.485c0.378-0.011,0.754-0.208,1.135-0.347c1.116-0.403,2.21-0.865,3.652-0.648 c1.733,0.262,2.963,1.032,3.723,2.22c-1.466,0.933-2.625,2.339-2.427,4.74C17.818,14.688,19.086,15.964,20.67,16.716z" />
                          </g>
                        </g>
                      </svg>
                      Apple
                    </button>
                  </div>

                  {/* Fast Guest Entry Option */}
                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={handleGuestEntry}
                      className="text-xs text-stone-500 hover:text-stone-800 transition-colors inline-flex items-center gap-1 font-medium"
                    >
                      <Compass className="w-3.5 h-3.5" />
                      <span>Or continue with instant guest access</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Footer Security Micro-Copy */}
          <div className="pt-4 border-t border-[#E5E0D8] mt-5 flex items-center justify-between text-[10px] text-stone-400 font-mono">
            <div className="flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-[#2D5A27]" />
              <span>Zero external trackers</span>
            </div>
            <span>Salted Web Crypto SHA-256</span>
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
            mode={mode}
          />
        </div>
      </div>
    </div>
  );
};
