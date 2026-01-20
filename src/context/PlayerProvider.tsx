import { type PropsWithChildren, useMemo, useState } from 'react';
import type { LoopMode, SongModel } from '@/types';
import { PlayerContext } from '@/context/PlayerContext';

const PlayerProvider = ({ children }: PropsWithChildren) => {
  const [currentSong, setCurrentSong] = useState<SongModel | null>(null);
  const [currentSongId, setCurrentSongId] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loopMode, setLoopMode] = useState<LoopMode>('off');

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
    }),
    [currentSong, currentSongId, isPlaying, loopMode],
  );

  return <PlayerContext.Provider value={contextValue}>{children}</PlayerContext.Provider>;
};

export default PlayerProvider;
