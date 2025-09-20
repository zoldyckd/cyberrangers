/// <reference types="@workadventure/iframe-api-typings" />

let instructionsPopupRef: any | undefined;

export function initInstructions() {
  // Show popup when the map loads
  WA.onInit().then(() => {
    console.log("[WA] Instructions ready");

    // Show popup automatically at the start area
    showInstructions();
  });
}

function showInstructions() {
  closePopup(); // close any existing popup
  instructionsPopupRef = WA.ui.openPopup(
    "instructionsPopup",
    "👋 Welcome Ranger!\n\nHere are your instructions:\n\n1️⃣ Explore the garden\n2️⃣ Read the billboard\n3️⃣ Interact with objects\n\nPress SPACE near signs or boards to learn more!",
    [
      {
        label: "Got it!",
        className: "primary",
        callback: (popup) => {
          popup.close();
        },
      },
    ]
  );
}

function closePopup() {
  if (instructionsPopupRef) {
    instructionsPopupRef.close();
    instructionsPopupRef = undefined;
  }
}
