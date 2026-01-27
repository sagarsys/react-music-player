import { songs } from '@/constants/songs';
import type { Track } from '@/types';
import Song from '@/components/Song';
import { useAudioStoreSelector } from '@/hooks/useAudioStoreSelector.ts';
import { selectCurrentTrack } from '@/lib/audioStore.ts';
import { useAudioActions } from '@/hooks/useAudioActions.ts';

const SongsList = () => {
  const currentSong = useAudioStoreSelector(selectCurrentTrack);
  const isPlaying = useAudioStoreSelector((s) => s.status === 'playing');
  const { playAtIndex } = useAudioActions();

  const onSongClick = async (idx: number) => {
    await playAtIndex(idx);
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-6 pb-32">
      <div className="space-y-2">
        {songs.map((song: Track, index: number) => (
          <Song
            key={song.id}
            song={song}
            isActive={song.id === currentSong?.id}
            isPlaying={isPlaying}
            onClick={() => onSongClick(index)}
          />
        ))}
      </div>
    </main>
  );
};

export default SongsList;
