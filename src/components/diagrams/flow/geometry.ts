// Geometry for the SVG diagrams: text wrapping, node boxes, orthogonal edge routes,
// and the point lists that packets travel along. Units are viewBox pixels.

export type Point = [number, number];
export type Box = { x0: number; y0: number; x1: number; y1: number; cx: number; cy: number };

/** h = horizontal, v = vertical. "hvh"/"vhv" are Z-shapes; "hv"/"vh" are L-shapes. */
export type Route = "hvh" | "vhv" | "hv" | "vh";

export const LABEL_SIZE = 13;
export const SUB_SIZE = 12;
const LABEL_CHAR = 7.1; // average advance of Instrument Sans at 13px
const SUB_CHAR = 7.2; // Geist Mono at 12px
const PAD_X = 10;
const PAD_Y = 11;
const LABEL_LINE = 16;
const SUB_LINE = 15;

/** Greedy word wrap by an estimated character budget. */
export function wrap(text: string, maxChars: number): string[] {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(/\s+/)) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export type NodeShape = Box & {
  w: number;
  h: number;
  labelLines: string[];
  subLines: string[];
};

/** Lays out a node centered on (x, y) with width w; height follows the wrapped text. */
export function nodeShape(
  label: string,
  sublabel: string | undefined,
  x: number,
  y: number,
  w: number,
): NodeShape {
  const inner = w - PAD_X * 2;
  const labelLines = wrap(label, Math.floor(inner / LABEL_CHAR));
  const subLines = sublabel ? wrap(sublabel, Math.floor(inner / SUB_CHAR)) : [];
  const h =
    PAD_Y * 2 +
    labelLines.length * LABEL_LINE +
    (subLines.length ? 4 + subLines.length * SUB_LINE : 0);
  return {
    x0: x - w / 2,
    x1: x + w / 2,
    y0: y - h / 2,
    y1: y + h / 2,
    cx: x,
    cy: y,
    w,
    h,
    labelLines,
    subLines,
  };
}

/** Baselines for a node's text lines, top to bottom. */
export function textRows(shape: NodeShape) {
  const rows: { text: string; y: number; sub: boolean }[] = [];
  let y = shape.y0 + PAD_Y + LABEL_LINE - 4;
  for (const text of shape.labelLines) {
    rows.push({ text, y, sub: false });
    y += LABEL_LINE;
  }
  y += 4;
  for (const text of shape.subLines) {
    rows.push({ text, y: y - 2, sub: true });
    y += SUB_LINE;
  }
  return rows;
}

export function boxAround(boxes: Box[], pad: number, extraBottom = 0): Box {
  const x0 = Math.min(...boxes.map((b) => b.x0)) - pad;
  const y0 = Math.min(...boxes.map((b) => b.y0)) - pad;
  const x1 = Math.max(...boxes.map((b) => b.x1)) + pad;
  const y1 = Math.max(...boxes.map((b) => b.y1)) + pad + extraBottom;
  return { x0, y0, x1, y1, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2 };
}

/** Orthogonal route from box a to box b, leaving and entering through the facing sides. */
export function route(a: Box, b: Box, kind?: Route): Point[] {
  const dx = b.cx - a.cx;
  const dy = b.cy - a.cy;
  const r: Route = kind ?? (Math.abs(dx) >= Math.abs(dy) ? "hvh" : "vhv");
  const right = dx >= 0;
  const down = dy >= 0;
  switch (r) {
    case "hvh": {
      const s: Point = [right ? a.x1 : a.x0, a.cy];
      const e: Point = [right ? b.x0 : b.x1, b.cy];
      if (Math.abs(s[1] - e[1]) < 0.5) return [s, e];
      const mx = (s[0] + e[0]) / 2;
      return [s, [mx, s[1]], [mx, e[1]], e];
    }
    case "vhv": {
      const s: Point = [a.cx, down ? a.y1 : a.y0];
      const e: Point = [b.cx, down ? b.y0 : b.y1];
      if (Math.abs(s[0] - e[0]) < 0.5) return [s, e];
      const my = (s[1] + e[1]) / 2;
      return [s, [s[0], my], [e[0], my], e];
    }
    case "hv":
      return [
        [right ? a.x1 : a.x0, a.cy],
        [b.cx, a.cy],
        [b.cx, down ? b.y0 : b.y1],
      ];
    case "vh":
      return [
        [a.cx, down ? a.y1 : a.y0],
        [a.cx, b.cy],
        [right ? b.x0 : b.x1, b.cy],
      ];
  }
}

export function pathD(points: Point[]): string {
  return points.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join("");
}

/** Arrowhead at the last point, pointing along the last segment. */
export function arrowD(points: Point[], size = 6): string {
  const [x1, y1] = points[points.length - 2];
  const [x2, y2] = points[points.length - 1];
  const len = Math.hypot(x2 - x1, y2 - y1) || 1;
  const ux = (x2 - x1) / len;
  const uy = (y2 - y1) / len;
  const bx = x2 - ux * size;
  const by = y2 - uy * size;
  const px = -uy * size * 0.6;
  const py = ux * size * 0.6;
  return `M${bx + px} ${by + py}L${x2} ${y2}L${bx - px} ${by - py}`;
}

/** Midpoint of the longest segment: where edge labels and callouts sit. */
export function labelAnchor(points: Point[]): { x: number; y: number; vertical: boolean } {
  let best = 0;
  let bestLen = -1;
  for (let i = 0; i < points.length - 1; i++) {
    const len = Math.hypot(points[i + 1][0] - points[i][0], points[i + 1][1] - points[i][1]);
    if (len > bestLen) {
      bestLen = len;
      best = i;
    }
  }
  const [ax, ay] = points[best];
  const [bx, by] = points[best + 1];
  return { x: (ax + bx) / 2, y: (ay + by) / 2, vertical: Math.abs(bx - ax) < Math.abs(by - ay) };
}

/** Keyframes for a packet travelling the route at constant speed. */
export function packetKeyframes(points: Point[]) {
  const lengths = points
    .slice(1)
    .map((p, i) => Math.hypot(p[0] - points[i][0], p[1] - points[i][1]));
  const total = lengths.reduce((a, b) => a + b, 0) || 1;
  let acc = 0;
  const times = [0, ...lengths.map((l) => (acc += l) / total)];
  return { x: points.map((p) => p[0]), y: points.map((p) => p[1]), times, length: total };
}
