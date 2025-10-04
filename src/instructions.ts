/// <reference types="@workadventure/iframe-api-typings" />

let previewRef: any | undefined;
let initialized = false;
let enterSub: any | undefined;
let leaveSub: any | undefined;
let popupOpen = false;
let lastOpenAt = 0;

const AREA   = "instructions";        // Tiled area name
const ANCHOR = "instructionsPopup";   // Tiled popup object name
const COOLDOWN_MS = 250;

export function initInstructions() {
  if (initialized) return;  // avoid double init from multiple imports/calls
  initialized = true;

  WA.onInit().then(() => {
    // Clean any previous (hot reload, etc.)
    try { enterSub?.unsubscribe?.(); } catch {}
    try { leaveSub?.unsubscribe?.(); } catch {}

    enterSub = WA.room.area.onEnter(AREA).subscribe(() => {
      const now = Date.now();
      if (now - lastOpenAt < COOLDOWN_MS) return; // debounce
      lastOpenAt = now;

      if (popupOpen) return; // guard against stacking
      closePopup();          // extra safety

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
            },
          },
        ]
      );
      popupOpen = true;
    });

    leaveSub = WA.room.area.onLeave(AREA).subscribe(() => {
      closePopup();
    });
  });
}

function closePopup() {
  try { previewRef?.close?.(); } catch {}
  previewRef = undefined;
  popupOpen = false;
}
