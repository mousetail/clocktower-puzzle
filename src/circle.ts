import { el } from "./dom.ts";
import { playerLabel, statusClass } from "./format.ts";
import { reminderById } from "./reminders.ts";
import type { ReminderState } from "./reminderState.ts";
import type { PlayerInfo } from "./types.ts";

export type CircleCallbacks = {
  onSelect: (player: number) => void;
  onHover: (player: number | null) => void;
  onAddReminder: (player: number) => void;
  onRemoveReminder: (player: number, id: string) => void;
};

const RADIUS_PERCENT = 42;

export class CircleView {
  private readonly root: HTMLElement;
  private readonly callbacks: CircleCallbacks;
  private readonly tokens = new Map<number, HTMLElement>();
  private readonly chips = new Map<number, HTMLElement>();

  constructor(players: readonly PlayerInfo[], callbacks: CircleCallbacks) {
    this.callbacks = callbacks;
    this.root = el("div", "circle");
    players.forEach((player, index) => {
      const number = index + 1;
      const token = el("div", "player-token");
      token.classList.add(`status-${statusClass(player.death_status)}`);
      token.append(buildTop(number, player));
      token.append(el("span", "player-role", player.role));

      const chips = el("div", "reminder-chips");
      token.append(chips);
      this.chips.set(number, chips);

      const add = el("button", "add-reminder", "+");
      add.type = "button";
      add.title = "Add reminder";
      add.addEventListener("click", (event) => {
        event.stopPropagation();
        callbacks.onAddReminder(number);
      });
      token.append(add);

      positionToken(token, index, players.length);
      token.addEventListener("click", () => callbacks.onSelect(number));
      token.addEventListener("mouseenter", () => callbacks.onHover(number));
      token.addEventListener("mouseleave", () => callbacks.onHover(null));
      this.tokens.set(number, token);
      this.root.append(token);
    });
  }

  get element(): HTMLElement {
    return this.root;
  }

  setHighlighted(selected: number | null, hovered: number | null): void {
    for (const [number, token] of this.tokens) {
      token.classList.toggle("selected", number === selected);
      token.classList.toggle("hovered", number === hovered);
    }
  }

  updateReminders(state: ReminderState): void {
    for (const [number, chips] of this.chips) {
      const elements: HTMLElement[] = [];
      for (const id of state.get(number)) {
        const reminder = reminderById(id);
        if (reminder === undefined) {
          continue;
        }
        const chip = el("span", "reminder-chip", reminder.short);
        chip.classList.add(`accent-${reminder.accent}`);
        chip.title = `Remove ${reminder.full}`;
        chip.addEventListener("click", (event) => {
          event.stopPropagation();
          this.callbacks.onRemoveReminder(number, id);
        });
        elements.push(chip);
      }
      chips.replaceChildren(...elements);
    }
  }
}

function buildTop(number: number, player: PlayerInfo): HTMLElement {
  const top = el("div", "player-top");
  top.append(el("span", "player-number", playerLabel(number)));
  top.append(el("span", "player-name", player.name));
  return top;
}

function positionToken(token: HTMLElement, index: number, total: number): void {
  const angle = -Math.PI / 2 + (index / total) * Math.PI * 2;
  token.style.left = `${(50 + RADIUS_PERCENT * Math.cos(angle)).toFixed(3)}%`;
  token.style.top = `${(50 + RADIUS_PERCENT * Math.sin(angle)).toFixed(3)}%`;
}
