import type { SongModel } from '@/types';

type Props = {
  song: SongModel | null;
};

const SeekBar = ({ song }: Props) => {
  return (
    <div className="flex items-center justify-center mx-auto mt-2">
      <span className="mr-2">00:00</span>
      <div className="border w-100 relative">
        <div className="absolute border border-accent w-20 -top-px -left-px"></div>
      </div>
      <span className="ml-2">{song?.duration || '00:00'}</span>
    </div>
  );
};

export default SeekBar;
