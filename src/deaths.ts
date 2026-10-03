import type { DeathEvent, LogEntry } from "./types.ts";

/** Chronological order key: night N precedes day N. */
export function nightOrder(night: number): number {
  return night * 2 - 1;
}

export function dayOrder(day: number): number {
  return day * 2;
}

export function phaseOrder(event: DeathEvent): number {
  return event.phase === "night"
    ? nightOrder(event.night)
    : dayOrder(event.day);
}

export function collectDeaths(
  timeline: readonly LogEntry[],
  playerCount: number,
): Map<number, DeathEvent[]> {
  const deaths = new Map<number, DeathEvent[]>();
  for (let player = 1; player <= playerCount; player++) {
    deaths.set(player, []);
  }
  for (const entry of timeline) {
    for (const player of entry.deaths_at_night) {
      append(deaths, player, {
        phase: "night",
        cause: "demon",
        night: entry.night,
        repeat: false,
      });
    }
    if (entry.kind === "day") {
      for (const player of entry.executed) {
        append(deaths, player, {
          phase: "day",
          cause: "execution",
          day: entry.day,
          repeat: false,
        });
      }
      for (const player of entry.witch_deaths) {
        append(deaths, player, {
          phase: "day",
          cause: "witch",
          day: entry.day,
          repeat: false,
        });
      }
    }
  }
  for (const events of deaths.values()) {
    events.sort((a, b) => phaseOrder(a) - phaseOrder(b));
    events.forEach((event, index) => {
      event.repeat = index > 0;
    });
  }
  return deaths;
}

function append(
  deaths: Map<number, DeathEvent[]>,
  player: number,
  event: DeathEvent,
): void {
  const events = deaths.get(player);
  if (events === undefined) {
    deaths.set(player, [event]);
  } else {
    events.push(event);
  }
}
