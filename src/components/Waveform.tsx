import { useEffect, useRef } from "react";

interface WaveformProps {
  levels: number[];
  active: boolean;
  hasTake: boolean;
}

export function Waveform({ levels, active, hasTake }: WaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, width, height);

    const mid = height / 2;
    const barCount = levels.length;
    const gap = 2;
    const barWidth = width / barCount - gap;

    ctx.strokeStyle = "rgba(242, 177, 52, 0.5)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, mid);
    ctx.lineTo(width, mid);
    ctx.stroke();

    levels.forEach((level, i) => {
      const x = i * (barWidth + gap);
      const barHeight = Math.max(2, level * (height * 0.42));

      const mainColor = active ? "#e63aa8" : hasTake ? "#b9e6ef" : "#4b3a48";
      ctx.fillStyle = mainColor;
      ctx.fillRect(x, mid - barHeight, barWidth, barHeight * 2);

      const echoColor = active ? "rgba(230, 58, 168, 0.28)" : "rgba(185, 230, 239, 0.16)";
      ctx.fillStyle = echoColor;
      const echoHeight = barHeight * 0.5;
      ctx.fillRect(x, height - echoHeight - 3, barWidth, echoHeight);
    });
  }, [levels, active, hasTake]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="h-24 w-full rounded-sm"
        style={{ width: "100%", height: "96px" }}
      />
      {active && (
        <span className="tick absolute right-2 top-1.5 flex items-center gap-1 text-[10px] text-magenta">
          <span className="h-1.5 w-1.5 animate-rec-pulse rounded-full bg-[var(--color-magenta)]" />
          LIVE INPUT
        </span>
      )}
    </div>
  );
}
