// instructions_phishingPopup.ts
/// <reference types="@workadventure/iframe-api-typings" />
import { openPopupOnce, closePopup } from "./popupManager";

export function initPhishingInstructions() {
  WA.onInit().then(() => {
    console.log("[WA] Phishing Instructions ready");

    // Show the popup when the player enters the spawn tile (including spawn)
    WA.room.area.onEnter("from-garden").subscribe(() => {
      openPopupOnce(
        "instructions_phishingPopup",   // this is just the popup id
        "🔎 This room hides 3 easter eggs. Explore the objects and see what you can find. Speak with the NPC for more in-depth details about phishing before moving on to the next map.",
        [{ label: "Got it!", className: "primary", callback: () => closePopup() }]
      );
    });

    // Hide it as soon as they step off the spawn tile
    WA.room.area.onLeave("from-garden").subscribe(() => {
      closePopup();
    });
  });
}
