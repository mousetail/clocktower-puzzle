import { playerLabel } from "./format.ts";
import type { PlayerInfo } from "./types.ts";

export type LabelMode = "number" | "name" | "role";

export function tagLabel(
  number: number,
  players: readonly PlayerInfo[],
  mode: LabelMode,
): string {
  if (mode === "name") {
    return players[number - 1]?.name ?? playerLabel(number);
  }
  if (mode === "role") {
    return players[number - 1]?.role ?? playerLabel(number);
  }
  return playerLabel(number);
}
