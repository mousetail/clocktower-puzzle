import type { ReminderDraft } from "./types.ts";

/** Tokens specific to the Trouble Brewing edition. */
export const TROUBLE_BREWING_REMINDERS: readonly ReminderDraft[] = [
  {
    id: "poisoner",
    full: "Possible Poisoner",
    short: "Poisoner",
    category: "minion",
  },
  {
    id: "baron",
    full: "Possible Baron",
    short: "Baron",
    category: "minion",
  },
  {
    id: "spy",
    full: "Possible Spy",
    short: "Spy",
    category: "minion",
  },
  {
    id: "scarlet-woman",
    full: "Possible Scarlet Woman",
    short: "Scarlet Woman",
    category: "minion",
  },
  {
    id: 'the-drunk',
    full: 'Possibly the Drunk',
    short: 'Drunk',
    category: 'droisoning'
  }
];
