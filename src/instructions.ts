/// <reference types="@workadventure/iframe-api-typings" />

let previewRef: any | undefined;

const AREA   = "instructions";        // Tiled area (Class: area)
const ANCHOR = "instructionsPopup";   // Tiled popup anchor object

export function initInstructions() {
  // hot-reload / double-import guard
  if ((window as any).__BOUND_INSTRUCTIONS__) return;
  (window as any).__BOUND_INSTRUCTIONS__ = true;

  WA.onInit().then(() => {
    // Enter -> open (after closing any stray instance)
    WA.room.area.onEnter(AREA).subscribe(() => {
      closePopup();
      previewRef = WA.ui.openPopup(
        ANCHOR,
        "🪧 Cyber Rangers HQ — There are 5 maps to explore and learn cybersecurity: Phishing, Malware, Password Security, Safe Internet Practices, Identity Theft. Check the signage in every map for what to do. When you’re ready, head to the ladder beside the billboard to continue!",
        [{ label: "Close", callback: () => closePopup() }] // required 3rd arg
      );
    });

    // Leave -> always close and clear reference
    WA.room.area.onLeave(AREA).subscribe(() => {
      closePopup();
    });
  });
}

function closePopup() {
  try {
    if (previewRef) {
      previewRef.close?.();
      previewRef = undefined; // ensure next cycle starts clean
    }
  } catch {
    previewRef = undefined;
  }
}
