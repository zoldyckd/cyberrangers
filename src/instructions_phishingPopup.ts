// instructions_phishingPopup.ts
/// <reference types="@workadventure/iframe-api-typings" />

let popup: ReturnType<typeof WA.ui.openPopup> | undefined;

export function initPhishingInstructions() {
  WA.onInit().then(() => {
    console.log("[WA] Phishing Instructions ready");

    // If you already spawn on the tile, open immediately
    if (WA.player.state?.currentArea === "from-garden") {
      openPopup();
    }

    // Enter spawn tile → open
    WA.room.area.onEnter("from-garden").subscribe(() => {
      openPopup();
    });

    // Leave spawn tile → close
    WA.room.area.onLeave("from-garden").subscribe(() => {
      closePopup();
    });
  });
}

function openPopup() {
  // avoid duplicates
  closePopup();
  popup = WA.ui.openPopup(
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

function closePopup() {
  if (popup) {
    popup.close();
    popup = undefined;
  }
}
