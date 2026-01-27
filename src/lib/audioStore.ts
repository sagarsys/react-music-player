import type { AudioState, AudioStore, LoadQueueOptions, LoopMode, Track } from '@/types';
import { buildIdToIndex, clamp, shuffle, toFiniteNumber } from '@/lib/utils.ts';

/**
 * Store implementation: Context holds only the stable store object.
 * Components subscribe with useAudioSelector to avoid global re-renders.
 */
export function createAudioStore(options?: { timeUpdateIntervalMs?: number }): AudioStore {
  const timeUpdateIntervalMs = options?.timeUpdateIntervalMs ?? 1000;

  const audio = new Audio();
  audio.preload = 'metadata';

  const listeners = new Set<() => void>();
  const notify = () => {
    listeners.forEach((listener) => listener());
  };

  let lastTimeDispatchMs = 0;
  let playRequestId = 0;

  let state: AudioState = {
    queue: [],
    currentTrackId: null,
    currentIndex: -1,
    idToIndex: {},
    status: 'idle',
    error: null,

    currentTime: 0,
    duration: 0,

    shuffleEnabled: false,
    shuffleOrder: [],
    shufflePos: -1,

    loopMode: 'off',
  };

  const setState = (updater: AudioState | ((prevState: AudioState) => AudioState)): void => {
    const next = typeof updater === 'function' ? (updater as (p: AudioState) => AudioState)(state) : updater;
    if (next === state) return;
    state = next;
    notify();
  };

  const resolveIndexFromId = (s: AudioState): number => {
    if (!s.currentTrackId) return -1;
    const idx = s.idToIndex[s.currentTrackId];
    return idx ?? -1;
  };

  const applyCurrentSelection = (prev: AudioState, next: Partial<AudioState>): AudioState => {
    const merged = { ...prev, ...next } as AudioState;
    const resolvedIdx = resolveIndexFromId(merged);
    return { ...merged, currentIndex: resolvedIdx };
  };

  const buildShuffleState = (
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

  const getNextIndex = (state: AudioState): number => {
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

  const getPrevIndex = (state: AudioState): number => {
    const { queue, currentIndex, loopMode, shuffleEnabled, shuffleOrder, shufflePos } = state;
    if (queue.length === 0) return -1;
    if (loopMode === 'one') return currentIndex >= 0 ? currentIndex : -1;

    const lastIndex = queue.length - 1;

    if (shuffleEnabled) {
      const prevPos = shufflePos - 1;
      if (prevPos >= 0) return shuffleOrder[prevPos];
      return loopMode === 'all' ? shuffleOrder[lastIndex] : -1;
    }

    const prev = currentIndex < 0 ? -1 : currentIndex - 1;
    if (prev >= 0) return prev;
    return loopMode === 'all' ? lastIndex : 0;
  };

  const rebuildShuffleIfNeeded = (nextState: AudioState): AudioState => {
    if (!nextState.shuffleEnabled) return nextState;
    const { shuffleOrder, shufflePos } = buildShuffleState(nextState.queue.length, nextState.currentIndex);
    return { ...nextState, shuffleOrder, shufflePos };
  };

  const syncDuration = () => {
    setState((prevState) => ({ ...prevState, duration: toFiniteNumber(audio.duration, 0) }));
  };

  const syncTimeImmediate = () => {
    setState((s) => ({ ...s, currentTime: toFiniteNumber(audio.currentTime, 0) }));
  };

  const syncTimeThrottled = () => {
    const now = Date.now();
    if (now - lastTimeDispatchMs < timeUpdateIntervalMs) return;
    lastTimeDispatchMs = now;

    setState((prevState) => ({
      ...prevState,
      currentTime: toFiniteNumber(audio.currentTime, 0),
      duration: Number.isFinite(audio.duration) ? audio.duration : prevState.duration,
    }));
  };

  const playUrl = async (url: string): Promise<void> => {
    const requestId = ++playRequestId;

    setState((prev) => ({ ...prev, status: 'loading', error: null }));
    audio.pause();
    audio.src = url;
    audio.load();

    try {
      await audio.play();
      if (requestId !== playRequestId) return;
      setState((prev) => ({ ...prev, status: 'playing' }));
    } catch (e) {
      if (requestId !== playRequestId) return;
      const error = e instanceof Error ? e : new Error(String(e));
      setState((prev) => ({ ...prev, status: 'idle', error }));
      return;
    }
  };

  const playAtIndex = async (index: number): Promise<void> => {
    const snapshot = state;
    const idx = clamp(index, 0, snapshot.queue.length - 1);
    const track = snapshot.queue[idx];
    if (!track) return;

    setState((prev) => {
      let next: AudioState = { ...prev, currentIndex: idx, status: 'loading', error: null };
      if (next.shuffleEnabled) {
        const pos = next.shuffleOrder.indexOf(idx);
        next = { ...next, shufflePos: pos >= 0 ? pos : 0 };
      }
      return applyCurrentSelection(prev, next);
    });

    await playUrl(track.src);
  };

  const playById = async (id: number): Promise<void> => {
    const idx = state.idToIndex[id];
    await playAtIndex(idx);
  };

  const playNext = async (): Promise<void> => {
    if (state.queue.length === 0) return;
    const nextIndex = getNextIndex(state);

    if (nextIndex < 0) {
      setState((prev) => ({ ...prev, status: 'ended' }));
      return;
    }

    if (state.shuffleEnabled) {
      setState((prev) => ({ ...prev, shufflePos: (prev.shufflePos + 1) % prev.queue.length }));
    }

    await playAtIndex(nextIndex);
  };

  const playPrevious = async (): Promise<void> => {
    if (state.queue.length === 0) return;
    const prevIndex = getPrevIndex(state);
    if (prevIndex < 0) return;

    if (state.shuffleEnabled) {
      setState((prev) => ({ ...prev, shufflePos: Math.max(0, prev.shufflePos - 1) }));
    }

    await playAtIndex(prevIndex);
  };

  const pause = (): void => {
    audio.pause();
    setState((s) => ({ ...s, status: 'paused' }));
  };

  const resume = async (): Promise<void> => {
    if (!audio.src) return;

    const requestId = ++playRequestId;
    setState((prevState) => ({ ...prevState, status: 'loading', error: null }));

    try {
      await audio.play();
      if (requestId !== playRequestId) return;
      setState((prevState) => ({ ...prevState, status: 'playing' }));
    } catch (e) {
      if (requestId !== playRequestId) return;
      const error = e instanceof Error ? e : new Error(String(e));
      setState((prevState) => ({ ...prevState, status: 'idle', error }));
    }
  };

  const stop = (opts?: { release?: boolean }): void => {
    const release = opts?.release ?? false;

    audio.pause();
    try {
      audio.currentTime = 0;
    } catch {
      // ignore
    }

    if (release) {
      audio.removeAttribute('src');
      audio.load();
    }

    setState((prevState) => ({ ...prevState, status: 'idle', currentTime: 0, error: null }));
  };

  const seek = (seconds: number): void => {
    const dur = toFiniteNumber(audio.duration, 0);
    const next = clamp(toFiniteNumber(seconds, 0), 0, dur || 0);

    try {
      audio.currentTime = next;
    } catch {
      return;
    }

    // Why: immediate UI feedback even if timeupdate is throttled.
    setState((prevState) => ({ ...prevState, currentTime: next }));
  };

  const loadQueue = async (tracks: Track[], opts?: LoadQueueOptions): Promise<void> => {
    const autoplay = opts?.autoplay ?? false;
    const startIndex = opts?.startIndex ?? 0;

    const idToIndex = buildIdToIndex(tracks);
    const idx = tracks.length ? clamp(startIndex, 0, tracks.length - 1) : -1;
    const currentTrackId = idx >= 0 ? tracks[idx].id : null;

    setState((prevState) => {
      let next: AudioState = {
        ...prevState,
        queue: tracks,
        currentIndex: idx,
        currentTrackId,
        idToIndex,
        currentTime: 0,
        duration: 0,
        error: null,
      };
      next = rebuildShuffleIfNeeded(next);
      return applyCurrentSelection(prevState, next);
    });

    if (!autoplay) {
      stop({ release: true });
      return;
    }

    await playAtIndex(idx);
  };

  const toggleShuffle = (): void => {
    setState((prevState) => {
      const nextEnabled = !prevState.shuffleEnabled;

      if (!nextEnabled) return { ...prevState, shuffleEnabled: false, shuffleOrder: [], shufflePos: -1 };

      const { shuffleOrder, shufflePos } = buildShuffleState(prevState.queue.length, prevState.currentIndex);
      return { ...prevState, shuffleEnabled: true, shuffleOrder, shufflePos };
    });
  };

  const setLoopMode = (mode: LoopMode): void => {
    setState((prevState) => ({ ...prevState, loopMode: mode }));
  };

  const cycleLoopMode = (): void => {
    const nextModes: Record<string, LoopMode> = {
      off: 'one',
      one: 'all',
      all: 'off',
    };
    setState((prevState) => ({ ...prevState, loopMode: nextModes[prevState.loopMode] }));
  };

  // audio event handlers (named so that they can be removed on unmount
  const onLoadedMetadata = () => syncDuration();
  const onDurationChange = () => syncDuration();
  // High-frequency event: keep audio moving smoothly; store state updates are throttled.
  const onTimeUpdate = () => syncTimeThrottled();
  // Helpful for seekbar behavior
  const onSeeking = () => syncTimeImmediate();
  const onSeeked = () => syncTimeImmediate();
  const onPlay = () => setState((s) => ({ ...s, status: 'playing' }));
  const onPause = () => setState((s) => ({ ...s, status: s.status === 'ended' ? 'ended' : 'paused' }));
  const onEnded = () => {
    setState((prevState) => ({ ...prevState, status: 'ended' }));
    void playNext();
  };
  const onError = () =>
    setState((prevState) => ({ ...prevState, status: 'error', error: new Error('Audio playback failed') }));

  const attach = () => {
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('durationchange', onDurationChange);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('seeking', onSeeking);
    audio.addEventListener('seeked', onSeeked);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);
  };

  const destroy = () => {
    // cancel pending requests
    playRequestId++;

    // stop playback + release resources
    stop({ release: true });

    // remove event listeners
    audio.removeEventListener('loadedmetadata', onLoadedMetadata);
    audio.removeEventListener('durationchange', onDurationChange);
    audio.removeEventListener('timeupdate', onTimeUpdate);
    audio.removeEventListener('seeking', onSeeking);
    audio.removeEventListener('seeked', onSeeked);
    audio.removeEventListener('play', onPlay);
    audio.removeEventListener('pause', onPause);
    audio.removeEventListener('ended', onEnded);
    audio.removeEventListener('error', onError);

    // prevent future notifications from stale subscribers
    listeners.clear();
  };

  return {
    getState: () => state,
    getAudioElement: () => audio,
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },

    loadQueue,
    playUrl,
    playById,
    playAtIndex,
    playNext,
    playPrevious,
    pause,
    resume,
    stop,
    seek,
    toggleShuffle,
    setLoopMode,
    cycleLoopMode,
    attach,
    destroy,
  };
}

// selectors
export const selectCurrentTrack = (s: AudioState) =>
  s.currentIndex >= 0 && s.currentIndex < s.queue.length ? s.queue[s.currentIndex] : null;
