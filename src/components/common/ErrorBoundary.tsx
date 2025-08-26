// src/components/common/ErrorBoundary.tsx
import { Component, type ReactNode } from "react";
import Router from "next/router";

type Props = { children: ReactNode };
type State = { hasError: boolean; info?: string };

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, info: undefined };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: any) {
    // eslint-disable-next-line no-console
    console.error("Client error captured:", error, info?.componentStack ?? info);
    this.setState({ info: String(error instanceof Error ? error.message : error) });
  }

  componentDidMount() {
    Router.events.on("routeChangeStart", this.reset);
  }
  componentWillUnmount() {
    Router.events.off("routeChangeStart", this.reset);
  }

  private reset = () => {
    if (this.state.hasError) this.setState({ hasError: false, info: undefined });
  };
  private reload = () => {
    if (typeof window !== "undefined") window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const isDev = process.env.NODE_ENV !== "production";
      return (
        <main className="mx-auto max-w-3xl p-6">
          <h1 className="text-xl font-bold mb-2">ページの表示中にエラーが発生しました。</h1>
          <p className="text-sm text-gray-600">再読み込みするか、別ページへ移動して再度お試しください。</p>
          <div className="mt-4 flex gap-3">
            <button type="button" onClick={this.reload} className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50">
              再読み込み
            </button>
            <button type="button" onClick={this.reset} className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50">
              画面をリセット
            </button>
          </div>
          {isDev && this.state.info ? (
            <pre className="mt-4 whitespace-pre-wrap rounded-md bg-gray-100 p-3 text-xs text-gray-700">
              {this.state.info}
            </pre>
          ) : null}
        </main>
      );
    }
    return this.props.children;
  }
}
