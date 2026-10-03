export class ReminderState {
  private readonly byPlayer = new Map<number, Set<string>>();

  get(player: number): string[] {
    return [...(this.byPlayer.get(player) ?? [])];
  }

  has(player: number, id: string): boolean {
    return this.byPlayer.get(player)?.has(id) ?? false;
  }

  add(player: number, id: string): void {
    const set = this.byPlayer.get(player) ?? new Set<string>();
    set.add(id);
    this.byPlayer.set(player, set);
  }

  toggle(player: number, id: string): void {
    const set = this.byPlayer.get(player) ?? new Set<string>();
    if (set.has(id)) {
      set.delete(id);
    } else {
      set.add(id);
    }
    if (set.size === 0) {
      this.byPlayer.delete(player);
    } else {
      this.byPlayer.set(player, set);
    }
  }

  clear(): void {
    this.byPlayer.clear();
  }

  serialize(): string {
    const entries: [number, string[]][] = [];
    for (const [player, ids] of this.byPlayer) {
      entries.push([player, [...ids]]);
    }
    return JSON.stringify(entries);
  }

  static fromJson(json: string | null): ReminderState {
    const state = new ReminderState();
    if (json === null || json === "") {
      return state;
    }
    let stored: [number, string[]][];
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
      const ids = entry[1];
      if (typeof player !== "number" || !Array.isArray(ids)) {
        continue;
      }
      for (const id of ids) {
        if (typeof id === "string") {
          state.add(player, id);
        }
      }
    }
    return state;
  }
}
