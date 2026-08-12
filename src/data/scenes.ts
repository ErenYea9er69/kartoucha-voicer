import type { Pack, Scene } from "../types";

const GTV = "https://storage.googleapis.com/gtv-videos-bucket/sample";

export const packs: Pack[] = [
  { id: "melodrama", name: "Melodrama Pack", tint: "magenta" },
  { id: "action", name: "Action Pack", tint: "cyan" },
  { id: "roadtrip", name: "Roadtrip Pack", tint: "amber" },
];

export const scenes: Scene[] = [
  {
    id: "s01",
    packId: "melodrama",
    title: "The Confession",
    caption: "Bear, I love you so, so, so, so, so much...",
    videoUrl: `${GTV}/ElephantsDream.mp4`,
    durationLabel: "0:07",
  },
  {
    id: "s02",
    packId: "melodrama",
    title: "One Last Look",
    caption: "You were never supposed to open that door.",
    videoUrl: `${GTV}/Sintel.mp4`,
    durationLabel: "0:05",
  },
  {
    id: "s03",
    packId: "melodrama",
    title: "The Apology",
    caption: "I should have told you the truth in the spring.",
    videoUrl: `${GTV}/TearsOfSteel.mp4`,
    durationLabel: "0:08",
  },
  {
    id: "s04",
    packId: "action",
    title: "The Countdown",
    caption: "Ten seconds. That's all the bridge has left.",
    videoUrl: `${GTV}/ForBiggerBlazes.mp4`,
    durationLabel: "0:04",
  },
  {
    id: "s05",
    packId: "action",
    title: "The Escape",
    caption: "Don't look back, just run for the fence!",
    videoUrl: `${GTV}/ForBiggerEscapes.mp4`,
    durationLabel: "0:06",
  },
  {
    id: "s06",
    packId: "action",
    title: "The Standoff",
    caption: "Put it down. This ends now, right here.",
    videoUrl: `${GTV}/ForBiggerMeltdowns.mp4`,
    durationLabel: "0:05",
  },
  {
    id: "s07",
    packId: "roadtrip",
    title: "First Gear",
    caption: "Nobody said the desert would sound like this.",
    videoUrl: `${GTV}/ForBiggerJoyrides.mp4`,
    durationLabel: "0:06",
  },
  {
    id: "s08",
    packId: "roadtrip",
    title: "Wrong Turn",
    caption: "This map stopped making sense two exits ago.",
    videoUrl: `${GTV}/ForBiggerFun.mp4`,
    durationLabel: "0:07",
  },
  {
    id: "s09",
    packId: "roadtrip",
    title: "Flat Tire",
    caption: "We are, officially, going nowhere fast.",
    videoUrl: `${GTV}/WeAreGoingOnBullrun.mp4`,
    durationLabel: "0:05",
  },
];
