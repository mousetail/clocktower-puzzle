import { el } from "./dom.ts";
import { REMINDERS } from "./reminders.ts";
import type { ReminderState } from "./reminderState.ts";

export class ReminderPicker {
  private readonly overlay: HTMLElement;
  private readonly title: HTMLElement;
  private readonly list: HTMLElement;
  private readonly state: ReminderState;
  private readonly onChange: () => void;
  private player: number | null = null;

  constructor(state: ReminderState, onChange: () => void) {
    this.state = state;
    this.onChange = onChange;

    this.overlay = el("div", "modal-overlay");
    this.overlay.hidden = true;

    const modal = el("div", "modal");
    const header = el("div", "modal-header");
    this.title = el("h2", "modal-title");
    const close = el("button", "modal-close", "\u00d7");
    close.type = "button";
    close.addEventListener("click", () => this.close());
    header.append(this.title, close);

    this.list = el("ul", "reminder-options");
    modal.append(header, this.list);
    this.overlay.append(modal);

    this.overlay.addEventListener("click", (event) => {
      if (event.target === this.overlay) {
        this.close();
      }
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        this.close();
      }
    });
  }

  get element(): HTMLElement {
    return this.overlay;
  }

  open(player: number, name: string): void {
    this.player = player;
    this.title.textContent = `Reminders for P${player} ${name}`;
    this.renderList();
    this.overlay.hidden = false;
  }

  close(): void {
    this.player = null;
    this.overlay.hidden = true;
  }

  private renderList(): void {
    const player = this.player;
    if (player === null) {
      return;
    }
    const items: HTMLElement[] = [];
    for (const reminder of REMINDERS) {
      const item = el("li", "reminder-option-item");
      const button = el("button", "reminder-option", reminder.full);
      button.type = "button";
      button.classList.add(`accent-${reminder.accent}`);
      if (this.state.has(player, reminder.id)) {
        button.classList.add("active");
      }
      button.addEventListener("click", () => {
        this.state.toggle(player, reminder.id);
        this.onChange();
        this.close();
      });
      item.append(button);
      items.push(item);
    }
    this.list.replaceChildren(...items);
  }
}
