import { el } from "./dom.ts";

const NOTICE =
  "Evil players may lie. A living mutant may maintain a townsfolk cover. " +
  "A player currently effected by the Cerenovus madness may maintain the " +
  "required false claim. Other good players honestly report their character, " +
  "choices, and information received.";

export function buildNotice(): HTMLElement {
  return el("p", "notice", NOTICE);
}
