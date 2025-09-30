/// <reference types="@workadventure/iframe-api-typings" />

const AREA_NAME = "instructions";          // Tiled area name
const POPUP_ANCHOR = "instructionsPopup";  // Tiled popup object name

let ref: any | undefined;
let bound = false;

export function initInstructions() {
  if (bound) return;
  bound = true;

  WA.onInit().then(() => {
    // Open when entering area
    WA.room.area.onEnter(AREA_NAME).subscribe(() => {
      openInstructionsPopup();
    });

    // Close when leaving area
    WA.room.area.onLeave(AREA_NAME).subscribe(() => {
      closeInstructionsPopup();
    });
  });
}

function openInstructionsPopup() {
  closeInstructionsPopup(); // prevent duplicates

  ref = WA.ui.openPopup(
    POPUP_ANCHOR,
    "🪧 Cyber Rangers HQ - There are 5 maps to explore and learn cybersecurity: Phishing, Malware, Password Security, Safe Internet Practices, Identity Theft. Check the signage in every map for what to do. When you’re ready, head to the ladder beside the billboard to continue!",
    [] // 👈 no buttons
  );
}

function closeInstructionsPopup() {
  if (!ref) return;
  try { ref.close?.(); } catch {}
  ref = undefined;
}
