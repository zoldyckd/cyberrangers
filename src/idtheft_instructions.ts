/// <reference types="@workadventure/iframe-api-typings" />

let popupRef: any | undefined;

export function initIDTheftInstructions() {
  WA.onInit().then(() => {
    console.log("[WA] ID Theft instructions ready");

    // Show popup when entering the instructions area
    WA.room.area.onEnter("idtheft_instructions").subscribe(() => {
      openPopup();
    });

    // Close popup when leaving the area
    WA.room.area.onLeave("idtheft_instructions").subscribe(() => {
      closePopup();
    });
  });
}

function openPopup() {
  // Prevent duplicate popups
  closePopup();

  popupRef = WA.ui.openPopup(
    "idtheft_instructionsPopup",
    "🧑‍🏫 It’s hard to believe it but we seem to be in the last topic! We’re almost ready to face the hackers and help defend the school! One of the students recently fell victim to ID Theft via a phishing email, and they’re now being impersonated online! Press SPACE to read the slides on the basics you need to learn first. Afterwards, please check the PC nearby to see if you can help.",
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
    try { popupRef.close?.(); } catch {}
    popupRef = undefined;
  }
}
