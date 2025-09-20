/// <reference types="@workadventure/iframe-api-typings" />

let popup: ReturnType<typeof WA.ui.openPopup> | undefined;

export function initPhishingInstructions() {
  WA.onInit().then(() => {
    console.log("[WA] Phishing Instructions ready");

    // 1) Force open shortly after spawn (handles the case where onEnter doesn't fire on spawn)
    setTimeout(() => {
      openPopup();
    }, 200);

    // 2) If you step onto the spawn tile again later, open it
    WA.room.area.onEnter("from-garden").subscribe(() => {
      openPopup();
    });

    // 3) Leave the 1x1 spawn tile → close
    WA.room.area.onLeave("from-garden").subscribe(() => {
      closePopup();
    });
  });
}

function openPopup() {
  // avoid duplicates
  closePopup();
  popup = WA.ui.openPopup(
    "instructions_phishingPopup", // popup id only
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
