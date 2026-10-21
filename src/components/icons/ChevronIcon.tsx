import type { SVGProps } from "react";
import {
  iconDirectionClass,
  joinIconClassName,
  type IconDirection,
} from "./iconDirection";

type ChevronIconProps = SVGProps<SVGSVGElement> & {
  direction?: IconDirection;
};

/** Fill chevron — rotates from right-facing source. */
export default function ChevronIcon({
  direction = "right",
  className,
  ...props
}: ChevronIconProps) {
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
        d="M16.7363 15.7627C19.013 13.7706 19.013 10.2294 16.7363 8.2373L9.81152 2.17773L7.17773 5.18848L14.1025 11.2471C14.5579 11.6455 14.5579 12.3545 14.1025 12.7529L7.17773 18.8115L9.81152 21.8223L16.7363 15.7627Z"
      />
    </svg>
  );
}
