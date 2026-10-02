export type ReminderAccent = "red" | "cyan";

export type Reminder = {
  id: string;
  full: string;
  short: string;
  accent: ReminderAccent;
};

export const REMINDERS: readonly Reminder[] = [
  { id: "demon", full: "Possible Demon", short: "Demon", accent: "red" },
  { id: "fang-gu", full: "Possible Fang Gu", short: "Fang Gu", accent: "red" },
  { id: "vortox", full: "Possible Vortox", short: "Vortox", accent: "red" },
  { id: "no-dashi", full: "Possible No Dashi", short: "No Dashi", accent: "red" },
  { id: "vigor-mortis", full: "Possible Vigor Mortis", short: "Vigor Mortis", accent: "red" },
  { id: "minion", full: "Possible Minion", short: "Minion", accent: "red" },
  { id: "witch", full: "Possible Witch", short: "Witch", accent: "red" },
  { id: "cerenovus", full: "Possible Cerenovus", short: "Cerenovus", accent: "red" },
  { id: "pit-hag", full: "Possible Pit Hag", short: "Pit Hag", accent: "red" },
  { id: "evil-twin", full: "Possible Evil Twin", short: "Evil Twin", accent: "red" },
  { id: "outsider", full: "Possible Outsider", short: "Outsider", accent: "cyan" },
  { id: "mutant", full: "Possible Mutant", short: "Mutant", accent: "cyan" },
  { id: "no-dashi-poisoned", full: "Possibly No Dashi Poisoned", short: "No Dashi Poisoned", accent: "cyan" },
  { id: "sweetheart-drunk", full: "Possibly Sweetheart Drunk", short: "Sweetheart Drunk", accent: "cyan" },
  { id: "vigormortis-poisoned", full: "Possibly Vigormortis Poisoned", short: "Vigormortis Poisoned", accent: "cyan" },
  { id: "vigor-mortis-poisoned", full: "Possibly Vigor Mortis Poisoned", short: "Vigor Mortis Poisoned", accent: "cyan" },
  { id: "vigor-killed-minion", full: "Possible Vigor Killed Minion", short: "Vigor Killed Minion", accent: "cyan" },
  { id: "former-demon", full: "Possible Former Demon", short: "Former Demon", accent: "cyan" },
  { id: "good-twin", full: "Good Twin", short: "Good Twin", accent: "cyan" },
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
