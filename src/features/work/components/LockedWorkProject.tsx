import { MDXProvider } from "@mdx-js/react";
import {
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
  fetchLockedContent,
  fetchSessionUnlocked,
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
  const [state, setState] = useState<LoadState>({ status: "checking" });
  const loadAbortRef = useRef<AbortController | null>(null);

  const loadContent = useCallback(async (signal?: AbortSignal) => {
    setState({ status: "loading" });

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

      setState({ status: "ready", Content: compiled.Content });
    } catch (error) {
      if (isAbortError(error) || signal?.aborted) return;
      setState({ status: "error", message: "內容格式錯誤，無法渲染。" });
    }
  }, [slug]);

  const startLoadContent = useCallback(() => {
    loadAbortRef.current?.abort();
    const controller = new AbortController();
    loadAbortRef.current = controller;
    void loadContent(controller.signal);
  }, [loadContent]);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    async function bootstrap() {
      setState({ status: "checking" });
      try {
        const unlocked = await fetchSessionUnlocked(signal);
        if (signal.aborted) return;

        if (!unlocked) {
          setState({ status: "locked" });
          return;
        }

        await loadContent(signal);
      } catch (error) {
        if (isAbortError(error) || signal.aborted) return;
        setState({
          status: "error",
          message: "無法確認解鎖狀態，請稍後再試。",
        });
      }
    }

    void bootstrap();

    return () => {
      controller.abort();
      loadAbortRef.current?.abort();
    };
  }, [loadContent]);

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
          <Content />
        </RemoteMdxErrorBoundary>
      </WorkProjectLayout>
    </MDXProvider>
  );
}
