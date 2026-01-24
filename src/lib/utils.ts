import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateRandomNonRepeatingIdInRange = (min: number, max: number, currentIdx: number) => {
  let idx = Math.floor(Math.random() * (max - min + 1)) + min;
  while (currentIdx === idx) {
    idx = Math.floor(Math.random() * (max - min + 1)) + min;
  }
  return idx;
};

export function clampNumber(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function safeParseTime(value: number): number {
  return Number.isFinite(value) ? value : 0;
}
