import { cn } from "@/lib/utils";

type Props = {
  eyebrow: string;
  title: string;
  description?: string;
  eyebrowCase?: "upper" | "none";
};

export function PageHeader({
  eyebrow,
  title,
  description,
  eyebrowCase = "upper",
}: Props) {
  return (
    <header className="mx-auto mb-12 max-w-3xl text-center">
      <p
        className={cn(
          "text-sm font-semibold tracking-[0.4em] text-secondary-sky",
          eyebrowCase === "upper" && "uppercase",
        )}
      >
        {eyebrow}
      </p>
      <h1 className="mt-3 text-3xl font-bold text-primary-navy md:text-4xl">
        {title}
      </h1>
      {description ? (
        <p className="mx-auto mt-4 max-w-2xl text-base text-warm-gray md:text-lg">
          {description}
        </p>
      ) : null}
    </header>
  );
}
