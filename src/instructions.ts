/// <reference types="@workadventure/iframe-api-typings" />

let previewRef: any | undefined;

const AREA   = "instructions";        // area name in Tiled
const ANCHOR = "instructionsPopup";   // popup rectangle in Tiled

export function initInstructions() {
  WA.onInit().then(() => {
    WA.room.area.onEnter(AREA).subscribe(() => {
      closePopup();
      previewRef = WA.ui.openPopup(
        ANCHOR,
        "🏫 Cyber Rangers HQ — Welcome to the starting map of Cyber Adventure. Murdoch University is in distress, the students need your help! Look for me when you get to every map for more info! When you're ready, head to the ladder at the top to continue!",
        [{ label: "Close", className: "primary", callback: () => closePopup() }]
      );
    });

    WA.room.area.onLeave(AREA).subscribe(() => {
      closePopup();
    });
  });
}

function closePopup() {
  try {
    if (previewRef) {
      previewRef.close?.();
      previewRef = undefined; // important reset
    }
  } catch {
    previewRef = undefined;
  }
}
