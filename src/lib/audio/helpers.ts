import type { AudioState } from '@/types';
import { shuffle } from '@/lib/utils.ts';

export const buildShuffleState = (
  queueLength: number,
  currentIndex: number,
): Pick<AudioState, 'shuffleOrder' | 'shufflePos'> => {
  if (queueLength <= 0) return { shuffleOrder: [], shufflePos: -1 };

  const base = Array.from({ length: queueLength }, (_, i) => i);
  const shuffled = shuffle(base);

  // make current track first for next behavior
  const desiredIndex = currentIndex >= 0 ? currentIndex : 0;
  const pos = Math.max(0, shuffled.indexOf(desiredIndex));
  if (pos !== 0) [shuffled[0], shuffled[pos]] = [shuffled[pos], shuffled[0]];

  return { shuffleOrder: shuffled, shufflePos: 0 };
};

export const getNextIndex = (state: AudioState): number => {
  const { queue, currentIndex, loopMode, shuffleEnabled, shuffleOrder, shufflePos } = state;
  if (queue.length === 0) return -1;
  if (loopMode === 'one') return currentIndex >= 0 ? currentIndex : 0;

  const lastIndex = queue.length - 1;

  if (shuffleEnabled) {
    const nextPos = shufflePos + 1;
    if (nextPos <= lastIndex) return shuffleOrder[nextPos];
    return loopMode === 'all' ? shuffleOrder[0] : -1;
  }

  const next = currentIndex < 0 ? 0 : currentIndex + 1;
  if (next <= lastIndex) return next;
  return loopMode === 'all' ? 0 : -1;
};

export const getPrevIndex = (state: AudioState): number => {
  const { queue, currentIndex, loopMode, shuffleEnabled, shuffleOrder, shufflePos } = state;
  if (queue.length === 0) return -1;
  if (loopMode === 'one') return currentIndex >= 0 ? currentIndex : 0;

  const lastIndex = queue.length - 1;

  if (shuffleEnabled) {
    const prevPos = shufflePos - 1;
    if (prevPos >= 0) return shuffleOrder[prevPos];
    return loopMode === 'all' ? shuffleOrder[lastIndex] : -1;
  }

  const prev = currentIndex < 0 ? -1 : currentIndex - 1;
  if (prev >= 0) return prev;
  return loopMode === 'all' ? lastIndex : -1;
};
