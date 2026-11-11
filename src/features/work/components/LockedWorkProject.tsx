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
import { LockedWorkPreview } from "./LockedWorkPreview";
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
import type { WorkProjectEntry } from "../lib/registry";

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

/** Capture before content height grows; ignore non-scrollable pages. */
function isWindowScrolledToBottom(thresholdPx = 64): boolean {
  const maxScroll =
    document.documentElement.scrollHeight - window.innerHeight;
  return maxScroll > thresholdPx && window.scrollY >= maxScroll - thresholdPx;
}

export default function LockedWorkProject({
  project,
}: {
  project: WorkProjectEntry;
}) {
  const { slug, title, summary, hero, projectInfo } = project;
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
  const wasAtBottomRef = useRef(false);
  const bodyStartRef = useRef<HTMLDivElement | null>(null);

  const clearMinLoadingTimer = useCallback(() => {
    if (minLoadingTimerRef.current) {
      clearTimeout(minLoadingTimerRef.current);
      minLoadingTimerRef.current = null;
    }
  }, []);

  const markLoadingStarted = useCallback(() => {
    loadingStartedAtRef.current = performance.now();
  }, []);

  const rememberScrollBeforeReady = useCallback(() => {
    wasAtBottomRef.current = isWindowScrolledToBottom();
  }, []);

  const setStateAfterMinLoading = useCallback(
    (next: LoadState, signal?: AbortSignal) => {
      if (signal?.aborted) return;

      const startedAt = loadingStartedAtRef.current;
      const elapsed = startedAt == null ? MIN_LOADING_MS : performance.now() - startedAt;
      const remaining = Math.max(0, MIN_LOADING_MS - elapsed);

      clearMinLoadingTimer();

      const apply = () => {
        if (next.status === "ready") {
          rememberScrollBeforeReady();
        }
        setState(next);
      };

      if (remaining === 0) {
        loadingStartedAtRef.current = null;
        apply();
        return;
      }

      minLoadingTimerRef.current = setTimeout(() => {
        minLoadingTimerRef.current = null;
        if (signal?.aborted) return;
        loadingStartedAtRef.current = null;
        apply();
      }, remaining);
    },
    [clearMinLoadingTimer, rememberScrollBeforeReady],
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
        rememberScrollBeforeReady();
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
    [
      rememberScrollBeforeReady,
      setStateAfterMinLoading,
      slug,
      storeAndReady,
    ],
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
    if (!wasAtBottomRef.current) return;
    wasAtBottomRef.current = false;
    bodyStartRef.current?.scrollIntoView({
      block: "start",
      behavior: "instant",
    });
  }, [state.status, slug]);

  let body: ReactNode;

  if (state.status === "checking" || state.status === "loading") {
    body = <GridIconLoadingBlock />;
  } else if (state.status === "locked") {
    body = (
      <div className="work-prose lab-prose max-w-none">
        <UnlockForm slug={slug} onUnlocked={startLoadContent} />
      </div>
    );
  } else if (state.status === "error") {
    body = (
      <div className="py-12 text-center">
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
    // Prefer public meta projectInfo; fall back to private frontmatter only when
    // the public preview has no rows (legacy private MDX still embeds ProjectInfo).
    const hasPublicProjectInfo = Boolean(
      projectInfo?.some((item) => item.label.trim() && item.value.trim()),
    );
    const projectInfoItems = hasPublicProjectInfo
      ? null
      : projectInfoFromFrontmatter(content.frontmatter);
    const lockedMdxComponents = {
      ...workMdxComponents,
      ProjectInfo: () =>
        projectInfoItems ? <ProjectInfo items={projectInfoItems} /> : null,
    };
    body = (
      <div ref={bodyStartRef} className="work-prose lab-prose max-w-none">
        <MDXProvider components={lockedMdxComponents}>
          <RemoteMdxErrorBoundary
            key={slug}
            onError={(message) =>
              setState({ status: "error", message: `渲染失敗：${message}` })
            }
          >
            <SafeMdxDocumentView
              document={content.document}
              components={lockedMdxComponents}
            />
          </RemoteMdxErrorBoundary>
        </MDXProvider>
      </div>
    );
  }

  return (
    <WorkProjectLayout prose={false} showPager>
      <LockedWorkPreview
        title={title}
        summary={summary}
        hero={hero}
        projectInfo={projectInfo}
      />
      {body}
    </WorkProjectLayout>
  );
}
