import { createContext } from 'react';
import type { LoopMode, SongModel } from '@/types';

type PlayerContextType = {
  currentSong: SongModel | null;
  currentSongId: number | null;
  setCurrentSong: (song: SongModel | null) => void;
  setCurrentSongId: (id: number | null) => void;
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  loopMode: LoopMode;
  setLoopMode: (mode: LoopMode) => void;
};

export const PlayerContext = createContext<PlayerContextType | undefined>(undefined);
