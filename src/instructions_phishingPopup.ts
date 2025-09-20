/// <reference types="@workadventure/iframe-api-typings" />
import { openPopupOnce, closePopup } from "./popupManager";

export function initPhishingInstructions() {
  WA.onInit().then(() => {
    console.log("[WA] Phishing Instructions ready");

    // Open the intro when you are inside the instructions area (spawn or re-enter)
    WA.room.area.onEnter("instructions_phishingPopup").subscribe(() => {
      openPopupOnce(
        "phishingIntro", // unique id (do NOT reuse the area name)
        "🔎 This room hides 3 easter eggs. Explore the objects and see what you can find. Speak with the NPC for more in-depth details about phishing before moving on to the next map.",
        [
          {
            label: "Got it!",
            className: "primary",
            callback: (p) => p.close(),
          },
        ]
      );
    });

    // Close when leaving that area
    WA.room.area.onLeave("instructions_phishingPopup").subscribe(() => {
      closePopup();
    });
  });
}
