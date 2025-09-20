/// <reference types="@workadventure/iframe-api-typings" />

let popup: ReturnType<typeof WA.ui.openPopup> | undefined;

export function initPhishingInstructions() {
  console.log("[Phishing] file loaded");             // <-- must see this

  WA.onInit().then(() => {
    console.log("[Phishing] WA ready");              // <-- must see this

    // Force-open once on spawn (covers case where onEnter doesn't fire on spawn)
    setTimeout(() => {
      console.log("[Phishing] open on spawn timeout");
      openPopup();
    }, 250);

    // Enter/leave the 1x1 spawn tile to open/close
    WA.room.area.onEnter("from-garden").subscribe(() => {
      console.log("[Phishing] enter from-garden");
      openPopup();
    });

    WA.room.area.onLeave("from-garden").subscribe(() => {
      console.log("[Phishing] leave from-garden");
      closePopup();
    });
  });
}

function openPopup() {
  closePopup();
  popup = WA.ui.openPopup(
    "from-garden",
    "🔎 This room hides 3 easter eggs. Explore the objects and see what you can find. Speak with the NPC for more in-depth details about phishing before moving on to the next map.",
    [{ label: "Got it!", className: "primary", callback: () => closePopup() }]
  );
}

function closePopup() {
  if (popup) {
    popup.close();
    popup = undefined;
  }
}
