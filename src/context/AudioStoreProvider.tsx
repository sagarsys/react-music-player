import { type PropsWithChildren, useEffect, useState } from 'react';
import { AudioStoreContext } from '@/context/AudioStoreContext.ts';
import type { AudioStore } from '@/types';
import { createAudioStore } from '@/lib/audio/audioStore.ts';

type Props = PropsWithChildren & {
  timeUpdateIntervalMs?: number;
};

const AudioStoreProvider = ({ children, timeUpdateIntervalMs = 500 }: Props) => {
  const [store] = useState<AudioStore>(() => createAudioStore({ timeUpdateIntervalMs }));

  // Cleanup on unmounting
  useEffect(() => {
    store.attach();

    return () => {
      store.destroy();
    };
  }, [store]);

  return <AudioStoreContext.Provider value={store}>{children}</AudioStoreContext.Provider>;
};

export default AudioStoreProvider;
