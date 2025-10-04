/// <reference types="@workadventure/iframe-api-typings" />

let inited = false;
let previewRef: any | undefined;

const AREA   = "instructions";        // area name in garden.tmj
const ANCHOR = "instructionsPopup";   // popup rectangle in garden.tmj

export function initInstructions() {
  if (inited) return;           // 🔒 prevent multiple init (stacked subs)
  inited = true;

  WA.onInit().then(() => {
    // Open when entering the area
    WA.room.area.onEnter(AREA).subscribe(() => {
      if (previewRef) return;   // already open; don't stack

      try { previewRef?.close?.(); } catch {}
      previewRef = WA.ui.openPopup(
        ANCHOR,
        "🏫 Cyber Rangers HQ — Welcome to the starting map of Cyber Adventure. Murdoch University is in distress, the students need your help! Look for me when you get to every map for more info! When you're ready, head to the ladder at the top to continue!",
        [
          {
            label: "Close",
            className: "primary",
            callback: closePopup,
          },
        ]
      );

      // safety: auto-close after 15s in case leave event didn't fire
      setTimeout(() => closePopup(), 15000);
    });

    // Close when leaving the area
    WA.room.area.onLeave(AREA).subscribe(() => {
      closePopup();
    });
  });
}

function closePopup() {
  try { previewRef?.close?.(); } catch {}
  previewRef = undefined;
}
