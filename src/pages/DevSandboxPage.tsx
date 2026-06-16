import CurrentSketch from "@/components/sketches/CanvasParticleFlame";

export default function DevSandboxPage() {
  return (
    <div className="flex min-h-svh flex-col bg-bg-page text-text-primary">
      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-6">
          <p className="type-btn text-xs text-text-muted">Dev only</p>
          <h1 className="mt-2 text-lg font-medium text-text-primary">
            Sandbox
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            預覽 <code className="text-text-primary">sketches/</code>{" "}
            中的 WIP 作品。要換實驗時，改{" "}
            <code className="text-text-primary">DevSandboxPage</code> 的 sketch
            import。
          </p>
        </header>

        <div className="flex min-h-[min(70svh,40rem)] flex-col">
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-border-default bg-bg-card p-3 sm:p-4">
            <div className="relative min-h-0 flex-1 overflow-hidden rounded-xl bg-ash-900">
              <CurrentSketch />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
