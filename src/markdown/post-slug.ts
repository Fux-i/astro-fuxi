const DATA_BASE = "/src/data/";

type MarkdownFile = {
  path?: string;
  data: {
    astro?: {
      frontmatter?: Record<string, unknown>;
    };
  };
};

function fallbackPostSlug(filePath: string): string {
  const normalized = filePath.replace(/\\/g, "/");
  const dataIndex = normalized.lastIndexOf(DATA_BASE);
  const relPath =
    dataIndex >= 0
      ? normalized.slice(dataIndex + DATA_BASE.length)
      : normalized.split("/").pop()!;
  const noSourceDir = relPath.includes("/")
    ? relPath.slice(relPath.indexOf("/") + 1)
    : relPath;
  const base = noSourceDir.split("/").pop()!;
  const stem = base.split(".")[0];
  const dir = noSourceDir.includes("/")
    ? noSourceDir.slice(0, noSourceDir.lastIndexOf("/"))
    : "";
  return dir ? `${dir}/${stem}` : stem;
}

export function getPostSlug(file: MarkdownFile): string {
  return typeof file.data.astro?.frontmatter?.slug === "string"
    ? file.data.astro.frontmatter.slug
    : fallbackPostSlug(file.path ?? "");
}
