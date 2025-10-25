/// <reference types="@workadventure/iframe-api-typings" />

/** --- CONFIG --- */
const GATE_AREA = "finalboss_gate";              // rectangle area before Peter (Object layer)
const POPUP_ANCHOR = "finalboss_gate_popup";     // tiny point/area near Peter for the bubble
const TASK_KEY = "finalboss";                    // set true when CipherX is completed
const BLOCK_MSG =
  "🔒 You must finish the CipherX quiz before proceeding.\nPlease find CipherX in this room first!";

/** Internal state */
let goals: Record<string, boolean> = {};
let gateCooldown = false; // prevent spam push

/** Call this from your office room bootstrap */
export async function initFinalBossGate() {
  goals = (await WA.state.loadVariable("goals")) || {};

  WA.room.area.onEnter(GATE_AREA).subscribe(() => {
    if (goals[TASK_KEY]) return; // already cleared → allow pass

    // Show warning near Peter
    if (POPUP_ANCHOR) {
      WA.ui.displayBubble(POPUP_ANCHOR, BLOCK_MSG);
    } else {
      WA.ui.openPopup("finalbossGateWarn", BLOCK_MSG, [
        { label: "OK", className: "primary", callback: (p) => p.close() },
      ]);
    }

    // Nudge player back (DOWN one tile). Adjust if your corridor differs.
    if (!gateCooldown) {
      gateCooldown = true;
      WA.player.moveBy(0, 32, 0.2);
      setTimeout(() => (gateCooldown = false), 400);
    }
  });
}

/** Call this when CipherX quiz is successfully completed */
export async function markFinalBossDone() {
  goals = (await WA.state.loadVariable("goals")) || {};
  goals[TASK_KEY] = true;
  await WA.state.saveVariable("goals", goals);
}
