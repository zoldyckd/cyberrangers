/// <reference types="@workadventure/iframe-api-typings" />

const AREA_NAME = "instructions";          // Tiled area name (Class: area)
const POPUP_ANCHOR = "instructionsPopup";  // Tiled popup anchor name

let ref: any | undefined;
let bound = false;

export function initInstructions() {
  if (bound) return;
  bound = true;

  WA.onInit().then(() => {
    WA.room.area.onEnter(AREA_NAME).subscribe(() => {
      open();
    });

    WA.room.area.onLeave(AREA_NAME).subscribe(() => {
      close();
    });
  });
}

function open() {
  // hard-close any ghost instance, then open without a footer
  try { ref?.close?.(); } catch {}
  ref = undefined;

  ref = WA.ui.openPopup(
    POPUP_ANCHOR,
    "🪧 Cyber Rangers HQ - There are 5 maps to explore and learn cybersecurity: Phishing, Malware, Password Security, Safe Internet Practices, Identity Theft. Check the signage in every map for what to do. When you’re ready, head to the ladder beside the billboard to continue!"
    // 👈 no third parameter → no bottom bar
  );
}

function close() {
  if (!ref) return;
  try { ref.close?.(); } catch {}
  ref = undefined;
}
