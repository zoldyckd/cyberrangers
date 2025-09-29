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
    "🧑‍💻 Go through the PPT to prepare yourself for when you explore the room!",
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
