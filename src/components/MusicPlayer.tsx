import PlayerControlBar from '@/components/PlayerControlBar.tsx';
import SongsList from '@/components/SongsList.tsx';
import MusicPlayerHeader from '@/components/MusicPlayerHeader.tsx';
import { useAudioStoreActions } from '@/hooks/useAudioStoreActions.ts';
import { useEffect } from 'react';
import { songs } from '@/constants/songs.ts';

const MusicPlayer = () => {
  const { loadQueue } = useAudioStoreActions();

  useEffect(() => {
    void loadQueue(songs, { autoplay: true, startIndex: 0 });
  }, [loadQueue]);

  return (
    <div className="min-h-screen bg-background">
      <MusicPlayerHeader />
      <SongsList />
      <PlayerControlBar />
    </div>
  );
};

export default MusicPlayer;
