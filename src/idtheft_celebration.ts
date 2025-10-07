/// <reference types="@workadventure/iframe-api-typings" />

let popupRef: any | undefined;

export function initIDTheftCelebration() {
  WA.onInit().then(() => {
    console.log("[WA] ID Theft - Celebration ready");

    // Show popup when entering the area
    WA.room.area.onEnter("idtheft_celebration").subscribe(() => {
      openPopup();
    });

    // Close popup when leaving the area
    WA.room.area.onLeave("idtheft_celebration").subscribe(() => {
      closePopup();
    });
  });
}

function openPopup() {
  // Prevent duplicate popups
  closePopup();

  popupRef = WA.ui.openPopup(
    "idtheft_celebrationPopup",
    "📸 You’ve just passed your driving test and gotten your new license! Excited, you picked up your phone from the bench and took a selfie with it in hand to celebrate your big achievement. But should you post it online? Press SPACE to see what happens next!",
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
