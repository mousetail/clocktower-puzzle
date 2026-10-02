import type { DeathEvent, DeathStatus, InformationEntry } from "./types.ts";

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
  if (status.cause === "demon") {
    return `Killed by the demon on night ${status.night}`;
  }
  if (status.cause === "witch") {
    return `Killed by the witch on day ${status.day}`;
  }
  return `Executed on day ${status.day}`;
}

export function describeEvent(event: DeathEvent): string {
  if (event.phase === "night") {
    return `demon kill on night ${event.night}`;
  }
  if (event.cause === "witch") {
    return `witch death on day ${event.day}`;
  }
  return `execution on day ${event.day}`;
}

export function describeInformationWhen(entry: InformationEntry): string {
  return "night" in entry ? `Night ${entry.night}` : `Day ${entry.day}`;
}
