import { useContext } from 'react';
import { AudioStoreContext } from '@/context/AudioStoreContext.ts';

export const useAudioStoreContext = () => {
  const store = useContext(AudioStoreContext);
  if (!store) throw new Error('useAudioSelector must be used inside <AudioStoreProvider />');

  return store;
};
