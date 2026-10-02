export class ReminderState {
  private readonly byPlayer = new Map<number, Set<string>>();

  get(player: number): string[] {
    return [...(this.byPlayer.get(player) ?? [])];
  }

  has(player: number, id: string): boolean {
    return this.byPlayer.get(player)?.has(id) ?? false;
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
}
