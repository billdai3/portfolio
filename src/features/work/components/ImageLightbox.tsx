import {
  useCallback,
  useEffect,
  useId,
  useRef,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { createPortal } from "react-dom";

export type LightboxImage = {
  src: string;
  alt?: string;
};

type ImageLightboxProps = {
  images: LightboxImage[];
  index: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
};

export default function ImageLightbox({
  images,
  index,
  onClose,
  onIndexChange,
}: ImageLightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const current = images[index];
  const hasMultiple = images.length > 1;

  const goPrev = useCallback(() => {
    if (!hasMultiple) return;
    onIndexChange((index - 1 + images.length) % images.length);
  }, [hasMultiple, images.length, index, onIndexChange]);

  const goNext = useCallback(() => {
    if (!hasMultiple) return;
    onIndexChange((index + 1) % images.length);
  }, [hasMultiple, images.length, index, onIndexChange]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goNext, goPrev, onClose]);

  const onDialogKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab" || !dialogRef.current) return;

    const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
    );
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  if (!current) return null;

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-100 flex flex-col bg-ash-900/92 text-text-primary"
      onKeyDown={onDialogKeyDown}
      onClick={onClose}
    >
      <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <p id={titleId} className="type-btn truncate text-sm text-text-secondary">
          {current.alt?.trim() || "Image viewer"}
          {hasMultiple ? ` · ${index + 1} / ${images.length}` : null}
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="type-btn shrink-0 rounded-full border border-border-default px-3 py-1.5 text-sm text-text-secondary transition-colors hover:border-border-strong hover:text-text-primary"
        >
          Close
        </button>
      </div>

      <div
        className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-8 sm:px-10"
        onClick={(event) => event.stopPropagation()}
      >
        {hasMultiple ? (
          <button
            type="button"
            onClick={goPrev}
            className="absolute left-2 z-10 flex size-11 items-center justify-center rounded-full border border-border-default bg-bg-card/80 text-lg text-text-secondary transition-colors hover:text-text-primary sm:left-4"
            aria-label="Previous image"
          >
            ←
          </button>
        ) : null}

        <img
          src={current.src}
          alt={current.alt ?? ""}
          className="max-h-full max-w-full object-contain"
        />

        {hasMultiple ? (
          <button
            type="button"
            onClick={goNext}
            className="absolute right-2 z-10 flex size-11 items-center justify-center rounded-full border border-border-default bg-bg-card/80 text-lg text-text-secondary transition-colors hover:text-text-primary sm:right-4"
            aria-label="Next image"
          >
            →
          </button>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
