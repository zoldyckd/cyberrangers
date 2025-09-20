/// <reference types="@workadventure/iframe-api-typings" />

let popupRef: any | undefined;
let shownOnce = false;

export function initPhishingInstructions() {
  WA.onInit().then(() => {
    console.log("[WA] Library spawn popup ready");

    // Spawn tile (1x1)
    WA.room.area.onEnter("from-garden").subscribe(() => {
      if (!shownOnce) openPopup();
    });
    WA.room.area.onLeave("from-garden").subscribe(closePopup);

    // Larger info zone as fallback
    WA.room.area.onEnter("instructions_phishingPopup").subscribe(() => {
      if (!shownOnce && !popupRef) openPopup();
    });
    WA.room.area.onLeave("instructions_phishingPopup").subscribe(closePopup);
  });
}

function openPopup() {
  closePopup(); // safety
  popupRef = WA.ui.openPopup(
    "instructions_phishingPopup",
    "This room has 3 easter eggs. Explore the objects and talk to the NPC for more phishing insights before moving on.",
    [
      {
        label: "Got it!",
        className: "primary",
        callback: (p) => {
          shownOnce = true; // only once per session
          p.close();
        },
      },
    ]
  );
}

function closePopup() {
  if (popupRef) {
    popupRef.close();
    popupRef = undefined;
  }
}
