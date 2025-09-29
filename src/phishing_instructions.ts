/// <reference types="@workadventure/iframe-api-typings" />

let popupRef: any | undefined;

export function initPhishingInstructions() {
  WA.onInit().then(() => {
    console.log("[WA] Phishing sign instructions ready");

    // Open when entering the sign-board area
    WA.room.area.onEnter("phishing_instructions").subscribe(() => {
      openPopup();
    });

    // Close when leaving the sign-board area
    WA.room.area.onLeave("phishing_instructions").subscribe(() => {
      closePopup();
    });
  });
}

function openPopup() {
  // prevent duplicates
  closePopup();

  popupRef = WA.ui.openPopup(
    "phishing_instructionsPopup",
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
