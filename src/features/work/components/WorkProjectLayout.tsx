import { type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

type WorkProjectLayoutProps = {
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
  children,
}: WorkProjectLayoutProps) {
  return (
    <div className="bg-bg-page text-text-primary">
      <GoBackButton />

      <div className="mx-auto max-w-360 px-4 pb-16 pt-14 sm:px-6 lg:px-8 lg:pb-20 lg:pt-18">
        <article className="work-prose lab-prose max-w-none">
          {children}
        </article>
      </div>
    </div>
  );
}
