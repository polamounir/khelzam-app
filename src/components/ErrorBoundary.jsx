import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary] Caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-exam-bg text-center">
          <div className="exam-card max-w-lg w-full border-red-500/30 bg-red-500/5">
            <h1 className="text-4xl mb-4">⚠️</h1>
            <h2 className="text-2xl font-bold text-exam-text mb-2">Oops! Something went wrong.</h2>
            <p className="text-exam-muted mb-6">
              The application encountered an unexpected error. Don't worry, your progress might still be safe.
            </p>
            <div className="space-y-4">
              <button
                onClick={() => window.location.reload()}
                className="exam-btn-primary w-full"
              >
                Reload Page
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="exam-btn-secondary w-full"
              >
                Go to Home
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-8 text-start bg-black/40 p-4 rounded-lg overflow-auto max-h-40">
                <summary className="text-xs text-red-500 cursor-pointer font-bold">Error Details (Dev Only)</summary>
                <code className="text-[10px] text-red-300 block mt-2 whitespace-pre-wrap">
                  {this.state.error?.toString()}
                </code>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
