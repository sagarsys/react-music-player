import { usePlayerContext } from '@/hooks/usePlayerContext.ts';

const CurrentSongInfo = () => {
  const { currentSong } = usePlayerContext();

  return (
    <div className="flex-1 min-w-0">
      {currentSong ? (
        <div>
          <p className="font-medium text-foreground truncate">{currentSong.title}</p>
          <p className="text-sm text-muted-foreground truncate">{currentSong.artist}</p>
        </div>
      ) : (
        <p className="text-muted-foreground">No song selected</p>
      )}
    </div>
  );
};

export default CurrentSongInfo;
