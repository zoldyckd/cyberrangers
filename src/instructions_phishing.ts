/// <reference types="@workadventure/iframe-api-typings" />

let instructionsPhishingPopupRef: any | undefined;

export function initInstructionsPhishing() {
  WA.onInit().then(() => {
    console.log("[WA] Phishing Instructions ready");

    // Open immediately when the map loads (assumes you spawn inside the area)
    openPhishingInstructions();

    // Close automatically when the player walks out of the area
    WA.room.area.onLeave("instructions_phishing").subscribe(() => {
      closePhishingInstructions();
    });
  });
}

function openPhishingInstructions() {
  closePhishingInstructions(); // safety: avoid duplicates
  instructionsPhishingPopupRef = WA.ui.openPopup(
    "instructions_phishingPopup",
    "🎣 Welcome to the Phishing Room!\n\nThere are 3 hidden easter eggs in this room — can you find them all?\n\nBefore you leave, talk to the NPC to learn more in-depth about phishing:\n- How attackers trick you\n- How to spot scams\n- Simple steps to stay safe\n\nGood luck and stay curious!",
    [] // ← no buttons; walking out of the area will close it
  );
}

function closePhishingInstructions() {
  if (instructionsPhishingPopupRef) {
    instructionsPhishingPopupRef.close?.();
    instructionsPhishingPopupRef = undefined;
  }
}
