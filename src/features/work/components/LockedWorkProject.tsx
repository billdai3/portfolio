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
import { GridIconLoadingBlock } from "../../../components/GridIconLoading";
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

/** 避免極短等待時 loading 閃一下 */
const MIN_LOADING_MS = 350;

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
  const loadingStartedAtRef = useRef<number | null>(null);
  const minLoadingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearMinLoadingTimer = useCallback(() => {
    if (minLoadingTimerRef.current) {
      clearTimeout(minLoadingTimerRef.current);
      minLoadingTimerRef.current = null;
    }
  }, []);

  const markLoadingStarted = useCallback(() => {
    loadingStartedAtRef.current = performance.now();
  }, []);

  const setStateAfterMinLoading = useCallback(
    (next: LoadState, signal?: AbortSignal) => {
      if (signal?.aborted) return;

      const startedAt = loadingStartedAtRef.current;
      const elapsed = startedAt == null ? MIN_LOADING_MS : performance.now() - startedAt;
      const remaining = Math.max(0, MIN_LOADING_MS - elapsed);

      clearMinLoadingTimer();

      if (remaining === 0) {
        loadingStartedAtRef.current = null;
        setState(next);
        return;
      }

      minLoadingTimerRef.current = setTimeout(() => {
        minLoadingTimerRef.current = null;
        if (signal?.aborted) return;
        loadingStartedAtRef.current = null;
        setState(next);
      }, remaining);
    },
    [clearMinLoadingTimer],
  );

  const compileAndStore = useCallback(
    async (content: WorkContentPayload, signal?: AbortSignal) => {
      const compiled = await compileRemoteMdx(content.body, content.frontmatter);
      if (signal?.aborted) return;

      setCachedWorkContent(slug, compiled.Content);
      setStateAfterMinLoading(
        { status: "ready", Content: compiled.Content },
        signal,
      );
    },
    [setStateAfterMinLoading, slug],
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
        setStateAfterMinLoading({ status: "locked" }, signal);
        return;
      }

      if (result === "error") {
        setStateAfterMinLoading(
          { status: "error", message: "無法載入內容，請稍後再試。" },
          signal,
        );
        return;
      }

      await compileAndStore(result, signal);
    } catch (error) {
      if (isAbortError(error) || signal?.aborted) return;
      setStateAfterMinLoading(
        { status: "error", message: "內容格式錯誤，無法渲染。" },
        signal,
      );
    }
  }, [compileAndStore, setStateAfterMinLoading, slug]);

  const startLoadContent = useCallback(
    (content?: WorkContentPayload) => {
      loadAbortRef.current?.abort();
      clearMinLoadingTimer();
      const controller = new AbortController();
      loadAbortRef.current = controller;
      markLoadingStarted();
      setState({ status: "loading" });

      if (content) {
        void compileAndStore(content, controller.signal).catch((error: unknown) => {
          if (isAbortError(error) || controller.signal.aborted) return;
          setStateAfterMinLoading(
            { status: "error", message: "內容格式錯誤，無法渲染。" },
            controller.signal,
          );
        });
        return;
      }

      void loadContent(controller.signal);
    },
    [
      clearMinLoadingTimer,
      compileAndStore,
      loadContent,
      markLoadingStarted,
      setStateAfterMinLoading,
    ],
  );

  useEffect(() => {
    if (getCachedWorkContent(slug)) {
      return () => {
        loadAbortRef.current?.abort();
        clearMinLoadingTimer();
      };
    }

    if (!hasUnlockHint()) {
      return () => {
        loadAbortRef.current?.abort();
        clearMinLoadingTimer();
      };
    }

    loadAbortRef.current?.abort();
    clearMinLoadingTimer();
    const controller = new AbortController();
    loadAbortRef.current = controller;
    markLoadingStarted();
    queueMicrotask(() => {
      void loadContent(controller.signal);
    });

    return () => {
      controller.abort();
      loadAbortRef.current?.abort();
      clearMinLoadingTimer();
    };
  }, [clearMinLoadingTimer, loadContent, markLoadingStarted, slug]);

  let body: ReactNode;

  if (state.status === "checking" || state.status === "loading") {
    body = <GridIconLoadingBlock />;
  } else if (state.status === "locked") {
    body = <UnlockForm slug={slug} onUnlocked={startLoadContent} />;
  } else if (state.status === "error") {
    body = (
      <div className="py-24 text-center">
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
  } else {
    const { Content } = state;
    body = (
      <MDXProvider components={workMdxComponents}>
        <RemoteMdxErrorBoundary
          key={slug}
          onError={(message) =>
            setState({ status: "error", message: `渲染失敗：${message}` })
          }
        >
          {createElement(Content)}
        </RemoteMdxErrorBoundary>
      </MDXProvider>
    );
  }

  return (
    <WorkProjectLayout prose={state.status === "ready"}>
      {body}
    </WorkProjectLayout>
  );
}
