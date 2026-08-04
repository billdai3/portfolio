import { MDXProvider } from "@mdx-js/react";
import {
  createElement,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";
import { UnlockForm } from "./UnlockForm";
import { RemoteMdxErrorBoundary } from "./RemoteMdxErrorBoundary";
import { workMdxComponents } from "./mdx-components";
import WorkProjectLayout from "./WorkProjectLayout";
import { compileRemoteMdx } from "../lib/compile-remote-mdx";
import { fetchLockedContent } from "../lib/unlock-api";

type LoadState =
  | { status: "checking" }
  | { status: "locked" }
  | { status: "loading" }
  | { status: "ready"; Content: ComponentType<{ children?: ReactNode }> }
  | { status: "error"; message: string };

const contentCache = new Map<
  string,
  ComponentType<{ children?: ReactNode }>
>();

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

export default function LockedWorkProject({ slug }: { slug: string }) {
  const [state, setState] = useState<LoadState>({ status: "checking" });
  const loadAbortRef = useRef<AbortController | null>(null);
  const cachedContent = contentCache.get(slug);

  const loadContent = useCallback(async (signal?: AbortSignal) => {
    try {
      const result = await fetchLockedContent(slug, signal);
      if (signal?.aborted) return;

      if (result === "unauthorized") {
        setState({ status: "locked" });
        return;
      }

      if (result === "error") {
        setState({ status: "error", message: "無法載入內容，請稍後再試。" });
        return;
      }

      const compiled = await compileRemoteMdx(
        result.body,
        result.frontmatter,
      );
      if (signal?.aborted) return;

      contentCache.set(slug, compiled.Content);
      setState({ status: "checking" });
    } catch (error) {
      if (isAbortError(error) || signal?.aborted) return;
      setState({ status: "error", message: "內容格式錯誤，無法渲染。" });
    }
  }, [slug]);

  const startLoadContent = useCallback(() => {
    loadAbortRef.current?.abort();
    const controller = new AbortController();
    loadAbortRef.current = controller;
    setState({ status: "loading" });
    void loadContent(controller.signal);
  }, [loadContent]);

  useEffect(() => {
    if (cachedContent) {
      return () => {
        loadAbortRef.current?.abort();
      };
    }

    const controller = new AbortController();
    const { signal } = controller;

    void fetchLockedContent(slug, signal)
      .then(async (result) => {
        if (signal.aborted) return;

        if (result === "unauthorized") {
          setState({ status: "locked" });
          return;
        }

        if (result === "error") {
          setState({ status: "error", message: "無法載入內容，請稍後再試。" });
          return;
        }

        const compiled = await compileRemoteMdx(
          result.body,
          result.frontmatter,
        );
        if (signal.aborted) return;

        contentCache.set(slug, compiled.Content);
        setState({ status: "checking" });
      })
      .catch((error: unknown) => {
        if (isAbortError(error) || signal.aborted) return;
        setState({ status: "error", message: "內容格式錯誤，無法渲染。" });
      });

    return () => {
      controller.abort();
      loadAbortRef.current?.abort();
    };
  }, [cachedContent, slug]);

  if (cachedContent) {
    return (
      <MDXProvider components={workMdxComponents}>
        <WorkProjectLayout>
          <RemoteMdxErrorBoundary
            key={slug}
            onError={(message) =>
              setState({ status: "error", message: `渲染失敗：${message}` })
            }
          >
            {createElement(cachedContent)}
          </RemoteMdxErrorBoundary>
        </WorkProjectLayout>
      </MDXProvider>
    );
  }

  if (state.status === "checking" || state.status === "loading") {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center text-sm text-text-secondary">
        載入中…
      </div>
    );
  }

  if (state.status === "locked") {
    return <UnlockForm onUnlocked={startLoadContent} />;
  }

  if (state.status === "error") {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <p className="text-sm text-text-secondary">{state.message}</p>
        <button
          type="button"
          className="mt-4 text-sm text-accent underline"
          onClick={() => setState({ status: "locked" })}
        >
          重新輸入密碼
        </button>
      </div>
    );
  }

  return null;
}
