import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const moreLinkVariants = cva(
  "inline-flex items-center gap-1 font-medium transition-colors underline-offset-4 hover:underline",
  {
    variants: {
      tone: {
        navy: "text-primary-navy hover:text-primary-navy/80",
        white: "text-white hover:text-white/85",
        teal: "text-secondary-sky hover:text-secondary-sky/80",
      },
      size: {
        sm: "text-sm",
        md: "text-base",
      },
    },
    defaultVariants: { tone: "navy", size: "md" },
  },
);

export type MoreLinkProps = VariantProps<typeof moreLinkVariants> & {
  href: string;
  children: React.ReactNode;
  className?: string;
  prefetch?: boolean;
};

export function MoreLink({
  href,
  tone,
  size,
  children,
  className,
  prefetch,
}: MoreLinkProps) {
  return (
    <Link
      href={href}
      prefetch={prefetch}
      className={cn(moreLinkVariants({ tone, size }), className)}
    >
      <span>{children}</span>
      <span aria-hidden className="ml-0.5 leading-none">》</span>
    </Link>
  );
}

export { moreLinkVariants };
