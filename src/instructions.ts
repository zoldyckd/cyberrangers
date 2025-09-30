/// <reference types="@workadventure/iframe-api-typings" />
import { openInstructionsPopup, closeInstructionsPopup } from "./instructionsPopup";

export function initInstructions() {
  WA.onInit().then(() => {
    // Open when the player steps onto the sign area
    WA.room.area.onEnter("instructions").subscribe(() => {
      openInstructionsPopup();
    });

    // Close when the player steps out
    WA.room.area.onLeave("instructions").subscribe(() => {
      closeInstructionsPopup();
    });
  });
}
