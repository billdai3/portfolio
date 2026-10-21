import { useLocation, useNavigate } from "react-router-dom";
import {
  parseDetailLocationState,
  toDetailNavigateTo,
} from "@/features/projects/lib/detail-from";
import ArrowIcon from "./icons/ArrowIcon";

type DetailBackButtonProps = {
  fallbackTo: string;
};

export default function DetailBackButton({ fallbackTo }: DetailBackButtonProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleGoBack = () => {
    const detail = parseDetailLocationState(location.state);
    navigate(detail ? toDetailNavigateTo(detail) : fallbackTo);
  };

  return (
    <button
      type="button"
      onClick={handleGoBack}
      className="detail-back-btn"
      aria-label="Go Back"
    >
      <span className="detail-back-btn__icon" aria-hidden>
        <ArrowIcon direction="left" className="size-6" />
      </span>
      <span className="detail-back-btn__label">Go Back</span>
    </button>
  );
}
