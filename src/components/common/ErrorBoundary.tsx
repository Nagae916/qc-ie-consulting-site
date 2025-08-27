// src/components/common/ErrorBoundary.tsx
'use client';

import React, { Component, type ReactNode } from 'react';
import Router from 'next/router';

type Props = { children: ReactNode };

/**
 * exactOptionalPropertyTypes=true だと
 * optional プロパティは「存在するなら undefined は不可」になる。
 * そこで info は string | undefined を明示しておく。
 */
type State = { hasError: boolean; info?: string | undefined };

export default class ErrorBoundary extends Component<Props, State> {
  // info は初期値に含めない（存在させない）
  state: State = { hasError: false };

  static getDerivedStateFromError(): Partial<State> {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: React.ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('Client error captured:', error, info?.componentStack ?? info);

    const message =
      error instanceof Error ? error.message : typeof error === 'string' ? error : JSON.stringify(error);

    this.setState({ info: message });
  }

  componentDidMount() {
    Router.events.on('routeChangeStart', this.reset);
  }
  componentWillUnmount() {
    Router.events.off('routeChangeStart', this.reset);
  }

  private reset = () => {
    if (this.state.hasError) {
      // Partial<State> なので info を undefined で明示クリア可能
      this.setState({ hasError: false, info: undefined });
    }
  };

  private reload = () => {
    if (typeof window !== 'undefined') window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const isDev = process.env.NODE_ENV !== 'production';
      return (
        <main className="mx-auto max-w-3xl p-6">
          <h1 className="text-xl font-bold mb-2">ページの表示中にエラーが発生しました。</h1>
          <p className="text-sm text-gray-600">再読み込みするか、別ページへ移動して再度お試しください。</p>
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={this.reload}
              className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
            >
              再読み込み
            </button>
            <button
              type="button"
              onClick={this.reset}
              className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
            >
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
