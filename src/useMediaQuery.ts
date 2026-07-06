import { useSyncExternalStore } from "react";

type MediaQueryStore = {
  getSnapshot: () => boolean;
  getServerSnapshot: () => boolean;
  subscribe: (listener: () => void) => () => void;
};

const stores = new Map<string, MediaQueryStore>();

function createMediaQueryStore(
  query: string,
  noWindowDefault: boolean = false,
  storeKey: string = query,
): MediaQueryStore {
  const media =
    typeof window !== "undefined"
      ? window.matchMedia(query)
      : undefined;
    
  const listeners = new Set<() => void>();

  const notify = () => {
    listeners.forEach((listener) => listener());
  };

  return {
    getSnapshot() {
      return media?.matches ?? noWindowDefault;    
    },

    getServerSnapshot() {
      return noWindowDefault;
    },

    subscribe(listener) {
      if (!media) {
        return () => {};
      }

      listeners.add(listener);

      if (listeners.size === 1) {
        media.addEventListener("change", notify);
      }

      return () => {
        listeners.delete(listener);

        if (listeners.size === 0) {
          media.removeEventListener("change", notify);
          stores.delete(storeKey);
        }
      };
    },
  };
}

function getMediaQueryStore(query: string, noWindowDefault: boolean = false) {
  if (typeof window === "undefined") {
    return createMediaQueryStore(query, noWindowDefault);
  }

  const storeKey = `${query}::${String(noWindowDefault)}`;
  let store = stores.get(storeKey);

  if (!store) {
    store = createMediaQueryStore(query, noWindowDefault, storeKey);
    stores.set(storeKey, store);
  }

  return store;
}

export type UseMediaQueryOptions = {
  /**
   * Value returned when `window` is unavailable, such as during server rendering.
   */
  noWindowDefault?: boolean;
};

/**
 * Subscribes to an arbitrary CSS media query and returns whether it currently matches.
 */
export function useMediaQuery(
  query: string,
  options: UseMediaQueryOptions = {},
): boolean {
  const store = getMediaQueryStore(query, options.noWindowDefault ?? false);

  return useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );
}
