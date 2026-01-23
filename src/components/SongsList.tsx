import { songs } from '@/constants/songs';
import type { SongModel } from '@/types';
import Song from '@/components/Song';
import { usePlayerContext } from '@/hooks/usePlayerContext.ts';
import { useAudioPlayer } from '@/hooks/useAudioPlayer.ts';

const SongsList = () => {
  const { currentSongId, isPlaying, setCurrentSongId, setCurrentSong, setIsPlaying } = usePlayerContext();
  const { play, stop } = useAudioPlayer();

  const onSongClick = (song: SongModel) => {
    if (isPlaying) stop();
    setCurrentSong(song);
    setCurrentSongId(song.id);
    play(song);
    setIsPlaying(true);
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-6 pb-32">
      <div className="space-y-2">
        {songs.map((song: SongModel) => (
          <Song
            key={song.id}
            song={song}
            isActive={song.id === currentSongId}
            isPlaying={isPlaying}
            onClick={() => onSongClick(song)}
          />
        ))}
      </div>
    </main>
  );
};

export default SongsList;
