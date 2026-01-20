import { Disc3 } from "lucide-react";
import { songs } from "@/constants/songs.ts";

const MusicPlayerHeader = () => {
  return (
    <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <Disc3 className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Music Player</h1>
            <p className="text-sm text-muted-foreground">
              {songs.length} songs
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default MusicPlayerHeader;
