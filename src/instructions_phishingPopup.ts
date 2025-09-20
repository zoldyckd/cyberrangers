/// <reference types="@workadventure/iframe-api-typings" />
import { openPopupOnce, closePopup } from "./popupManager";

export function initPhishingInstructions() {
  WA.onInit().then(() => {
    console.log("[WA] Phishing Instructions ready");

    // Show popup when spawning / entering the from-garden area
    WA.room.area.onEnter("from-garden").subscribe(() => {
      openInstructionPopup();
    });

    // Hide popup once the player leaves the spawn tile
    WA.room.area.onLeave("from-garden").subscribe(() => {
      closePopup();
    });
  });
}

function openInstructionPopup() {
  openPopupOnce(
    "instructions_phishingPopup", // popup id (not an area)
    "🔎 This room hides 3 easter eggs. Explore the objects and see what you can find. Speak with the NPC for more in-depth details about phishing before moving on to the next map.",
    [
      {
        label: "Got it!",
        className: "primary",
        callback: () => closePopup(),
      },
    ]
  );
}
