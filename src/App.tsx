import { useMemo, useState } from "react";
import { packs, scenes } from "./data/scenes";
import { DubStudio } from "./components/DubStudio";
import { SceneShelf } from "./components/SceneShelf";

export default function App() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [dubs, setDubs] = useState<Record<string, string>>({});

  const scene = scenes[sceneIndex];

  const savedSceneIds = useMemo(() => new Set(Object.keys(dubs)), [dubs]);

  const handleSelectScene = (sceneId: string) => {
    const idx = scenes.findIndex((s) => s.id === sceneId);
    if (idx >= 0) setSceneIndex(idx);
  };

  const handleNext = () => {
    setSceneIndex((i) => (i + 1) % scenes.length);
  };

  const handleSaveDub = (sceneId: string, audioUrl: string) => {
    setDubs((prev) => ({ ...prev, [sceneId]: audioUrl }));
  };

  return (
    <div className="mx-auto min-h-screen max-w-5xl px-4 py-6 sm:py-10">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <p className="tick text-[11px] uppercase tracking-[0.2em] text-[var(--color-magenta)]">
            Dub Mode
          </p>
          <h1 className="font-[var(--font-display)] text-2xl font-semibold text-[var(--color-paper)] sm:text-3xl">
            Redub Studio
          </h1>
        </div>
        <div className="hidden text-right sm:block">
          <p className="tick text-xs text-[var(--color-paper-dim)]">Session</p>
          <p className="tick text-sm text-[var(--color-paper)]">{scenes.length} clips loaded</p>
        </div>
      </header>

      <DubStudio
        scene={scene}
        index={sceneIndex}
        total={scenes.length}
        savedAudioUrl={dubs[scene.id] ?? null}
        onNext={handleNext}
        onSaveDub={handleSaveDub}
      />

      <SceneShelf
        packs={packs}
        scenes={scenes}
        currentSceneId={scene.id}
        savedSceneIds={savedSceneIds}
        onSelect={handleSelectScene}
      />

      <footer className="mt-10 pb-6 text-center text-xs text-[var(--color-paper-dim)]">
        Original fan-made clone built for practicing dub timing. Not affiliated with the original title.
      </footer>
    </div>
  );
}
