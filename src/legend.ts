import { el } from "./dom.ts";

const ENTRIES: readonly { className: string; label: string }[] = [
  { className: "status-alive", label: "Alive" },
  { className: "status-dead", label: "Dead" },
];

export function buildLegend(): HTMLElement {
  const panel = el("section", "legend");
  const list = el("ul", "legend-list");
  for (const entry of ENTRIES) {
    const item = el("li", "legend-item");
    item.append(el("span", `legend-swatch ${entry.className}`));
    item.append(el("span", "legend-label", entry.label));
    list.append(item);
  }
  panel.append(list);
  return panel;
}
