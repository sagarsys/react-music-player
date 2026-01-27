import { useAudioStoreContext } from '@/hooks/useAudioStoreContext.ts';
import { useMemo } from 'react';

/** Actions hook: stable action references */
export function useAudioActions() {
  const store = useAudioStoreContext();

  return useMemo(
    () => ({
      loadQueue: store.loadQueue,
      play: store.playUrl,
      playAtIndex: store.playAtIndex,
      next: store.playNext,
      prev: store.playPrevious,
      pause: store.pause,
      resume: store.resume,
      stop: store.stop,
      seek: store.seek,
      toggleShuffle: store.toggleShuffle,
      cycleLoopMode: store.cycleLoopMode,
    }),
    [store],
  );
}
