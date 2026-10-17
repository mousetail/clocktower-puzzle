import type { ReminderDraft } from "./types.ts";

/** Tokens specific to the Trouble Brewing edition. */
export const TROUBLE_BREWING_REMINDERS: readonly ReminderDraft[] = [
  {
    id: "imp",
    full: "Imp",
    short: "Imp",
    category: "demon",
    parent: "demon",
  },
  {
    id: "poisoner",
    full: "Poisoner",
    short: "Poisoner",
    category: "minion",
    parent: "minion",
  },
  {
    id: "baron",
    full: "Baron",
    short: "Baron",
    category: "minion",
    parent: "minion",
  },
  {
    id: "spy",
    full: "Spy",
    short: "Spy",
    category: "minion",
    parent: "minion",
  },
  {
    id: "scarlet-woman",
    full: "Scarlet Woman",
    short: "Scarlet Woman",
    category: "minion",
    parent: "minion",
  },
  {
    id: "the-drunk",
    full: "The Drunk",
    short: "Drunk",
    category: "droisoning",
    parent: "poisoned",
  },
];
