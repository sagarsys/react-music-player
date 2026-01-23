import { Button } from '@/components/ui/button.tsx';
import cn from 'classnames';
import { SkipBack, SkipForward, Play, Pause, Repeat, Repeat1, Shuffle } from 'lucide-react';
import { usePlayerContext } from '@/hooks/usePlayerContext.ts';
import { songs } from '@/constants/songs.ts';
import type { LoopMode, SongModel } from '@/types';
import { useAudioPlayer } from '@/hooks/useAudioPlayer.ts';

const generateRandomNonRepeatingIdInRange = (min: number, max: number, currentIdx: number) => {
  let idx = Math.floor(Math.random() * (max - min + 1)) + min;
  while (currentIdx === idx) {
    idx = Math.floor(Math.random() * (max - min + 1)) + min;
  }
  return idx;
};

const PlayerControls = () => {
  const {
    currentSong,
    currentSongId,
    isPlaying,
    loopMode,
    setLoopMode,
    setIsPlaying,
    setCurrentSong,
    setCurrentSongId,
    isShuffled,
    setIsShuffled,
  } = usePlayerContext();

  const { play, pause, stop } = useAudioPlayer();

  const onLoopModeChange = () => {
    const nextModes: Record<string, LoopMode> = {
      off: 'one',
      one: 'all',
      all: 'off',
    };
    setLoopMode(nextModes[loopMode]);
  };

  const changeSong = (direction: 'next' | 'prev') => {
    if (!currentSongId) return;
    stop();
    if (loopMode === 'one') {
      play(currentSong as SongModel);
      return;
    } // ID stays the same

    if (isShuffled) {
      const randomIndex = generateRandomNonRepeatingIdInRange(0, songs.length - 1, currentSongId - 1);
      const randomSong = songs[randomIndex];
      setCurrentSong(randomSong);
      setCurrentSongId(randomSong.id);
      play(randomSong);
      return;
    }

    const isNext = direction === 'next';
    const isFirst = currentSongId === 1;
    const isLast = currentSongId === songs.length;

    if (loopMode === 'off') {
      if ((isNext && isLast) || (!isNext && isFirst)) {
        setCurrentSong(null);
        setCurrentSongId(null);
        setIsPlaying(false);
        return;
      }
    }

    let nextId: number;
    if (isNext) nextId = isLast ? 1 : currentSongId + 1;
    else nextId = isFirst ? songs.length : currentSongId - 1;

    const nextSong = songs.find((s) => s.id === nextId) || null;
    setCurrentSong(nextSong);
    setCurrentSongId(nextSong?.id || null);
    if (nextSong) play(nextSong);
  };

  const togglePlayback = () => {
    if (isPlaying) pause();
    else play(currentSong as SongModel);
    setIsPlaying(!isPlaying);
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
              onClick={() => setIsShuffled(!isShuffled)}
              variant="ghost"
              size="icon"
              className={cn('h-10 w-10 transition-colors', isShuffled && 'text-primary')}
              aria-label="Toggle shuffle"
            >
              <Shuffle className="h-5 w-5" />
            </Button>

            <Button
              onClick={() => changeSong('prev')}
              disabled={!currentSongId}
              aria-disabled={!currentSongId}
              onKeyDown={(e) => (e.key === ' ' ? changeSong('prev') : undefined)}
              variant="ghost"
              size="icon"
              className="h-10 w-10"
              aria-label="Previous track"
            >
              <SkipBack className="h-5 w-5" />
            </Button>

            <Button
              onClick={() => togglePlayback()}
              size="icon"
              className="h-12 w-12 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
            </Button>

            <Button
              onClick={() => changeSong('next')}
              variant="ghost"
              size="icon"
              className="h-10 w-10"
              aria-label="Next track"
            >
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
