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
  /** Colour group. Only affects the token's accent colour. */
  category: ReminderCategory;
  /**
   * Id of the top-level token whose submenu this token belongs to. A token
   * without a parent is itself a top-level entry (a generic category).
   */
  parent?: string;
};

export type Reminder = ReminderDraft & {
  accent: ReminderAccent;
};
