/// <reference types="@workadventure/iframe-api-typings" />
import { openPopupOnce, closePopup } from "./popupManager";

export function initPhishingInstructions() {
  WA.onInit().then(() => {
    console.log("[WA] Phishing Instructions ready");

    // Open immediately if spawning inside the start zone
    if (WA.player.state?.currentArea === "instructions_phishingPopup") {
      openInstructionPopup();
    }

    // Enter zone → open
    WA.room.area.onEnter("instructions_phishingPopup").subscribe(() => {
      openInstructionPopup();
    });

    // Leave zone → close
    WA.room.area.onLeave("instructions_phishingPopup").subscribe(() => {
      closePopup();
    });
  });
}

function openInstructionPopup() {
  openPopupOnce(
    "instructions_phishingPopup",
    "🔎 This room hides 3 easter eggs. Explore the objects and see what you can find. Speak with the NPC for more in-depth details about phishing before moving on to the next map.",
    [
      {
        label: "Got it!",
        className: "primary",
        callback: (popup) => popup.close(),
      },
    ]
  );
}
