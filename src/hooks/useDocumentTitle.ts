import { useEffect } from "react";

export const SITE_TITLE = "Bill's Portfolio";

export function formatDocumentTitle(...parts: Array<string | undefined>) {
  return [...parts, SITE_TITLE].filter(Boolean).join(" | ");
}

export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
