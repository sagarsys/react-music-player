export type Track = {
  id: number;
  title: string;
  artist: string;
  duration: string;
  src: string;
};

export type LoopMode = 'off' | 'all' | 'one';

export type AudioStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'ended' | 'error';

export type AudioState = {
  queue: Track[];
  // Stable identity
  currentTrackId: number | null;
  // Fast positional access (derived from currentTrackId + idToIndex)
  currentIndex: number;
  // O(1) id lookup
  idToIndex: Record<number, number>;
  status: AudioStatus;
  error: Error | null;

  currentTime: number;
  duration: number;

  shuffleEnabled: boolean;
  shuffleOrder: number[];
  shufflePos: number;

  loopMode: LoopMode;
};

export type LoadQueueOptions = {
  autoplay?: boolean;
  startIndex?: number;
};

export type AudioStore = {
  getState: () => AudioState;
  subscribe: (listener: () => void) => () => void;

  loadQueue: (tracks: Track[], options?: LoadQueueOptions) => Promise<void>;
  playUrl: (url: string) => Promise<void>;
  playById: (id: number) => Promise<void>;
  playAtIndex: (index: number) => Promise<void>;
  playNext: () => Promise<void>;
  playPrevious: () => Promise<void>;
  pause: () => void;
  resume: () => Promise<void>;
  stop: (options?: { release?: boolean }) => void;
  seek: (seconds: number) => void;

  toggleShuffle: () => void;
  setLoopMode: (mode: LoopMode) => void;
  cycleLoopMode: () => void;

  getAudioElement: () => HTMLAudioElement;
  attach: () => void;
  /**
   * Cleanup resources (Audio element + listeners). Call on Provider unmount.
   */
  destroy: () => void;
};
