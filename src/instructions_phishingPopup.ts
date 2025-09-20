/// <reference types="@workadventure/iframe-api-typings" />

let popupRef: any | undefined;
let shownOnce = false;

export function initPhishingInstructions() {
  WA.onInit().then(() => {
    console.log("[WA] Library spawn popup ready");

    // Show when spawning into the library at the from-garden tile
    WA.room.area.onEnter("from-garden").subscribe(() => {
      if (!shownOnce) openPopup();
    });

    WA.room.area.onLeave("from-garden").subscribe(closePopup);
  });
}

function openPopup() {
  closePopup();
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
