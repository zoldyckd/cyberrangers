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

  WA.onInit().then(async () => {
    const player = await WA.player.getName();   // ← get the player’s name
    const playerName = player || "Cyber Ranger";

    // (Re)create clean subscriptions
    try { enterSub?.unsubscribe?.(); } catch {}
    try { leaveSub?.unsubscribe?.(); } catch {}

    // When player enters the instructions area
    enterSub = WA.room.area.onEnter(AREA).subscribe(() => {
      closePopup(); // just in case

      popupRef = WA.ui.openPopup(
        ANCHOR,
        `🏫 Thank the heavens you're here, ${playerName}! 

Murdoch University is under a Cyber Attack! We need your help to protect the school against evildoers who wish us harm. Please proceed through the school and learn how you can help us!`,
        [
          {
            label: "Got it!",
            className: "primary",
            callback: () => closePopup(),
          },
        ]
      );
    });

    // When player leaves the instructions area
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
