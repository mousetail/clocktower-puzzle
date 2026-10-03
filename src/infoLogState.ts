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
}

export type InfoLogControls = {
  isShown: (player: number) => boolean;
  onToggle: (player: number) => void;
};
