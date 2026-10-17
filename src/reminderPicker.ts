import type { LogPhase } from "./deaths.ts";
import { el } from "./dom.ts";
import { describeReminderWhen } from "./format.ts";
import { remindersForEdition } from "./reminders/index.ts";
import type { Reminder } from "./reminders/index.ts";
import type {
  ReminderEntry,
  ReminderState,
  ReminderWhen,
} from "./reminderState.ts";

export class ReminderPicker {
  private readonly overlay: HTMLElement;
  private readonly title: HTMLElement;
  private readonly whenToggle: HTMLElement;
  private readonly menu: HTMLElement;
  private readonly state: ReminderState;
  private readonly edition: string | undefined;
  private readonly onChange: () => void;
  private readonly whenButtons = new Map<string, HTMLButtonElement>();
  private player: number | null = null;
  private when: ReminderWhen | null = null;
  private openParent: string | null = null;
  private openGeneric: ReminderEntry | null = null;
  private openGenericCreated = false;
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

    this.menu = el("div", "reminder-menu");
    modal.append(
      header,
      el("div", "when-label", "When"),
      this.whenToggle,
      this.menu,
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
    this.openParent = null;
    this.openGeneric = null;
    this.openGenericCreated = false;
    this.updateWhenButtons();
    this.renderList();
    this.overlay.hidden = false;
  }

  close(): void {
    this.player = null;
    this.openParent = null;
    this.openGeneric = null;
    this.openGenericCreated = false;
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
    const reminders = remindersForEdition(this.edition);

    const childrenByParent = new Map<string, Reminder[]>();
    for (const reminder of reminders) {
      if (reminder.parent === undefined) {
        continue;
      }
      const list = childrenByParent.get(reminder.parent) ?? [];
      list.push(reminder);
      childrenByParent.set(reminder.parent, list);
    }

    const menus: HTMLElement[] = [];
    const plain: HTMLElement[] = [];
    for (const reminder of reminders) {
      if (reminder.parent !== undefined) {
        continue;
      }
      const submenu = childrenByParent.get(reminder.id);
      if (submenu === undefined || submenu.length === 0) {
        plain.push(this.buildTopLevelOption(reminder, player, when));
      } else {
        menus.push(this.buildMenu(reminder, submenu, player, when));
      }
    }
    this.menu.replaceChildren(...menus, ...plain);
  }

  /**
   * A top-level token that has children: clicking it adds the generic token and
   * unfolds its submenu to the right.
   */
  private buildMenu(
    parent: Reminder,
    reminders: readonly Reminder[],
    player: number,
    when: ReminderWhen | undefined,
  ): HTMLElement {
    const item = el("div", "reminder-category-item");
    if (this.openParent === parent.id) {
      item.classList.add("open");
    }
    const button = el("button", "reminder-category-button", parent.full);
    button.type = "button";
    button.classList.add(`accent-${parent.accent}`);
    button.append(el("span", "reminder-chevron", "\u203a"));
    item.append(button);

    const replace = this.openParent === parent.id ? this.openGeneric : null;
    const submenu = el("div", "reminder-submenu");
    submenu.append(this.buildGenericOption(parent));
    for (const reminder of reminders) {
      submenu.append(this.buildOption(reminder, player, when, replace));
    }
    item.append(submenu);

    button.addEventListener("click", () => {
      if (this.openParent === parent.id) {
        // Confirm the generic and collapse.
        this.openParent = null;
        this.openGeneric = null;
        this.openGenericCreated = false;
        this.renderList();
        return;
      }
      // Drop the generic preview from the previously open menu.
      if (this.openGeneric !== null && this.openGenericCreated) {
        this.state.remove(player, this.openGeneric);
      }
      const entry: ReminderEntry = { id: parent.id, when };
      this.openGenericCreated = !this.state.has(player, parent.id, when);
      this.state.add(player, entry);
      this.openGeneric = entry;
      this.openParent = parent.id;
      this.onChange();
      this.renderList();
    });
    return item;
  }

  /** A top-level token with no children: a plain button that toggles it. */
  private buildTopLevelOption(
    reminder: Reminder,
    player: number,
    when: ReminderWhen | undefined,
  ): HTMLElement {
    const button = el("button", "reminder-category-button", reminder.full);
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
    return button;
  }

  /** The generic top-level option; clicking it confirms the preview. */
  private buildGenericOption(reminder: Reminder): HTMLElement {
    const button = el("button", "reminder-option", reminder.full);
    button.type = "button";
    button.classList.add(`accent-${reminder.accent}`);
    button.classList.add("active");
    button.addEventListener("click", () => this.close());
    return button;
  }

  private buildOption(
    reminder: Reminder,
    player: number,
    when: ReminderWhen | undefined,
    replace: ReminderEntry | null,
  ): HTMLElement {
    const button = el("button", "reminder-option", reminder.full);
    button.type = "button";
    button.classList.add(`accent-${reminder.accent}`);
    if (this.state.has(player, reminder.id, when)) {
      button.classList.add("active");
    }
    button.addEventListener("click", () => {
      if (replace !== null) {
        this.state.remove(player, replace);
      }
      this.state.toggle(player, { id: reminder.id, when });
      this.onChange();
      this.close();
    });
    return button;
  }
}

function whenKey(when: ReminderWhen | null): string {
  return when === null ? "none" : `${when.phase}:${when.number}`;
}
