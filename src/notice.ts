import { el } from "./dom.ts";

const GENERAL_NOTICE =
  "Evil players may lie. Other good players honestly report their character, " +
  "choices, and information received.";

const EDITION_NOTICES: Record<string, string> = {
  "Trouble Brewing":
    "Evil players may lie. Other good players honestly report their character, " +
    "choices, and information received.",
  "Sects and Violets":
    "Evil players may lie. A living mutant may maintain a townsfolk cover. " +
    "A player currently affected by the Cerenovus madness may maintain the " +
    "required false claim. Other good players honestly report their character, " +
    "choices, and information received.",
  "Bad Moon Rising":
    "Evil players may lie. A lunatic believes they are the demon and may " +
    "maintain that cover. Other good players honestly report their character, " +
    "choices, and information received.",
};

export function buildNotice(edition?: string): HTMLElement {
  const text =
    (edition === undefined ? undefined : EDITION_NOTICES[edition]) ??
    GENERAL_NOTICE;
  return el("p", "notice", text);
}
