/// <reference types="@workadventure/iframe-api-typings" />

const AREA_NAME = "instructions";         // Tiled object (Class: area)
const POPUP_ANCHOR = "instructionsPopup"; // Tiled popup anchor

let ref: any | undefined;
let insideCount = 0;

// prevent duplicate subscriptions if hot-reload
if (!(window as any).__BOUND_INSTRUCTIONS__) {
  (window as any).__BOUND_INSTRUCTIONS__ = true;

  export function initInstructions() {
    WA.onInit().then(() => {
      WA.room.area.onEnter(AREA_NAME).subscribe(() => {
        insideCount++;
        openInstructionsPopup();
      });

      WA.room.area.onLeave(AREA_NAME).subscribe(() => {
        insideCount = Math.max(0, insideCount - 1);
        if (insideCount === 0) closeInstructionsPopup();
      });
    });
  }
}

function openInstructionsPopup() {
  if (ref) return; // already open

  ref = WA.ui.openPopup(
    POPUP_ANCHOR,
    "📜 Welcome! This signage explains what to do next. Read carefully, then walk away to close.",
    [
      {
        label: "Got it",
        className: "primary",
        callback: () => closeInstructionsPopup(),
      },
    ]
  );
}

function closeInstructionsPopup() {
  if (!ref) return;
  try { ref.close?.(); } catch {}
  ref = undefined;
}
