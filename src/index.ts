import "./style.css";
import { CircleView } from "./circle.ts";
import { parseGame } from "./data.ts";
import { collectDeaths } from "./deaths.ts";
import { el } from "./dom.ts";
import { findGame, GAMES } from "./games.ts";
import type { GameEntry } from "./games.ts";
import { buildLegend } from "./legend.ts";
import { LabelToggle } from "./labelToggle.ts";
import { isLabelMode } from "./labels.ts";
import type { LabelMode } from "./labels.ts";
import { LogView } from "./log.ts";
import { buildMenu } from "./menu.ts";
import { buildNotice } from "./notice.ts";
import { PlayerInfoView } from "./playerInfo.ts";
import { ReminderPicker } from "./reminderPicker.ts";
import { remindersFor } from "./reminders.ts";
import { ReminderState } from "./reminderState.ts";
import { InfoLogState } from "./infoLogState.ts";
import type { InfoLogControls } from "./infoLogState.ts";
import { buildGlobalNotes } from "./globalNotes.ts";
import { PlayerNotesState } from "./notesState.ts";
import type { NotesControls } from "./notesState.ts";
import { readStorage, writeStorage } from "./storage.ts";
import type { PlayerTagHandlers } from "./playerTag.ts";
import { validateGame, validateTimeline } from "./validate.ts";
import { menuHash, startRouter } from "./router.ts";
import type { Route } from "./router.ts";

const LABEL_MODE_KEY = "clocktower.labelMode";

let cleanup: (() => void) | null = null;

function renderRoute(route: Route): void {
  cleanup?.();
  cleanup = null;
  document.body.replaceChildren();

  if (route.kind === "game") {
    const game = findGame(route.id);
    if (game === undefined) {
      renderNotFound(route.id);
      return;
    }
    cleanup = renderGame(game);
    return;
  }

  renderMenu();
}

function renderMenu(): void {
  document.title = "Blood on the Clocktower";
  document.body.append(buildMenu(GAMES));
}

function renderNotFound(id: string): void {
  document.title = "Puzzle not found";
  const main = el("main", "not-found");
  main.append(el("h1", "menu-title", "Puzzle not found"));
  main.append(el("p", "menu-subtitle", `No puzzle matches "${id}".`));
  const back = el("a", "back-link", "\u2190 All puzzles");
  back.href = menuHash();
  main.append(back);
  document.body.append(main);
}

function renderGame(game: GameEntry): () => void {
  document.title = game.name;

  const data = parseGame(game.data);
  const deaths = collectDeaths(data.timeline, data.players.length);
  const issues = [
    ...data.dataIssues,
    ...validateGame(data.players, deaths),
    ...validateTimeline(data.timeline),
  ];

  for (const issue of issues) {
    console.error(`[${issue.severity}] ${issue.message}`);
  }

  const key = (suffix: string): string => `clocktower.${game.id}.${suffix}`;
  const REMINDERS_KEY = key("reminders");
  const INFO_LOG_KEY = key("infoLog");
  const NOTES_KEY = key("notes");
  const GLOBAL_NOTES_KEY = key("globalNotes");

  const storedMode = readStorage(LABEL_MODE_KEY);
  let labelMode: LabelMode =
    storedMode !== null && isLabelMode(storedMode) ? storedMode : "number";

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

  const infoLogState = InfoLogState.fromJson(readStorage(INFO_LOG_KEY));
  const infoLogControls: InfoLogControls = {
    isShown: (player) => infoLogState.has(player),
    onToggle: (player) => {
      infoLogState.toggle(player);
      writeStorage(INFO_LOG_KEY, infoLogState.serialize());
      renderLog();
      refresh();
    },
  };

  const playerNotes = PlayerNotesState.fromJson(readStorage(NOTES_KEY));
  const notesControls: NotesControls = {
    get: (player) => playerNotes.get(player),
    onChange: (player, text) => {
      playerNotes.set(player, text);
      writeStorage(NOTES_KEY, playerNotes.serialize());
    },
  };

  const infoView = new PlayerInfoView(
    data.players,
    handlers,
    infoLogControls,
    notesControls,
  );
  let picker: ReminderPicker | null = null;

  const circleView = new CircleView(data.players, {
    onSelect: (player) => {
      selected = selected === player ? null : player;
      refresh();
    },
    onHover: (player) => {
      hovered = player;
      refresh();
    },
    onAddReminder: (player) =>
      picker?.open(player, data.players[player - 1].name),
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
      data.players[shown - 1],
      remindersFor(reminderState.get(shown)),
    );
  }

  const stage = el("div", "stage");
  stage.append(circleView.element, infoView.element);

  const board = el("main", "board");
  board.append(stage);

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
      new LogView(data.timeline, data.players, deaths, handlers, infoLogState)
        .element,
    );
  }

  renderLog();

  const logPanel = el("section", "panel log-panel");
  logPanel.append(el("h2", "panel-title", "Game log"), logBody);

  const globalNotes = buildGlobalNotes(readStorage(GLOBAL_NOTES_KEY) ?? "", {
    onChange: (text) => writeStorage(GLOBAL_NOTES_KEY, text),
  });

  const railHeader = el("header", "rail-header");
  const back = el("a", "back-link", "\u2190 All puzzles");
  back.href = menuHash();
  railHeader.append(back, el("h1", "rail-title", game.name));
  if (game.edition !== undefined) {
    railHeader.append(el("p", "rail-edition", game.edition));
  }

  const leftSidebar = el("aside", "sidebar");
  leftSidebar.append(
    railHeader,
    buildNotice(game.edition),
    globalNotes,
    buildLegend(),
  );

  const rightSidebar = el("aside", "sidebar");
  rightSidebar.append(toolbar, logPanel);

  const app = el("div", "app");
  app.append(leftSidebar, board, rightSidebar);

  document.body.append(app, picker.element);

  circleView.updateReminders(reminderState);
  refresh();

  return () => picker?.destroy();
}

startRouter(renderRoute);
