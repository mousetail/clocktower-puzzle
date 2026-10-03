import { el } from "./dom.ts";
import { tagLabel } from "./labels.ts";
import type { LabelMode } from "./labels.ts";
import type { PlayerInfo } from "./types.ts";

export type HighlightHandler = (player: number | null) => void;
export type SelectHandler = (player: number) => void;

export type PlayerTagHandlers = {
  onHighlight: HighlightHandler;
  onSelect: SelectHandler;
  getLabelMode: () => LabelMode;
};

export function buildPlayerTag(
  number: number,
  players: readonly PlayerInfo[],
  handlers: PlayerTagHandlers,
): HTMLElement {
  const tag = el(
    "span",
    "player-tag",
    tagLabel(number, players, handlers.getLabelMode()),
  );
  const player = players[number - 1];
  if (player !== undefined) {
    tag.title = player.name;
    if (player.death_status === "alive") {
      tag.classList.add("tag-alive");
    }
  }
  tag.addEventListener("mouseenter", () => handlers.onHighlight(number));
  tag.addEventListener("mouseleave", () => handlers.onHighlight(null));
  tag.addEventListener("click", () => handlers.onSelect(number));
  return tag;
}

/** Renders text, turning `P<number>` references into player badges. */
export function buildPlayerText(
  text: string,
  players: readonly PlayerInfo[],
  handlers: PlayerTagHandlers,
): HTMLElement {
  const container = el("span", "player-text");
  const pattern = /P\d+/g;
  let lastIndex = 0;
  let match = pattern.exec(text);
  while (match !== null) {
    if (match.index > lastIndex) {
      container.append(text.slice(lastIndex, match.index));
    }
    const number = Number(match[0].slice(1));
    container.append(buildPlayerTag(number, players, handlers));
    lastIndex = match.index + match[0].length;
    match = pattern.exec(text);
  }
  if (lastIndex < text.length) {
    container.append(text.slice(lastIndex));
  }
  return container;
}
