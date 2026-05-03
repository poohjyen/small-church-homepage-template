type Props = {
  title: string;
  description?: string | null;
  uploadDate: string;
  youtubeId: string;
  thumbnail?: string;
};

export function VideoJsonLd({
  title,
  description,
  uploadDate,
  youtubeId,
  thumbnail,
}: Props) {
  const data = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: title,
    description: description ?? title,
    thumbnailUrl: thumbnail ?? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`,
    uploadDate,
    contentUrl: `https://www.youtube.com/watch?v=${youtubeId}`,
    embedUrl: `https://www.youtube.com/embed/${youtubeId}`,
    inLanguage: "ko-KR",
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
