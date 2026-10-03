import { dayOrder, nightOrder } from "./deaths.ts";
import { el } from "./dom.ts";
import { buildPlayerTag, buildPlayerText } from "./playerTag.ts";
import type { PlayerTagHandlers } from "./playerTag.ts";
import type { InfoLogState } from "./infoLogState.ts";
import type { DayLogEntry, DeathEvent, LogEntry, PlayerInfo } from "./types.ts";

type LogContext = {
  players: readonly PlayerInfo[];
  deaths: Map<number, DeathEvent[]>;
  handlers: PlayerTagHandlers;
  infoLog: InfoLogState;
};

export class LogView {
  private readonly root: HTMLElement;

  constructor(
    timeline: readonly LogEntry[],
    players: readonly PlayerInfo[],
    deaths: Map<number, DeathEvent[]>,
    handlers: PlayerTagHandlers,
    infoLog: InfoLogState,
  ) {
    const context: LogContext = { players, deaths, handlers, infoLog };
    this.root = el("div", "log");
    for (const entry of timeline) {
      this.root.append(buildEntry(entry, context));
    }
  }

  get element(): HTMLElement {
    return this.root;
  }
}

function buildEntry(entry: LogEntry, context: LogContext): HTMLElement {
  const card = el("article", "log-entry");
  card.append(buildNight(entry.night, entry.deaths_at_night, context));
  if (entry.kind === "day") {
    card.append(buildDay(entry, context));
  }
  return card;
}

function buildNight(
  night: number,
  deathsAtNight: readonly number[],
  context: LogContext,
): HTMLElement {
  const section = el("section", "log-phase log-night");
  section.append(el("h3", "phase-title", `Night ${night}`));
  section.append(buildPlayers("Deaths", deathsAtNight, context, "no deaths"));
  section.append(...buildInfoRows("night", night, context));
  return section;
}

function buildDay(entry: DayLogEntry, context: LogContext): HTMLElement {
  const section = el("section", "log-phase log-day");
  section.append(el("h3", "phase-title", `Day ${entry.day}`));
  section.append(buildExecuted(entry, context));
  section.append(buildNominated(entry, context));
  section.append(buildPlayers("Voted", entry.voted, context, "none"));
  section.append(...buildInfoRows("day", entry.day, context));
  return section;
}

function buildInfoRows(
  phase: "night" | "day",
  number: number,
  context: LogContext,
): HTMLElement[] {
  const rows: HTMLElement[] = [];
  context.players.forEach((player, index) => {
    const playerNumber = index + 1;
    if (!context.infoLog.has(playerNumber)) {
      return;
    }
    for (const entry of player.information) {
      const matches =
        phase === "night"
          ? "night" in entry && entry.night === number
          : "day" in entry && entry.day === number;
      if (matches) {
        rows.push(
          buildInfoRow(playerNumber, player.role, entry.information, context),
        );
      }
    }
  });
  return rows;
}

function buildInfoRow(
  player: number,
  role: string,
  information: string | number,
  context: LogContext,
): HTMLElement {
  const row = el("div", "log-row");
  const label = el("span", "log-label log-info-label", `${role}:`);
  label.addEventListener("click", () => context.handlers.onSelect(player));
  if (typeof information === "number") {
    row.append(label, el("span", "log-value", information));
  } else {
    row.append(
      label,
      buildPlayerText(information, context.players, context.handlers),
    );
  }
  return row;
}

function buildExecuted(entry: DayLogEntry, context: LogContext): HTMLElement {
  const row = el("div", "log-row");
  row.append(el("span", "log-label", "Executed"));
  const value = el("span", "log-value");
  if (entry.executed.length === 0) {
    value.append(el("span", "log-empty", "none"));
  } else {
    for (const player of entry.executed) {
      const first = context.deaths.get(player)?.[0];
      const alreadyDead =
        first !== undefined && orderOf(first) < dayOrder(entry.day);
      const tag = buildPlayerTag(player, context.players, context.handlers);
      if (alreadyDead) {
        tag.classList.add("repeat");
        tag.append(el("span", "tag-note", "already dead"));
      }
      value.append(tag);
    }
  }
  row.append(value);
  return row;
}

function buildNominated(entry: DayLogEntry, context: LogContext): HTMLElement {
  const row = el("div", "log-row");
  row.append(el("span", "log-label", "Nominated"));
  const value = el("span", "log-value");
  if (entry.nominated.length === 0) {
    value.append(el("span", "log-empty", "none"));
  } else {
    for (const player of entry.nominated) {
      const tag = buildPlayerTag(player, context.players, context.handlers);
      if (entry.witch_deaths.includes(player)) {
        tag.append(el("span", "tag-note", "witch death"));
      }
      value.append(tag);
    }
  }
  row.append(value);
  return row;
}

function buildPlayers(
  label: string,
  ids: readonly number[],
  context: LogContext,
  emptyText: string,
): HTMLElement {
  const row = el("div", "log-row");
  row.append(el("span", "log-label", label));
  const value = el("span", "log-value");
  if (ids.length === 0) {
    value.append(el("span", "log-empty", emptyText));
  } else {
    for (const id of ids) {
      value.append(buildPlayerTag(id, context.players, context.handlers));
    }
  }
  row.append(value);
  return row;
}

function orderOf(event: DeathEvent): number {
  return event.phase === "night"
    ? nightOrder(event.night)
    : dayOrder(event.day);
}
