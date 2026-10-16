import type { ReminderAccent, ReminderCategory } from "./types.ts";

/** Order in which categories are listed in the reminder picker. */
export const CATEGORY_ORDER: readonly ReminderCategory[] = [
  "demon",
  "minion",
  "outsider",
  "madness",
  "droisoning",
  "other",
];

export const CATEGORY_LABELS: Record<ReminderCategory, string> = {
  demon: "Demon",
  minion: "Minion",
  outsider: "Outsider",
  madness: "Madness",
  droisoning: "Droisoning",
  other: "Other",
};

/**
 * Single source of truth for which category gets which accent colour.
 * The accent names map to the `--accent-*` custom properties in style.css.
 */
export const CATEGORY_ACCENT: Record<ReminderCategory, ReminderAccent> = {
  demon: "red",
  minion: "rust",
  outsider: "cyan",
  madness: "olive",
  droisoning: "mustard",
  other: "cyan",
};
