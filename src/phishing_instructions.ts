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
    "🧑‍💻 Quick! We saw one of the hackers going through this room! They are using phishing emails and dodgy QR codes to endanger students on campus! Before you chase after him, you should read these slides to learn how you can defend against Phishing.  ",
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
