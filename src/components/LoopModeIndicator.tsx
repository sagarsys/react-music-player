import { usePlayerContext } from '@/hooks/usePlayerContext.ts';

const LoopModeIndicator = () => {
  const { loopMode } = usePlayerContext();
  return (
    <div className="flex-1 flex justify-end">
      <span className="text-xs text-muted-foreground uppercase tracking-wider">
        {loopMode === 'off' && 'Loop Off'}
        {loopMode === 'all' && 'Loop All'}
        {loopMode === 'one' && 'Loop One'}
      </span>
    </div>
  );
};

export default LoopModeIndicator;
