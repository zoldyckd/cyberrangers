/// <reference types="@workadventure/iframe-api-typings" />

let popupRef: any | undefined;

export function initPasswordSecurityInstructions() {
  WA.onInit().then(() => {
    console.log("[WA] Password Security instructions ready");

    // Show popup when entering the instructions area
    WA.room.area.onEnter("passwordsecurity_instructions").subscribe(() => {
      openPopup();
    });

    // Close popup when leaving the area
    WA.room.area.onLeave("passwordsecurity_instructions").subscribe(() => {
      closePopup();
    });
  });
}

function openPopup() {
  // Prevent duplicates / stacking
  closePopup();

  popupRef = WA.ui.openPopup(
    "passwordsecurity_instructionsPopup",
    "🧑‍🏫 Thank goodness you’re here! The hackers are after our passwords, and we need your help to secure them! ➡️ To begin, go through the slides to learn more about Passsword Security by pressing SPACE. Afterwards, help us defend the school!",
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
