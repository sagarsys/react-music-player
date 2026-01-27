import { Music } from 'lucide-react';
import cn from 'classnames';
import type { Track } from '@/types';

type Props = {
  song: Track;
  onClick: (song: Track) => void;
  isActive?: boolean;
  isPlaying?: boolean;
};

const Song = ({ song, isActive = false, isPlaying = false, onClick }: Props) => {
  return (
    <button
      onClick={() => onClick(song)}
      className={cn(
        'w-full flex items-center gap-4 p-4 rounded-lg transition-all duration-200',
        'hover:bg-secondary/80 group text-left',
        isActive && 'bg-secondary border-l-4 border-primary',
      )}
    >
      <div
        className={cn(
          'w-12 h-12 rounded-md flex items-center justify-center flex-shrink-0 transition-colors',
          isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
        )}
      >
        <Music className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn('font-medium truncate transition-colors', isActive ? 'text-primary' : 'text-foreground')}>
          {song.title}
        </p>
        <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
      </div>
      <span className="text-sm text-muted-foreground tabular-nums">{song.duration}</span>
      {isActive && (
        <div className="flex items-center gap-1">
          <span className={cn('w-1 h-3 bg-primary rounded-full', isPlaying ? 'animate-pulse' : '')} />
          <span className={cn('w-1 h-4 bg-primary rounded-full delay-75', isPlaying ? 'animate-pulse' : '')} />
          <span className={cn('w-1 h-2 bg-primary rounded-full delay-150', isPlaying ? 'animate-pulse' : '')} />
        </div>
      )}
    </button>
  );
};

export default Song;
