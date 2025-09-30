/// <reference types="@workadventure/iframe-api-typings" />

let ref: any | undefined;
const AREA   = "instructions";         // Tiled area name (Class: area)
const ANCHOR = "instructionsPopup";    // Tiled popup anchor name

let bound = false;                     // prevent duplicate subscriptions

export function initInstructions() {
  if (bound) return;
  bound = true;

  WA.onInit().then(() => {
    WA.room.area.onEnter(AREA).subscribe(() => {
      closePopup();
      ref = WA.ui.openPopup(
        ANCHOR,
        "🪧 Cyber Rangers HQ - There are 5 maps to explore and learn cybersecurity: Phishing, Malware, Password Security, Safe Internet Practices, Identity Theft. Check the signage in every map for what to do. When you’re ready, head to the ladder beside the billboard to continue!",
        [{ label: "Close", callback: () => closePopup() }] // required 3rd arg
      );
    });

    WA.room.area.onLeave(AREA).subscribe(() => {
      closePopup();
    });
  });
}

function closePopup() {
  try {
    if (ref) {
      ref.close?.();
      ref = undefined;
    }
  } catch {
    ref = undefined;
  }
}
