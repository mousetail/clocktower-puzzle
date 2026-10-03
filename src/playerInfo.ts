import { el, replaceChildren } from "./dom.ts";
import {
  describeInformationWhen,
  describeStatus,
  playerLabel,
  statusClass,
} from "./format.ts";
import { buildPlayerText } from "./playerTag.ts";
import type { PlayerTagHandlers } from "./playerTag.ts";
import type { InfoLogControls } from "./infoLogState.ts";
import type { Reminder } from "./reminders.ts";
import type { PlayerInfo } from "./types.ts";

export class PlayerInfoView {
  private readonly root: HTMLElement;
  private readonly players: readonly PlayerInfo[];
  private readonly handlers: PlayerTagHandlers;
  private readonly infoLog: InfoLogControls;

  constructor(
    players: readonly PlayerInfo[],
    handlers: PlayerTagHandlers,
    infoLog: InfoLogControls,
  ) {
    this.players = players;
    this.handlers = handlers;
    this.infoLog = infoLog;
    this.root = el("div", "player-info");
    this.render(null, undefined, []);
  }

  get element(): HTMLElement {
    return this.root;
  }

  show(
    number: number | null,
    player: PlayerInfo | undefined,
    reminders: readonly Reminder[],
  ): void {
    this.render(number, player, reminders);
  }

  private render(
    number: number | null,
    player: PlayerInfo | undefined,
    reminders: readonly Reminder[],
  ): void {
    if (number === null || player === undefined) {
      replaceChildren(
        this.root,
        el(
          "p",
          "info-hint",
          "Exactly one of the 3 living players is the demon.",
        ),
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
      children.push(buildReminders(reminders));
    }
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

function buildReminders(reminders: readonly Reminder[]): HTMLElement {
  const section = el("div", "info-section");
  section.append(el("div", "info-section-title", "Reminders"));
  const list = el("ul", "info-list");
  for (const reminder of reminders) {
    const item = el("li", "info-item", reminder.full);
    item.classList.add(`accent-${reminder.accent}`);
    list.append(item);
  }
  section.append(list);
  return section;
}
