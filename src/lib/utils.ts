import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Track } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function buildIdToIndex(tracks: Track[]): Record<number, number> {
  const map: Record<number, number> = {};
  for (let i = 0; i < tracks.length; i++) map[tracks[i].id] = i;
  return map;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function toFiniteNumber(value: number, fallback = 0): number {
  return Number.isFinite(value) ? value : fallback;
}

export function formatTime(seconds: number): string {
  const s = Math.floor(toFiniteNumber(seconds));
  const mm = String(Math.floor(s / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

// Fisher Yates shuffle algorithm
export function shuffle(indices: number[]): number[] {
  const arr = indices.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
