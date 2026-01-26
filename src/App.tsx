import './App.css';
import MusicPlayer from '@/components/MusicPlayer.tsx';
import AudioStoreProvider from '@/context/AudioStoreProvider.tsx';

function App() {
  return (
    <AudioStoreProvider>
      <MusicPlayer />
    </AudioStoreProvider>
  );
}

export default App;
