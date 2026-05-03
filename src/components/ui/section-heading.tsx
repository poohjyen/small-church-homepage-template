import { cn } from "@/lib/utils";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  eyebrowCase?: "upper" | "none";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  eyebrowCase = "upper",
  className,
}: Props) {
  return (
    <div
      className={cn(
        align === "center" ? "mx-auto text-center" : "text-left",
        className,
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            "text-xs font-semibold tracking-[0.4em] text-secondary-sky md:text-sm",
            eyebrowCase === "upper" && "uppercase",
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-3 text-3xl font-bold text-primary-navy md:text-4xl">
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-4 text-base text-warm-gray md:text-lg",
            align === "center" && "mx-auto max-w-2xl",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
