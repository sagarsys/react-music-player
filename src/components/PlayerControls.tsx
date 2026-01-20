import { Button } from '@/components/ui/button.tsx';
import cn from 'classnames';
import { SkipBack, SkipForward, Play, Pause, Repeat, Repeat1, Shuffle } from 'lucide-react';
import { usePlayerContext } from '@/usePlayerContext.ts';

const PlayerControls = () => {
  const { currentSong, isPlaying, loopMode, setLoopMode } = usePlayerContext();

  const onLoopModeChange = () => {
    let nextLoopMode = loopMode;
    if (loopMode === 'off') nextLoopMode = 'one';
    if (loopMode === 'one') nextLoopMode = 'all';
    if (loopMode === 'all') nextLoopMode = 'off';

    setLoopMode(nextLoopMode);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Current song info */}
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

          {/* Playback controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'h-10 w-10 transition-colors',
                // isShuffled && "text-primary"
              )}
              aria-label="Toggle shuffle"
            >
              <Shuffle className="h-5 w-5" />
            </Button>

            <Button variant="ghost" size="icon" className="h-10 w-10" aria-label="Previous track">
              <SkipBack className="h-5 w-5" />
            </Button>

            <Button
              size="icon"
              className="h-12 w-12 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
            </Button>

            <Button variant="ghost" size="icon" className="h-10 w-10" aria-label="Next track">
              <SkipForward className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={onLoopModeChange}
              className={cn('h-10 w-10 transition-colors', loopMode !== 'off' && 'text-primary')}
              aria-label={`Loop mode: ${loopMode}`}
            >
              {loopMode === 'one' ? <Repeat1 className="h-5 w-5" /> : <Repeat className="h-5 w-5" />}
            </Button>
          </div>

          {/* Loop mode indicator */}
          <div className="flex-1 flex justify-end">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">
              {loopMode === 'off' && 'Loop Off'}
              {loopMode === 'all' && 'Loop All'}
              {loopMode === 'one' && 'Loop One'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerControls;
