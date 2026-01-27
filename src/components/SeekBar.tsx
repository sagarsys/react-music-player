import { useAudioActions } from '@/hooks/useAudioActions.ts';
import { useAudioStoreSelector } from '@/hooks/useAudioStoreSelector.ts';
import { formatTime } from '@/lib/utils.ts';

const SeekBar = () => {
  const { seek } = useAudioActions();
  const duration = useAudioStoreSelector((s) => s.duration);
  const currentTime = useAudioStoreSelector((s) => s.currentTime);

  return (
    <div className="flex items-center justify-center mx-auto mt-2">
      <span className="mr-2">{formatTime(currentTime)}</span>
      <input
        className="w-80 h-1 accent-accent cursor-pointer"
        type="range"
        min={0}
        max={duration || 0}
        step={0.01}
        value={Math.min(currentTime, duration || 0)}
        disabled={!duration}
        onChange={(e) => seek(Number(e.target.value))}
      />
      <span className="ml-2">{formatTime(duration)}</span>
    </div>
  );
};

export default SeekBar;
