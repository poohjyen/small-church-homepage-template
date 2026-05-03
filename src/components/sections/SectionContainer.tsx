import { cn } from "@/lib/utils";

type Bg = "white" | "gray" | "teal" | "navy";

type Props = {
  children: React.ReactNode;
  bg?: Bg;
  className?: string;
  containerClassName?: string;
  fullBleed?: boolean;
  id?: string;
};

const bgClasses: Record<Bg, string> = {
  white: "bg-white",
  gray: "bg-slate-50",
  teal: "bg-secondary-sky text-white",
  navy: "bg-primary-navy text-white",
};

export function SectionContainer({
  children,
  bg = "white",
  className,
  containerClassName,
  fullBleed = false,
  id,
}: Props) {
  return (
    <section
      id={id}
      className={cn("py-10 md:py-16", bgClasses[bg], className)}
    >
      {fullBleed ? (
        children
      ) : (
        <div className={cn("container mx-auto px-4", containerClassName)}>
          {children}
        </div>
      )}
    </section>
  );
}
