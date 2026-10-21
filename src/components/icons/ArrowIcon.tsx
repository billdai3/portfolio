import type { SVGProps } from "react";
import {
  iconDirectionClass,
  joinIconClassName,
  type IconDirection,
} from "./iconDirection";

type ArrowIconProps = SVGProps<SVGSVGElement> & {
  direction?: IconDirection;
};

/** Fill arrow — rotates from right-facing source. */
export default function ArrowIcon({
  direction = "right",
  className,
  ...props
}: ArrowIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      {...props}
      className={joinIconClassName(iconDirectionClass(direction), className)}
    >
      <path
        fill="currentColor"
        d="M20 9.17188C21.5619 10.7339 21.5619 13.2661 20 14.8281L13.4141 21.4141L10.5859 18.5859L15.1719 14H3V10H15.1719L10.5859 5.41406L13.4141 2.58594L20 9.17188Z"
      />
    </svg>
  );
}
