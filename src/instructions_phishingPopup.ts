/// <reference types="@workadventure/iframe-api-typings" />

let phishingPopupRef: any | undefined;

export function initPhishingInstructions() {
  WA.onInit().then(() => {
    console.log("[WA] Phishing Instructions ready");

    // Open immediately if spawning inside the start zone
    openPhishingPopup();

    // If they walk back into the zone later, reopen
    WA.room.area.onEnter("instructions_phishingPopup").subscribe(() => {
      openPhishingPopup();
    });

    // Close when leaving the zone
    WA.room.area.onLeave("instructions_phishingPopup").subscribe(() => {
      closePhishingPopup();
    });
  });
}

function openPhishingPopup() {
  closePhishingPopup(); // avoid duplicates
  phishingPopupRef = WA.ui.openPopup(
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

function closePhishingPopup() {
  if (phishingPopupRef) {
    phishingPopupRef.close();
    phishingPopupRef = undefined;
  }
}
