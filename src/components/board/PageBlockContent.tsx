import Image from "next/image";

import type { PageBlock } from "@/types/database";

type Props = { blocks: PageBlock[]; className?: string };

export function PageBlockContent({ blocks, className }: Props) {
  if (blocks.length === 0) return null;
  return (
    <div className={className ?? "mx-auto max-w-3xl space-y-8"}>
      {blocks.map((b) => (
        <Block key={b.id} block={b} />
      ))}
    </div>
  );
}

function Block({ block }: { block: PageBlock }) {
  if (block.type === "heading" && block.title) {
    return (
      <h2 className="text-2xl font-bold text-primary-navy md:text-3xl">
        {block.title}
      </h2>
    );
  }
  if (block.type === "paragraph" && block.body) {
    return (
      <p className="whitespace-pre-line text-base leading-loose text-charcoal md:text-lg">
        {block.body}
      </p>
    );
  }
  if (block.type === "image" && block.image_url) {
    return (
      <figure className="overflow-hidden rounded-2xl shadow-md ring-1 ring-black/5">
        <Image
          src={block.image_url}
          alt={block.image_alt ?? ""}
          width={1280}
          height={720}
          sizes="(max-width: 1024px) 100vw, 896px"
          className="h-auto w-full"
        />
        {block.image_alt ? (
          <figcaption className="bg-soft px-4 py-2 text-center text-xs text-warm-gray">
            {block.image_alt}
          </figcaption>
        ) : null}
      </figure>
    );
  }
  if (block.type === "quote" && block.body) {
    return (
      <blockquote className="rounded-2xl border-l-4 border-secondary-sky bg-soft px-6 py-5 text-base italic leading-loose text-charcoal md:text-lg">
        <p className="whitespace-pre-line">{block.body}</p>
        {block.image_alt ? (
          <footer className="mt-3 text-right text-sm not-italic text-warm-gray">
            — {block.image_alt}
          </footer>
        ) : null}
      </blockquote>
    );
  }
  if (block.type === "youtube" && block.youtube_id) {
    return (
      <figure className="overflow-hidden rounded-2xl bg-black shadow-md ring-1 ring-black/5">
        <div className="relative aspect-video w-full">
          <iframe
            src={`https://www.youtube.com/embed/${block.youtube_id}?rel=0&modestbranding=1&iv_load_policy=3&playsinline=1`}
            title={block.title ?? "동영상"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 size-full"
          />
        </div>
        {block.title ? (
          <figcaption className="bg-soft px-4 py-2 text-center text-xs text-warm-gray">
            {block.title}
          </figcaption>
        ) : null}
      </figure>
    );
  }
  return null;
}
