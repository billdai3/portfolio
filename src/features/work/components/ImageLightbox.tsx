import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

type ImageLightboxProps = {
  src: string;
  alt?: string;
  onClose: () => void;
};

const OVERLAY_OPACITY = 0.8;

export default function ImageLightbox({
  src,
  alt = "",
  onClose,
}: ImageLightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const previousFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    dialogRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === "Tab") {
        event.preventDefault();
        dialogRef.current?.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      previousFocus?.focus();
    };
  }, [onClose]);

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={alt ? `Expanded image: ${alt}` : "Expanded image"}
      tabIndex={-1}
      className="fixed inset-0 z-100 flex cursor-zoom-out items-center justify-center p-4 text-text-primary outline-none sm:p-6"
      style={{ backgroundColor: `rgb(0 0 0 / ${OVERLAY_OPACITY})` }}
      onClick={onClose}
    >
      <img
        src={src}
        alt={alt}
        className="max-h-full max-w-full object-contain"
      />
    </div>,
    document.body,
  );
}
