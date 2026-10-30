import { Component, type ErrorInfo, type ReactNode } from "react";
import CtaLink from "./CtaLink";
import {
  formatDocumentTitle,
  useDocumentTitle,
} from "../hooks/useDocumentTitle";

type AppErrorBoundaryProps = {
  children: ReactNode;
};

type AppErrorBoundaryState = {
  hasError: boolean;
};

type AppErrorFallbackProps = {
  onReset: () => void;
};

function AppErrorFallback({ onReset }: AppErrorFallbackProps) {
  useDocumentTitle(formatDocumentTitle("Error"));

  return (
    <section
      className="flex min-h-[calc(100svh-7rem)] flex-col items-center justify-center px-6 py-24 sm:px-10 lg:min-h-[calc(100svh-8.5rem)]"
      role="alert"
      aria-labelledby="app-error-heading"
    >
      <div className="section-inner flex flex-col items-center text-center">
        <h1
          id="app-error-heading"
          className="type-page-title text-text-primary"
        >
          出了點問題
        </h1>
        <p className="mt-4 max-w-md text-base leading-relaxed text-text-secondary">
          這個頁面暫時無法顯示。可以回首頁，或重新整理再試一次。
        </p>
        <div className="mt-6 flex flex-col items-center gap-4">
          <p onClick={onReset}>
            <CtaLink to="/">Back to home</CtaLink>
          </p>
          <button
            type="button"
            className="type-btn cursor-pointer text-text-secondary transition-colors hover:text-brand focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
            onClick={() => window.location.reload()}
          >
            重新整理
          </button>
        </div>
      </div>
    </section>
  );
}

export class AppErrorBoundary extends Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[AppErrorBoundary]", error, info.componentStack);
  }

  private reset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return <AppErrorFallback onReset={this.reset} />;
    }
    return this.props.children;
  }
}
