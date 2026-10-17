import type { ReminderAccent, ReminderCategory } from "./types.ts";

/**
 * Single source of truth for which category gets which accent colour.
 * The accent names map to the `--accent-*` custom properties in style.css.
 *
 * Categories only control colouring; which submenu a token appears under is
 * decided by its `parent` (see types.ts).
 */
export const CATEGORY_ACCENT: Record<ReminderCategory, ReminderAccent> = {
  demon: "red",
  minion: "rust",
  outsider: "cyan",
  madness: "olive",
  droisoning: "mustard",
  other: "cyan",
};
