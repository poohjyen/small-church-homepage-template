import type { SVGProps } from "react";

export function NaverBandIcon({
  className,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
      {...props}
    >
      <rect
        x="2.5"
        y="2.5"
        width="19"
        height="19"
        rx="4"
        ry="4"
        fill="currentColor"
      />
      <path
        d="M9 7.25v9.5M9 7.25h3.6a2.4 2.4 0 0 1 0 4.8H9M9 12.05h3.9a2.45 2.45 0 0 1 0 4.7H9"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
