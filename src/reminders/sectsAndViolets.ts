import type { ReminderDraft } from "./types.ts";

/** Tokens specific to the Sects and Violets edition. */
export const SECTS_AND_VIOLETS_REMINDERS: readonly ReminderDraft[] = [
  // Demons
  {
    id: "fang-gu",
    full: "Possible Fang Gu",
    short: "Fang Gu",
    category: "demon",
  },
  { id: "vortox", full: "Possible Vortox", short: "Vortox", category: "demon" },
  {
    id: "no-dashii",
    full: "Possible No Dashii",
    short: "No Dashii",
    category: "demon",
  },
  {
    id: "vigor-mortis",
    full: "Possible Vigormortis",
    short: "Vigormortis",
    category: "demon",
  },
  // Minions
  { id: "witch", full: "Possible Witch", short: "Witch", category: "minion" },
  {
    id: "cerenovus",
    full: "Possible Cerenovus",
    short: "Cerenovus",
    category: "minion",
  },
  {
    id: "pit-hag",
    full: "Possible Pit Hag",
    short: "Pit Hag",
    category: "minion",
  },
  {
    id: "evil-twin",
    full: "Possible Evil Twin",
    short: "Evil Twin",
    category: "minion",
  },
  {
    id: "vigor-killed-minion",
    full: "Possible Vigor Killed Minion",
    short: "Vigor Killed Minion",
    category: "minion",
  },
  // Outsiders
  {
    id: "good-twin",
    full: "Good Twin",
    short: "Good Twin",
    category: "outsider",
  },
  // Madness
  {
    id: "mutant",
    full: "Possible Mutant",
    short: "Mutant",
    category: "madness",
  },
  {
    id: "cerenovus-mad",
    full: "Possibly Ceremad",
    short: "Ceremand",
    category: "madness",
  },
  // Droisoning
  {
    id: "no-dashi-poisoned",
    full: "Possibly No Dashi Poisoned",
    short: "No Dashi Poisoned",
    category: "droisoning",
  },
  {
    id: "sweetheart-drunk",
    full: "Possibly Sweetheart Drunk",
    short: "Sweetheart Drunk",
    category: "droisoning",
  },
  {
    id: "philosopher-drunk",
    full: "Possibly Philosopher Drunk",
    short: "Philodrunk",
    category: "droisoning",
  },
  {
    id: "vigormortis-poisoned",
    full: "Possibly Vigormortis Poisoned",
    short: "Vigormortis Poisoned",
    category: "droisoning",
  },
  // Other
  {
    id: "barber swapped",
    full: "Possibly Barber Swapped",
    short: "Barber Swapped",
    category: "other",
  },
];
