import PlayerControlBar from '@/components/PlayerControlBar.tsx';
import SongsList from '@/components/SongsList.tsx';
import MusicPlayerHeader from '@/components/MusicPlayerHeader.tsx';

const MusicPlayer = () => {
  return (
    <div className="min-h-screen bg-background">
      <MusicPlayerHeader />
      <SongsList />
      <PlayerControlBar />
    </div>
  );
};

export default MusicPlayer;
