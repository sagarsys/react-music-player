import type { AudioState } from '@/types';
import { useAudioStoreContext } from '@/hooks/useAudioStoreContext.ts';
import { useCallback, useRef, useSyncExternalStore } from 'react';

/**
 * Selector hook:
 * - Returns selected slice.
 * - Re-renders only when the selected slice changes by equalityFn.
 */
export function useAudioStoreSelector<TSelected>(
  selector: (s: AudioState) => TSelected,
  equalityFn: (left: TSelected, right: TSelected) => boolean = Object.is,
): TSelected {
  const store = useAudioStoreContext();
  const selectedRef = useRef<TSelected | null>(null);
  const hasSelectedRef = useRef(false);

  const getSnapshot = useCallback(() => {
    const next = selector(store.getState());
    if (!hasSelectedRef.current) {
      hasSelectedRef.current = true;
      selectedRef.current = next;
      return next;
    }

    if (selectedRef.current !== null && equalityFn(next, selectedRef.current)) {
      return selectedRef.current;
    }

    selectedRef.current = next;
    return next;
  }, [selector, store, equalityFn]);

  return useSyncExternalStore(store.subscribe, getSnapshot, getSnapshot);
}
