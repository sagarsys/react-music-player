import { useAudioStoreContext } from '@/hooks/useAudioStoreContext.ts';
import type { LoopMode, SongModel } from '@/types';
import { generateRandomNonRepeatingIdInRange } from '@/lib/utils.ts';
import { songs } from '@/constants/songs.ts';
import { useCallback, useEffect } from 'react';

export function useAudioPlayer() {
  const {
    audio,
    currentSong,
    currentSongId,
    loopMode,
    isPlaying,
    isShuffled,
    setAudio,
    setCurrentSong,
    setCurrentSongId,
    setLoopMode,
    setIsPlaying,
  } = useAudioStoreContext();

  const play = useCallback(
    (song: SongModel) => {
      const newSong = new Audio(song.src);
      setAudio(newSong);
      void newSong.play();
    },
    [setAudio],
  );

  const pause = useCallback((): void => {
    audio.current?.pause();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audio.current]);

  const stop = useCallback(() => {
    if (audio) {
      audio.current?.pause();
      audio.current?.load();

      const newAudio = new Audio('');
      setAudio(newAudio);
      newAudio.load();
    }
  }, [audio, setAudio]);

  const changeSong = useCallback(
    (direction: 'next' | 'prev') => {
      if (!currentSongId) return;
      stop();
      if (loopMode === 'one') {
        play(currentSong as SongModel);
        return;
      }

      if (isShuffled) {
        const randomIndex = generateRandomNonRepeatingIdInRange(0, songs.length - 1, currentSongId - 1);
        const randomSong = songs[randomIndex];
        setCurrentSong(randomSong);
        setCurrentSongId(randomSong.id);
        play(randomSong);
        return;
      }

      const isNext = direction === 'next';
      const isFirst = currentSongId === 1;
      const isLast = currentSongId === songs.length;

      if (loopMode === 'off') {
        if ((isNext && isLast) || (!isNext && isFirst)) {
          setCurrentSong(null);
          setCurrentSongId(null);
          setIsPlaying(false);
          return;
        }
      }

      let nextId: number;
      if (isNext) nextId = isLast ? 1 : currentSongId + 1;
      else nextId = isFirst ? songs.length : currentSongId - 1;

      const nextSong = songs.find((s) => s.id === nextId) || null;
      setCurrentSong(nextSong);
      setCurrentSongId(nextSong?.id || null);
      if (nextSong) play(nextSong);
    },
    [currentSong, currentSongId, isShuffled, loopMode, play, setCurrentSong, setCurrentSongId, setIsPlaying, stop],
  );

  const changeLoopMode = () => {
    const nextModes: Record<string, LoopMode> = {
      off: 'one',
      one: 'all',
      all: 'off',
    };
    setLoopMode(nextModes[loopMode]);
  };

  const togglePlayback = () => {
    if (isPlaying) pause();
    else play(currentSong as SongModel);
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    audio.current?.addEventListener('ended', () => {
      changeSong('next');
    });

    return () => {
      removeEventListener('ended', () => {});
    };
  }, [audio, changeSong]);

  return { play, pause, stop, changeLoopMode, changeSong, togglePlayback };
}
