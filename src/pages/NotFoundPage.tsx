import CtaLink from "../components/CtaLink";
import {
  formatDocumentTitle,
  useDocumentTitle,
} from "../hooks/useDocumentTitle";

export default function NotFoundPage() {
  useDocumentTitle(formatDocumentTitle("404"));

  return (
    <section
      className="flex h-full min-h-0 flex-col items-center justify-center px-6 py-24 sm:px-10"
      aria-labelledby="not-found-heading"
    >
      <div className="section-inner flex flex-col items-center text-center">
        <h1
          id="not-found-heading"
          className="type-page-title text-text-primary"
        >
          404
        </h1>
        <p className="mt-4 max-w-md text-base leading-relaxed text-text-secondary">
          找不到這個頁面。可能已被移除，或網址有誤。
        </p>
        <p className="mt-6">
          <CtaLink to="/">Back to home</CtaLink>
        </p>
      </div>
    </section>
  );
}
