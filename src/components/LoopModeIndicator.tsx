import { useAudioStoreSelector } from '@/hooks/useAudioStoreSelector.ts';

const LoopModeIndicator = () => {
  const mode = useAudioStoreSelector((s) => s.loopMode);

  return (
    <div className="flex-1 flex justify-end">
      <span className="text-xs text-muted-foreground uppercase tracking-wider">
        {mode === 'off' && 'Loop Off'}
        {mode === 'all' && 'Loop All'}
        {mode === 'one' && 'Loop One'}
      </span>
    </div>
  );
};

export default LoopModeIndicator;
