/// <reference types="@workadventure/iframe-api-typings" />
import { initProgressChecker } from "./progresschecker";

/** Progress config for the COMPUTER LAB (ID Theft) room */
export const IDTHEFT_PROGRESS: Record<
  string,
  {
    tasks: { key: string; label: string; area: string }[];
    exitGate?: { area: string; nextRoom: string; warnAnchorId?: string };
  }
> = {
  computerlab: {
    tasks: [
      { key: "idtheft_instructions",       label: "Slides",                 area: "idtheft_instructions" },
      { key: "idtheft_sensitivepapers",    label: "Sensitive Papers",       area: "idtheft_sensitivepapers" },
      { key: "idtheft_customerservicecall",label: "Customer Service Call",  area: "idtheft_customerservicecall" },
      { key: "idtheft_celebration",        label: "Celebration",            area: "idtheft_celebration" },
    ],
    exitGate: {
      area: "to-office",
      nextRoom: "office",           // TODO: set to your actual Office room path/id
      warnAnchorId: "idtheft_gate_popup",
    },
  },
};

/** Helper to wire up this room’s progress with your generic checker */
export function initIDTheftProgress() {
  // If your checker expects just the object, this works. Otherwise, adapt as needed.
  // @ts-ignore - generic checker may be typed loosely
  initProgressChecker(IDTHEFT_PROGRESS.computerlab);
}
