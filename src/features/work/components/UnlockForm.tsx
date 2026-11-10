import { useState, type SubmitEvent } from "react";
import {
  persistUnlockHint,
  unlockAndFetchContent,
  type WorkContentPayload,
} from "../lib/unlock-api";

type UnlockFormProps = {
  slug: string;
  onUnlocked: (content?: WorkContentPayload) => void;
};

export function UnlockForm({ slug, onUnlocked }: UnlockFormProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const result = await unlockAndFetchContent(slug, password);
      if (result === "unauthorized") {
        setError("密碼錯誤，請再試一次。");
        return;
      }

      if (result === "error") {
        setError("無法連線，請稍後再試。");
        return;
      }

      if (result === "unlocked-no-content") {
        setPassword("");
        persistUnlockHint();
        onUnlocked(undefined);
        return;
      }

      if (typeof result === "object" && "kind" in result) {
        const minutes = Math.max(1, Math.ceil(result.retryAfterSec / 60));
        setError(`嘗試次數過多，請約 ${minutes} 分鐘後再試。`);
        return;
      }

      setPassword("");
      persistUnlockHint();
      onUnlocked(result);
    } catch {
      setError("無法連線，請稍後再試。");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section
      className="mt-4 mb-6 rounded-3xl bg-bg-card/60 p-6 sm:p-8"
      aria-labelledby="work-unlock-heading"
    >
      <h2
        id="work-unlock-heading"
        className="text-xl font-semibold text-text-primary"
      >
        此專案已上鎖
      </h2>
      <p className="mt-2 text-sm text-text-secondary">
        輸入密碼後即可檢視完整內容。
      </p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block">
          <span className="sr-only">密碼</span>
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={submitting}
            placeholder="密碼"
            className="w-full rounded-xl border border-border-default bg-bg-card px-4 py-3 text-text-primary outline-none focus-visible:ring-2 focus-visible:ring-accent"
            required
          />
        </label>
        {error ? (
          <p className="text-sm text-red-400" role="alert">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={submitting || !password}
          className="w-full cursor-pointer rounded-xl bg-bg-section-alt px-4 py-3 text-sm font-bold text-text-primary transition-colors duration-300 ease-out enabled:hover:bg-brand enabled:hover:text-text-on-light focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-30"
        >
          {submitting ? "驗證中…" : "解鎖"}
        </button>
      </form>
    </section>
  );
}
