import { openPopupOnce, closePopup } from "./popupManager";

export function initPhishingInstructions() {
  WA.onInit().then(() => {
    WA.room.area.onEnter("instructions_phishingPopup").subscribe(() => {
      openPopupOnce(
        "phishingIntro",
        "🔎 This room hides 3 easter eggs. Explore the objects and see what you can find. Speak with the NPC for more in-depth details about phishing before moving on to the next map.",
        [{ label: "Got it!", className: "primary", callback: (p) => p.close() }]
      );
    });
    WA.room.area.onLeave("instructions_phishingPopup").subscribe(closePopup);
  });
}
