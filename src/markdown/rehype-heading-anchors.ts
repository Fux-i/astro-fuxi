import { getHeadingAnchor } from "./heading-anchors";
import { getPostSlug } from "./post-slug";

type ElementNode = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: ElementNode[];
};

function visitElements(node: ElementNode, visit: (node: ElementNode) => void) {
  visit(node);
  for (const child of node.children ?? []) visitElements(child, visit);
}

function textContent(node: ElementNode): string {
  if (typeof node.value === "string") return node.value;
  return (node.children ?? []).map(textContent).join("");
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}\p{M}\-_]/gu, "");
}

export default function rehypePostHeadingAnchors() {
  return function transformer(tree: ElementNode, file: any) {
    const postSlug = getPostSlug(file);
    const slugs = new Map<string, number>();

    visitElements(tree, (node) => {
      if (!/^h[2-6]$/.test(node.tagName ?? "")) return;
      const id =
        typeof node.properties?.id === "string"
          ? node.properties.id
          : slugify(textContent(node));
      const count = slugs.get(id) ?? 0;
      slugs.set(id, count + 1);
      const uniqueId = count > 0 ? `${id}-${count}` : id;
      node.properties = {
        ...node.properties,
        id: getHeadingAnchor(postSlug, uniqueId),
      };
    });
  };
}
