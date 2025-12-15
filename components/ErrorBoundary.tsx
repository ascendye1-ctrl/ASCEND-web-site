import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4 text-center">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
            <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">System Malfunction Detected</h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mb-8">
            Our automatic problem-solving tool caught an unexpected error. We can attempt a system reset to fix this.
          </p>
          
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-slate-700 max-w-lg w-full mb-8 text-left overflow-hidden">
            <p className="font-mono text-xs text-red-500 break-all">
                Error: {this.state.error?.message || 'Unknown Error'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button 
                onClick={this.handleReset}
                className="px-6 py-3 bg-brand-navy text-white rounded-xl font-bold hover:bg-brand-navy/90 transition-all flex items-center justify-center gap-2 shadow-lg"
            >
                <RefreshCw className="w-4 h-4" /> Run Auto-Repair & Reload
            </button>
            <button 
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-200 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-slate-700 transition-all"
            >
                Try Simple Refresh
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;