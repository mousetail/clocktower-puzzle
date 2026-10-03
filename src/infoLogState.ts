export class InfoLogState {
  private readonly shown = new Set<number>();

  has(player: number): boolean {
    return this.shown.has(player);
  }

  toggle(player: number): void {
    if (this.shown.has(player)) {
      this.shown.delete(player);
    } else {
      this.shown.add(player);
    }
  }

  serialize(): string {
    return JSON.stringify([...this.shown]);
  }

  static fromJson(json: string | null): InfoLogState {
    const state = new InfoLogState();
    if (json === null || json === "") {
      return state;
    }
    let stored: number[];
    try {
      stored = JSON.parse(json);
    } catch {
      return state;
    }
    if (!Array.isArray(stored)) {
      return state;
    }
    for (const player of stored) {
      if (typeof player === "number") {
        state.shown.add(player);
      }
    }
    return state;
  }
}

export type InfoLogControls = {
  isShown: (player: number) => boolean;
  onToggle: (player: number) => void;
};
