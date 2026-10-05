import { useSyncExternalStore } from "react";

const subscribeNoop = () => () => {};

// The cart is persisted in localStorage, so anything derived from it is only
// known on the client. Returns false during SSR and the first client render.
export function useHydrated() {
  return useSyncExternalStore(subscribeNoop, () => true, () => false);
}
