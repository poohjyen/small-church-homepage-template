import type { SVGProps } from "react";

export function YoutubeIcon({
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
        x="1.5"
        y="5"
        width="21"
        height="14"
        rx="4"
        ry="4"
        fill="#FF0000"
      />
      <polygon points="10,8.5 10,15.5 16,12" fill="#FFFFFF" />
    </svg>
  );
}
