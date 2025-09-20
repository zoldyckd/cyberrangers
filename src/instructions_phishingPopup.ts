/// <reference types="@workadventure/iframe-api-typings" />

let phishingPopupRef: any | undefined;

export function initPhishingInstructions() {
  WA.onInit().then(() => {
    console.log("[WA] Phishing Instructions ready");

    // Open immediately if spawning inside the zone
    openPhishingPopup();

    // Re-open when re-entering the big zone
    WA.room.area.onEnter("instructions_phishingPopup").subscribe(openPhishingPopup);

    // Close when leaving either the big zone or the tiny spawn tile
    WA.room.area.onLeave("instructions_phishingPopup").subscribe(closePhishingPopup);
    WA.room.area.onLeave("from-garden").subscribe(closePhishingPopup);

    // Safety net: as soon as the player starts exploring or approaches the exit, close it
    ["blackbibleppt", "MurdochEmail", "QRcode", "BrockZone", "to-canteen"].forEach((zone) => {
      WA.room.area.onEnter(zone).subscribe(closePhishingPopup);
    });
  });
}

function openPhishingPopup() {
  closePhishingPopup(); // avoid duplicates
  phishingPopupRef = WA.ui.openPopup(
    "phishingIntro", // use a unique ID (avoid sharing the same name as the area)
    "🔎 This room hides 3 easter eggs. Explore the objects and see what you can find. Speak with the NPC for more in-depth details about phishing before moving on to the next map.",
    [
      {
        label: "Got it!",
        className: "primary",
        callback: (popup) => {
          popup.close();
          phishingPopupRef = undefined; // clear ref
        },
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
