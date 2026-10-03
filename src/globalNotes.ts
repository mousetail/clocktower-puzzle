import { el } from "./dom.ts";

export type GlobalNotesHandlers = {
  onChange: (text: string) => void;
};

export function buildGlobalNotes(
  initial: string,
  handlers: GlobalNotesHandlers,
): HTMLElement {
  const section = el("section", "global-notes");
  section.append(el("h2", "global-notes-title", "Notes"));
  const area = el("textarea", "global-notes-area");
  area.value = initial;
  area.placeholder = "Global notes…";
  area.rows = 6;
  area.addEventListener("input", () => handlers.onChange(area.value));
  section.append(area);
  return section;
}
