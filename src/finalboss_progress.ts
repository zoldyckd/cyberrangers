/// <reference types="@workadventure/iframe-api-typings" />
import { initProgressChecker } from "./progresschecker";

/** Progress config for the OFFICE (Final Boss) room */
export const FINALBOSS_PROGRESS: Record<
  string,
  {
    tasks: { key: string; label: string; area: string }[];
    exitGate?: { area: string; nextRoom: string; warnAnchorId?: string };
  }
> = {
  office: {
    tasks: [
      // Boss encounter area (popup → Twine quiz)
      { key: "finalboss",   label: "Face CipherX",     area: "finalboss_cipherx" },
      // Post-quiz congratulations area
      { key: "ending",      label: "Ending Message",    area: "endingmessage" },
      // Stairs area to open survey
      { key: "survey",      label: "Survey",            area: "survey" },
    ],
    // No exit gate for final room (end of game). Add one here if you later need it.
    // exitGate: { area: "to-somewhere", nextRoom: "garden", warnAnchorId: "finalboss_gate_popup" },
  },
};

/** Helper to initialize this map’s progress */
export function initFinalBossProgress() {
  // @ts-ignore - generic checker accepts SingleMapConfig
  initProgressChecker(FINALBOSS_PROGRESS.office);
}
