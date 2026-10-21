import { useNavigate } from "react-router-dom";
import ArrowIcon from "./icons/ArrowIcon";

type DetailBackButtonProps = {
  fallbackTo: string;
};

export default function DetailBackButton({ fallbackTo }: DetailBackButtonProps) {
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(fallbackTo);
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
        <ArrowIcon direction="left" className="size-5" />
      </span>
      <span className="detail-back-btn__label">Go Back</span>
    </button>
  );
}
