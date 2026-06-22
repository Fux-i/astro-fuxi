import { getPostSlug } from "./post-slug";
import { getHeadingAnchor } from "./heading-anchors";

type ElementNode = {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: ElementNode[];
};

function visitElements(node: ElementNode, visit: (node: ElementNode) => void) {
  visit(node);
  for (const child of node.children ?? []) visitElements(child, visit);
}

function normalizeFootnoteIndex(value: string, prefix: string): string | null {
  return value.startsWith(prefix) ? value.slice(prefix.length) : null;
}

function scopedFootnoteRefId(postSlug: string, index: string): string {
  return getHeadingAnchor(postSlug, index);
}

function scopedFootnoteId(postSlug: string, index: string): string {
  return getHeadingAnchor(postSlug, `fn-${index}`);
}

function isFootnoteSection(node: ElementNode): boolean {
  return (
    node.tagName === "section" &&
    typeof node.properties === "object" &&
    node.properties !== null &&
    "dataFootnotes" in node.properties
  );
}

export default function rehypeFootnoteAnchors() {
  return function transformer(tree: ElementNode, file: any) {
    const postSlug = getPostSlug(file);

    visitElements(tree, (node) => {
      const properties = node.properties;
      if (!properties) return;

      if (isFootnoteSection(node)) {
        const heading = node.children?.find(
          (child) => child.tagName === "h2" && child.properties,
        );
        const id =
          typeof heading?.properties?.id === "string"
            ? heading.properties.id
            : getHeadingAnchor(postSlug, "footnote-label");
        properties.id = id;
        if (heading?.properties) delete heading.properties.id;
      }

      if (typeof properties.id === "string") {
        const refIndex = normalizeFootnoteIndex(
          properties.id,
          "user-content-fnref-",
        );
        if (refIndex) {
          properties.id = scopedFootnoteRefId(postSlug, refIndex);
        } else {
          const footnoteIndex = normalizeFootnoteIndex(
            properties.id,
            "user-content-fn-",
          );
          if (footnoteIndex) {
            properties.id = scopedFootnoteId(postSlug, footnoteIndex);
          }
        }
      }

      if (typeof properties.href === "string") {
        const refIndex = normalizeFootnoteIndex(
          properties.href,
          "#user-content-fnref-",
        );
        if (refIndex) {
          properties.href = `#${scopedFootnoteRefId(postSlug, refIndex)}`;
        } else {
          const footnoteIndex = normalizeFootnoteIndex(
            properties.href,
            "#user-content-fn-",
          );
          if (footnoteIndex) {
            properties.href = `#${scopedFootnoteId(postSlug, footnoteIndex)}`;
          }
        }
      }

      if (properties.ariaDescribedBy === "footnote-label") {
        properties.ariaDescribedBy = getHeadingAnchor(postSlug, "footnote-label");
      }
      if (properties["aria-describedby"] === "footnote-label") {
        properties["aria-describedby"] = getHeadingAnchor(
          postSlug,
          "footnote-label",
        );
      }
    });
  };
}
