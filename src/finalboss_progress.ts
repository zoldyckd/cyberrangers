/// <reference types="@workadventure/iframe-api-typings" />
import { initProgressChecker } from "./progresschecker";

/** Progress config for the OFFICE (Final Boss) room */
export const FINALBOSS_PROGRESS: Record<
  string,
  {
    tasks: { key: string; label: string; area: string }[];
    exitGate?: { area: string; nextRoom: string; warnAnchorId?: string };
    /** Soft gate inside the room (no room change) */
    blockGate?: {
      area: string;
      requireTaskKey: string;
      warnAnchorId?: string;
      pushBack?: { dx: number; dy: number };
      /** NEW: custom message shown when blocked */
      message?: string;
    };
  }
> = {
  office: {
    tasks: [
      // Boss encounter area (popup → Twine quiz)
      { key: "finalboss", label: "Face CipherX", area: "finalboss_cipherx" },
    ],

    // Thin rectangle area before Peter named "finalboss_gate"
    // Optional anchor point for popup named "finalboss_gate_popup"
    blockGate: {
      area: "finalboss_gate",
      requireTaskKey: "finalboss",
      warnAnchorId: "finalboss_gate_popup",
      pushBack: { dx: -32, dy: 0 },
      message:
        "🔒 You must finish the CipherX quiz before proceeding. Please find CipherX in this room first!",
    },
  },
};

/** Helper to initialize this map’s progress */
export function initFinalBossProgress() {
  // @ts-ignore - generic checker accepts SingleMapConfig
  initProgressChecker(FINALBOSS_PROGRESS.office);
}
