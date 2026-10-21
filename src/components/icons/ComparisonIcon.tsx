import type { SVGProps } from "react";

/** Fill comparison / before-after handle icon. */
export default function ComparisonIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      {...props}
    >
      <path
        fill="currentColor"
        d="M8.04688 4.44141L4.87109 10H8V14H4.87109L8.04688 19.5586L5.44141 21.0469L1.54785 14.2324C0.757528 12.8491 0.757527 11.1509 1.54785 9.76758L5.44141 2.95312L8.04688 4.44141ZM22.4522 9.76758C23.2425 11.1509 23.2425 12.8491 22.4522 14.2324L18.5586 21.0469L15.9531 19.5586L19.1289 14H16V10H19.1289L15.9531 4.44141L18.5586 2.95312L22.4522 9.76758ZM12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10Z"
      />
    </svg>
  );
}
