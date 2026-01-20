import "./App.css";
import MusicPlayer from "@/components/MusicPlayer.tsx";
import PlayerProvider from "@/context/PlayerProvider.tsx";

function App() {
  return (
    <PlayerProvider>
      <MusicPlayer />
    </PlayerProvider>
  );
}

export default App;
