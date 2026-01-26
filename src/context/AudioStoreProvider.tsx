import { type PropsWithChildren, useCallback, useMemo, useRef, useState } from 'react';
import type { LoopMode, SongModel } from '@/types';
import { AudioStoreContext } from '@/context/AudioStoreContext.ts';

const AudioStoreProvider = ({ children }: PropsWithChildren) => {
  const [currentSong, setCurrentSong] = useState<SongModel | null>(null);
  const [currentSongId, setCurrentSongId] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loopMode, setLoopMode] = useState<LoopMode>('off');
  const [isShuffled, setIsShuffled] = useState(false);
  const audio = useRef<HTMLAudioElement | null>(null);

  const setAudio = useCallback((newAudio: HTMLAudioElement) => {
    audio.current = newAudio;
  }, []);

  const contextValue = useMemo(
    () => ({
      currentSong,
      setCurrentSong,
      currentSongId,
      setCurrentSongId,
      isPlaying,
      setIsPlaying,
      loopMode,
      setLoopMode,
      isShuffled,
      setIsShuffled,
      audio,
      setAudio,
    }),
    [currentSong, currentSongId, isPlaying, loopMode, isShuffled, setAudio],
  );

  return <AudioStoreContext.Provider value={contextValue}>{children}</AudioStoreContext.Provider>;
};

export default AudioStoreProvider;
