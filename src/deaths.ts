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
        if (entry.survived_execution.includes(player)) {
          continue;
        }
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

/** Nights on which each player was resurrected, in chronological order. */
export function collectResurrections(
  timeline: readonly LogEntry[],
  playerCount: number,
): Map<number, number[]> {
  const resurrections = new Map<number, number[]>();
  for (let player = 1; player <= playerCount; player++) {
    resurrections.set(player, []);
  }
  for (const entry of timeline) {
    for (const player of entry.resurrected_at_night) {
      const nights = resurrections.get(player);
      if (nights === undefined) {
        resurrections.set(player, [entry.night]);
      } else {
        nights.push(entry.night);
      }
    }
  }
  for (const nights of resurrections.values()) {
    nights.sort((a, b) => a - b);
  }
  return resurrections;
}

/** A death or a resurrection, placed on the shared chronological timeline. */
type LifeMoment = { order: number; death: DeathEvent | null };

function lifeMoments(
  deaths: readonly DeathEvent[],
  resurrections: readonly number[],
): LifeMoment[] {
  const moments: LifeMoment[] = [];
  for (const death of deaths) {
    moments.push({ order: phaseOrder(death), death });
  }
  for (const night of resurrections) {
    moments.push({ order: nightOrder(night), death: null });
  }
  moments.sort((a, b) => a.order - b.order);
  return moments;
}

/**
 * The death a player is currently subject to, or null if they are alive. A
 * death only counts while the player is alive, so repeat deaths are ignored and
 * a later resurrection clears the death entirely.
 */
export function currentDeath(
  deaths: readonly DeathEvent[],
  resurrections: readonly number[],
): DeathEvent | null {
  let current: DeathEvent | null = null;
  for (const moment of lifeMoments(deaths, resurrections)) {
    if (moment.death === null) {
      current = null;
    } else if (current === null) {
      current = moment.death;
    }
  }
  return current;
}

/** Whether a player is dead immediately before the given chronological order. */
export function isDeadBefore(
  deaths: readonly DeathEvent[],
  resurrections: readonly number[],
  order: number,
): boolean {
  let dead = false;
  for (const moment of lifeMoments(deaths, resurrections)) {
    if (moment.order >= order) {
      break;
    }
    if (moment.death === null) {
      dead = false;
    } else if (!dead) {
      dead = true;
    }
  }
  return dead;
}
