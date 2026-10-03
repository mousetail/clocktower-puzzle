export type ReminderAccent = "red" | "cyan" | "mustard" | "olive" | "rust";

export type Reminder = {
  id: string;
  full: string;
  short: string;
  accent: ReminderAccent;
};

export const REMINDERS: readonly Reminder[] = [
  // Demons
  { id: "demon", full: "Possible Demon", short: "Demon", accent: "red" },
  { id: "fang-gu", full: "Possible Fang Gu", short: "Fang Gu", accent: "red" },
  { id: "vortox", full: "Possible Vortox", short: "Vortox", accent: "red" },
  {
    id: "no-dashi",
    full: "Possible No Dashi",
    short: "No Dashi",
    accent: "red",
  },
  {
    id: "vigor-mortis",
    full: "Possible Vigor Mortis",
    short: "Vigor Mortis",
    accent: "red",
  },
  // Minions
  { id: "minion", full: "Possible Minion", short: "Minion", accent: "rust" },
  { id: "witch", full: "Possible Witch", short: "Witch", accent: "rust" },
  {
    id: "cerenovus",
    full: "Possible Cerenovus",
    short: "Cerenovus",
    accent: "rust",
  },
  { id: "pit-hag", full: "Possible Pit Hag", short: "Pit Hag", accent: "rust" },
  {
    id: "evil-twin",
    full: "Possible Evil Twin",
    short: "Evil Twin",
    accent: "rust",
  },
  // Reminders
  {
    id: "outsider",
    full: "Possible Outsider",
    short: "Outsider",
    accent: "cyan",
  },
  {
    id: "outsider",
    full: "Possible Former Outsider",
    short: "Former Outsider",
    accent: "cyan",
  },
  { id: "good-twin", full: "Good Twin", short: "Good Twin", accent: "cyan" },
  // Madness
  { id: "mad", full: "Possibly Mad", short: "Mad", accent: "olive" },
  { id: "mutant", full: "Possible Mutant", short: "Mutant", accent: "olive" },
  {
    id: "cerenovus-mad",
    full: "Possibly Ceremad",
    short: "Ceremand",
    accent: "olive",
  },
  // Droisoning
  {
    id: "poisoned",
    full: "Possibly Drunk or poisoned",
    short: "Droisoned",
    accent: "mustard",
  },
  {
    id: "no-dashi-poisoned",
    full: "Possibly No Dashi Poisoned",
    short: "No Dashi Poisoned",
    accent: "mustard",
  },
  {
    id: "sweetheart-drunk",
    full: "Possibly Sweetheart Drunk",
    short: "Sweetheart Drunk",
    accent: "mustard",
  },
  {
    id: "philosopher-drunk",
    full: "Possibly Philosopher Drunk",
    short: "Philodrunk",
    accent: "mustard",
  },
  {
    id: "vigormortis-poisoned",
    full: "Possibly Vigormortis Poisoned",
    short: "Vigormortis Poisoned",
    accent: "mustard",
  },
  // Other
  {
    id: "barber swapped",
    full: "Possibly Barber Swapped",
    short: "Barber Swapped",
    accent: "cyan",
  },
  {
    id: "vigor-killed-minion",
    full: "Possible Vigor Killed Minion",
    short: "Vigor Killed Minion",
    accent: "rust",
  },
  {
    id: "former-demon",
    full: "Possible Former Demon",
    short: "Former Demon",
    accent: "red",
  },
];

export function reminderById(id: string): Reminder | undefined {
  return REMINDERS.find((reminder) => reminder.id === id);
}

export function remindersFor(ids: readonly string[]): Reminder[] {
  const result: Reminder[] = [];
  for (const id of ids) {
    const reminder = reminderById(id);
    if (reminder !== undefined) {
      result.push(reminder);
    }
  }
  return result;
}
