import { useCallback, useEffect, useRef, useState } from "react";

const BAR_COUNT = 64;

export type MicState = "unarmed" | "arming" | "armed" | "denied";
export type RecordState = "idle" | "recording" | "stopped";

export function useRecorder() {
  const [micState, setMicState] = useState<MicState>("unarmed");
  const [recordState, setRecordState] = useState<RecordState>("idle");
  const [levels, setLevels] = useState<number[]>(() => new Array(BAR_COUNT).fill(0.04));
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const rafRef = useRef<number | null>(null);

  const stopMeter = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const runMeter = useCallback(() => {
    const analyser = analyserRef.current;
    if (!analyser) return;
    const data = new Uint8Array(analyser.frequencyBinCount);

    const tick = () => {
      analyser.getByteTimeDomainData(data);
      let sum = 0;
      for (let i = 0; i < data.length; i++) {
        const v = (data[i] - 128) / 128;
        sum += v * v;
      }
      const rms = Math.sqrt(sum / data.length);
      const level = Math.min(1, rms * 3.2);

      setLevels((prev) => {
        const next = prev.slice(1);
        next.push(Math.max(0.04, level));
        return next;
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const armMic = useCallback(async () => {
    setError(null);
    setMicState("arming");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const ctx = new AudioContext();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      source.connect(analyser);

      audioCtxRef.current = ctx;
      analyserRef.current = analyser;

      setMicState("armed");
    } catch (err) {
      console.error(err);
      setMicState("denied");
      setError("Microphone access was blocked. Allow it in your browser's site settings and reset the mic.");
    }
  }, []);

  const resetMic = useCallback(() => {
    stopMeter();
    recorderRef.current?.stream.getTracks().forEach((t) => t.stop());
    streamRef.current?.getTracks().forEach((t) => t.stop());
    audioCtxRef.current?.close().catch(() => {});
    streamRef.current = null;
    audioCtxRef.current = null;
    analyserRef.current = null;
    recorderRef.current = null;
    chunksRef.current = [];
    setMicState("unarmed");
    setRecordState("idle");
    setLevels(new Array(BAR_COUNT).fill(0.04));
    setAudioUrl(null);
    setError(null);
  }, [stopMeter]);

  const startRecording = useCallback(() => {
    const stream = streamRef.current;
    if (!stream) return;

    chunksRef.current = [];
    const mimeType = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : undefined;
    const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
      setAudioUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(blob);
      });
      stopMeter();
      setLevels(new Array(BAR_COUNT).fill(0.04));
    };

    recorderRef.current = recorder;
    recorder.start(100);
    setRecordState("recording");
    setAudioUrl(null);
    runMeter();
  }, [runMeter, stopMeter]);

  const stopRecording = useCallback(() => {
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
    }
    setRecordState("stopped");
  }, []);

  const clearTake = useCallback(() => {
    setAudioUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setRecordState("idle");
  }, []);

  useEffect(() => {
    return () => {
      stopMeter();
      streamRef.current?.getTracks().forEach((t) => t.stop());
      audioCtxRef.current?.close().catch(() => {});
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
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
  };
}
