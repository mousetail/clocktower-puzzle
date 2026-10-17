import type { ReminderDraft } from "./types.ts";

/**
 * Tokens that apply to every edition. None of these have a `parent`, so each
 * one is a top-level entry in the picker (and a submenu when it has children).
 */
export const GENERIC_REMINDERS: readonly ReminderDraft[] = [
  { id: "demon", full: "Demon", short: "Demon", category: "demon" },
  { id: "minion", full: "Minion", short: "Minion", category: "minion" },
  {
    id: "outsider",
    full: "Outsider",
    short: "Outsider",
    category: "outsider",
  },
  {
    id: "former-outsider",
    full: "Former Outsider",
    short: "Former Outsider",
    category: "outsider",
  },
  {
    id: "former-demon",
    full: "Former Demon",
    short: "Former Demon",
    category: "demon",
  },
  {
    id: "poisoned",
    full: "Possibly Drunk or poisoned",
    short: "Droisoned",
    category: "droisoning",
  },
];
