/// <reference types="@workadventure/iframe-api-typings" />

const AREA   = "instructions";
const ANCHOR = "instructionsPopup";

let enterSub: any;
let leaveSub: any;
let popupRef: any | undefined;
let open = false;

function runOnlyOn(mapFile: string, fn: () => void) {
  WA.onInit().then(() => {
    if (WA.room.mapURL?.endsWith(`/${mapFile}`)) fn();
  });
}

export function initInstructions() {
  // prevent double init
  // @ts-ignore
  if ((window as any).__initInstructionsDone) return;
  // @ts-ignore
  (window as any).__initInstructionsDone = true;

  runOnlyOn("garden.tmj", () => {
    enterSub = WA.room.area.onEnter(AREA).subscribe(() => {
      if (open) return;
      safeClose();

      popupRef = WA.ui.openPopup(
        ANCHOR,
        "🏫 Cyber Rangers HQ — Welcome to the starting map of Cyber Adventure. Murdoch University is in distress, the students need your help! Look for me when you get to every map for more info! When you're ready, head to the ladder at the top to continue!",
        [
          {
            label: "Close",
            className: "primary",
            callback: () => safeClose()
          }
        ]
      );
      open = true;
    });

    leaveSub = WA.room.area.onLeave(AREA).subscribe(() => {
      safeClose();
    });
  });
}

function safeClose() {
  try { popupRef?.close?.(); } catch {}
  popupRef = undefined;
  open = false;
}
