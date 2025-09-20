/// <reference types="@workadventure/iframe-api-typings" />

let instructionsPhishingPopupRef: any | undefined;

export function initInstructionsPhishing() {
  WA.onInit().then(() => {
    console.log("[WA] Phishing Instructions ready");

    // 1) Open immediately if you spawn inside the zone
    openPhishingInstructions();

    // 2) If you walk back into the zone later, open again
    WA.room.area.onEnter("instructions_phishing").subscribe(() => {
      openPhishingInstructions();
    });

    // 3) Close as soon as you step out of the zone
    WA.room.area.onLeave("instructions_phishing").subscribe(() => {
      closePhishingInstructions();
    });
  });
}

function openPhishingInstructions() {
  closePhishingInstructions(); // safety: avoid duplicates
  instructionsPhishingPopupRef = WA.ui.openPopup(
    "instructions_phishingPopup",
    "🎣 Welcome to the Phishing Room!There are 3 hidden easter eggs in this room — can you find them all? Before you leave, talk to the NPC to learn more in-depth about phishing:- How attackers trick you, How to spot scams, Simple steps to stay safe. Good luck and stay curious!",
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
