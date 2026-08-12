import { useEffect, useRef, useState } from "react";
import type { Scene } from "../types";
import { useRecorder } from "../hooks/useRecorder";
import { Waveform } from "./Waveform";
import { ControlRail } from "./ControlRail";

interface DubStudioProps {
  scene: Scene;
  index: number;
  total: number;
  savedAudioUrl: string | null;
  onNext: () => void;
  onSaveDub: (sceneId: string, audioUrl: string) => void;
}

export function DubStudio({ scene, index, total, savedAudioUrl, onNext, onSaveDub }: DubStudioProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [showCaption, setShowCaption] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  const [isWatching, setIsWatching] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  const {
    micState,
    recordState,
    levels,
    audioUrl,
    error,
    armMic,
    resetMic,
    startRecording,
    stopRecording,
    clearTake,
  } = useRecorder();

  const activeTake = audioUrl ?? savedAudioUrl;

  // reset the transient per-scene UI when the scene changes
  useEffect(() => {
    clearTake();
    setIsWatching(false);
    setJustSaved(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.muted = false;
      videoRef.current.pause();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene.id]);

  const handleHearClip = () => {
    const video = videoRef.current;
    if (!video) return;
    setIsWatching(false);
    video.muted = false;
    video.currentTime = 0;
    video.play().catch(() => {});
  };

  const handleToggleRecord = async () => {
    if (micState === "unarmed" || micState === "denied") {
      await armMic();
      return;
    }
    if (recordState === "recording") {
      stopRecording();
      videoRef.current?.pause();
      return;
    }
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.currentTime = 0;
      video.play().catch(() => {});
    }
    startRecording();
  };

  const handleWatch = () => {
    const video = videoRef.current;
    const audio = audioRef.current;
    if (!video || !audio || !activeTake) return;
    audio.src = activeTake;
    video.muted = true;
    video.currentTime = 0;
    audio.currentTime = 0;
    setIsWatching(true);
    Promise.all([video.play(), audio.play()]).catch(() => {});
  };

  const handleSaveDub = () => {
    if (!activeTake) return;
    onSaveDub(scene.id, activeTake);
    setJustSaved(true);
    window.setTimeout(() => setJustSaved(false), 1600);
  };

  const handleVideoEnded = () => {
    if (isWatching) {
      audioRef.current?.pause();
      setIsWatching(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <div className="flex-1">
        <div className="overflow-hidden rounded-lg border border-[var(--color-line)] bg-black">
          <video
            ref={videoRef}
            src={scene.videoUrl}
            className="aspect-video w-full bg-black object-cover"
            playsInline
            onEnded={handleVideoEnded}
          />
        </div>
        <audio ref={audioRef} className="hidden" />

        {showCaption && (
          <p className="mt-3 text-center font-[var(--font-display)] text-sm text-[var(--color-paper)] sm:text-base">
            "{scene.caption}"
          </p>
        )}

        <div className="mt-3 rounded-lg border border-[var(--color-line)] bg-[var(--color-stage-2)] p-2">
          <Waveform levels={levels} active={recordState === "recording"} hasTake={Boolean(activeTake)} />
        </div>

        {error && (
          <p className="mt-2 text-xs text-[var(--color-magenta)]" role="alert">
            {error}
          </p>
        )}

        {showOptions && (
          <div className="mt-3 flex flex-wrap gap-4 rounded-lg border border-[var(--color-line)] bg-[var(--color-panel)] p-3 text-sm">
            <label className="flex items-center gap-2 text-[var(--color-paper-dim)]">
              <input
                type="checkbox"
                checked={showCaption}
                onChange={(e) => setShowCaption(e.target.checked)}
                className="accent-[var(--color-magenta)]"
              />
              Show caption
            </label>
            <span className="text-[var(--color-paper-dim)]">
              Mic status: <span className="tick text-[var(--color-paper)]">{micState}</span>
            </span>
          </div>
        )}
      </div>

      <ControlRail
        index={index}
        total={total}
        isRecording={recordState === "recording"}
        hasTake={Boolean(activeTake)}
        micArmed={micState === "armed"}
        onHearClip={handleHearClip}
        onToggleRecord={handleToggleRecord}
        onNext={onNext}
        onWatch={handleWatch}
        onSaveDub={handleSaveDub}
        onResetMic={resetMic}
        onOptions={() => setShowOptions((v) => !v)}
        saved={justSaved}
      />
    </div>
  );
}
