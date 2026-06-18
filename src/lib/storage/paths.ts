export type StorageBucket =
  | "gallery"
  | "hero"
  | "bulletins"
  | "resources"
  | "site"
  | "popups";

export function pathFromPublicUrl(
  bucket: StorageBucket,
  url: string | null | undefined,
): string | null {
  if (!url) return null;
  const marker = `/storage/v1/object/public/${bucket}/`;
  const i = url.indexOf(marker);
  if (i < 0) return null;
  return url.slice(i + marker.length);
}
