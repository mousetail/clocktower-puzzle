import { el } from "./dom.ts";
import { formatDate } from "./format.ts";
import type { GameEntry } from "./games.ts";
import { gameHash } from "./router.ts";

export function buildMenu(games: readonly GameEntry[]): HTMLElement {
  const main = el("main", "menu");
  main.append(el("h1", "menu-title", "Blood on the Clocktower"));
  main.append(el("p", "menu-subtitle", "Choose a puzzle to attempt"));

  if (games.length === 0) {
    main.append(el("p", "menu-empty", "No puzzles found."));
    return main;
  }

  const list = el("ul", "menu-list");
  for (const game of games) {
    list.append(buildItem(game));
  }
  main.append(list);
  return main;
}

function buildItem(game: GameEntry): HTMLElement {
  const item = el("li", "menu-item");
  const link = el("a", "menu-link");
  link.href = gameHash(game.id);
  link.append(el("span", "menu-game-name", game.name));
  link.append(el("span", "menu-game-meta", metaFor(game)));
  item.append(link);
  return item;
}

function metaFor(game: GameEntry): string {
  const parts: string[] = [];
  if (game.edition !== undefined) {
    parts.push(game.edition);
  }
  if (game.author !== undefined) {
    parts.push(`by ${game.author}`);
  }
  parts.push(`${game.data.players.length} players`);
  if (game.publicationDate !== undefined) {
    parts.push(formatDate(game.publicationDate));
  }
  return parts.join(" \u00b7 ");
}
