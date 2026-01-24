import { Button } from '@/components/ui/button.tsx';
import cn from 'classnames';
import { Pause, Play, Repeat, Repeat1, Shuffle, SkipBack, SkipForward } from 'lucide-react';
import type { LoopMode, SongModel } from '@/types';
import { usePlayerContext } from '@/hooks/usePlayerContext.ts';
import { useAudioPlayer } from '@/hooks/useAudioPlayer.ts';
import { songs } from '@/constants/songs.ts';
import { generateRandomNonRepeatingIdInRange } from '@/lib/utils.ts';

const PlayerControls = () => {
  const {
    currentSong,
    currentSongId,
    isPlaying,
    loopMode,
    isShuffled,
    setLoopMode,
    setIsPlaying,
    setCurrentSong,
    setCurrentSongId,
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
    }

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
  );
};

export default PlayerControls;
