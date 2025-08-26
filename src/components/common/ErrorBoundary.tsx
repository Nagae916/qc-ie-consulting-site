// src/components/common/ErrorBoundary.tsx
import { Component, ReactNode } from "react";

type Props = { children: ReactNode };
type State = { hasError: boolean; info?: string };

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: any) {
    // Vercel でも console に出るので原因特定が容易になる
    // eslint-disable-next-line no-console
    console.error("Client error captured:", error, info?.componentStack ?? info);
    this.setState({ info: String(error instanceof Error ? error.message : error) });
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="mx-auto max-w-3xl p-6">
          <h1 className="text-xl font-bold mb-2">ページの表示中にエラーが発生しました。</h1>
          <p className="text-sm text-gray-600">
            もう一度お試しください。改善しない場合は最初のエラー行を共有してください。
          </p>
        </main>
      );
    }
    return this.props.children;
  }
}
