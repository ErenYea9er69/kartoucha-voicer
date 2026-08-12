import { useMemo, useState } from "react";
import type { Pack, Scene } from "../types";

const TINT_CLASSES: Record<string, string> = {
  magenta: "from-[#3a1c30] to-[#1c1d22]",
  cyan: "from-[#173238] to-[#1c1d22]",
  amber: "from-[#3a2c12] to-[#1c1d22]",
};

const TINT_BORDER: Record<string, string> = {
  magenta: "border-[var(--color-magenta)]",
  cyan: "border-[var(--color-cyan)]",
  amber: "border-[var(--color-amber)]",
};

interface SceneShelfProps {
  packs: Pack[];
  scenes: Scene[];
  currentSceneId: string;
  savedSceneIds: Set<string>;
  onSelect: (sceneId: string) => void;
}

export function SceneShelf({ packs, scenes, currentSceneId, savedSceneIds, onSelect }: SceneShelfProps) {
  const [activePack, setActivePack] = useState<string>("all");

  const filtered = useMemo(() => {
    if (activePack === "all") return scenes;
    return scenes.filter((s) => s.packId === activePack);
  }, [scenes, activePack]);

  return (
    <div className="mt-8">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-[var(--font-display)] text-sm uppercase tracking-wide text-[var(--color-paper-dim)]">
          Choose a scene
        </h2>
        <p className="tick text-xs text-[var(--color-paper-dim)]">
          {savedSceneIds.size} of {scenes.length} dubbed
        </p>
      </div>

      <div className="shelf-scroll mb-4 flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActivePack("all")}
          className={`tick shrink-0 rounded-full border px-3 py-1 text-xs transition-colors ${
            activePack === "all"
              ? "border-[var(--color-paper)] bg-[var(--color-paper)] text-[var(--color-cyan-ink)]"
              : "border-[var(--color-line)] text-[var(--color-paper-dim)] hover:border-[var(--color-paper-dim)]"
          }`}
        >
          All scenes
        </button>
        {packs.map((pack) => (
          <button
            key={pack.id}
            onClick={() => setActivePack(pack.id)}
            className={`tick shrink-0 rounded-full border px-3 py-1 text-xs transition-colors ${
              activePack === pack.id
                ? "border-[var(--color-paper)] bg-[var(--color-paper)] text-[var(--color-cyan-ink)]"
                : "border-[var(--color-line)] text-[var(--color-paper-dim)] hover:border-[var(--color-paper-dim)]"
            }`}
          >
            {pack.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {filtered.map((scene) => {
          const pack = packs.find((p) => p.id === scene.packId);
          const tint = pack?.tint ?? "cyan";
          const isCurrent = scene.id === currentSceneId;
          const isDubbed = savedSceneIds.has(scene.id);

          return (
            <button
              key={scene.id}
              onClick={() => onSelect(scene.id)}
              className={`group relative overflow-hidden rounded-lg border bg-gradient-to-br p-3 text-left transition-transform hover:-translate-y-0.5 ${
                TINT_CLASSES[tint]
              } ${isCurrent ? TINT_BORDER[tint] : "border-[var(--color-line)]"}`}
            >
              <div className="flex items-start justify-between">
                <span className="tick text-[10px] text-[var(--color-paper-dim)]">{scene.durationLabel}</span>
                {isDubbed && (
                  <span className="tick rounded-sm bg-[var(--color-cyan)] px-1 text-[10px] text-[var(--color-cyan-ink)]">
                    ✓ dubbed
                  </span>
                )}
              </div>
              <p className="mt-4 font-[var(--font-display)] text-sm font-medium text-[var(--color-paper)]">
                {scene.title}
              </p>
              <p className="mt-1 line-clamp-2 text-xs text-[var(--color-paper-dim)]">"{scene.caption}"</p>
              {isCurrent && (
                <span className="tick absolute bottom-2 right-2 text-[10px] text-[var(--color-paper)]">
                  on stage
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
