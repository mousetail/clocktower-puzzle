import type {
  DeathEvent,
  DeathStatus,
  LogEntry,
  PlayerInfo,
  ValidationIssue,
} from "./types.ts";
import { describeEvent, describeStatus } from "./format.ts";

export function validateGame(
  players: readonly PlayerInfo[],
  deaths: Map<number, DeathEvent[]>,
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  players.forEach((player, index) => {
    validatePlayer(index + 1, player.death_status, deaths.get(index + 1) ?? [], issues);
  });
  return issues;
}

function validatePlayer(
  number: number,
  status: DeathStatus,
  events: readonly DeathEvent[],
  issues: ValidationIssue[],
): void {
  const first = events[0];
  if (status === "alive") {
    if (first !== undefined) {
      issues.push({
        player: number,
        severity: "error",
        message: `P${number} is marked alive, but the log records a ${describeEvent(first)}.`,
      });
    }
    return;
  }
  if (first === undefined) {
    issues.push({
      player: number,
      severity: "error",
      message: `P${number} is marked dead (${describeStatus(status)}), but the log records no matching death.`,
    });
    return;
  }
  if (!matches(first, status)) {
    issues.push({
      player: number,
      severity: "error",
      message: `P${number}'s death status (${describeStatus(status)}) does not match the first death in the log (${describeEvent(first)}).`,
    });
  }
}

function matches(event: DeathEvent, status: DeathStatus): boolean {
  if (status === "alive") {
    return false;
  }
  if (status.cause === "demon") {
    return (
      event.phase === "night" && event.cause === "demon" && event.night === status.night
    );
  }
  return (
    event.phase === "day" && event.cause === status.cause && event.day === status.day
  );
}

/** A player killed by the witch must have nominated on the same day. */
export function validateTimeline(timeline: readonly LogEntry[]): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  for (const entry of timeline) {
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
  }
  return issues;
}
