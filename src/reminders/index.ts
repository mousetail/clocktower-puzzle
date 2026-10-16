import { BAD_MOON_RISING_REMINDERS } from "./badMoonRising.ts";
import { CATEGORY_ACCENT, CATEGORY_ORDER } from "./categories.ts";
import { GENERIC_REMINDERS } from "./generic.ts";
import { SECTS_AND_VIOLETS_REMINDERS } from "./sectsAndViolets.ts";
import { TROUBLE_BREWING_REMINDERS } from "./troubleBrewing.ts";
import type { Reminder, ReminderDraft } from "./types.ts";

export type {
  Reminder,
  ReminderAccent,
  ReminderCategory,
  ReminderDraft,
} from "./types.ts";
export { CATEGORY_ACCENT, CATEGORY_LABELS, CATEGORY_ORDER } from "./categories.ts";

const EDITION_REMINDERS: Record<string, readonly ReminderDraft[]> = {
  "Trouble Brewing": TROUBLE_BREWING_REMINDERS,
  "Sects and Violets": SECTS_AND_VIOLETS_REMINDERS,
  "Bad Moon Rising": BAD_MOON_RISING_REMINDERS,
};

function withAccent(reminder: ReminderDraft): Reminder {
  return { ...reminder, accent: CATEGORY_ACCENT[reminder.category] };
}

function byCategory(a: Reminder, b: Reminder): number {
  return CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category);
}

/** Every reminder token, across all editions, used for id lookup. */
export const REMINDERS: readonly Reminder[] = [
  ...GENERIC_REMINDERS,
  ...TROUBLE_BREWING_REMINDERS,
  ...SECTS_AND_VIOLETS_REMINDERS,
  ...BAD_MOON_RISING_REMINDERS,
].map(withAccent);

/** Generic tokens plus the tokens specific to the given edition, sorted by category. */
export function remindersForEdition(edition?: string): Reminder[] {
  const specific =
    edition === undefined ? [] : EDITION_REMINDERS[edition] ?? [];
  return [...GENERIC_REMINDERS, ...specific].map(withAccent).sort(byCategory);
}

export function reminderById(id: string): Reminder | undefined {
  return REMINDERS.find((reminder) => reminder.id === id);
}
