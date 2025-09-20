/// <reference types="@workadventure/iframe-api-typings" />

let instructionsPopupRef: any | undefined;

export function initInstructions() {
  WA.onInit().then(() => {
    console.log("[WA] Instructions ready");

    // 1) Open immediately on load (you spawn on the red X inside the zone)
    openInstructions();

    // 2) If you walk back into the zone later, open again
    WA.room.area.onEnter("instructions").subscribe(() => {
      openInstructions();
    });

    // 3) Close as soon as you step out of the zone
    WA.room.area.onLeave("instructions").subscribe(() => {
      closeInstructions();
    });
  });
}

function openInstructions() {
  closeInstructions(); // safety: avoid duplicates
  instructionsPopupRef = WA.ui.openPopup(
    "instructionsPopup",
    "👋 Welcome Ranger! Use the Arrow Keys or WASD to move around. Walk close to objects such as signs, boards, or NPCs to interact with them. Sometimes you will need to press SPACE to open a dialogue or a side panel with more details. Explore the garden and see what you can discover! REMEMBER! Check the signboard for more info.",
    [
      {
        label: "Let’s go!",
        className: "primary",
        callback: (popup) => popup.close(),
      },
    ]
  );
}

function closeInstructions() {
  if (instructionsPopupRef) {
    instructionsPopupRef.close();
    instructionsPopupRef = undefined;
  }
}
