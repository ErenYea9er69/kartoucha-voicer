export interface Scene {
  id: string;
  packId: string;
  title: string;
  caption: string;
  videoUrl: string;
  durationLabel: string;
  /** Music-and-effects bed: the scene's score with no dialogue on it.
   *  When set, the studio keeps this playing under the mic and mutes
   *  the clip's own baked-in audio, so only the voice gets replaced. */
  musicUrl?: string;
  musicLabel?: string;
}

export interface Pack {
  id: string;
  name: string;
  tint: string;
}

export interface Dub {
  sceneId: string;
  audioUrl: string;
  recordedAt: number;
}

export type StudioStatus = "idle" | "arming" | "recording" | "reviewing" | "watching";
