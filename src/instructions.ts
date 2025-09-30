/// <reference types="@workadventure/iframe-api-typings" />

let previewRef: any | undefined;

const AREA   = "instructions";        // area name in garden.tmj
const ANCHOR = "instructionsPopup";   // popup rectangle in garden.tmj

export function initInstructions() {
  WA.onInit().then(() => {
    WA.room.area.onEnter(AREA).subscribe(() => {
      closePopup();
      previewRef = WA.ui.openPopup(
        ANCHOR,
        "🏫 Cyber Rangers HQ — There are 5 maps to explore and learn cybersecurity: Phishing, Malware, Password Security, Safe Internet Practices, Identity Theft. Check the signage in every map for what to do. When you're ready, head to the ladder beside the billboard to continue!",
        [
          { 
            label: "Close", 
            className: "primary",
            callback: () => closePopup() 
          }
        ]
      );
    });

    WA.room.area.onLeave(AREA).subscribe(() => {
      closePopup();
    });
  });
}

function closePopup() {
  try {
    if (previewRef) {
      previewRef.close?.();
      previewRef = undefined; // reset
    }
  } catch {
    previewRef = undefined;
  }
}
