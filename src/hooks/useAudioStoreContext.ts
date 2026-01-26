import { useContext } from 'react';
import { AudioStoreContext } from '@/context/AudioStoreContext.ts';

export const useAudioStoreContext = () => {
  const context = useContext(AudioStoreContext);
  if (!context) {
    throw new Error('useAudioStoreContext must be used within a AudioStoreProvider');
  }
  return context;
};
