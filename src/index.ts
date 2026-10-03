import "./style.css";
import gameData from "./game.json";
import { CircleView } from "./circle.ts";
import { parseGame } from "./data.ts";
import { collectDeaths } from "./deaths.ts";
import { el } from "./dom.ts";
import { buildLegend } from "./legend.ts";
import { LabelToggle } from "./labelToggle.ts";
import { isLabelMode } from "./labels.ts";
import type { LabelMode } from "./labels.ts";
import { LogView } from "./log.ts";
import { buildNotice } from "./notice.ts";
import { PlayerInfoView } from "./playerInfo.ts";
import { ReminderPicker } from "./reminderPicker.ts";
import { remindersFor } from "./reminders.ts";
import { ReminderState } from "./reminderState.ts";
import { InfoLogState } from "./infoLogState.ts";
import type { InfoLogControls } from "./infoLogState.ts";
import { readStorage, writeStorage } from "./storage.ts";
import type { PlayerTagHandlers } from "./playerTag.ts";
import { validateGame, validateTimeline } from "./validate.ts";

const game = parseGame(gameData);
const deaths = collectDeaths(game.timeline, game.players.length);
const issues = [
  ...game.dataIssues,
  ...validateGame(game.players, deaths),
  ...validateTimeline(game.timeline),
];

for (const issue of issues) {
  console.error(`[${issue.severity}] ${issue.message}`);
}

const REMINDERS_KEY = "clocktower.reminders";
const LABEL_MODE_KEY = "clocktower.labelMode";

const storedMode = readStorage(LABEL_MODE_KEY);
let labelMode: LabelMode = storedMode !== null && isLabelMode(storedMode) ? storedMode : "number";

const reminderState = ReminderState.fromJson(readStorage(REMINDERS_KEY));
let selected: number | null = null;
let hovered: number | null = null;

function saveReminders(): void {
  writeStorage(REMINDERS_KEY, reminderState.serialize());
}

const handlers: PlayerTagHandlers = {
  onHighlight: highlightPlayer,
  onSelect: selectPlayer,
  getLabelMode: () => labelMode,
};

const infoLogState = new InfoLogState();
const infoLogControls: InfoLogControls = {
  isShown: (player) => infoLogState.has(player),
  onToggle: (player) => {
    infoLogState.toggle(player);
    renderLog();
    refresh();
  },
};

const infoView = new PlayerInfoView(game.players, handlers, infoLogControls);
let picker: ReminderPicker | null = null;

const circleView = new CircleView(game.players, {
  onSelect: (player) => {
    selected = selected === player ? null : player;
    refresh();
  },
  onHover: (player) => {
    hovered = player;
    refresh();
  },
  onAddReminder: (player) =>
    picker?.open(player, game.players[player - 1].name),
  onRemoveReminder: removeReminder,
});

picker = new ReminderPicker(reminderState, () => {
  circleView.updateReminders(reminderState);
  saveReminders();
  refresh();
});

function removeReminder(player: number, id: string): void {
  reminderState.toggle(player, id);
  circleView.updateReminders(reminderState);
  saveReminders();
  refresh();
}

function highlightPlayer(player: number | null): void {
  circleView.setExternalHighlight(player);
}

function selectPlayer(player: number): void {
  selected = player;
  refresh();
}

function refresh(): void {
  const shown = hovered ?? selected;
  circleView.setHighlighted(selected, hovered);
  if (shown === null) {
    infoView.show(null, undefined, []);
    return;
  }
  infoView.show(
    shown,
    game.players[shown - 1],
    remindersFor(reminderState.get(shown)),
  );
}

const stage = el("div", "stage");
stage.append(circleView.element, infoView.element);

const board = el("main", "board");
board.append(el("h1", "board-title", "Blood on the Clocktower"), stage);

const clearButton = el("button", "clear-reminders", "Remove all reminders");
clearButton.type = "button";
clearButton.addEventListener("click", () => {
  reminderState.clear();
  circleView.updateReminders(reminderState);
  saveReminders();
  refresh();
});

const toolbar = el("div", "sidebar-toolbar");

const labelToggle = new LabelToggle((mode) => {
  labelMode = mode;
  writeStorage(LABEL_MODE_KEY, mode);
  renderLog();
  refresh();
});
labelToggle.setMode(labelMode);
toolbar.append(labelToggle.element, clearButton);

const logBody = el("div", "log-body");

function renderLog(): void {
  logBody.replaceChildren(
    new LogView(game.timeline, game.players, deaths, handlers, infoLogState)
      .element,
  );
}

renderLog();

const logPanel = el("section", "panel log-panel");
logPanel.append(el("h2", "panel-title", "Game log"), logBody);

const sidebar = el("aside", "sidebar");
sidebar.append(toolbar, logPanel);

const app = el("div", "app");
app.append(board, sidebar);
document.body.append(app, buildLegend(), buildNotice(), picker.element);

circleView.updateReminders(reminderState);
refresh();
