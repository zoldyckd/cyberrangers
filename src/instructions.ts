/// <reference types="@workadventure/iframe-api-typings" />

let instructionsPopupRef: any | undefined;
let dismissed = false; // don't reopen until you leave & re-enter

export function initInstructions() {
  WA.onInit().then(() => {
    console.log("[WA] Instructions ready");

    // Open when you enter the area
    WA.room.area.onEnter("instructions").subscribe(() => {
      if (!dismissed) openInstructions();
    });

    // ✅ Close when you leave the area (capital L!)
    WA.room.area.onLeave("instructions").subscribe(() => {
      dismissed = false; // reset so it can show next time you come back
      closeInstructions();
    });

    // If you spawn already inside the area, onEnter may or may not fire.
    // Open once on load; if not in the area, the onLeave above will keep it closed anyway.
    openInstructions();
  });
}

function openInstructions() {
  // prevent duplicates
  closeInstructions();

  instructionsPopupRef = WA.ui.openPopup(
    "instructionsPopup",
    "👋 Welcome Ranger! Use the Arrow Keys or WASD to move around. Walk close to objects such as signs, boards, or NPCs to interact with them. Sometimes you will need to press SPACE to open a dialogue or a side panel with more details. Explore the garden and see what you can discover! REMEMBER! Check the signboard for more info.",
    [
      {
        label: "Let's go!",
        className: "primary",
        callback: () => {
          dismissed = true;
          closeInstructions();
        },
      },
    ]
  );
}

function closeInstructions() {
  if (instructionsPopupRef) {
    instructionsPopupRef.close?.();
    instructionsPopupRef = undefined;
  }
}
