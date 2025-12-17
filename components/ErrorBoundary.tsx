
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

/**
 * ErrorBoundary component to catch rendering errors in the application.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  // Fix: Explicitly declare state and props to resolve TypeScript property existence errors
  public state: ErrorBoundaryState;
  public props: ErrorBoundaryProps;

  // Use a constructor to ensure that 'props' and 'state' are correctly initialized and typed by inheritance
  constructor(props: ErrorBoundaryProps) {
    super(props);
    // Fix line 22: Initializing state property
    this.state = {
      hasError: false,
      error: null
    };
    // Fix inheritance visibility for props
    this.props = props;
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
    // Fix line 48: Access state properties from the instance via destructuring
    const { hasError, error } = this.state;
    
    if (hasError) {
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
                {/* Fix line 64: Accessing error message from destructured state */}
                Error: {error?.message || 'Unknown Error'}
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

    // Fix line 84: Access props from the instance which are now correctly recognized by TypeScript
    return this.props.children;
  }
}
