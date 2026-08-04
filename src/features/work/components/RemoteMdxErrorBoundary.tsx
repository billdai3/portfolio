import { Component, type ReactNode } from "react";

type RemoteMdxErrorBoundaryProps = {
  children: ReactNode;
  onError: (message: string) => void;
};

type RemoteMdxErrorBoundaryState = {
  hasError: boolean;
};

export class RemoteMdxErrorBoundary extends Component<
  RemoteMdxErrorBoundaryProps,
  RemoteMdxErrorBoundaryState
> {
  state: RemoteMdxErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): RemoteMdxErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    this.props.onError(error.message || "內容渲染失敗。");
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}
