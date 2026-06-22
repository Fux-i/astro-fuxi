export function getHeadingAnchor(postSlug: string, headingSlug: string): string {
  const prefix = postSlug
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return prefix ? `${prefix}-${headingSlug}` : headingSlug;
}
