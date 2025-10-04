/// <reference types="@workadventure/iframe-api-typings" />

let previewRef: any | undefined;
let popupOpen = false;         // guard against stacking
let initialized = false;       // guard against double init
let lastOpenAt = 0;            // tiny debounce

const AREA   = "instructions";        // Tiled area name
const ANCHOR = "instructionsPopup";   // Tiled popup object name
const COOLDOWN_MS = 250;

export function initInstructions() {
  if (initialized) return;     // prevent duplicate subscriptions
  initialized = true;

  WA.onInit().then(() => {
    WA.room.area.onEnter(AREA).subscribe(() => {
      // debounce rapid re-fires
      const now = Date.now();
      if (now - lastOpenAt < COOLDOWN_MS) return;
      lastOpenAt = now;

      if (popupOpen) return;   // already showing → don't open again

      closePopup();            // extra safety
      previewRef = WA.ui.openPopup(
        ANCHOR,
        "🏫 Cyber Rangers HQ — Welcome to the starting map of Cyber Adventure. Murdoch University is in distress, the students need your help! Look for me when you get to every map for more info! When you're ready, head to the ladder at the top to continue!",
        [
          {
            label: "Close",
            className: "primary",
            callback: (popup) => {
              try { popup.close?.(); } catch {}
              closePopup();
            }
          }
        ]
      );
      popupOpen = true;
    });

    WA.room.area.onLeave(AREA).subscribe(() => {
      closePopup();
    });
  });
}

function closePopup() {
  try {
    if (previewRef) previewRef.close?.();
  } catch {}
  previewRef = undefined;
  popupOpen = false;
}
