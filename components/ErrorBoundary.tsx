import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from './ui/Button';

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 max-w-md w-full text-center">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="text-red-500" size={40} />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              কিছু ভুল হয়েছে / Something went wrong
            </h2>
            
            <p className="text-gray-500 mb-6 text-sm">
              দুঃখিত, একটি অপ্রত্যাশিত সমস্যা দেখা দিয়েছে। অনুগ্রহ করে পেজটি রিলোড করুন।
              <br />
              <span className="text-xs mt-2 block opacity-70">
                Error: {this.state.error?.message || 'Unknown Error'}
              </span>
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={this.handleReload} className="flex items-center justify-center gap-2">
                <RefreshCw size={18} />
                রিলোড / Reload
              </Button>
              <Button onClick={this.handleGoHome} variant="outline" className="flex items-center justify-center gap-2">
                <Home size={18} />
                হোম / Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
