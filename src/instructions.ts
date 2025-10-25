/// <reference types="@workadventure/iframe-api-typings" />

let popupRef: any | undefined;
let enterSub: any | undefined;
let leaveSub: any | undefined;
let initialized = false;

const AREA = "instructions";       // must match your Tiled area name
const ANCHOR = "instructionsPopup";  // must match your Tiled popup object

export function initInstructions() {
  if (initialized) return;          // prevent double-binding if file gets imported twice
  initialized = true;

  WA.onInit().then(() => {
    // Clean up previous subscriptions (safety)
    try { enterSub?.unsubscribe?.(); } catch {}
    try { leaveSub?.unsubscribe?.(); } catch {}

    // Subscribe to entering the area
    enterSub = WA.room.area.onEnter(AREA).subscribe(() => {
      closePopup(); // avoid duplicate popups

      const playerName = WA.player.name || "Cyber Ranger";

      popupRef = WA.ui.openPopup(
        ANCHOR,
        `🏫 Thank the heavens you're here, ${playerName}!  
Murdoch University is under a Cyber Attack! We need your help to protect the school against evildoers who wish us harm.  
Please proceed through the school and learn about how you can help us!`,
        [
          {
            label: "Got it!",
            className: "primary",
            callback: () => closePopup(),
          },
        ]
      );
    });

    // Subscribe to leaving the area
    leaveSub = WA.room.area.onLeave(AREA).subscribe(() => {
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
