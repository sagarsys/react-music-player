import { createContext, type RefObject } from 'react';
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
  isShuffled: boolean;
  setIsShuffled: (isShuffled: boolean) => void;
  audio: RefObject<HTMLAudioElement | null>;
  setAudio: (audio: HTMLAudioElement) => void;
};

export const PlayerContext = createContext<PlayerContextType | undefined>(undefined);
