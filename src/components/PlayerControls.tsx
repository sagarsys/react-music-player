import { Button } from '@/components/ui/button.tsx';
import cn from 'classnames';
import { Pause, Play, Repeat, Repeat1, Shuffle, SkipBack, SkipForward } from 'lucide-react';
import { useAudioActions } from '@/hooks/useAudioActions.ts';
import { useAudioStoreSelector } from '@/hooks/useAudioStoreSelector.ts';
import { selectCurrentTrack } from '@/lib/audioStore.ts';

const PlayerControls = () => {
  const { next, prev, pause, resume, toggleShuffle, cycleLoopMode } = useAudioActions();
  const currentSong = useAudioStoreSelector(selectCurrentTrack);
  const isShuffled = useAudioStoreSelector((s) => s.shuffleEnabled);
  const isPlaying = useAudioStoreSelector((s) => s.status === 'playing');
  const loopMode = useAudioStoreSelector((s) => s.loopMode);

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={toggleShuffle}
        variant="ghost"
        size="icon"
        className={cn('h-10 w-10 transition-colors', isShuffled && 'text-primary')}
        aria-label="Toggle shuffle"
      >
        <Shuffle className="h-5 w-5" />
      </Button>

      <Button
        onClick={prev}
        disabled={!currentSong?.id}
        aria-disabled={!currentSong?.id}
        onKeyDown={(e) => (e.key === ' ' ? prev() : undefined)}
        variant="ghost"
        size="icon"
        className="h-10 w-10"
        aria-label="Previous track"
      >
        <SkipBack className="h-5 w-5" />
      </Button>

      <Button
        onClick={() => (isPlaying ? pause() : resume())}
        size="icon"
        className="h-12 w-12 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
      </Button>

      <Button onClick={next} variant="ghost" size="icon" className="h-10 w-10" aria-label="Next track">
        <SkipForward className="h-5 w-5" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={cycleLoopMode}
        className={cn('h-10 w-10 transition-colors', loopMode !== 'off' && 'text-primary')}
        aria-label={`Loop mode: ${loopMode}`}
      >
        {loopMode === 'one' ? <Repeat1 className="h-5 w-5" /> : <Repeat className="h-5 w-5" />}
      </Button>
    </div>
  );
};

export default PlayerControls;
