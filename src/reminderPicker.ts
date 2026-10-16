import type { LogPhase } from "./deaths.ts";
import { el } from "./dom.ts";
import { describeReminderWhen } from "./format.ts";
import { CATEGORY_LABELS, remindersForEdition } from "./reminders/index.ts";
import type { ReminderCategory } from "./reminders/index.ts";
import type { ReminderState, ReminderWhen } from "./reminderState.ts";

export class ReminderPicker {
  private readonly overlay: HTMLElement;
  private readonly title: HTMLElement;
  private readonly whenToggle: HTMLElement;
  private readonly list: HTMLElement;
  private readonly state: ReminderState;
  private readonly edition: string | undefined;
  private readonly onChange: () => void;
  private readonly whenButtons = new Map<string, HTMLButtonElement>();
  private player: number | null = null;
  private when: ReminderWhen | null = null;
  private readonly onKeydown = (event: KeyboardEvent): void => {
    if (event.key === "Escape") {
      this.close();
    }
  };

  constructor(
    state: ReminderState,
    edition: string | undefined,
    phases: readonly LogPhase[],
    onChange: () => void,
  ) {
    this.state = state;
    this.edition = edition;
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

    this.whenToggle = el("div", "label-toggle when-toggle");
    this.addWhenOption("None", null);
    for (const phase of phases) {
      this.addWhenOption(describeReminderWhen(phase), phase);
    }

    this.list = el("ul", "reminder-options");
    modal.append(
      header,
      el("div", "when-label", "When"),
      this.whenToggle,
      this.list,
    );
    this.overlay.append(modal);

    this.overlay.addEventListener("click", (event) => {
      if (event.target === this.overlay) {
        this.close();
      }
    });
    document.addEventListener("keydown", this.onKeydown);
  }

  get element(): HTMLElement {
    return this.overlay;
  }

  destroy(): void {
    document.removeEventListener("keydown", this.onKeydown);
  }

  open(player: number, name: string): void {
    this.player = player;
    this.title.textContent = `Reminders for P${player} ${name}`;
    this.when = null;
    this.updateWhenButtons();
    this.renderList();
    this.overlay.hidden = false;
  }

  close(): void {
    this.player = null;
    this.overlay.hidden = true;
  }

  private addWhenOption(label: string, when: ReminderWhen | null): void {
    const button = el("button", "label-option", label);
    button.type = "button";
    button.addEventListener("click", () => {
      this.when = when;
      this.updateWhenButtons();
      this.renderList();
    });
    this.whenButtons.set(whenKey(when), button);
    this.whenToggle.append(button);
  }

  private updateWhenButtons(): void {
    const active = whenKey(this.when);
    for (const [key, button] of this.whenButtons) {
      button.classList.toggle("active", key === active);
    }
  }

  private renderList(): void {
    const player = this.player;
    if (player === null) {
      return;
    }
    const when = this.when ?? undefined;
    const items: HTMLElement[] = [];
    let category: ReminderCategory | null = null;
    for (const reminder of remindersForEdition(this.edition)) {
      if (reminder.category !== category) {
        category = reminder.category;
        const header = el(
          "li",
          "reminder-category",
          CATEGORY_LABELS[reminder.category],
        );
        header.classList.add(`accent-${reminder.accent}`);
        items.push(header);
      }
      const item = el("li", "reminder-option-item");
      const button = el("button", "reminder-option", reminder.full);
      button.type = "button";
      button.classList.add(`accent-${reminder.accent}`);
      if (this.state.has(player, reminder.id, when)) {
        button.classList.add("active");
      }
      button.addEventListener("click", () => {
        this.state.toggle(player, { id: reminder.id, when });
        this.onChange();
        this.close();
      });
      item.append(button);
      items.push(item);
    }
    this.list.replaceChildren(...items);
  }
}

function whenKey(when: ReminderWhen | null): string {
  return when === null ? "none" : `${when.phase}:${when.number}`;
}
