import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  description?: string;
}

interface ToastContextType {
  toasts: ToastMessage[];
  showToast: (message: string, type?: ToastType, description?: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = 'success', description?: string) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const newToast: ToastMessage = { id, type, message, description };

      setToasts(prev => [...prev.slice(-3), newToast]); // Keep max 4 toasts

      setTimeout(() => {
        removeToast(id);
      }, 4000);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      {/* Toast Notification Container */}
      <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-2 sm:px-0">
        {toasts.map(toast => {
          const isSuccess = toast.type === 'success';
          const isError = toast.type === 'error';

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto p-3.5 rounded-xl hairline-border shadow-lg backdrop-blur-md flex items-start gap-3 transition-all duration-300 animate-slideIn ${
                isSuccess
                  ? 'bg-white/95 border-[#2D5A27]/30 text-stone-900'
                  : isError
                  ? 'bg-red-50/95 border-red-300 text-red-900'
                  : 'bg-stone-900/95 border-stone-700 text-white'
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {isSuccess && <CheckCircle2 className="w-4 h-4 text-[#2D5A27]" />}
                {isError && <AlertCircle className="w-4 h-4 text-red-600" />}
                {!isSuccess && !isError && <Info className="w-4 h-4 text-amber-400" />}
              </div>

              <div className="flex-1 text-xs">
                <span className="font-semibold block leading-tight">{toast.message}</span>
                {toast.description && (
                  <span
                    className={`text-[11px] block mt-0.5 leading-snug ${
                      isSuccess ? 'text-stone-500' : isError ? 'text-red-700' : 'text-stone-300'
                    }`}
                  >
                    {toast.description}
                  </span>
                )}
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                className="shrink-0 p-1 text-stone-400 hover:text-stone-700 rounded-md transition-colors"
                title="Dismiss notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
