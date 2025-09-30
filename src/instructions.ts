/// <reference types="@workadventure/iframe-api-typings" />
import { openInstructionsPopup, closeInstructionsPopup, ensurePopupClosed } from "./instructionsPopup";

let insideCount = 0;               // robust against multi-tile / multi-rect areas
let bound = (window as any).__INSTR_BOUND__;
if (!bound) {
  (window as any).__INSTR_BOUND__ = true;

  export function initInstructions() {
    WA.onInit().then(() => {
      // Enter
      WA.room.area.onEnter("instructions").subscribe(() => {
        insideCount++;
        // idempotent: close any old one first, then open
        ensurePopupClosed();
        openInstructionsPopup();
      });

      // Leave
      WA.room.area.onLeave("instructions").subscribe(() => {
        insideCount = Math.max(0, insideCount - 1);
        if (insideCount === 0) {
          closeInstructionsPopup();
        }
      });
    });
  }
}
