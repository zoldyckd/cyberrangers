/// <reference types="@workadventure/iframe-api-typings" />
import { initProgressChecker } from "./progresschecker";

/** Progress config for the OFFICE (Final Boss) room */
export const FINALBOSS_PROGRESS: Record<
  string,
  {
    tasks: { key: string; label: string; area: string }[];
    exitGate?: { area: string; nextRoom: string; warnAnchorId?: string };
    /** Soft in-room gate: blocks passage until a task is visited/completed */
    blockGate?: {
      area: string;                    // trigger rectangle before Peter
      requireTaskKey: string;          // task that must be done/visited
      warnAnchorId?: string;           // popup anchor id
      pushBack?: { dx: number; dy: number }; // where to nudge player
      message?: string;                // custom gate message
    };
  }
> = {
  office: {
    tasks: [
      // Marked done once player ENTERS the CipherX area (visit = ok)
      { key: "finalboss_cipherx", label: "CipherX Quiz", area: "finalboss_cipherx" },
    ],

    // Thin rectangle area in front of Peter named "finalboss_gate"
    // Optional point/1x1 object for popup named "finalboss_gate_popup"
    blockGate: {
      area: "finalboss_gate",
      requireTaskKey: "finalboss_cipherx",
      warnAnchorId: "finalboss_gate_popup",
      pushBack: { dx: 0, dy: 32 }, // push DOWN one tile (you’re walking up toward Peter)
      message:
        "🔒 You must finish the CipherX quiz before proceeding.\nPlease find CipherX in this room first!",
    },
  },
};

/** Helper to wire up this room’s progress with your generic checker */
export function initFinalBossProgress() {
  // @ts-ignore - generic checker may be typed loosely
  initProgressChecker(FINALBOSS_PROGRESS.office);
}
