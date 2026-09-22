// Shared real-world contexts for word problems so generators don't repeat
// "bags of apples" as the only scenario in the app.

export interface WordProblemContext {
  container: string; // "bag"
  containerPlural: string; // "bags"
  item: string; // "apple"
  itemPlural: string; // "apples"
}

export const CONTEXTS: WordProblemContext[] = [
  { container: "bag", containerPlural: "bags", item: "apple", itemPlural: "apples" },
  { container: "box", containerPlural: "boxes", item: "pencil", itemPlural: "pencils" },
  { container: "basket", containerPlural: "baskets", item: "egg", itemPlural: "eggs" },
  { container: "shelf", containerPlural: "shelves", item: "book", itemPlural: "books" },
  { container: "jar", containerPlural: "jars", item: "cookie", itemPlural: "cookies" },
  { container: "vase", containerPlural: "vases", item: "flower", itemPlural: "flowers" },
  { container: "plate", containerPlural: "plates", item: "grape", itemPlural: "grapes" },
  { container: "car", containerPlural: "cars", item: "wheel", itemPlural: "wheels" },
  { container: "table", containerPlural: "tables", item: "chair", itemPlural: "chairs" },
  { container: "team", containerPlural: "teams", item: "player", itemPlural: "players" },
];

export function pickContext(rng: () => number): WordProblemContext {
  return CONTEXTS[Math.floor(rng() * CONTEXTS.length)];
}
