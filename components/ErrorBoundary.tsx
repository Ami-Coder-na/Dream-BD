import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from './ui/Button';

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary component to catch rendering errors in the application.
 */
// Fix: Use React.Component with explicit Generic types to ensure props and state are correctly typed
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  // Fix: Initialize state as a class property for better TypeScript recognition
  state: ErrorBoundaryState = {
    hasError: false,
    error: null
  };

  constructor(props: ErrorBoundaryProps) {
    super(props);
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  // Log error information for debugging
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render(): ReactNode {
    // Check if an error has occurred and show fallback UI
    // Fix: state is correctly identified as a member of React.Component via generics
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
                {/* Fix: error property is now safely accessed from the initialized state */}
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

    // Standard return of children when no error exists
    // Fix: props is correctly identified as a member of React.Component via generics
    return this.props.children;
  }
}
