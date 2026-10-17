import { el, replaceChildren } from "./dom.ts";
import {
  describeInformationWhen,
  describeReminderWhen,
  describeStatus,
  playerLabel,
  statusClass,
} from "./format.ts";
import { buildPlayerText } from "./playerTag.ts";
import type { PlayerTagHandlers } from "./playerTag.ts";
import type { InfoLogControls } from "./infoLogState.ts";
import type { NotesControls } from "./notesState.ts";
import { reminderById } from "./reminders/index.ts";
import type { ReminderEntry } from "./reminderState.ts";
import type { PlayerInfo } from "./types.ts";

export type ReminderControls = {
  onRemove: (player: number, entry: ReminderEntry) => void;
};

export class PlayerInfoView {
  private readonly root: HTMLElement;
  private readonly players: readonly PlayerInfo[];
  private readonly handlers: PlayerTagHandlers;
  private readonly infoLog: InfoLogControls;
  private readonly notes: NotesControls;
  private readonly reminders: ReminderControls;
  private readonly edition: string | undefined;

  constructor(
    players: readonly PlayerInfo[],
    handlers: PlayerTagHandlers,
    infoLog: InfoLogControls,
    notes: NotesControls,
    reminders: ReminderControls,
    edition?: string,
  ) {
    this.players = players;
    this.handlers = handlers;
    this.infoLog = infoLog;
    this.notes = notes;
    this.reminders = reminders;
    this.edition = edition;
    this.root = el("div", "player-info");
    this.render(null, undefined, []);
  }

  get element(): HTMLElement {
    return this.root;
  }

  show(
    number: number | null,
    player: PlayerInfo | undefined,
    reminders: readonly ReminderEntry[],
  ): void {
    this.render(number, player, reminders);
  }

  private render(
    number: number | null,
    player: PlayerInfo | undefined,
    reminders: readonly ReminderEntry[],
  ): void {
    if (number === null || player === undefined) {
      replaceChildren(
        this.root,
        el("p", "info-hint", demonHint(this.edition)),
      );
      return;
    }
    const children: HTMLElement[] = [
      buildHeader(number, player),
      buildStatus(player),
      buildRole(player),
    ];
    if (player.information.length > 0) {
      children.push(buildInfoLogToggle(number, this.infoLog));
      children.push(this.buildInformation(player));
    }
    if (reminders.length > 0) {
      children.push(buildReminders(number, reminders, this.reminders));
    }
    children.push(buildNotes(number, this.notes));
    replaceChildren(this.root, ...children);
  }

  private buildInformation(player: PlayerInfo): HTMLElement {
    const section = el("div", "info-section");
    section.append(el("div", "info-section-title", "Information"));
    const list = el("ul", "info-list");
    for (const entry of player.information) {
      const item = el("li", "info-item");
      item.append(el("span", "info-when", describeInformationWhen(entry)));
      if (typeof entry.information === "number") {
        item.append(el("span", "info-value", entry.information));
      } else {
        item.append(
          buildPlayerText(entry.information, this.players, this.handlers),
        );
      }
      list.append(item);
    }
    section.append(list);
    return section;
  }
}

function demonHint(edition: string): string {
  if (edition === "Bad Moon Rising") {
    return (
      "Exactly one living or dead player is the demon."
    );
  }
  return "Exactly one of the 3 living players is the demon.";
}

function buildHeader(number: number, player: PlayerInfo): HTMLElement {
  const header = el("div", "info-header");
  header.append(el("span", "info-number", playerLabel(number)));
  header.append(el("span", "info-name", player.name));
  return header;
}

function buildRole(player: PlayerInfo): HTMLElement {
  const row = el("div", "info-row");
  row.append(el("span", "info-label", "Claim"));
  row.append(el("span", "info-value", player.role));
  return row;
}

function buildStatus(player: PlayerInfo): HTMLElement {
  const row = el("div", "info-row");
  row.classList.add(`status-${statusClass(player.death_status)}`);
  row.append(el("span", "info-label", "Status"));
  row.append(el("span", "info-value", describeStatus(player.death_status)));
  return row;
}

function buildInfoLogToggle(
  number: number,
  infoLog: InfoLogControls,
): HTMLElement {
  const label = el("label", "info-toggle");
  const checkbox = el("input", "info-toggle-checkbox");
  checkbox.type = "checkbox";
  checkbox.checked = infoLog.isShown(number);
  checkbox.addEventListener("change", () => infoLog.onToggle(number));
  label.append(checkbox, el("span", "info-toggle-text", "Show in log"));
  return label;
}

function buildNotes(number: number, notes: NotesControls): HTMLElement {
  const section = el("div", "info-section");
  section.append(el("div", "info-section-title", "Notes"));
  const area = el("textarea", "info-notes");
  area.value = notes.get(number);
  area.placeholder = "Notes…";
  area.rows = 3;
  area.addEventListener("input", () => notes.onChange(number, area.value));
  section.append(area);
  return section;
}

function buildReminders(
  number: number,
  entries: readonly ReminderEntry[],
  controls: ReminderControls,
): HTMLElement {
  const section = el("div", "info-section");
  section.append(el("div", "info-section-title", "Reminders"));
  const list = el("ul", "info-list");
  for (const entry of entries) {
    const reminder = reminderById(entry.id);
    if (reminder === undefined) {
      continue;
    }
    const item = el("li", "info-item reminder-item");
    item.classList.add(`accent-${reminder.accent}`);
    item.append(el("span", "reminder-text", reminder.full));
    if (entry.when !== undefined) {
      item.append(
        el("span", "reminder-when", describeReminderWhen(entry.when)),
      );
    }
    item.title = `Remove ${reminder.full}`;
    item.addEventListener("click", () => controls.onRemove(number, entry));
    list.append(item);
  }
  section.append(list);
  return section;
}
