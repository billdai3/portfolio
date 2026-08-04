import { useState, type SubmitEvent } from "react";

type UnlockFormProps = {
  onUnlocked: () => void;
};

export function UnlockForm({ onUnlocked }: UnlockFormProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/work-unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        setError("密碼錯誤，請再試一次。");
        return;
      }

      setPassword("");
      onUnlocked();
    } catch {
      setError("無法連線，請稍後再試。");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-md flex-col justify-center px-4 py-16">
      <h1 className="text-2xl font-semibold text-text-primary">此專案已上鎖</h1>
      <p className="mt-2 text-sm text-text-secondary">
        輸入密碼後即可檢視完整內容。
      </p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
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
          className="w-full rounded-xl bg-text-primary px-4 py-3 text-sm font-medium text-bg-page transition enabled:hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? "驗證中…" : "解鎖"}
        </button>
      </form>
    </div>
  );
}
