import { MDXProvider } from "@mdx-js/react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { GridIconLoadingBlock } from "../../../components/GridIconLoading";
import { UnlockForm } from "./UnlockForm";
import { RemoteMdxErrorBoundary } from "./RemoteMdxErrorBoundary";
import { ProjectInfo } from "./ProjectInfo";
import { workMdxComponents } from "./mdx-components";
import WorkProjectLayout from "./WorkProjectLayout";
import { SafeMdxDocumentView } from "../lib/render-safe-mdx-document";
import { projectInfoFromFrontmatter } from "../lib/project-info-from-frontmatter";
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
  | { status: "ready"; content: WorkContentPayload }
  | { status: "error"; message: string };

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

export default function LockedWorkProject({ slug }: { slug: string }) {
  const [state, setState] = useState<LoadState>(() => {
    const cachedContent = getCachedWorkContent(slug);
    if (cachedContent) {
      return { status: "ready", content: cachedContent };
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

  const storeAndReady = useCallback(
    (content: WorkContentPayload, signal?: AbortSignal) => {
      setCachedWorkContent(slug, content);
      setStateAfterMinLoading({ status: "ready", content }, signal);
    },
    [setStateAfterMinLoading, slug],
  );

  const loadContent = useCallback(
    async (signal?: AbortSignal) => {
      const cachedContent = getCachedWorkContent(slug);
      if (cachedContent) {
        setState({ status: "ready", content: cachedContent });
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

        storeAndReady(result, signal);
      } catch (error) {
        if (isAbortError(error) || signal?.aborted) return;
        setStateAfterMinLoading(
          { status: "error", message: "內容格式錯誤，無法渲染。" },
          signal,
        );
      }
    },
    [setStateAfterMinLoading, slug, storeAndReady],
  );

  const startLoadContent = useCallback(
    (content?: WorkContentPayload) => {
      loadAbortRef.current?.abort();
      clearMinLoadingTimer();
      const controller = new AbortController();
      loadAbortRef.current = controller;
      markLoadingStarted();
      setState({ status: "loading" });

      if (content) {
        storeAndReady(content, controller.signal);
        return;
      }

      void loadContent(controller.signal);
    },
    [clearMinLoadingTimer, loadContent, markLoadingStarted, storeAndReady],
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

  useLayoutEffect(() => {
    if (state.status !== "ready") return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [state.status, slug]);

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
    const { content } = state;
    const projectInfo = projectInfoFromFrontmatter(content.frontmatter);
    body = (
      <MDXProvider components={workMdxComponents}>
        <RemoteMdxErrorBoundary
          key={slug}
          onError={(message) =>
            setState({ status: "error", message: `渲染失敗：${message}` })
          }
        >
          {projectInfo ? <ProjectInfo items={projectInfo} /> : null}
          <SafeMdxDocumentView
            document={content.document}
            components={workMdxComponents}
          />
        </RemoteMdxErrorBoundary>
      </MDXProvider>
    );
  }

  return (
    <WorkProjectLayout
      prose={state.status === "ready"}
      showPager={state.status === "ready"}
    >
      {body}
    </WorkProjectLayout>
  );
}
