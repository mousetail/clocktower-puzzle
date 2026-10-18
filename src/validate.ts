import type {
  DeathEvent,
  DeathStatus,
  LogEntry,
  PlayerInfo,
  ValidationIssue,
} from "./types.ts";
import { currentDeath, isDeadBefore, nightOrder } from "./deaths.ts";
import { describeEvent, describeStatus } from "./format.ts";

export function validateGame(
  players: readonly PlayerInfo[],
  deaths: Map<number, DeathEvent[]>,
  resurrections: Map<number, number[]>,
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  players.forEach((player, index) => {
    validatePlayer(
      index + 1,
      player.death_status,
      deaths.get(index + 1) ?? [],
      resurrections.get(index + 1) ?? [],
      issues,
    );
  });
  return issues;
}

function validatePlayer(
  number: number,
  status: DeathStatus,
  events: readonly DeathEvent[],
  resurrections: readonly number[],
  issues: ValidationIssue[],
): void {
  const current = currentDeath(events, resurrections);
  if (status === "alive") {
    if (current !== null) {
      issues.push({
        player: number,
        severity: "error",
        message: `P${number} is marked alive, but the log records a ${describeEvent(current)}.`,
      });
    }
    return;
  }
  if (current === null) {
    issues.push({
      player: number,
      severity: "error",
      message: `P${number} is marked dead (${describeStatus(status)}), but the log records no matching death.`,
    });
    return;
  }
  if (!matches(current, status)) {
    issues.push({
      player: number,
      severity: "error",
      message: `P${number}'s death status (${describeStatus(status)}) does not match the death in the log (${describeEvent(current)}).`,
    });
  }
}

function matches(event: DeathEvent, status: DeathStatus): boolean {
  if (status === "alive") {
    return false;
  }
  if (status.cause === "night-death") {
    return (
      event.phase === "night" &&
      event.cause === "night-death" &&
      event.night === status.night
    );
  }
  return (
    event.phase === "day" &&
    event.cause === status.cause &&
    event.day === status.day
  );
}

/** A player killed by the witch must have nominated on the same day. */
export function validateTimeline(
  timeline: readonly LogEntry[],
  deaths: Map<number, DeathEvent[]>,
  resurrections: Map<number, number[]>,
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  for (const entry of timeline) {
    for (const player of entry.resurrected_at_night) {
      if (
        !isDeadBefore(
          deaths.get(player) ?? [],
          resurrections.get(player) ?? [],
          nightOrder(entry.night),
        )
      ) {
        issues.push({
          player,
          severity: "error",
          message: `P${player} was resurrected on night ${entry.night} but was not dead at the time.`,
        });
      }
    }
    if (entry.kind !== "day") {
      continue;
    }
    for (const player of entry.witch_deaths) {
      if (!entry.nominated.includes(player)) {
        issues.push({
          player,
          severity: "error",
          message: `P${player} was killed by the witch on day ${entry.day} but did not nominate that day.`,
        });
      }
    }
    for (const player of entry.survived_execution) {
      if (!entry.executed.includes(player)) {
        issues.push({
          player,
          severity: "error",
          message: `P${player} survived execution on day ${entry.day} but was not executed that day.`,
        });
      }
    }
  }
  return issues;
}
