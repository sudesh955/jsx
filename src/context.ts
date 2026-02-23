export interface ContextToken<T> {
  key: symbol;
  factory: () => T;
}

export function createContextToken<T>(factory: () => T): ContextToken<T> {
  return { factory, key: Symbol() };
}

const contextCache: { [key: symbol]: unknown } = {};

export class Context {
  #map: { [token: symbol]: { value: unknown }[] } = {};

  private constructor(map: { [token: symbol]: { value: unknown }[] }) {
    this.#map = map;
  }

  get<T>(token: ContextToken<T>): T {
    const items = this.#map[token.key];
    if (!Array.isArray(items) || items.length === 0) {
      if (!(token.key in contextCache)) {
        contextCache[token.key] = token.factory();
      }
      return contextCache[token.key] as T;
    }
    return items[items.length - 1].value as T;
  }

  set<T>(token: ContextToken<T>, value: T): Context {
    const map = { ...this.#map };
    if (!(token.key in map)) {
      map[token.key] = [{ value }];
    } else {
      map[token.key].push({ value });
    }
    return new Context(map);
  }

  reset<T>(token: ContextToken<T>): Context {
    const map = { ...this.#map };
    if (token.key in map) {
      map[token.key].pop();
    }
    return new Context(map);
  }
}
