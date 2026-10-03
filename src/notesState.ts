export class PlayerNotesState {
  private readonly byPlayer = new Map<number, string>();

  get(player: number): string {
    return this.byPlayer.get(player) ?? "";
  }

  set(player: number, text: string): void {
    if (text === "") {
      this.byPlayer.delete(player);
    } else {
      this.byPlayer.set(player, text);
    }
  }

  serialize(): string {
    return JSON.stringify([...this.byPlayer]);
  }

  static fromJson(json: string | null): PlayerNotesState {
    const state = new PlayerNotesState();
    if (json === null || json === "") {
      return state;
    }
    let stored: [number, string][];
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
      const text = entry[1];
      if (typeof player === "number" && typeof text === "string") {
        state.set(player, text);
      }
    }
    return state;
  }
}

export type NotesControls = {
  get: (player: number) => string;
  onChange: (player: number, text: string) => void;
};
