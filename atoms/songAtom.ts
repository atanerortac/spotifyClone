import { atom } from "recoil";

export const currentTrackIdState: any = atom({
  key: "currentTrackIdState",
  default: null,
});

export const isPlayingState: any = atom({
  key: "isPlayingState",
  default: false,
});
