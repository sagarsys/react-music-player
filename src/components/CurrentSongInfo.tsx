import { useAudioStoreSelector } from '@/hooks/useAudioStoreSelector.ts';
import { selectCurrentTrack } from '@/lib/audio/audioStore.ts';

const CurrentSongInfo = () => {
  const song = useAudioStoreSelector(selectCurrentTrack);

  return (
    <div className="flex-1 min-w-0">
      {song ? (
        <div>
          <p className="font-medium text-foreground truncate">{song.title}</p>
          <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
        </div>
      ) : (
        <p className="text-muted-foreground">No song selected</p>
      )}
    </div>
  );
};

export default CurrentSongInfo;
