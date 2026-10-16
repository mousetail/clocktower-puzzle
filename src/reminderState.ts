export type ReminderWhen = {
  phase: "day" | "night";
  number: number;
};

export type ReminderEntry = {
  id: string;
  when?: ReminderWhen;
};

function sameWhen(
  a: ReminderWhen | undefined,
  b: ReminderWhen | undefined,
): boolean {
  if (a === undefined || b === undefined) {
    return a === b;
  }
  return a.phase === b.phase && a.number === b.number;
}

function sameEntry(a: ReminderEntry, b: ReminderEntry): boolean {
  return a.id === b.id && sameWhen(a.when, b.when);
}

export class ReminderState {
  private readonly byPlayer = new Map<number, ReminderEntry[]>();

  get(player: number): ReminderEntry[] {
    return (this.byPlayer.get(player) ?? []).map((entry) => ({ ...entry }));
  }

  has(player: number, id: string, when?: ReminderWhen): boolean {
    return (this.byPlayer.get(player) ?? []).some(
      (entry) => entry.id === id && sameWhen(entry.when, when),
    );
  }

  add(player: number, entry: ReminderEntry): void {
    const list = this.byPlayer.get(player) ?? [];
    if (!list.some((existing) => sameEntry(existing, entry))) {
      list.push({ ...entry });
    }
    this.byPlayer.set(player, list);
  }

  remove(player: number, entry: ReminderEntry): void {
    const list = this.byPlayer.get(player);
    if (list === undefined) {
      return;
    }
    const next = list.filter((existing) => !sameEntry(existing, entry));
    if (next.length === 0) {
      this.byPlayer.delete(player);
    } else {
      this.byPlayer.set(player, next);
    }
  }

  toggle(player: number, entry: ReminderEntry): void {
    if (this.has(player, entry.id, entry.when)) {
      this.remove(player, entry);
    } else {
      this.add(player, entry);
    }
  }

  clear(): void {
    this.byPlayer.clear();
  }

  serialize(): string {
    const entries: [number, ReminderEntry[]][] = [];
    for (const [player, list] of this.byPlayer) {
      entries.push([player, list.map((entry) => ({ ...entry }))]);
    }
    return JSON.stringify(entries);
  }

  static fromJson(json: string | null): ReminderState {
    const state = new ReminderState();
    if (json === null || json === "") {
      return state;
    }
    let stored: unknown;
    try {
      stored = JSON.parse(json);
    } catch {
      return state;
    }
    if (!Array.isArray(stored)) {
      return state;
    }
    for (const entry of stored) {
      if (!Array.isArray(entry) || entry.length !== 2) {
        continue;
      }
      const player = entry[0];
      const list = entry[1];
      if (typeof player !== "number" || !Array.isArray(list)) {
        continue;
      }
      for (const item of list) {
        const parsed = parseEntry(item);
        if (parsed !== undefined) {
          state.add(player, parsed);
        }
      }
    }
    return state;
  }
}

/** Accepts both the current `{ id, when }` shape and the legacy bare id. */
function parseEntry(item: unknown): ReminderEntry | undefined {
  if (typeof item === "string") {
    return { id: item };
  }
  if (typeof item !== "object" || item === null) {
    return undefined;
  }
  const record = item as Record<string, unknown>;
  if (typeof record.id !== "string") {
    return undefined;
  }
  const when = parseWhen(record.when);
  return when === undefined ? { id: record.id } : { id: record.id, when };
}

function parseWhen(value: unknown): ReminderWhen | undefined {
  if (typeof value !== "object" || value === null) {
    return undefined;
  }
  const record = value as Record<string, unknown>;
  const phase = record.phase;
  const number = record.number;
  if ((phase === "day" || phase === "night") && typeof number === "number") {
    return { phase, number };
  }
  return undefined;
}
