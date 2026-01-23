export type SongModel = {
  id: number;
  title: string;
  artist: string;
  duration: string;
  src: string;
};

export type LoopMode = 'off' | 'all' | 'one';
