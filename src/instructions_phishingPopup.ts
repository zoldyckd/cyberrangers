// instructions_phishingPopup.ts
/// <reference types="@workadventure/iframe-api-typings" />
import { openPopupOnce, closePopup } from "./popupManager";

export function initPhishingInstructions() {
  WA.onInit().then(() => {
    console.log("[WA] Phishing Instructions ready");

    // Triggered by the spawn area (from-garden), not an area named "instructions_phishingPopup"
    WA.room.area.onEnter("from-garden").subscribe(() => {
      openPopupOnce(
        "instructions_phishingPopup", // popup id only
        "🔎 This room hides 3 easter eggs. Explore the objects and see what you can find. Speak with the NPC for more in-depth details about phishing before moving on to the next map.",
        [{ label: "Got it!", className: "primary", callback: () => closePopup() }]
      );
    });

    WA.room.area.onLeave("from-garden").subscribe(() => {
      closePopup();
    });
  });
}
