/// <reference types="@workadventure/iframe-api-typings" />

let popupRef: any | undefined;
let enterSub: any | undefined;
let leaveSub: any | undefined;
let initialized = false;

const AREA   = "instructions";       // must match your Tiled area name
const ANCHOR = "instructionsPopup";  // must match your Tiled popup object

export function initInstructions() {
  if (initialized) return;           // prevent double-binding if file gets imported twice
  initialized = true;

  WA.onInit().then(() => {
    // (Re)create clean subscriptions
    try { enterSub?.unsubscribe?.(); } catch {}
    try { leaveSub?.unsubscribe?.(); } catch {}

    enterSub = WA.room.area.onEnter(AREA).subscribe(() => {
      closePopup(); // just in case
      popupRef = WA.ui.openPopup(
        ANCHOR,
        "🏫 Cyber Rangers HQ — Welcome to the starting map of Cyber Adventure. Murdoch University is in distress, the students need your help! Look for me, Professor Byte, when you get to every map for more info! When you're ready, head to the ladder at the top to continue!",
        [
          {
            label: "Close",
            className: "primary",
            callback: () => closePopup(),
          },
        ]
      );
    });

    leaveSub = WA.room.area.onLeave(AREA).subscribe(() => {
      // Always close when walking out of the area
      closePopup();
    });
  });
}

function closePopup() {
  try {
    popupRef?.close?.();
  } catch { /* ignore */ }
  popupRef = undefined;
}
