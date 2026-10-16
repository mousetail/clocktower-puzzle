export type ReminderCategory =
  | "demon"
  | "minion"
  | "outsider"
  | "madness"
  | "droisoning"
  | "other";

export type ReminderAccent = "red" | "rust" | "cyan" | "olive" | "mustard";

/** A reminder token before its accent is derived from its category. */
export type ReminderDraft = {
  id: string;
  full: string;
  short: string;
  category: ReminderCategory;
};

export type Reminder = ReminderDraft & {
  accent: ReminderAccent;
};
