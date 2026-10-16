import type { ReminderDraft } from "./types.ts";

/** Tokens that apply to every edition. */
export const GENERIC_REMINDERS: readonly ReminderDraft[] = [
  // Might be a particular character type
  { id: "demon", full: "Possible Demon", short: "Demon", category: "demon" },
  {
    id: "minion",
    full: "Possible Minion",
    short: "Minion",
    category: "minion",
  },
  {
    id: "outsider",
    full: "Possible Outsider",
    short: "Outsider",
    category: "outsider",
  },
  {
    id: "former-outsider",
    full: "Possible Former Outsider",
    short: "Former Outsider",
    category: "outsider",
  },
  {
    id: "former-demon",
    full: "Possible Former Demon",
    short: "Former Demon",
    category: "demon",
  },
  // Madness
  { id: "mad", full: "Possibly Mad", short: "Mad", category: "madness" },
  // Droisoning
  {
    id: "poisoned",
    full: "Possibly Drunk or poisoned",
    short: "Droisoned",
    category: "droisoning",
  },
];
