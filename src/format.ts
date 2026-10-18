import type { DeathEvent, DeathStatus, InformationEntry } from "./types.ts";
import type { ReminderWhen } from "./reminderState.ts";

/** Human-readable labels shared by the views. */
export function playerLabel(number: number): string {
  return `P${number}`;
}

export function statusClass(status: DeathStatus): string {
  return status === "alive" ? "alive" : "dead";
}

export function describeStatus(status: DeathStatus): string {
  if (status === "alive") {
    return "Alive";
  }
  if (status.cause === "night-death") {
    return `Killed during night ${status.night}`;
  }
  if (status.cause === "witch") {
    return `Killed by the witch on day ${status.day}`;
  }
  return `Executed on day ${status.day}`;
}

export function describeEvent(event: DeathEvent): string {
  if (event.phase === "night") {
    return `night death on night ${event.night}`;
  }
  if (event.cause === "witch") {
    return `witch death on day ${event.day}`;
  }
  return `execution on day ${event.day}`;
}

export function describeInformationWhen(entry: InformationEntry): string {
  return "night" in entry ? `Night ${entry.night}` : `Day ${entry.day}`;
}

export function describeReminderWhen(when: ReminderWhen): string {
  return when.phase === "night" ? `Night ${when.number}` : `Day ${when.number}`;
}

/** Formats an ISO 8601 calendar date (YYYY-MM-DD) for display, in UTC. */
export function formatDate(value: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (match === null) {
    return value;
  }
  const date = new Date(
    Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])),
  );
  return new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
