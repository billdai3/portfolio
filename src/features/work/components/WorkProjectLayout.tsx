import { type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

type WorkProjectLayoutProps = {
  tag?: string;
  year?: string;
  role?: string;
  children: ReactNode;
};

function GoBackButton() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/work");
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoBack}
      className="detail-back-btn"
      aria-label="Go Back"
    >
      <span className="detail-back-btn__icon" aria-hidden>
        ←
      </span>
      <span className="detail-back-btn__label">Go Back</span>
    </button>
  );
}

export default function WorkProjectLayout({
  tag,
  year,
  role,
  children,
}: WorkProjectLayoutProps) {
  const hasMeta = Boolean(year || role);

  return (
    <div className="bg-bg-page text-text-primary">
      <GoBackButton />

      <div className="detail-content-fade-in mx-auto max-w-360 px-4 pb-16 pt-14 sm:px-6 lg:px-8 lg:pb-20 lg:pt-18">
        <article className="work-prose lab-prose max-w-none">
          {tag ? (
            <div className="mb-3">
              <span className="type-btn rounded-full border border-border-default px-3 py-1 text-xs text-text-secondary">
                {tag}
              </span>
            </div>
          ) : null}

          {hasMeta ? (
            <dl className="mb-6 flex flex-wrap gap-x-8 gap-y-2 text-sm text-text-muted">
              {year ? (
                <div>
                  <dt className="inline text-text-secondary">Year</dt>
                  <dd className="ml-2 inline text-text-primary">{year}</dd>
                </div>
              ) : null}
              {role ? (
                <div>
                  <dt className="inline text-text-secondary">Role</dt>
                  <dd className="ml-2 inline text-text-primary">{role}</dd>
                </div>
              ) : null}
            </dl>
          ) : null}

          {children}
        </article>
      </div>
    </div>
  );
}
