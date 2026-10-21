import type { SVGProps } from "react";

/** Fill lock (open) icon. */
export default function LockOpenIcon(props: SVGProps<SVGSVGElement>) {
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
        d="M12 2C14.2914 2 16.3259 3.10311 17.5996 4.79883L14.4014 7.20117C13.8507 6.46799 12.9802 6 12 6C10.3431 6 9 7.34315 9 9V10H21V18C21 20.2091 19.2091 22 17 22H7C4.79086 22 3 20.2091 3 18V10H5V9C5 5.13401 8.13401 2 12 2ZM12 13C10.8954 13 10 13.8954 10 15C10 16.1046 10.8954 17 12 17C13.1046 17 14 16.1046 14 15C14 13.8954 13.1046 13 12 13Z"
      />
    </svg>
  );
}
