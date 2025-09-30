/// <reference types="@workadventure/iframe-api-typings" />

const AREA_NAME = "instructions";          // Tiled object (Class: area)
const POPUP_ANCHOR = "instructionsPopup";  // Tiled popup anchor
const REOPEN_COOLDOWN_MS = 250;            // debounce against spammy enter/leave

let ref: any | undefined;
let inArea = false;
let lastOpen = 0;
let opening = false;

// prevent duplicate subscriptions if hot-reload
if (!(window as any).__BOUND_INSTRUCTIONS__) {
  (window as any).__BOUND_INSTRUCTIONS__ = true;

  export function initInstructions() {
    WA.onInit().then(() => {
      WA.room.area.onEnter(AREA_NAME).subscribe(() => {
        inArea = true;
        openInstructionsPopup();
      });

      WA.room.area.onLeave(AREA_NAME).subscribe(() => {
        inArea = false;
        closeInstructionsPopup();
      });
    });
  }
}

function openInstructionsPopup() {
  const now = Date.now();
  if (opening) return;                      // already in the middle of opening
  if (ref) return;                          // already open
  if (now - lastOpen < REOPEN_COOLDOWN_MS) return; // debounce rapid toggles
  if (!inArea) return;                      // only open if we're still inside

  opening = true;
  // hard close any ghost popup just in case
  try { ref?.close?.(); } catch {}
  ref = undefined;

  try {
    ref = WA.ui.openPopup(
      POPUP_ANCHOR,
      "📜 Welcome! This signage explains what to do next. Read carefully, then walk away to close.",
      [
        {
          label: "Got it",
          className: "primary",
          callback: () => {
            // user acknowledged -> close and prevent immediate reopen until they exit & re-enter
            closeInstructionsPopup();
          },
        },
      ]
    );
    lastOpen = now;
  } finally {
    opening = false;
  }
}

function closeInstructionsPopup() {
  if (!ref) return;
  try { ref.close?.(); } catch {}
  ref = undefined;
}
