import { type Lang } from "@/i18n/ui";

type SingleContent = {
  type: "single";
  source: string | Record<Lang, string>;
};

type CollectionContent = {
  type: "collection";
  source: Record<Lang, RegExp>;
};

type ContentEntry = SingleContent | CollectionContent;

/* config */

export const DATA_BASE = "/src/data";

export const CONTENT = {
  about: {
    type: "single",
    source: { zh: "about.md", en: "about.en.md" },
  },
  friends: {
    type: "single",
    source: "friends.md",
  },
  posts: {
    type: "collection",
    source: {
      zh: /^blog\/.*(?<!\.en)\.md$/,
      en: /^blog\/.*\.en\.md$/,
    },
  },
} as const satisfies Record<string, ContentEntry>;

/* runtime */

export type PageKey = keyof typeof CONTENT;
type MdModule = {
  frontmatter: Record<string, any>;
  Content: any;
  file?: string;
  url?: string;
  getHeadings?: () => any[];
};

// import.meta.glob requires literal pattern; load every md under src/data
const modules = import.meta.glob<MdModule>("/src/data/**/*.md", {
  eager: true,
});

// strip "/src/data/" prefix → relative path key, e.g. "blog/a/b/c.md"
const entries: { path: string; mod: MdModule }[] = Object.entries(modules).map(
  ([abs, mod]) => ({
    path: abs.replace(DATA_BASE + "/", ""),
    mod,
  }),
);

function resolveSourceString(
  entry: ContentEntry,
  lang: Lang,
): string | null {
  if (entry.type !== "single") return null;
  if (typeof entry.source === "string") return entry.source;
  return entry.source[lang] ?? null;
}

function fallbackSlug(path: string): string {
  // strip first segment (source dir) and all trailing .xxx suffixes
  // e.g. "blog/a/b/c.en.md" → "a/b/c"
  const noSourceDir = path.includes("/")
    ? path.slice(path.indexOf("/") + 1)
    : path;
  const base = noSourceDir.split("/").pop()!;
  const stem = base.split(".")[0];
  const dir = noSourceDir.includes("/")
    ? noSourceDir.slice(0, noSourceDir.lastIndexOf("/"))
    : "";
  return dir ? `${dir}/${stem}` : stem;
}

export function getSingle(pageKey: PageKey, lang: Lang): MdModule | null {
  const entry = CONTENT[pageKey];
  const src = resolveSourceString(entry, lang);
  if (!src) return null;
  const hit = entries.find((e) => e.path === src);
  return hit?.mod ?? null;
}

export type CollectionItem = {
  slug: string;
  frontmatter: Record<string, any>;
  Content: any;
};

export function getCollection(
  pageKey: PageKey,
  lang: Lang,
): CollectionItem[] {
  const entry = CONTENT[pageKey];
  if (entry.type !== "collection") return [];
  const pattern = entry.source[lang];
  if (!pattern) return [];

  return entries
    .filter((e) => pattern.test(e.path))
    .filter((e) => e.mod.frontmatter?.draft !== true)
    .map((e) => ({
      slug: e.mod.frontmatter?.slug ?? fallbackSlug(e.path),
      frontmatter: e.mod.frontmatter ?? {},
      Content: e.mod.Content,
    }));
}
