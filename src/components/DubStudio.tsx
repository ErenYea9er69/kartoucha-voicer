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

const SCORE_VOLUME = 0.55;

export function DubStudio({ scene, index, total, savedAudioUrl, onNext, onSaveDub }: DubStudioProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const voiceRef = useRef<HTMLAudioElement>(null);
  const scoreRef = useRef<HTMLAudioElement>(null);
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
  const hasScore = Boolean(scene.musicUrl);

  const stopEverything = () => {
    const video = videoRef.current;
    const score = scoreRef.current;
    const voice = voiceRef.current;
    video?.pause();
    score?.pause();
    voice?.pause();
  };

  // reset the transient per-scene UI when the scene changes
  useEffect(() => {
    clearTake();
    setIsWatching(false);
    setJustSaved(false);
    stopEverything();
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.muted = false;
    }
    if (scoreRef.current) scoreRef.current.currentTime = 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene.id]);

  const handleHearClip = () => {
    const video = videoRef.current;
    if (!video) return;
    setIsWatching(false);
    scoreRef.current?.pause();
    voiceRef.current?.pause();
    // reference listen: the clip's own original mix, dialogue and score together
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
      scoreRef.current?.pause();
      return;
    }

    const video = videoRef.current;
    const score = scoreRef.current;

    // mute the clip's own audio so only the live mic fills the dialogue,
    // and bring the score bed in underneath it so the music keeps playing
    if (video) {
      video.muted = true;
      video.currentTime = 0;
    }
    if (score && hasScore) {
      score.volume = SCORE_VOLUME;
      score.currentTime = 0;
    }

    startRecording();
    video?.play().catch(() => {});
    if (hasScore) score?.play().catch(() => {});
  };

  const handleWatch = () => {
    const video = videoRef.current;
    const voice = voiceRef.current;
    const score = scoreRef.current;
    if (!video || !voice || !activeTake) return;

    voice.src = activeTake;
    video.muted = true;
    video.currentTime = 0;
    voice.currentTime = 0;
    if (score && hasScore) {
      score.volume = SCORE_VOLUME;
      score.currentTime = 0;
    }
    setIsWatching(true);

    const plays = [video.play(), voice.play()];
    if (hasScore) plays.push(score!.play());
    Promise.all(plays).catch(() => {});
  };

  const handleSaveDub = () => {
    if (!activeTake) return;
    onSaveDub(scene.id, activeTake);
    setJustSaved(true);
    window.setTimeout(() => setJustSaved(false), 1600);
  };

  const handleVideoEnded = () => {
    if (isWatching) {
      voiceRef.current?.pause();
      scoreRef.current?.pause();
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
        {/* the recorded voice take: never touches the clip's own audio */}
        <audio ref={voiceRef} className="hidden" />
        {/* the music-and-effects bed: the score, no dialogue, kept running under the mic */}
        <audio ref={scoreRef} src={scene.musicUrl} loop className="hidden" />

        {showCaption && (
          <p className="mt-3 text-center font-[var(--font-display)] text-sm text-[var(--color-paper)] sm:text-base">
            "{scene.caption}"
          </p>
        )}

        <div className="mt-3 rounded-lg border border-[var(--color-line)] bg-[var(--color-stage-2)] p-2">
          <Waveform levels={levels} active={recordState === "recording"} hasTake={Boolean(activeTake)} />
        </div>

        <p className="tick mt-2 flex items-center gap-1.5 text-[11px] text-[var(--color-paper-dim)]">
          <span
            className={`h-1.5 w-1.5 rounded-full ${hasScore ? "bg-[var(--color-cyan)]" : "bg-[var(--color-line)]"}`}
          />
          {hasScore ? (
            <>Score bed on: {scene.musicLabel}, keeps playing under your take</>
          ) : (
            <>No separate score bed for this clip. Recording replaces the full mix.</>
          )}
        </p>

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
