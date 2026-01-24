import SeekBar from '@/components/SeekBar.tsx';
import CurrentSongInfo from '@/components/CurrentSongInfo.tsx';
import LoopModeIndicator from '@/components/LoopModeIndicator.tsx';
import PlayerControls from '@/components/PlayerControls.tsx';
import { usePlayerContext } from '@/hooks/usePlayerContext.ts';

const PlayerControlBar = () => {
  const { currentSong, loopMode } = usePlayerContext();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Current song info */}
          <CurrentSongInfo song={currentSong} />

          {/* Playback controls */}
          <PlayerControls />

          {/* Loop mode indicator */}
          <LoopModeIndicator mode={loopMode} />
        </div>

        <SeekBar song={currentSong} />
      </div>
    </div>
  );
};

export default PlayerControlBar;
