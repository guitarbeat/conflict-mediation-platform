import React from "react";
import logger from "../utils/logger";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    };
  }

  static getDerivedStateFromError(error) {
    // * Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // * Log the error for debugging
    logger.captureError(error, "ErrorBoundary", {
      componentStack: errorInfo.componentStack,
      props: this.props,
    });

    this.setState({
      error,
      errorInfo,
    });
  }

  toggleDetails = () => {
    this.setState((prev) => ({ showDetails: !prev.showDetails }));
  };

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-card border border-destructive/20 rounded-lg p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center">
                <span className="text-destructive text-xl">⚠️</span>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">
                  Something went wrong
                </h1>
                <p className="text-muted-foreground">
                  An error occurred while rendering this component
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {this.state.error && (
                <div className="bg-muted/50 rounded-md p-4">
                  <h2 className="font-medium text-foreground mb-2">
                    Error Details
                  </h2>
                  <p className="text-sm text-destructive font-mono">
                    {this.state.error.message}
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={this.toggleDetails}
                  className="px-3 py-2 text-sm bg-secondary hover:bg-secondary/80 rounded-md transition-colors"
                >
                  {this.state.showDetails ? "Hide" : "Show"} Debug Info
                </button>
                <button
                  onClick={this.resetError}
                  className="px-3 py-2 text-sm bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors"
                >
                  Try Again
                </button>
              </div>

              {this.state.showDetails && this.state.errorInfo && (
                <div className="bg-muted/30 rounded-md p-4">
                  <h3 className="font-medium text-foreground mb-2">
                    Component Stack
                  </h3>
                  <pre className="text-xs text-muted-foreground overflow-auto max-h-40">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </div>
              )}

              {import.meta.env.DEV && (
                <div className="text-xs text-muted-foreground">
                  <p>
                    💡 Development mode: Check the console for detailed error
                    logs
                  </p>
                  <p>
                    🔧 Use{" "}
                    <code className="bg-muted px-1 rounded">
                      window.logger.getLogHistory()
                    </code>{" "}
                    to view recent logs
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
