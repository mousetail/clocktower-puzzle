import type { ReminderDraft } from "./types.ts";

/** Tokens specific to the Sects and Violets edition. */
export const SECTS_AND_VIOLETS_REMINDERS: readonly ReminderDraft[] = [
  // Demons
  {
    id: "fang-gu",
    full: "Fang Gu",
    short: "Fang Gu",
    category: "demon",
    parent: "demon",
  },
  {
    id: "vortox",
    full: "Vortox",
    short: "Vortox",
    category: "demon",
    parent: "demon",
  },
  {
    id: "no-dashi",
    full: "No Dashi",
    short: "No Dashi",
    category: "demon",
    parent: "demon",
  },
  {
    id: "vigor-mortis",
    full: "Vigor Mortis",
    short: "Vigor Mortis",
    category: "demon",
    parent: "demon",
  },
  // Minions
  {
    id: "witch",
    full: "Witch",
    short: "Witch",
    category: "minion",
    parent: "minion",
  },
  {
    id: "cerenovus",
    full: "Cerenovus",
    short: "Cerenovus",
    category: "minion",
    parent: "minion",
  },
  {
    id: "pit-hag",
    full: "Pit Hag",
    short: "Pit Hag",
    category: "minion",
    parent: "minion",
  },
  {
    id: "evil-twin",
    full: "Evil Twin",
    short: "Evil Twin",
    category: "minion",
    parent: "minion",
  },
  {
    id: "vigor-killed-minion",
    full: "Vigor Killed Minion",
    short: "Vigor Killed Minion",
    category: "minion",
    parent: "minion",
  },
  // Outsiders
  {
    id: "good-twin",
    full: "Good Twin",
    short: "Good Twin",
    category: "outsider",
  },
  // Madness
  { id: "mad", full: "Mad", short: "Mad", category: "madness" },
  {
    id: "mutant",
    full: "Mutant",
    short: "Mutant",
    category: "madness",
    parent: "mad",
  },
  {
    id: "cerenovus-mad",
    full: "Ceremad",
    short: "Ceremand",
    category: "madness",
    parent: "mad",
  },
  // Droisoning
  {
    id: "no-dashi-poisoned",
    full: "No Dashi Poisoned",
    short: "No Dashi Poisoned",
    category: "droisoning",
    parent: "poisoned",
  },
  {
    id: "sweetheart-drunk",
    full: "Sweetheart Drunk",
    short: "Sweetheart Drunk",
    category: "droisoning",
    parent: "poisoned",
  },
  {
    id: "philosopher-drunk",
    full: "Philosopher Drunk",
    short: "Philodrunk",
    category: "droisoning",
    parent: "poisoned",
  },
  {
    id: "vigormortis-poisoned",
    full: "Vigormortis Poisoned",
    short: "Vigormortis Poisoned",
    category: "droisoning",
    parent: "poisoned",
  },
  // Other
  {
    id: "barber swapped",
    full: "Barber Swapped",
    short: "Barber Swapped",
    category: "other",
  },
];
