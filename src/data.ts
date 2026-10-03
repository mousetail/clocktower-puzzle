import type {
  DayLogEntry,
  DeathStatus,
  InformationEntry,
  LogEntry,
  NightLogEntry,
  ParsedGame,
  PlayerInfo,
  ValidationIssue,
} from "./types.ts";

type RawInformation = {
  day?: number;
  night?: number;
  information?: string | number;
};

type RawDeathStatus = string | { cause?: string; night?: number; day?: number };

type RawPlayer = {
  name: string;
  role: string;
  information?: readonly RawInformation[];
  death_status?: RawDeathStatus;
};

export type RawLogEntry = {
  day?: number;
  night?: number;
  deaths_at_night?: number | readonly number[];
  nominated?: readonly number[];
  voted?: readonly number[];
  executed?: readonly number[];
  witch_deaths?: readonly number[];
};

export type RawGameData = {
  players: readonly RawPlayer[];
  timeline: readonly RawLogEntry[];
};

export function parseGame(raw: RawGameData): ParsedGame {
  const dataIssues: ValidationIssue[] = [];
  const players = raw.players.map((player, index) =>
    parsePlayer(player, index + 1, dataIssues),
  );
  const timeline = raw.timeline.map(parseLogEntry);
  return { players, timeline, dataIssues };
}

function parsePlayer(
  raw: RawPlayer,
  number: number,
  issues: ValidationIssue[],
): PlayerInfo {
  if (raw.role === undefined) {
    issues.push({
      player: number,
      severity: "warning",
      message: `P${number} (${raw.name}) has no role defined.`,
    });
  }
  return {
    name: raw.name,
    role: raw.role ?? "Unknown",
    information: parseInformation(raw.information ?? [], number, issues),
    death_status: parseDeathStatus(raw.death_status, number, issues),
  };
}

function parseInformation(
  raw: readonly RawInformation[],
  player: number,
  issues: ValidationIssue[],
): InformationEntry[] {
  const result: InformationEntry[] = [];
  for (const item of raw) {
    if (item.information === undefined) {
      issues.push({
        player,
        severity: "warning",
        message: `P${player} has an information entry without a value.`,
      });
    } else if (item.night !== undefined) {
      result.push({ night: item.night, information: item.information });
    } else if (item.day !== undefined) {
      result.push({ day: item.day, information: item.information });
    } else {
      issues.push({
        player,
        severity: "warning",
        message: `P${player} has an information entry without a day or night.`,
      });
    }
  }
  return result;
}

function parseDeathStatus(
  raw: RawDeathStatus | undefined,
  player: number,
  issues: ValidationIssue[],
): DeathStatus {
  if (raw === undefined) {
    issues.push({
      player,
      severity: "warning",
      message: `P${player} has no death status; treating as alive.`,
    });
    return "alive";
  }
  if (raw === "alive") {
    return "alive";
  }
  if (typeof raw === "string") {
    issues.push({
      player,
      severity: "warning",
      message: `P${player} has an unrecognized death status "${raw}".`,
    });
    return "alive";
  }
  if (raw.cause === "demon" && raw.night !== undefined) {
    return { cause: "demon", night: raw.night };
  }
  if (
    (raw.cause === "witch" || raw.cause === "execution") &&
    raw.day !== undefined
  ) {
    return { cause: raw.cause, day: raw.day };
  }
  issues.push({
    player,
    severity: "warning",
    message: `P${player} has a death status with a missing or unknown cause.`,
  });
  return "alive";
}

function parseLogEntry(raw: RawLogEntry): LogEntry {
  const deaths = toNumbers(raw.deaths_at_night);
  if (raw.day !== undefined) {
    const entry: DayLogEntry = {
      kind: "day",
      day: raw.day,
      night: raw.night ?? raw.day,
      deaths_at_night: deaths,
      nominated: toIds(raw.nominated),
      voted: toIds(raw.voted),
      executed: toIds(raw.executed),
      witch_deaths: toIds(raw.witch_deaths),
    };
    return entry;
  }
  const entry: NightLogEntry = {
    kind: "night",
    night: raw.night ?? 0,
    deaths_at_night: deaths,
  };
  return entry;
}

function toNumbers(value: number | readonly number[] | undefined): number[] {
  if (value === undefined) {
    return [];
  }
  if (typeof value === "number") {
    return [value];
  }
  return [...value];
}

function toIds(value: readonly number[] | undefined): number[] {
  return value === undefined ? [] : [...value];
}
