import type { RawGameData } from "./data.ts";

export type RawGameFile = RawGameData & {
  name: string;
  edition?: string;
  author?: string;
  publication_date?: string;
};

export type GameEntry = {
  id: string;
  name: string;
  edition?: string;
  author?: string;
  publicationDate?: string;
  data: RawGameFile;
};

const modules = import.meta.glob<RawGameFile>(
  ["./games/*.json", "!**/game.schema.json"],
  { eager: true, import: "default" },
);

export const GAMES: readonly GameEntry[] = Object.entries(modules)
  .map(([path, data]) => toEntry(path, data))
  .sort((a, b) => a.id.localeCompare(b.id));

export function findGame(id: string): GameEntry | undefined {
  return GAMES.find((game) => game.id === id);
}

function toEntry(path: string, data: RawGameFile): GameEntry {
  const id = path.replace(/^\.\/games\//, "").replace(/\.json$/, "");
  return {
    id,
    name: data.name ?? id,
    edition: data.edition,
    author: data.author,
    publicationDate: data.publication_date,
    data,
  };
}
