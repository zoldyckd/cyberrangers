/// <reference types="@workadventure/iframe-api-typings" />

let popupRef: any | undefined;

export function initIDTheftSensitivePapers() {
  WA.onInit().then(() => {
    console.log("[WA] ID Theft - Sensitive Papers ready");

    // Show popup when entering the area
    WA.room.area.onEnter("idtheft_sensitivepapers").subscribe(() => {
      openPopup();
    });

    // Close popup when leaving the area
    WA.room.area.onLeave("idtheft_sensitivepapers").subscribe(() => {
      closePopup();
    });
  });
}

function openPopup() {
  // Prevent duplicate popups
  closePopup();

  popupRef = WA.ui.openPopup(
    "idtheft_sensitivepapersPopup",
    "📄 While cleaning out some old documents from your locker, you notice a pile of old bank statements. They might contain sensitive information — how you handle them could determine whether your data stays safe! Press SPACE to investigate what happens next.",
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
  if (popupRef) {
    try { popupRef.close?.(); } catch {}
    popupRef = undefined;
  }
}
