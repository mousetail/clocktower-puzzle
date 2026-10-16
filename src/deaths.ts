import type { DeathEvent, LogEntry } from "./types.ts";

/** A night or day phase of the game log. */
export type LogPhase = {
  phase: "day" | "night";
  number: number;
};

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

/** Every night and day that appears in the timeline, in chronological order. */
export function collectPhases(timeline: readonly LogEntry[]): LogPhase[] {
  const phases: LogPhase[] = [];
  const seen = new Set<string>();
  const add = (phase: "day" | "night", number: number): void => {
    const key = `${phase}:${number}`;
    if (seen.has(key)) {
      return;
    }
    seen.add(key);
    phases.push({ phase, number });
  };
  for (const entry of timeline) {
    add("night", entry.night);
    if (entry.kind === "day") {
      add("day", entry.day);
    }
  }
  phases.sort((a, b) => phaseOrderOf(a) - phaseOrderOf(b));
  return phases;
}

function phaseOrderOf(phase: LogPhase): number {
  return phase.phase === "night"
    ? nightOrder(phase.number)
    : dayOrder(phase.number);
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
