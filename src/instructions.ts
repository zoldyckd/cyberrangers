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
    "👋 Welcome Ranger! Use the Arrow Keys or WASD to move around. Walk close to objects such as signs, boards, or NPCs to interact with them. Sometimes you will need to press SPACE to open a dialogue or a side panel with more details. Explore the garden and see what you can discover!",
    [
      {
        label: "Let’s go!",
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
