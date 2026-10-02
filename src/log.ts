import { dayOrder, nightOrder } from "./deaths.ts";
import { el } from "./dom.ts";
import { playerLabel } from "./format.ts";
import type { DayLogEntry, DeathEvent, LogEntry, PlayerInfo } from "./types.ts";

export class LogView {
  private readonly root: HTMLElement;

  constructor(
    timeline: readonly LogEntry[],
    players: readonly PlayerInfo[],
    deaths: Map<number, DeathEvent[]>,
  ) {
    this.root = el("div", "log");
    for (const entry of timeline) {
      this.root.append(buildEntry(entry, players, deaths));
    }
  }

  get element(): HTMLElement {
    return this.root;
  }
}

function buildEntry(
  entry: LogEntry,
  players: readonly PlayerInfo[],
  deaths: Map<number, DeathEvent[]>,
): HTMLElement {
  const card = el("article", "log-entry");
  card.append(buildNight(entry.night, entry.deaths_at_night, players));
  if (entry.kind === "day") {
    card.append(buildDay(entry, players, deaths));
  }
  return card;
}

function buildNight(
  night: number,
  deathsAtNight: readonly number[],
  players: readonly PlayerInfo[],
): HTMLElement {
  const section = el("section", "log-phase log-night");
  section.append(el("h3", "phase-title", `Night ${night}`));
  section.append(buildPlayers("Deaths", deathsAtNight, players, "no deaths"));
  return section;
}

function buildDay(
  entry: DayLogEntry,
  players: readonly PlayerInfo[],
  deaths: Map<number, DeathEvent[]>,
): HTMLElement {
  const section = el("section", "log-phase log-day");
  section.append(el("h3", "phase-title", `Day ${entry.day}`));
  section.append(buildExecuted(entry, players, deaths));
  section.append(buildPlayers("Witch deaths", entry.witch_deaths, players, "none"));
  section.append(buildPlayers("Nominated", entry.nominated, players, "none"));
  section.append(buildPlayers("Voted", entry.voted, players, "none"));
  return section;
}

function buildExecuted(
  entry: DayLogEntry,
  players: readonly PlayerInfo[],
  deaths: Map<number, DeathEvent[]>,
): HTMLElement {
  const row = el("div", "log-row");
  row.append(el("span", "log-label", "Executed"));
  const value = el("span", "log-value");
  if (entry.executed.length === 0) {
    value.append(el("span", "log-empty", "none"));
  } else {
    for (const player of entry.executed) {
      const first = deaths.get(player)?.[0];
      const alreadyDead = first !== undefined && orderOf(first) < dayOrder(entry.day);
      value.append(buildTag(player, players, alreadyDead));
    }
  }
  row.append(value);
  return row;
}

function orderOf(event: DeathEvent): number {
  return event.phase === "night" ? nightOrder(event.night) : dayOrder(event.day);
}

function buildPlayers(
  label: string,
  ids: readonly number[],
  players: readonly PlayerInfo[],
  emptyText: string,
): HTMLElement {
  const row = el("div", "log-row");
  row.append(el("span", "log-label", label));
  const value = el("span", "log-value");
  if (ids.length === 0) {
    value.append(el("span", "log-empty", emptyText));
  } else {
    for (const id of ids) {
      value.append(buildTag(id, players, false));
    }
  }
  row.append(value);
  return row;
}

function buildTag(
  number: number,
  players: readonly PlayerInfo[],
  alreadyDead: boolean,
): HTMLElement {
  const tag = el("span", "player-tag", playerLabel(number));
  const name = players[number - 1]?.name;
  if (name !== undefined) {
    tag.title = name;
  }
  if (alreadyDead) {
    tag.classList.add("repeat");
    tag.append(el("span", "tag-note", "already dead"));
  }
  return tag;
}
