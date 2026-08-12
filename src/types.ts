export interface Scene {
  id: string;
  packId: string;
  title: string;
  caption: string;
  videoUrl: string;
  durationLabel: string;
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
