import "./style.css";
import gameData from "./game.json";
import { CircleView } from "./circle.ts";
import { parseGame } from "./data.ts";
import { collectDeaths } from "./deaths.ts";
import { el } from "./dom.ts";
import { buildLegend } from "./legend.ts";
import { LogView } from "./log.ts";
import { buildNotice } from "./notice.ts";
import { PlayerInfoView } from "./playerInfo.ts";
import { ReminderPicker } from "./reminderPicker.ts";
import { remindersFor } from "./reminders.ts";
import { ReminderState } from "./reminderState.ts";
import { validateGame } from "./validate.ts";

const game = parseGame(gameData);
const deaths = collectDeaths(game.timeline, game.players.length);
const issues = [...game.dataIssues, ...validateGame(game.players, deaths)];

for (const issue of issues) {
  console.error(`[${issue.severity}] ${issue.message}`);
}

const reminderState = new ReminderState();
let selected: number | null = null;
let hovered: number | null = null;

const infoView = new PlayerInfoView();
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
  onAddReminder: (player) => picker?.open(player, game.players[player - 1].name),
  onRemoveReminder: removeReminder,
});

picker = new ReminderPicker(reminderState, () => {
  circleView.updateReminders(reminderState);
  refresh();
});

function removeReminder(player: number, id: string): void {
  reminderState.toggle(player, id);
  circleView.updateReminders(reminderState);
  refresh();
}

function refresh(): void {
  const shown = hovered ?? selected;
  circleView.setHighlighted(selected, hovered);
  if (shown === null) {
    infoView.show(null, undefined, []);
    return;
  }
  infoView.show(shown, game.players[shown - 1], remindersFor(reminderState.get(shown)));
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
  refresh();
});

const toolbar = el("div", "sidebar-toolbar");
toolbar.append(clearButton);

const logPanel = el("section", "panel log-panel");
logPanel.append(el("h2", "panel-title", "Game log"));
logPanel.append(new LogView(game.timeline, game.players, deaths).element);

const sidebar = el("aside", "sidebar");
sidebar.append(toolbar, logPanel);

const app = el("div", "app");
app.append(board, sidebar);
document.body.append(app, buildLegend(), buildNotice(), picker.element);

refresh();
