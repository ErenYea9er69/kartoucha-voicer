import type { ReactNode } from "react";

interface RailButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  tone?: "cyan" | "magenta" | "ghost";
  active?: boolean;
}

function RailButton({ children, onClick, disabled, tone = "ghost", active }: RailButtonProps) {
  const base =
    "w-full rounded-md px-3 py-2 text-sm font-medium font-[var(--font-display)] tracking-wide transition-colors border";

  const toneClasses = {
    cyan: "bg-[var(--color-cyan)] text-[var(--color-cyan-ink)] border-[var(--color-cyan)] hover:brightness-95",
    magenta: "bg-[var(--color-magenta)] text-white border-[var(--color-magenta)] hover:brightness-105",
    ghost:
      "bg-[var(--color-panel-2)] text-[var(--color-paper)] border-[var(--color-line)] hover:border-[var(--color-paper-dim)]",
  }[tone];

  const disabledClasses = "opacity-35 cursor-not-allowed hover:brightness-100";
  const activeRing = active ? "ring-2 ring-offset-2 ring-offset-[var(--color-panel)] ring-[var(--color-magenta)]" : "";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${toneClasses} ${disabled ? disabledClasses : ""} ${activeRing}`}
    >
      {children}
    </button>
  );
}

interface ControlRailProps {
  index: number;
  total: number;
  isRecording: boolean;
  hasTake: boolean;
  micArmed: boolean;
  onHearClip: () => void;
  onToggleRecord: () => void;
  onNext: () => void;
  onWatch: () => void;
  onSaveDub: () => void;
  onResetMic: () => void;
  onOptions: () => void;
  saved: boolean;
}

export function ControlRail({
  index,
  total,
  isRecording,
  hasTake,
  micArmed,
  onHearClip,
  onToggleRecord,
  onNext,
  onWatch,
  onSaveDub,
  onResetMic,
  onOptions,
  saved,
}: ControlRailProps) {
  return (
    <div className="flex h-full w-full flex-col gap-2 rounded-lg border border-[var(--color-line)] bg-[var(--color-panel)] p-3 sm:w-52">
      <div className="mb-1 rounded-md border border-[var(--color-line)] bg-[var(--color-stage-2)] px-3 py-2 text-center">
        <p className="tick text-[10px] uppercase text-[var(--color-paper-dim)]">On clip</p>
        <p className="tick text-sm text-[var(--color-paper)]">
          {index + 1} of {total}
        </p>
      </div>

      <RailButton onClick={onHearClip} tone="ghost">
        Hear clip again
      </RailButton>

      <RailButton onClick={onToggleRecord} tone="magenta" active={isRecording}>
        {isRecording ? "Stop" : micArmed ? "Record" : "Arm mic"}
      </RailButton>

      <div className="my-1 h-px bg-[var(--color-line)]" />

      <RailButton onClick={onNext} tone="ghost">
        Next ▶
      </RailButton>
      <RailButton onClick={onWatch} tone="ghost" disabled={!hasTake}>
        Watch
      </RailButton>
      <RailButton onClick={onSaveDub} tone={saved ? "cyan" : "ghost"} disabled={!hasTake}>
        {saved ? "Saved ✓" : "Save Dub"}
      </RailButton>

      <div className="my-1 h-px bg-[var(--color-line)]" />

      <RailButton onClick={onResetMic} tone="cyan">
        Reset Mic
      </RailButton>

      <div className="flex-1" />

      <RailButton onClick={onOptions} tone="ghost">
        Options
      </RailButton>
    </div>
  );
}
