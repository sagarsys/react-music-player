import { songs } from '@/constants/songs';
import type { Track } from '@/types';
import Song from '@/components/Song';
import { useAudioStoreSelector } from '@/hooks/useAudioStoreSelector.ts';
import { selectCurrentTrack } from '@/lib/audioStore.ts';
import { useAudioStoreActions } from '@/hooks/useAudioStoreActions.ts';

const SongsList = () => {
  const currentSong = useAudioStoreSelector(selectCurrentTrack);
  const isPlaying = useAudioStoreSelector((s) => s.status === 'playing');
  const { playById } = useAudioStoreActions();

  const onSongClick = async (songId: number) => {
    await playById(songId);
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-6 pb-32">
      <div className="space-y-2">
        {songs.map((song: Track) => (
          <Song
            key={song.id}
            song={song}
            isActive={song.id === currentSong?.id}
            isPlaying={isPlaying}
            onClick={() => onSongClick(song.id)}
          />
        ))}
      </div>
    </main>
  );
};

export default SongsList;
