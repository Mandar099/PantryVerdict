import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('PantryVerdict caught an error in component tree:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  private handleTryAgain = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full p-8 rounded-2xl hairline-border shadow-xl text-center space-y-5">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-sm">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-amber-700 font-bold block mb-1">
                Culinary Engine Notice
              </span>
              <h2 className="font-editorial text-2xl font-bold text-stone-900">
                Pantry Specimen Unavailable
              </h2>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed max-w-md mx-auto">
              A temporary display anomaly was detected while compiling ingredient chemistry metrics. Your saved pantry staples and preferences remain fully intact.
            </p>

            {this.state.error && (
              <div className="p-3 bg-stone-50 rounded-xl hairline-border text-[11px] font-mono text-stone-500 text-left overflow-x-auto max-h-24">
                {this.state.error.message}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2 pt-2 justify-center">
              <button
                onClick={this.handleTryAgain}
                className="py-2.5 px-4 rounded-xl hairline-border bg-stone-50 hover:bg-stone-100 text-stone-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Try Again</span>
              </button>

              <button
                onClick={this.handleReset}
                className="py-2.5 px-5 rounded-xl bg-[#2D5A27] hover:bg-emerald-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Return to Pantry</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
