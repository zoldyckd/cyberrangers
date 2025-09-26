/// <reference types="@workadventure/iframe-api-typings" />

let popupRef: any | undefined;

export function initInstructionsPhishing() {
  WA.onInit().then(() => {
    console.log("[WA] Phishing sign instructions ready");

    // Open when entering the sign-board area
    WA.room.area.onEnter("instructions_phishing").subscribe(() => {
      openPopup();
    });

    // Close when leaving the sign-board area
    WA.room.area.onLeave("instructions_phishing").subscribe(() => {
      closePopup();
    });
  });
}

function openPopup() {
  // prevent duplicates
  closePopup();

  popupRef = WA.ui.openPopup(
    "instructions_phishingPopup",
    "🧑‍💻 Welcome to the Phishing Room!\n\nThere are 3 hidden easter eggs in this room — can you find them all?\n\nBefore you leave, talk to the NPC to learn more about phishing:\n• How attackers trick you\n• How to spot scams\n• Simple steps to stay safe\n\nGood luck and stay curious!",
    [
      {
        label: "Got it!",
        className: "primary",
        callback: () => closePopup(),
      },
    ]
  );
}

function closePopup() {
  if (popupRef) {
    popupRef.close?.();
    popupRef = undefined;
  }
}
