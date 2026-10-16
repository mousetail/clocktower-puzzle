export type Route = { kind: "menu" } | { kind: "game"; id: string };

export function parseHash(hash: string): Route {
  const segments = hash
    .replace(/^#/, "")
    .split("/")
    .filter((segment) => segment !== "");
  if (segments[0] === "game" && segments[1] !== undefined) {
    return { kind: "game", id: decodeSegment(segments[1]) };
  }
  return { kind: "menu" };
}

export function gameHash(id: string): string {
  return `#/game/${encodeURIComponent(id)}`;
}

export function menuHash(): string {
  return "#/";
}

export function startRouter(handler: (route: Route) => void): void {
  window.addEventListener("hashchange", () => {
    handler(parseHash(window.location.hash));
  });
  handler(parseHash(window.location.hash));
}

function decodeSegment(segment: string): string {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}
