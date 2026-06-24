import type { MarkdownHeading } from "@/content";

const HEADING_LINE_HEIGHT = 1.25;
const ITEM_GAP = 0.375;
const INDENT_STEP = 1;
const BASE_DOT_X = 0.4;
const LINK_GAP = 0.85;
const SVG_SCALE = 100;

function formatRem(value: number): string {
  return `${Number(value.toFixed(3))}rem`;
}

function dotSize(depth: number): number {
  if (depth <= 2) return 0.45;
  if (depth === 3) return 0.36;
  return 0.28;
}

function dotX(depth: number): number {
  return BASE_DOT_X + (depth - 2) * INDENT_STEP;
}

export function buildOutlineItems(toc: MarkdownHeading[] = []) {
  const headings = toc.filter(
    (h) => h.depth >= 2 && h.depth <= 6 && h.text !== "Footnotes",
  );

  return headings.map((h, index) => {
    const next = headings[index + 1];
    const size = dotSize(h.depth);
    const x = dotX(h.depth);
    const nextSize = next ? dotSize(next.depth) : size;
    const nextX = next ? dotX(next.depth) : x;
    const connectorHeight =
      HEADING_LINE_HEIGHT + ITEM_GAP - (size + nextSize) / 2;
    const connectorLeft = Math.min(x, nextX);
    const connectorWidth = Math.abs(nextX - x);
    const svgWidth = Math.max(connectorWidth, 0.001) * SVG_SCALE;
    const svgHeight = connectorHeight * SVG_SCALE;
    const startX = (x - connectorLeft) * SVG_SCALE;
    const endX = (nextX - connectorLeft) * SVG_SCALE;

    return {
      ...h,
      dotSize: formatRem(size),
      dotX: formatRem(x),
      paddingStart: formatRem(x + LINK_GAP),
      connector: next
        ? {
            sameDepth: h.depth === next.depth,
            left: formatRem(connectorLeft),
            width: formatRem(connectorWidth),
            height: formatRem(connectorHeight),
            viewBox: `0 0 ${svgWidth} ${svgHeight}`,
            path: `M ${startX} 0 C ${startX} ${svgHeight * 0.45}, ${endX} ${svgHeight * 0.55}, ${endX} ${svgHeight}`,
          }
        : null,
    };
  });
}
