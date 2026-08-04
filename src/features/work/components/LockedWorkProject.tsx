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
import {
  clearCachedWorkContent,
  getCachedWorkContent,
  setCachedWorkContent,
} from "../lib/locked-content-cache";
import {
  clearUnlockHint,
  fetchLockedContent,
  hasUnlockHint,
  type WorkContentPayload,
} from "../lib/unlock-api";

type LoadState =
  | { status: "checking" }
  | { status: "locked" }
  | { status: "loading" }
  | { status: "ready"; Content: ComponentType<{ children?: ReactNode }> }
  | { status: "error"; message: string };

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

export default function LockedWorkProject({ slug }: { slug: string }) {
  const [state, setState] = useState<LoadState>(() => {
    const cachedContent = getCachedWorkContent(slug);
    if (cachedContent) {
      return { status: "ready", Content: cachedContent };
    }

    return hasUnlockHint() ? { status: "checking" } : { status: "locked" };
  });
  const loadAbortRef = useRef<AbortController | null>(null);

  const compileAndStore = useCallback(
    async (content: WorkContentPayload, signal?: AbortSignal) => {
      const compiled = await compileRemoteMdx(content.body, content.frontmatter);
      if (signal?.aborted) return;

      setCachedWorkContent(slug, compiled.Content);
      setState({ status: "ready", Content: compiled.Content });
    },
    [slug],
  );

  const loadContent = useCallback(async (signal?: AbortSignal) => {
    const cachedContent = getCachedWorkContent(slug);
    if (cachedContent) {
      setState({ status: "ready", Content: cachedContent });
      return;
    }

    try {
      const result = await fetchLockedContent(slug, signal);
      if (signal?.aborted) return;

      if (result === "unauthorized") {
        clearUnlockHint();
        clearCachedWorkContent(slug);
        setState({ status: "locked" });
        return;
      }

      if (result === "error") {
        setState({ status: "error", message: "無法載入內容，請稍後再試。" });
        return;
      }

      await compileAndStore(result, signal);
    } catch (error) {
      if (isAbortError(error) || signal?.aborted) return;
      setState({ status: "error", message: "內容格式錯誤，無法渲染。" });
    }
  }, [compileAndStore, slug]);

  const startLoadContent = useCallback(
    (content?: WorkContentPayload) => {
      loadAbortRef.current?.abort();
      const controller = new AbortController();
      loadAbortRef.current = controller;
      setState({ status: "loading" });

      if (content) {
        void compileAndStore(content, controller.signal).catch((error: unknown) => {
          if (isAbortError(error) || controller.signal.aborted) return;
          setState({ status: "error", message: "內容格式錯誤，無法渲染。" });
        });
        return;
      }

      void loadContent(controller.signal);
    },
    [compileAndStore, loadContent],
  );

  useEffect(() => {
    if (getCachedWorkContent(slug)) {
      return () => {
        loadAbortRef.current?.abort();
      };
    }

    if (!hasUnlockHint()) {
      return () => {
        loadAbortRef.current?.abort();
      };
    }

    loadAbortRef.current?.abort();
    const controller = new AbortController();
    loadAbortRef.current = controller;
    queueMicrotask(() => {
      void loadContent(controller.signal);
    });

    return () => {
      controller.abort();
      loadAbortRef.current?.abort();
    };
  }, [loadContent, slug]);

  if (state.status === "checking" || state.status === "loading") {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center text-sm text-text-secondary">
        載入中…
      </div>
    );
  }

  if (state.status === "locked") {
    return <UnlockForm slug={slug} onUnlocked={startLoadContent} />;
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

  const { Content } = state;

  return (
    <MDXProvider components={workMdxComponents}>
      <WorkProjectLayout>
        <RemoteMdxErrorBoundary
          key={slug}
          onError={(message) =>
            setState({ status: "error", message: `渲染失敗：${message}` })
          }
        >
          {createElement(Content)}
        </RemoteMdxErrorBoundary>
      </WorkProjectLayout>
    </MDXProvider>
  );
}
