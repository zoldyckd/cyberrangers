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
        "🏫 Thank the heavens you're here! Brave student, Murdoch University is under a Cyber Attack! We need your help to protect the school against evildoers who wish us harm. Please proceed through the school and learn about how you can help us!",
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
