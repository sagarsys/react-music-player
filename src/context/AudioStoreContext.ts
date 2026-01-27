import { createContext } from 'react';
import type { AudioStore } from '@/types';

export const AudioStoreContext = createContext<AudioStore | undefined>(undefined);
