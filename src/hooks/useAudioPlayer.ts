import { usePlayerContext } from '@/hooks/usePlayerContext.ts';
import type { SongModel } from '@/types';

export function useAudioPlayer() {
  const { audio, setAudio } = usePlayerContext();

  const play = (song: SongModel) => {
    const newSong = new Audio(song.src);
    setAudio(newSong);
    void newSong.play();
  };

  const pause = () => {
    audio.current?.pause();
  };

  const stop = () => {
    if (audio) {
      audio.current?.pause();
      audio.current?.load();

      const newAudio = new Audio('');
      setAudio(newAudio);
      newAudio.load();
    }
  };

  return { play, pause, stop };
}
