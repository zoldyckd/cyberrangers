/// <reference types="@workadventure/iframe-api-typings" />

let instructionsPhishingPopupRef: any | undefined;

export function initInstructionsPhishing() {
  WA.onInit().then(() => {
    console.log("[WA] Phishing Instructions ready");

    // Open immediately when the map loads
    openPhishingInstructions();
  });
}

function openPhishingInstructions() {
  closePhishingInstructions(); // safety
  instructionsPhishingPopupRef = WA.ui.openPopup(
    "instructions_phishingPopup",
    "🎣 Welcome to the Phishing Room!\n\nThere are 3 hidden easter eggs in this room — can you find them all?\n\nBefore you leave, talk to the NPC to learn more in-depth about phishing:\n- How attackers trick you\n- How to spot scams\n- Simple steps to stay safe\n\nGood luck and stay curious!",
    [
      {
        label: "Got it!",
        className: "primary",
        callback: (popup) => popup.close(),
      },
    ]
  );
}

function closePhishingInstructions() {
  if (instructionsPhishingPopupRef) {
    instructionsPhishingPopupRef.close();
    instructionsPhishingPopupRef = undefined;
  }
}
