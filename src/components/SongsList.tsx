import { songs } from '@/constants/songs';
import type { SongModel } from '@/types';
import Song from '@/components/Song';
import { usePlayerContext } from '@/usePlayerContext.ts';

const SongsList = () => {
  const { currentSongId, setCurrentSongId, setCurrentSong, setIsPlaying } = usePlayerContext();

  const onSongClick = (song: SongModel) => {
    setCurrentSong(song);
    setCurrentSongId(song.id);
    setIsPlaying(true);
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-6 pb-32">
      <div className="space-y-2">
        {songs.map((song: SongModel) => (
          <Song key={song.id} song={song} isActive={song.id === currentSongId} onClick={() => onSongClick(song)} />
        ))}
      </div>
    </main>
  );
};

export default SongsList;
