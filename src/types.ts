export type InformationEntry =
  | { day: number; information: string | number }
  | { night: number; information: string | number };

export type DeathStatus =
  | "alive"
  | { cause: "demon"; night: number }
  | { cause: "witch" | "execution"; day: number };

export type PlayerInfo = {
  name: string;
  role: string;
  information: InformationEntry[];
  death_status: DeathStatus;
};

export type DeathCause = "demon" | "witch" | "execution";

export type NightDeathEvent = {
  phase: "night";
  cause: "demon";
  night: number;
  repeat: boolean;
};

export type DayDeathEvent = {
  phase: "day";
  cause: "witch" | "execution";
  day: number;
  repeat: boolean;
};

export type DeathEvent = NightDeathEvent | DayDeathEvent;

export type DayLogEntry = {
  kind: "day";
  day: number;
  night: number;
  deaths_at_night: number[];
  nominated: number[];
  voted: number[];
  executed: number[];
  witch_deaths: number[];
};

export type NightLogEntry = {
  kind: "night";
  night: number;
  deaths_at_night: number[];
};

export type LogEntry = DayLogEntry | NightLogEntry;

export type IssueSeverity = "error" | "warning";

export type ValidationIssue = {
  player: number | null;
  severity: IssueSeverity;
  message: string;
};

export type ParsedGame = {
  players: PlayerInfo[];
  timeline: LogEntry[];
  dataIssues: ValidationIssue[];
};
